import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Lock, 
  X, 
  Check, 
  Eye, 
  Mail, 
  Phone 
} from 'lucide-react';

const UserManagementModule = ({ users = [], addUser, updateUser, deleteUser, toggleUserStatus }) => {
  const [selectedRole, setSelectedRole] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Default cooperative user directory
  const defaultUsers = [
    { id: '1', name: 'Rosa Mendoza', email: 'rosa.mendoza@marikha.org', role: 'Executive', roleLabel: 'Super Admin', sector: 'Central Office', rsbsa: 'N/A', status: true, lastActive: 'Just now' },
    { id: '2', name: 'Danilo Cruz', email: 'danilo.cruz@marikha.org', role: 'Admin', roleLabel: 'Admin IT/HR', sector: 'Administration', rsbsa: 'N/A', status: true, lastActive: '15 mins ago' },
    { id: '3', name: 'Arnel Bautista', email: 'arnel.bautista@marikha.org', role: 'Farm Staff', roleLabel: 'Farm Staff', sector: 'Sector A & B', rsbsa: 'N/A', status: true, lastActive: '1 hour ago' },
    { id: '4', name: 'Dr. Vicente Reyes', email: 'vicente.reyes@vet.gov.ph', role: 'Farm Staff', roleLabel: 'Farm Staff (Vet)', sector: 'Goat Herds', rsbsa: 'N/A', status: true, lastActive: '3 hours ago' },
    { id: '5', name: 'Juan Dela Cruz', email: 'juan.delacruz@farmer.ph', role: 'Farmer', roleLabel: 'Farmer Member', sector: 'Plot P-007', rsbsa: 'RSBSA-04-1234', status: true, lastActive: 'Today, 08:30 AM' },
    { id: '6', name: 'Roberto Cruz', email: 'roberto.cruz@farmer.ph', role: 'Farmer', roleLabel: 'Farmer Member', sector: 'Plot P-021', rsbsa: 'RSBSA-04-5678', status: true, lastActive: 'Yesterday' },
    { id: '7', name: 'Maria Santos', email: 'maria.santos@farmer.ph', role: 'Farmer', roleLabel: 'Farmer Member', sector: 'Plot P-094', rsbsa: 'RSBSA-04-9012', status: true, lastActive: '2 days ago' },
    { id: '8', name: 'Elena Gomez', email: 'elena.gomez@farmer.ph', role: 'Farmer', roleLabel: 'Farmer Member', sector: 'Plot P-082', rsbsa: 'RSBSA-04-3456', status: true, lastActive: '3 days ago' },
    { id: '9', name: 'Danilo Ramos', email: 'danilo.ramos@farmer.ph', role: 'Farmer', roleLabel: 'Farmer Member', sector: 'Plot P-015', rsbsa: 'RSBSA-04-7890', status: true, lastActive: '5 days ago' },
    { id: '10', name: 'Teresa Aquino', email: 'teresa.aquino@farmer.ph', role: 'Farmer', roleLabel: 'Farmer Member', sector: 'Plot P-033', rsbsa: 'RSBSA-04-2345', status: true, lastActive: '1 week ago' },
    { id: '11', name: 'Manuel Roxas', email: 'manuel.roxas@farmer.ph', role: 'Farmer', roleLabel: 'Farmer Member', sector: 'Plot P-044', rsbsa: 'RSBSA-04-6789', status: true, lastActive: '1 week ago' },
    { id: '12', name: 'Corazon Silang', email: 'corazon.silang@farmer.ph', role: 'Farmer', roleLabel: 'Farmer Member', sector: 'Plot P-055', rsbsa: 'RSBSA-04-8901', status: false, lastActive: '3 weeks ago' },
  ];

  // Robust role normalizer
  const normalizeRoleKey = (role) => {
    const r = String(role || '').toLowerCase().trim();
    if (r.includes('super') || r.includes('exec')) return 'super_admin';
    if (r.includes('admin')) return 'admin';
    if (r.includes('staff') || r.includes('vet')) return 'farm_staff';
    return 'farmer';
  };

  const getRoleBadge = (role) => {
    const key = normalizeRoleKey(role);
    switch (key) {
      case 'super_admin':
        return { bg: '#dcfce7', color: '#11592c', label: 'Super Admin' };
      case 'admin':
        return { bg: '#e0e7ff', color: '#3730a3', label: 'Admin IT/HR' };
      case 'farm_staff':
        return { bg: '#fef3c7', color: '#92400e', label: 'Farm Staff' };
      default:
        return { bg: '#f1f5f9', color: '#334155', label: 'Farmer Member' };
    }
  };

  // Check active status across boolean & string representations
  const checkIsActive = (u) => {
    if (!u) return false;
    return u.status === true || u.status === 'Active' || u.isActive === true;
  };

  const rawList = (users && users.length > 0) ? users : defaultUsers;
  const userList = rawList.map(u => {
    const normRole = normalizeRoleKey(u.role);
    const badge = getRoleBadge(u.role);
    const active = checkIsActive(u);
    const displayName = u.name || 'User';
    const initials = u.initials || displayName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
    const displaySector = u.assignedPlot || u.sector || (normRole === 'super_admin' ? 'Central Office' : (normRole === 'admin' ? 'Administration' : (normRole === 'farm_staff' ? 'Sector A & B' : 'Plot P-007')));
    const displayRsbsa = u.rsbsaNo || u.rsbsa || (normRole === 'farmer' ? 'RSBSA-04-1234' : 'N/A');
    const displayLastActive = u.lastActive || (active ? 'Active today' : 'Inactive');

    return {
      ...u,
      normalizedRole: normRole,
      badge,
      isActive: active,
      displayName,
      initials,
      displaySector,
      displayRsbsa,
      displayLastActive
    };
  });

  // Calculate statistics
  const totalUsers = userList.length;
  const activeUsers = userList.filter(u => u.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;

  const countSuperAdmin = userList.filter(u => u.normalizedRole === 'super_admin').length;
  const countAdmin = userList.filter(u => u.normalizedRole === 'admin').length;
  const countStaff = userList.filter(u => u.normalizedRole === 'farm_staff').length;
  const countFarmers = userList.filter(u => u.normalizedRole === 'farmer').length;

  // Filter users
  const filteredUsers = userList.filter(u => {
    const roleMatch = selectedRole === 'All' || 
                      (selectedRole === 'Super Admin' && u.normalizedRole === 'super_admin') ||
                      (selectedRole === 'Admin IT/HR' && u.normalizedRole === 'admin') ||
                      (selectedRole === 'Farm Staff' && u.normalizedRole === 'farm_staff') ||
                      (selectedRole === 'Farmers' && u.normalizedRole === 'farmer');
    const q = searchTerm.toLowerCase().trim();
    const searchMatch = !q ||
                        u.displayName.toLowerCase().includes(q) ||
                        (u.email || '').toLowerCase().includes(q) ||
                        u.displayRsbsa.toLowerCase().includes(q) ||
                        u.displaySector.toLowerCase().includes(q);
    return roleMatch && searchMatch;
  });

  // New user form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Farmer',
    sector: 'Sector A (Plot P-007)',
    rsbsa: 'RSBSA-04-1234',
    phone: '+63 917 555 0100',
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    const newUser = {
      ...formData,
      id: String(Date.now()),
      assignedPlot: formData.sector,
      rsbsaNo: formData.rsbsa,
      status: true,
      lastActive: 'Just now'
    };
    if (addUser) {
      addUser(newUser);
    }
    setShowAddModal(false);
    setFormData({
      name: '',
      email: '',
      role: 'Farmer',
      sector: 'Sector A (Plot P-007)',
      rsbsa: 'RSBSA-04-1234',
      phone: '+63 917 555 0100',
    });
  };

  return (
    <div className="superadmin-module animate-fade-in" style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#dcfce7', color: '#11592c', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '6px' }}>
            <Users size={14} /> Member & Staff Directory
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            User Accounts & Access Control
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Manage cooperative staff, extension advisers, and farmer member accounts.
          </p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', 
            background: '#11592c', color: '#ffffff', border: 'none', 
            borderRadius: '8px', fontSize: '0.84rem', fontWeight: '800', cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(17,89,44,0.25)'
          }}
        >
          <UserPlus size={16} /> Add New User
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Registered Users
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0f172a' }}>{totalUsers}</span>
            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '700' }}>Accounts</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Across 5 cooperative clusters
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Accounts
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#11592c' }}>{activeUsers}</span>
            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '700' }}>
              {totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Regularly logging farm field records
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Inactive Accounts
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#d97706' }}>{inactiveUsers}</span>
            <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: '700' }}>
              {inactiveUsers > 0 ? 'Disabled' : 'All Active'}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '4px', display: 'block' }}>
            Click "Activate" to restore access
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Access Tiers
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#2563eb' }}>4</span>
            <span style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: '700' }}>Tiers</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Super Admin, Admin, Staff, Farmer
          </span>
        </div>
      </div>

      {/* Role Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px', overflowX: 'auto' }}>
        {[
          { id: 'All', label: `All Users (${totalUsers})` },
          { id: 'Super Admin', label: `Super Admin (${countSuperAdmin})` },
          { id: 'Admin IT/HR', label: `Admin IT/HR (${countAdmin})` },
          { id: 'Farm Staff', label: `Farm Staff (${countStaff})` },
          { id: 'Farmers', label: `Farmers (${countFarmers})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedRole(tab.id)}
            style={{
              padding: '10px 18px',
              fontSize: '0.82rem',
              fontWeight: selectedRole === tab.id ? '800' : '600',
              color: selectedRole === tab.id ? '#11592c' : '#64748b',
              background: 'transparent',
              border: 'none',
              borderBottom: selectedRole === tab.id ? '2.5px solid #11592c' : '2.5px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* User Directory Table Container */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        {/* Search & Filter Bar */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text"
              placeholder="Search user name, email, RSBSA ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '9px 12px 9px 36px', fontSize: '0.82rem', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }}
            />
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
            Showing {filteredUsers.length} of {totalUsers} accounts
          </span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '700' }}>
                <th style={{ padding: '12px 18px' }}>User</th>
                <th style={{ padding: '12px 18px' }}>System Role</th>
                <th style={{ padding: '12px 18px' }}>Sector / RSBSA</th>
                <th style={{ padding: '12px 18px' }}>Account Status</th>
                <th style={{ padding: '12px 18px' }}>Last Active</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '36px 18px', textAlign: 'center', color: '#94a3b8' }}>
                    No user accounts match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: '#dcfce7', color: '#11592c',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: '800', fontSize: '0.8rem',
                            border: '1.5px solid #86efac'
                          }}>
                            {user.initials}
                          </div>
                          <div>
                            <strong style={{ color: '#0f172a', display: 'block', fontSize: '0.86rem' }}>
                              {user.displayName}
                            </strong>
                            <span style={{ color: '#64748b', fontSize: '0.74rem' }}>{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 18px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: '6px',
                          fontSize: '0.72rem', fontWeight: '800',
                          background: user.badge.bg, color: user.badge.color
                        }}>
                          {user.badge.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 18px', color: '#334155' }}>
                        <div style={{ fontWeight: '600' }}>{user.displaySector}</div>
                        {user.displayRsbsa && user.displayRsbsa !== 'N/A' && (
                          <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: '700' }}>
                            {user.displayRsbsa}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 18px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '4px 10px', borderRadius: '12px',
                          fontSize: '0.72rem', fontWeight: '800',
                          background: user.isActive ? '#dcfce7' : '#f1f5f9',
                          color: user.isActive ? '#15803d' : '#64748b',
                          border: user.isActive ? '1px solid #86efac' : '1px solid #cbd5e1'
                        }}>
                          <span style={{ 
                            width: '6px', height: '6px', borderRadius: '50%', 
                            background: user.isActive ? '#16a34a' : '#94a3b8' 
                          }} />
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 18px', color: '#64748b', fontSize: '0.75rem' }}>
                        {user.displayLastActive}
                      </td>
                      <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <button 
                            onClick={() => {
                              if (toggleUserStatus) {
                                toggleUserStatus(user.id, user.email);
                              }
                            }}
                            title={user.isActive ? "Deactivate User Account" : "Activate User Account"}
                            style={{ 
                              padding: '6px 14px', 
                              background: user.isActive ? '#ffffff' : '#11592c', 
                              color: user.isActive ? '#475569' : '#ffffff',
                              border: user.isActive ? '1.5px solid #cbd5e1' : '1.5px solid #11592c', 
                              borderRadius: '6px', 
                              fontSize: '0.74rem', 
                              fontWeight: '700', 
                              cursor: 'pointer',
                              boxShadow: user.isActive ? 'none' : '0 2px 4px rgba(17,89,44,0.25)',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {user.isActive ? 'Deactivate' : '✓ Activate'}
                          </button>
                          {deleteUser && user.normalizedRole !== 'super_admin' && (
                            <button 
                              onClick={() => {
                                if (window.confirm(`Delete user account "${user.displayName}"?`)) {
                                  deleteUser(user.id);
                                }
                              }}
                              title="Delete User"
                              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add User */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '520px', width: '100%', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Enroll New Cooperative User</h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0 0' }}>Provision system credentials and field assignments</p>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddUser}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Full Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Maria Clara Santos"
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '9px 12px', fontSize: '0.84rem', border: '1.5px solid #cbd5e1', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Email Address *</label>
                  <input 
                    type="email" 
                    placeholder="maria.santos@farmer.ph"
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    style={{ width: '100%', padding: '9px 12px', fontSize: '0.84rem', border: '1.5px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>System Role *</label>
                  <select 
                    value={formData.role} 
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', fontSize: '0.84rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', background: '#fff' }}
                  >
                    <option value="Farmer">Farmer Member</option>
                    <option value="Farm Staff">Farm Staff</option>
                    <option value="Admin">Admin IT/HR</option>
                    <option value="Executive">Super Admin</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '22px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Assigned Sector / Plot</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sector B (Plot P-021)"
                    value={formData.sector} 
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', fontSize: '0.84rem', border: '1.5px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>RSBSA ID</label>
                  <input 
                    type="text" 
                    placeholder="RSBSA-04-XXXX"
                    value={formData.rsbsa} 
                    onChange={(e) => setFormData({ ...formData, rsbsa: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', fontSize: '0.84rem', border: '1.5px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '9px 16px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '9px 22px', background: '#11592c', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '800', cursor: 'pointer' }}
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementModule;
