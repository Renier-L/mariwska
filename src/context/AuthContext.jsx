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
  const [announcements, setAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem('marikha_announcements_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return initialAnnouncements;
  });
  const [validations, setValidations] = useState(initialValidations);
  const [mlClassifications, setMlClassifications] = useState(initialMLClassifications);
  
  // Unlimited Real-time Push Notification Popup state
  const [activePushNotice, setActivePushNotice] = useState(null);

  // Security Matrix State (Persisted & Synced Live)
  const [permissionsMatrix, setPermissionsMatrix] = useState(() => {
    try {
      const saved = localStorage.getItem('marikha_permissions_matrix');
      if (saved) {
        const parsed = JSON.parse(saved);
        delete parsed['PGS Auditor'];
        return parsed;
      }
    } catch (e) {}
    return {
      Executive: { readLogs: true, writeEntries: false, executeValidations: false, bypassAudits: false, accessML: true },
      Administrator: { readLogs: true, writeEntries: true, executeValidations: false, bypassAudits: true, accessML: true },
      'Farm Staff': { readLogs: true, writeEntries: true, executeValidations: true, bypassAudits: false, accessML: true },
      Farmer: { readLogs: false, writeEntries: true, executeValidations: false, bypassAudits: false, accessML: false }
    };
  });

  const setCurrentRole = (roleKey) => {
    setCurrentRoleState(roleKey);
    try {
      localStorage.setItem('marikha_current_role', roleKey);
    } catch (e) {}
  };

  const loginAsRole = (roleKey, targetUser = null) => {
    setCurrentRole(roleKey);
    if (targetUser) {
      setCurrentUser(targetUser);
      return;
    }

    if (roleKey === 'super_admin') {
      const superAdmin = users.find(u => u.role === 'Executive' || u.role === 'Super Admin') || users[0] || initialUsers[0];
      setCurrentUser(superAdmin);
    } else if (roleKey === 'admin') {
      const adminUser = users.find(u => u.role === 'Admin') || users[1] || initialUsers[1];
      setCurrentUser(adminUser);
    } else if (roleKey === 'farm_staff') {
      const staffUser = users.find(u => u.role === 'Farm Staff') || users[2] || initialUsers[2];
      setCurrentUser(staffUser);
    } else if (roleKey === 'mobile_app') {
      const farmerUser = users.find(u => u.role === 'Farmer') || users[3] || {
        id: 'farmer-default',
        name: 'rei lopez',
        role: 'Farmer',
        email: 'lopezrenier97@gmail.com',
        phone: '+63 917 555 0100',
        password: 'password123',
        status: true,
        initials: 'RL'
      };
      setCurrentUser(farmerUser);
    }
  };

  // Cross-Window Instant Sync via BroadcastChannel & LocalStorage!
  useEffect(() => {
    const handleIncomingNotice = (newAnn) => {
      setAnnouncements(prev => [newAnn, ...prev.filter(a => a.id !== newAnn.id)]);
      setActivePushNotice(newAnn);
    };

    const handleIncomingValidation = (newVal) => {
      const formatted = {
        id: String(newVal.id || Date.now()),
        farmer: newVal.farmer || 'Mang Juan Dela Cruz',
        plot: newVal.plot || 'Plot P-007',
        taskType: newVal.activity || newVal.taskType || 'Watering',
        activity: newVal.activity || newVal.taskType || 'Watering',
        timestamp: 'Just now',
        urgency: 'Normal',
        urgencyCls: 'pill-low',
        location: newVal.gps || newVal.location || '14.586° N · 121.176° E',
        gps: newVal.gps || newVal.location || '14.586° N · 121.176° E',
        farmerNote: newVal.notes || newVal.farmerNote || 'Submitted via Farmers Mobile App',
        notes: newVal.notes || newVal.farmerNote || 'Submitted via Farmers Mobile App',
        photoUrl: newVal.photo_url || newVal.photoUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb12735?w=600&auto=format&fit=crop&q=60',
        photoAttached: true,
        status: newVal.status || 'Pending'
      };
      setValidations(prev => [formatted, ...prev.filter(v => String(v.id) !== String(formatted.id))]);
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

  // Fetch initial announcements, users, and validations from Supabase Realtime!
  useEffect(() => {
    async function fetchSupabaseData() {
      try {
        // 1. USERS SYNC
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
          setUsers(formattedUsers);
          try { localStorage.setItem('marikha_registered_users', JSON.stringify(formattedUsers)); } catch (e) {}
        } else {
          // Auto-direct seed core users into empty Supabase users table!
          for (const u of initialUsers) {
            await supabase.from('users').insert([{
              name: u.name,
              role: u.role,
              email: u.email,
              phone: u.phone || '+63 917 555 0100',
              password: u.password || 'password123',
              status: true
            }]);
          }
        }

        // 2. ANNOUNCEMENTS SYNC
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

        // 3. TASK VALIDATIONS SYNC
        const { data: valData } = await supabase.from('task_validations').select('*').order('created_at', { ascending: false });
        if (valData && valData.length > 0) {
          const formattedVals = valData.map(v => ({
            id: String(v.id),
            farmer: v.farmer || 'Mang Juan Dela Cruz',
            plot: v.plot || 'Plot P-007',
            taskType: v.activity || 'Watering',
            activity: v.activity || 'Watering',
            createdAt: v.created_at || new Date().toISOString(),
            created_at: v.created_at || new Date().toISOString(),
            timestamp: v.created_at || 'Just now',
            urgency: 'Normal',
            urgencyCls: 'pill-low',
            location: v.gps || 'Sumulong Highway, Antipolo City (OSM Verified)',
            gps: v.gps || 'Sumulong Highway, Antipolo City (OSM Verified)',
            farmerNote: v.notes || 'Submitted via Farmers Mobile App',
            notes: v.notes || 'Submitted via Farmers Mobile App',
            photoUrl: v.photo_url || null,
            photo_url: v.photo_url || null,
            photoAttached: true,
            status: v.status || 'Pending'
          }));
          setValidations(formattedVals);
        } else {
          setValidations([]);
        }
      } catch (err) {
        console.log('Supabase table fallback', err);
      }
    }
    fetchSupabaseData();
    const interval = setInterval(() => {
      fetchSupabaseData();
    }, 4000);

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

    // Supabase Realtime Subscription for Registered Users
    const usersChannel = supabase
      .channel('users_realtime_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
        if (payload.new) {
          const u = payload.new;
          const userObj = {
            id: String(u.id),
            name: u.name,
            role: u.role,
            email: u.email,
            phone: u.phone || '+63 917 555 0100',
            password: u.password || 'password123',
            status: u.status !== false,
            initials: u.name ? u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'
          };
          setUsers(prev => [userObj, ...prev.filter(existing => existing.id !== userObj.id && existing.email !== userObj.email)]);
        }
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(announcementsChannel);
      supabase.removeChannel(validationsChannel);
      supabase.removeChannel(usersChannel);
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
      password: newUser.password ? String(newUser.password).trim() : 'password123',
      initials: newUser.name ? newUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'
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
      const payload = { 
        name: newUser.name, 
        role: newUser.role, 
        email: newUser.email, 
        phone: newUser.phone || '+63 917 555 0100',
        password: newUser.password ? String(newUser.password).trim() : 'password123',
        status: newUser.status !== false
      };

      const { data, error } = await supabase.from('users').upsert(payload, { onConflict: 'email' }).select();

      if (error && error.message.includes('password')) {
        // Fallback retry without password column if missing in Supabase schema
        delete payload.password;
        await supabase.from('users').upsert(payload, { onConflict: 'email' });
      } else if (error) {
        console.error('Supabase User Insert Error:', error);
      } else if (data && data[0]) {
        console.log('Supabase User Inserted/Updated:', data[0]);
      }
    } catch (e) {
      console.log('Supabase sync error:', e);
    }
  };

  const updateUser = async (userId, updatedData) => {
    const targetUser = users.find(u => u.id === userId);
    setUsers(prev => {
      const next = prev.map(u => u.id === userId ? { 
        ...u, 
        ...updatedData, 
        password: updatedData.password ? String(updatedData.password).trim() : u.password,
        initials: updatedData.name ? updatedData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : u.initials 
      } : u);
      try { localStorage.setItem('marikha_registered_users', JSON.stringify(next)); } catch (e) {}
      return next;
    });

    try {
      const payload = {
        name: updatedData.name,
        role: updatedData.role,
        email: updatedData.email,
        phone: updatedData.phone || '+63 917 555 0100',
        password: updatedData.password ? String(updatedData.password).trim() : 'password123'
      };

      const { data, error } = await supabase.from('users').upsert(payload, { onConflict: 'email' }).select();

      if (error && error.message.includes('password')) {
        // Fallback retry without password column if missing in Supabase schema
        delete payload.password;
        const { data: retryData, error: retryError } = await supabase.from('users').upsert(payload, { onConflict: 'email' }).select();
        if (!retryError) {
          console.log('Supabase User Updated Live (schema fallback):', retryData);
        } else {
          console.error('Supabase User Update Retry Error:', retryError);
        }
      } else if (error) {
        console.error('Supabase User Update Error:', error);
      } else {
        console.log('Supabase User Updated Live:', data);
      }
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

    if (target) {
      try {
        const { error } = await supabase.from('users').delete().eq('email', target.email);
        if (error) console.error('Supabase Delete User Error:', error);
      } catch (e) {
        console.log('Supabase delete error:', e);
      }
    }
  };

  // INSTANT MULTI-WINDOW REALTIME BROADCAST
  const publishAnnouncement = async (title, content, instantPush) => {
    const cleanText = String(content || '').trim();
    if (!cleanText) return;

    const newAnn = { 
      id: `ANN-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, 
      title: title || 'Cooperative Broadcast Notice', 
      content: cleanText, 
      date: new Date().toISOString().split('T')[0], 
      author: currentUser?.name || 'Liza Cruz (Admin)', 
      instantPush: true,
      pushId: Math.random()
    };
    
    setAnnouncements(prev => {
      const next = [newAnn, ...prev];
      try { localStorage.setItem('marikha_announcements_list', JSON.stringify(next)); } catch (e) {}
      return next;
    });

    setActivePushNotice({ ...newAnn, pushId: Math.random() });

    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'ANNOUNCEMENT_PUSH', payload: newAnn });
    }

    try {
      localStorage.setItem('marikha_live_push', JSON.stringify({ ...newAnn, _t: Date.now() }));
    } catch (e) {}

    try {
      const { data, error } = await supabase.from('announcements').insert([{ 
        title: title || 'Cooperative Broadcast Notice', 
        content: cleanText, 
        author: currentUser?.name || 'Liza Cruz (Admin)', 
        instant_push: true 
      }]).select();

      if (error) {
        console.error('Supabase Announcement Insert Error:', error);
        alert(`⚠️ Supabase Cloud Notice: ${error.message}. Make sure RLS is disabled in Supabase SQL Editor.`);
      } else {
        console.log('Supabase Announcement Inserted:', data);
      }
    } catch (e) {
      console.log('Supabase sync error:', e);
    }
  };

  const deleteAnnouncement = async (annId) => {
    setAnnouncements(prev => {
      const next = prev.filter(a => a.id !== annId);
      try { localStorage.setItem('marikha_announcements_list', JSON.stringify(next)); } catch (e) {}
      return next;
    });

    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'ANNOUNCEMENT_DELETED_PUSH', payload: annId });
    }

    try {
      const { error } = await supabase.from('announcements').delete().eq('id', annId);
      if (error) console.error('Supabase Delete Error:', error);
    } catch (e) {
      console.log('Supabase delete error:', e);
    }
  };

  const dismissPushNotice = () => {
    setActivePushNotice(null);
  };

  const handleValidationAction = async (id, action, notes) => {
    setValidations(prev => prev.filter(v => String(v.id) !== String(id)));

    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'VALIDATION_DELETED_PUSH', payload: id });
    }

    try {
      await supabase.from('task_validations').delete().eq('id', id);
    } catch (e) {
      console.log('Supabase validation delete error:', e);
    }
  };

  const addFarmerSubmission = async (newSub) => {
    const farmerName = currentUser?.name || newSub.farmer || 'rei lopez';
    const newId = `VAL-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const actText = `${newSub.activity} (${newSub.amount || 10} Liters)`;
    const newEntry = {
      id: newId,
      farmer: farmerName,
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
        farmer: farmerName, 
        plot: newEntry.plot, 
        activity: newEntry.activity, 
        notes: newEntry.notes, 
        gps: newEntry.gps,
        photo_url: newEntry.photoUrl,
        status: 'Pending'
      }]);
    } catch (e) {
      console.log('Supabase sync error:', e);
    }
  };

  const addCrop = (newCrop) => {
    const cropObj = {
      id: Date.now(),
      variety: newCrop.variety,
      plot: newCrop.plot || `P-${Math.floor(100 + Math.random() * 900)}`,
      growthStage: newCrop.growthStage || 'Vegetative',
      fertilizer: newCrop.fertilizer || 'Organic Compost',
      irrigation: newCrop.irrigation || 'Drip System',
      yield: newCrop.yield || '350 kg'
    };
    setCrops(prev => [cropObj, ...prev]);
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'CROP_ADDED', payload: cropObj });
    }
  };

  const addLivestock = (newItem) => {
    const itemObj = {
      id: Date.now(),
      group: newItem.group,
      plot: newItem.plot || `P-${Math.floor(100 + Math.random() * 900)}`,
      headCount: Number(newItem.headCount) || 25,
      vaccination: newItem.vaccination || '100% (Up to date)',
      healthStatus: newItem.healthStatus || 'Healthy',
      dailyGain: newItem.dailyGain || '+1.2 kg/wk'
    };
    setLivestock(prev => [itemObj, ...prev]);
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'LIVESTOCK_ADDED', payload: itemObj });
    }
  };

  const updateProfile = async (updatedFields) => {
    if (!currentUser) return;
    const newInitials = updatedFields.name
      ? updatedFields.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      : currentUser.initials;

    const updatedUser = {
      ...currentUser,
      ...updatedFields,
      initials: newInitials
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === currentUser.id || u.email === currentUser.email) ? updatedUser : u));

    try {
      const payload = {
        name: updatedUser.name,
        role: updatedUser.role,
        email: updatedUser.email,
        phone: updatedUser.phone || '+63 917 555 0100',
        password: updatedUser.password || 'password123'
      };
      await supabase.from('users').upsert(payload, { onConflict: 'email' });
    } catch (e) {
      console.log('Supabase profile update error:', e);
    }
  };

  const togglePermission = (role, capability) => {
    setPermissionsMatrix(prev => {
      const next = {
        ...prev,
        [role]: {
          ...prev[role],
          [capability]: !prev[role]?.[capability]
        }
      };
      try { localStorage.setItem('marikha_permissions_matrix', JSON.stringify(next)); } catch (e) {}
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'PERMISSIONS_UPDATED_PUSH', payload: next });
      }
      return next;
    });
  };

  // Manual One-Click Supabase Seed & Sync Repair
  const syncSeedToSupabase = async () => {
    try {
      // 1. Sync Users
      for (const u of users) {
        await supabase.from('users').upsert({
          name: u.name,
          role: u.role,
          email: u.email,
          phone: u.phone || '+63 917 555 0100',
          password: u.password || 'password123',
          status: u.status !== false
        }, { onConflict: 'email' });
      }

      // 2. Sync Announcements
      for (const a of announcements) {
        await supabase.from('announcements').insert({
          title: a.title || 'Cooperative Broadcast Notice',
          content: a.content,
          author: a.author || 'Liza Cruz (Admin)',
          instant_push: true
        });
      }

      // 3. Sync Validations
      for (const v of validations) {
        await supabase.from('task_validations').insert({
          farmer: v.farmer,
          plot: v.plot,
          activity: v.taskType || 'Farm Task',
          notes: v.farmerNote || 'Submitted via App',
          gps: v.location || '14.586° N · 121.176° E',
          photo_url: v.photoUrl || ''
        });
      }

      alert('✅ Successfully synced all User accounts, Announcements, and Validations live into Supabase Cloud Database!');
    } catch (e) {
      console.log('Supabase sync seed error:', e);
      alert('⚠️ Sync completed with notice: Make sure RLS is disabled in Supabase SQL Editor!');
    }
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
      deleteAnnouncement,
      dismissPushNotice,
      handleValidationAction,
      addFarmerSubmission,
      addCrop,
      addLivestock,
      togglePermission,
      setCurrentRole,
      syncSeedToSupabase
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
