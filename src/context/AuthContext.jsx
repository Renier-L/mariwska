import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialUsers, initialCrops, initialLivestock, initialAnnouncements, initialValidations, initialMLClassifications } from '../data/mockData';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(initialUsers[0]); // Default Rosa Mendoza (Super Admin)
  const [currentRole, setCurrentRole] = useState('login'); // Start at secure login screen
  const [tenantInfo] = useState({
    name: 'Antipolo Organic Farming Cooperative',
    id: 'ANT-ORG-001',
    status: 'Cloud sync · Live (Supabase Connected)'
  });

  const [users, setUsers] = useState(initialUsers);
  const [crops, setCrops] = useState(initialCrops);
  const [livestock, setLivestock] = useState(initialLivestock);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [validations, setValidations] = useState(initialValidations);
  const [mlClassifications, setMlClassifications] = useState(initialMLClassifications);

  // Security Matrix State
  const [permissionsMatrix, setPermissionsMatrix] = useState({
    Executive: { readLogs: true, writeEntries: false, executeValidations: false, bypassAudits: false, accessML: true },
    Administrator: { readLogs: true, writeEntries: true, executeValidations: false, bypassAudits: true, accessML: true },
    'Farm Staff': { readLogs: true, writeEntries: true, executeValidations: true, bypassAudits: false, accessML: true },
    Farmer: { readLogs: false, writeEntries: true, executeValidations: false, bypassAudits: false, accessML: false },
    'PGS Auditor': { readLogs: true, writeEntries: false, executeValidations: true, bypassAudits: false, accessML: false },
  });

  // Try fetching live announcements from Supabase
  useEffect(() => {
    async function fetchSupabaseData() {
      try {
        const { data: annData } = await supabase.from('announcements').select('*');
        if (annData && annData.length > 0) {
          setAnnouncements(annData.map(a => ({
            id: a.id,
            title: a.title,
            content: a.content,
            author: a.author,
            instantPush: a.instant_push,
            date: new Date(a.created_at).toISOString().split('T')[0]
          })));
        }
      } catch (err) {
        console.log('Supabase table fallback to local state', err);
      }
    }
    fetchSupabaseData();
  }, []);

  const loginAsRole = (roleKey) => {
    setCurrentRole(roleKey);
    if (roleKey === 'super_admin') setCurrentUser(initialUsers[0]);
    else if (roleKey === 'admin') setCurrentUser(initialUsers[1]);
    else if (roleKey === 'farm_staff') setCurrentUser(initialUsers[2]);
    else if (roleKey === 'mobile_app') setCurrentUser(initialUsers[3]);
  };

  const toggleUserStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: !u.status } : u));
  };

  const addUser = async (newUser) => {
    const userObj = { ...newUser, id: String(Date.now()), initials: newUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() };
    setUsers([...users, userObj]);
    try {
      await supabase.from('users').insert([{ name: newUser.name, role: newUser.role, email: newUser.email, phone: newUser.phone }]);
    } catch (e) {
      console.log('Supabase sync error:', e);
    }
  };

  const publishAnnouncement = async (content, instantPush) => {
    const newAnn = { id: String(Date.now()), title: 'Cooperative Broadcast', content, date: new Date().toISOString().split('T')[0], author: 'Liza Cruz (Admin)', instantPush };
    setAnnouncements([newAnn, ...announcements]);
    try {
      await supabase.from('announcements').insert([{ title: 'Cooperative Broadcast', content, author: 'Liza Cruz (Admin)', instant_push: instantPush }]);
    } catch (e) {
      console.log('Supabase sync error:', e);
    }
  };

  const handleValidationAction = (id, action, notes) => {
    setValidations(validations.filter(v => v.id !== id));
  };

  const addFarmerSubmission = async (newSub) => {
    const newId = `VAL-${Date.now().toString().slice(-4)}`;
    const newEntry = {
      id: newId,
      farmer: 'Juan Dela Cruz',
      plot: newSub.plot || 'Plot P-007',
      activity: `${newSub.activity} (${newSub.amount || 10} Liters)`,
      timestamp: 'Just now',
      urgency: 'Normal',
      urgencyCls: 'pill-low',
      gps: '14.586° N · 121.176° E',
      notes: newSub.note || 'Submitted via Farmers Mobile App',
      photoAttached: true
    };
    setValidations([newEntry, ...validations]);
    try {
      await supabase.from('task_validations').insert([{ farmer: 'Juan Dela Cruz', plot: newEntry.plot, activity: newEntry.activity, notes: newEntry.notes, gps: newEntry.gps }]);
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
      loginAsRole,
      toggleUserStatus,
      addUser,
      publishAnnouncement,
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
