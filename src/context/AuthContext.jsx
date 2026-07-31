import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialUsers, initialCrops, initialLivestock, initialAnnouncements, initialValidations, initialMLClassifications } from '../data/mockData';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

// Browser-level BroadcastChannel for 0-latency instant cross-window sync!
const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('marikha_realtime_broadcast')
  : null;

export const AuthProvider = ({ children }) => {
  // Restore currentRole from localStorage upon reload!
  const [currentRole, setCurrentRoleState] = useState(() => {
    try {
      const savedRole = localStorage.getItem('marikha_current_role');
      return savedRole || 'login';
    } catch (e) {
      return 'login';
    }
  });

  const [currentUser, setCurrentUser] = useState(initialUsers[0]);
  const [tenantInfo] = useState({
    name: 'Antipolo Organic Farming Cooperative',
    id: 'ANT-ORG-001',
    status: 'Cloud sync · Live (Supabase Realtime)'
  });

  // Persist Users in LocalStorage & Supabase so created accounts NEVER vanish on refresh or login!
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('marikha_registered_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialUsers;
  });

  const [crops, setCrops] = useState(initialCrops);
  const [livestock, setLivestock] = useState(initialLivestock);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [validations, setValidations] = useState(initialValidations);
  const [mlClassifications, setMlClassifications] = useState(initialMLClassifications);
  
  // Unlimited Real-time Push Notification Popup state
  const [activePushNotice, setActivePushNotice] = useState(null);

  // Security Matrix State
  const [permissionsMatrix, setPermissionsMatrix] = useState({
    Executive: { readLogs: true, writeEntries: false, executeValidations: false, bypassAudits: false, accessML: true },
    Administrator: { readLogs: true, writeEntries: true, executeValidations: false, bypassAudits: true, accessML: true },
    'Farm Staff': { readLogs: true, writeEntries: true, executeValidations: true, bypassAudits: false, accessML: true },
    Farmer: { readLogs: false, writeEntries: true, executeValidations: false, bypassAudits: false, accessML: false },
    'PGS Auditor': { readLogs: true, writeEntries: false, executeValidations: true, bypassAudits: false, accessML: false },
  });

  const setCurrentRole = (roleKey) => {
    setCurrentRoleState(roleKey);
    try {
      localStorage.setItem('marikha_current_role', roleKey);
    } catch (e) {}
  };

  const loginAsRole = (roleKey) => {
    setCurrentRole(roleKey);
    if (roleKey === 'super_admin') setCurrentUser(users[0] || initialUsers[0]);
    else if (roleKey === 'admin') setCurrentUser(users[1] || initialUsers[1]);
    else if (roleKey === 'farm_staff') setCurrentUser(users[2] || initialUsers[2]);
    else if (roleKey === 'mobile_app') setCurrentUser(users[3] || initialUsers[3]);
  };

  // Cross-Window Instant Sync via BroadcastChannel & LocalStorage!
  useEffect(() => {
    const handleIncomingNotice = (newAnn) => {
      setAnnouncements(prev => [newAnn, ...prev.filter(a => a.id !== newAnn.id)]);
      setActivePushNotice(newAnn);
    };

    const handleIncomingValidation = (newVal) => {
      setValidations(prev => [newVal, ...prev.filter(v => v.id !== newVal.id)]);
    };

    const handleIncomingUser = (newUser) => {
      setUsers(prev => {
        const next = [newUser, ...prev.filter(u => u.id !== newUser.id)];
        try { localStorage.setItem('marikha_registered_users', JSON.stringify(next)); } catch (e) {}
        return next;
      });
    };

    const handleDeletedUser = (deletedId) => {
      setUsers(prev => {
        const next = prev.filter(u => u.id !== deletedId);
        try { localStorage.setItem('marikha_registered_users', JSON.stringify(next)); } catch (e) {}
        return next;
      });
    };

    if (broadcastChannel) {
      broadcastChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'ANNOUNCEMENT_PUSH') {
          handleIncomingNotice(event.data.payload);
        } else if (event.data && event.data.type === 'FARMER_SUBMISSION_PUSH') {
          handleIncomingValidation(event.data.payload);
        } else if (event.data && event.data.type === 'USER_CREATED_PUSH') {
          handleIncomingUser(event.data.payload);
        } else if (event.data && event.data.type === 'USER_DELETED_PUSH') {
          handleDeletedUser(event.data.payload);
        }
      };
    }

    const handleStorageEvent = (e) => {
      if (e.key === 'marikha_live_push' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          handleIncomingNotice(parsed);
        } catch (err) {}
      } else if (e.key === 'marikha_live_validation' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          handleIncomingValidation(parsed);
        } catch (err) {}
      } else if (e.key === 'marikha_live_user' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          handleIncomingUser(parsed);
        } catch (err) {}
      } else if (e.key === 'marikha_deleted_user' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          handleDeletedUser(parsed.id);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  // Fetch initial announcements & users from Supabase Realtime!
  useEffect(() => {
    async function fetchSupabaseData() {
      try {
        const { data: userData } = await supabase.from('users').select('*');
        if (userData && userData.length > 0) {
          const formattedUsers = userData.map(u => ({
            id: String(u.id),
            name: u.name,
            role: u.role,
            email: u.email,
            phone: u.phone || '+63 917 555 0100',
            password: u.password || 'password123',
            status: u.status !== false,
            initials: u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
          }));
          setUsers(prev => {
            const merged = [...formattedUsers];
            prev.forEach(p => {
              if (!merged.some(m => m.email === p.email || m.id === p.id)) {
                merged.push(p);
              }
            });
            try { localStorage.setItem('marikha_registered_users', JSON.stringify(merged)); } catch (e) {}
            return merged;
          });
        }

        const { data: annData } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
        if (annData && annData.length > 0) {
          const formatted = annData.map(a => ({
            id: String(a.id),
            title: a.title || 'Cooperative Broadcast Notice',
            content: a.content,
            author: a.author || 'Liza Cruz (Admin)',
            instantPush: true,
            date: new Date(a.created_at || Date.now()).toISOString().split('T')[0]
          }));
          setAnnouncements(formatted);
        }

        const { data: valData } = await supabase.from('task_validations').select('*').order('created_at', { ascending: false });
        if (valData && valData.length > 0) {
          const formattedVals = valData.map(v => ({
            id: String(v.id),
            farmer: v.farmer || 'Mang Juan Dela Cruz',
            plot: v.plot || 'Plot P-007',
            taskType: v.activity || 'Watering',
            activity: v.activity || 'Watering',
            timestamp: 'Just now',
            urgency: 'Normal',
            urgencyCls: 'pill-low',
            location: v.gps || '14.586° N · 121.176° E',
            gps: v.gps || '14.586° N · 121.176° E',
            farmerNote: v.notes || 'Submitted via Farmers Mobile App',
            notes: v.notes || 'Submitted via Farmers Mobile App',
            photoUrl: v.photo_url || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb12735?w=600&auto=format&fit=crop&q=60',
            photoAttached: true
          }));
          setValidations(formattedVals);
        }
      } catch (err) {
        console.log('Supabase table fallback', err);
      }
    }
    fetchSupabaseData();

    // Supabase Realtime Subscription for Broadcast Announcements
    const announcementsChannel = supabase
      .channel('announcements_realtime_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'announcements' }, (payload) => {
        const newRecord = payload.new;
        const newAnn = {
          id: String(newRecord.id),
          title: newRecord.title || 'Cooperative Broadcast Notice',
          content: newRecord.content,
          author: newRecord.author || 'Liza Cruz (Admin)',
          instantPush: true,
          date: new Date(newRecord.created_at || Date.now()).toISOString().split('T')[0],
          pushId: Math.random()
        };
        setAnnouncements(prev => [newAnn, ...prev.filter(a => a.id !== newAnn.id)]);
        setActivePushNotice(newAnn);
      })
      .subscribe();

    // Supabase Realtime Subscription for Farmer Task Validations
    const validationsChannel = supabase
      .channel('validations_realtime_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'task_validations' }, (payload) => {
        const newRecord = payload.new;
        const newEntry = {
          id: String(newRecord.id),
          farmer: newRecord.farmer || 'Mang Juan Dela Cruz',
          plot: newRecord.plot || 'Plot P-007',
          taskType: newRecord.activity || 'Watering',
          activity: newRecord.activity || 'Watering',
          timestamp: 'Just now',
          urgency: 'Normal',
          urgencyCls: 'pill-low',
          location: newRecord.gps || '14.586° N · 121.176° E',
          gps: newRecord.gps || '14.586° N · 121.176° E',
          farmerNote: newRecord.notes || 'Submitted via Farmers Mobile App',
          notes: newRecord.notes || 'Submitted via Farmers Mobile App',
          photoUrl: newRecord.photo_url || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb12735?w=600&auto=format&fit=crop&q=60',
          photoAttached: true
        };
        setValidations(prev => [newEntry, ...prev.filter(v => v.id !== newEntry.id)]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(announcementsChannel);
      supabase.removeChannel(validationsChannel);
    };
  }, []);

  const toggleUserStatus = (id) => {
    setUsers(prev => {
      const target = prev.find(u => u.id === id);
      if (target && (target.role === 'Executive' || target.role === 'Admin')) return prev;
      const next = prev.map(u => u.id === id ? { ...u, status: !u.status } : u);
      try { localStorage.setItem('marikha_registered_users', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  const addUser = async (newUser) => {
    const userObj = { 
      ...newUser, 
      id: String(Date.now()), 
      initials: newUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
    };
    
    setUsers(prev => {
      const next = [userObj, ...prev];
      try { localStorage.setItem('marikha_registered_users', JSON.stringify(next)); } catch (e) {}
      return next;
    });

    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'USER_CREATED_PUSH', payload: userObj });
    }

    try {
      localStorage.setItem('marikha_live_user', JSON.stringify({ ...userObj, _t: Date.now() }));
    } catch (e) {}

    try {
      await supabase.from('users').insert([{ 
        name: newUser.name, 
        role: newUser.role, 
        email: newUser.email, 
        phone: newUser.phone,
        password: newUser.password || 'password123'
      }]);
    } catch (e) {
      console.log('Supabase sync error:', e);
    }
  };

  const updateUser = async (userId, updatedData) => {
    setUsers(prev => {
      const next = prev.map(u => u.id === userId ? { ...u, ...updatedData, initials: updatedData.name ? updatedData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : u.initials } : u);
      try { localStorage.setItem('marikha_registered_users', JSON.stringify(next)); } catch (e) {}
      return next;
    });

    try {
      await supabase.from('users').update({
        name: updatedData.name,
        role: updatedData.role,
        email: updatedData.email,
        phone: updatedData.phone,
        password: updatedData.password
      }).eq('id', userId);
    } catch (e) {
      console.log('Supabase update error:', e);
    }
  };

  const deleteUser = async (userId) => {
    const target = users.find(u => u.id === userId);
    if (target && (target.role === 'Executive' || target.role === 'Admin')) {
      alert('⚠️ Security Protection: System Core Administrator accounts (Super Admin & Admin) cannot be deleted.');
      return;
    }

    setUsers(prev => {
      const next = prev.filter(u => u.id !== userId);
      try { localStorage.setItem('marikha_registered_users', JSON.stringify(next)); } catch (e) {}
      return next;
    });

    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'USER_DELETED_PUSH', payload: userId });
    }

    try {
      localStorage.setItem('marikha_deleted_user', JSON.stringify({ id: userId, _t: Date.now() }));
    } catch (e) {}

    try {
      await supabase.from('users').delete().eq('id', userId);
    } catch (e) {
      console.log('Supabase delete error:', e);
    }
  };

  // INSTANT MULTI-WINDOW REALTIME BROADCAST
  const publishAnnouncement = async (content, instantPush) => {
    const cleanText = String(content || '').trim();
    if (!cleanText) return;

    const newAnn = { 
      id: `ANN-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, 
      title: 'Cooperative Broadcast Notice', 
      content: cleanText, 
      date: new Date().toISOString().split('T')[0], 
      author: 'Liza Cruz (Admin)', 
      instantPush: true,
      pushId: Math.random()
    };
    
    setAnnouncements(prev => [newAnn, ...prev]);
    setActivePushNotice({ ...newAnn, pushId: Math.random() });

    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'ANNOUNCEMENT_PUSH', payload: newAnn });
    }

    try {
      localStorage.setItem('marikha_live_push', JSON.stringify({ ...newAnn, _t: Date.now() }));
    } catch (e) {}

    try {
      await supabase.from('announcements').insert([{ 
        title: 'Cooperative Broadcast Notice', 
        content: cleanText, 
        author: 'Liza Cruz (Admin)', 
        instant_push: true 
      }]);
    } catch (e) {
      console.log('Supabase sync error:', e);
    }
  };

  const dismissPushNotice = () => {
    setActivePushNotice(null);
  };

  const handleValidationAction = (id, action, notes) => {
    setValidations(validations.filter(v => v.id !== id));
  };

  const addFarmerSubmission = async (newSub) => {
    const newId = `VAL-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const actText = `${newSub.activity} (${newSub.amount || 10} Liters)`;
    const newEntry = {
      id: newId,
      farmer: 'Mang Juan Dela Cruz',
      plot: newSub.plot || 'Plot P-007',
      taskType: actText,
      activity: actText,
      timestamp: 'Just now',
      urgency: 'Normal',
      urgencyCls: 'pill-low',
      location: '14.586° N · 121.176° E',
      gps: '14.586° N · 121.176° E',
      farmerNote: newSub.note || 'Submitted via Farmers Mobile App',
      notes: newSub.note || 'Submitted via Farmers Mobile App',
      photoUrl: newSub.photoUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb12735?w=600&auto=format&fit=crop&q=60',
      photoAttached: true
    };
    
    setValidations(prev => [newEntry, ...prev]);

    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'FARMER_SUBMISSION_PUSH', payload: newEntry });
    }

    try {
      localStorage.setItem('marikha_live_validation', JSON.stringify({ ...newEntry, _t: Date.now() }));
    } catch (e) {}

    try {
      await supabase.from('task_validations').insert([{ 
        farmer: 'Mang Juan Dela Cruz', 
        plot: newEntry.plot, 
        activity: newEntry.activity, 
        notes: newEntry.notes, 
        gps: newEntry.gps,
        photo_url: newEntry.photoUrl
      }]);
    } catch (e) {
      console.log('Supabase sync error:', e);
    }
  };

  const togglePermission = (role, capability) => {
    setPermissionsMatrix({
      ...permissionsMatrix,
      [role]: {
        ...permissionsMatrix[role],
        [capability]: !permissionsMatrix[role][capability]
      }
    });
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      currentRole,
      tenantInfo,
      users,
      crops,
      livestock,
      announcements,
      validations,
      mlClassifications,
      permissionsMatrix,
      activePushNotice,
      loginAsRole,
      toggleUserStatus,
      addUser,
      updateUser,
      deleteUser,
      publishAnnouncement,
      dismissPushNotice,
      handleValidationAction,
      addFarmerSubmission,
      togglePermission,
      setCurrentRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
