import React, { createContext, useContext, useState } from 'react';
import { initialUsers, initialCrops, initialLivestock, initialAnnouncements, initialValidations, initialMLClassifications } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(initialUsers[0]); // Default Rosa Mendoza (Super Admin)
  const [currentRole, setCurrentRole] = useState('super_admin'); // 'super_admin', 'admin', 'farm_staff', 'mobile_app'
  const [tenantInfo] = useState({
    name: 'Antipolo Organic Farming Cooperative',
    id: 'ANT-ORG-001',
    status: 'Cloud sync · Live'
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

  const loginAsRole = (roleKey) => {
    setCurrentRole(roleKey);
    if (roleKey === 'super_admin') setCurrentUser(initialUsers[0]); // Rosa Mendoza
    else if (roleKey === 'admin') setCurrentUser(initialUsers[1]); // Liza Cruz
    else if (roleKey === 'farm_staff') setCurrentUser(initialUsers[2]); // Ramon Velasco
    else if (roleKey === 'mobile_app') setCurrentUser(initialUsers[3]); // Juan Dela Cruz
  };

  const toggleUserStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: !u.status } : u));
  };

  const addUser = (newUser) => {
    setUsers([...users, { ...newUser, id: String(Date.now()), initials: newUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() }]);
  };

  const publishAnnouncement = (content, instantPush) => {
    setAnnouncements([{ id: String(Date.now()), content, date: new Date().toISOString().split('T')[0], instantPush }, ...announcements]);
  };

  const handleValidationAction = (id, action, notes) => {
    setValidations(validations.filter(v => v.id !== id));
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
      togglePermission,
      setCurrentRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
