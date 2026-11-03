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
  const [editingUser, setEditingUser] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Default cooperative user directory
  const defaultUsers = [
    { id: 'USR-01', name: 'Rosa Mendoza', email: 'rosa.mendoza@marikha.org', role: 'super_admin', roleLabel: 'Super Admin', sector: 'Central Office', rsbsa: 'N/A', status: 'Active', lastActive: 'Just now' },
    { id: 'USR-02', name: 'Danilo Cruz', email: 'danilo.cruz@marikha.org', role: 'admin', roleLabel: 'Admin IT/HR', sector: 'Administration', rsbsa: 'N/A', status: 'Active', lastActive: '15 mins ago' },
    { id: 'USR-03', name: 'Arnel Bautista', email: 'arnel.bautista@marikha.org', role: 'farm_staff', roleLabel: 'Farm Staff', sector: 'Sector A & B', rsbsa: 'N/A', status: 'Active', lastActive: '1 hour ago' },
    { id: 'USR-04', name: 'Dr. Vicente Reyes', email: 'vicente.reyes@vet.gov.ph', role: 'farm_staff', roleLabel: 'Farm Staff (Vet)', sector: 'Goat Herds', rsbsa: 'N/A', status: 'Active', lastActive: '3 hours ago' },
    { id: 'USR-05', name: 'Juan Dela Cruz', email: 'juan.delacruz@farmer.ph', role: 'farmer', roleLabel: 'Farmer Member', sector: 'Plot P-007', rsbsa: 'RSBSA-04-1234', status: 'Active', lastActive: 'Today, 08:30 AM' },
    { id: 'USR-06', name: 'Roberto Cruz', email: 'roberto.cruz@farmer.ph', role: 'farmer', roleLabel: 'Farmer Member', sector: 'Plot P-021', rsbsa: 'RSBSA-04-5678', status: 'Active', lastActive: 'Yesterday' },
    { id: 'USR-07', name: 'Maria Santos', email: 'maria.santos@farmer.ph', role: 'farmer', roleLabel: 'Farmer Member', sector: 'Plot P-094', rsbsa: 'RSBSA-04-9012', status: 'Active', lastActive: '2 days ago' },
    { id: 'USR-08', name: 'Elena Gomez', email: 'elena.gomez@farmer.ph', role: 'farmer', roleLabel: 'Farmer Member', sector: 'Plot P-082', rsbsa: 'RSBSA-04-3456', status: 'Active', lastActive: '3 days ago' },
    { id: 'USR-09', name: 'Danilo Ramos', email: 'danilo.ramos@farmer.ph', role: 'farmer', roleLabel: 'Farmer Member', sector: 'Plot P-015', rsbsa: 'RSBSA-04-7890', status: 'Active', lastActive: '5 days ago' },
    { id: 'USR-10', name: 'Teresa Aquino', email: 'teresa.aquino@farmer.ph', role: 'farmer', roleLabel: 'Farmer Member', sector: 'Plot P-033', rsbsa: 'RSBSA-04-2345', status: 'Active', lastActive: '1 week ago' },
    { id: 'USR-11', name: 'Manuel Roxas', email: 'manuel.roxas@farmer.ph', role: 'farmer', roleLabel: 'Farmer Member', sector: 'Plot P-044', rsbsa: 'RSBSA-04-6789', status: 'Active', lastActive: '1 week ago' },
    { id: 'USR-12', name: 'Corazon Silang', email: 'corazon.silang@farmer.ph', role: 'farmer', roleLabel: 'Farmer Member', sector: 'Plot P-055', rsbsa: 'RSBSA-04-8901', status: 'Inactive', lastActive: '3 weeks ago' },
  ];

  const userList = (users && users.length > 0) ? users : defaultUsers;

  // New user form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'farmer',
    sector: 'Sector A',
    rsbsa: 'RSBSA-04-',
    phone: '+63 9',
  });

  // Calculate statistics
  const totalUsers = userList.length;
  const activeUsers = userList.filter(u => u.status === 'Active' || u.isActive === true).length;
  const inactiveUsers = totalUsers - activeUsers;

  // Filter users
  const filteredUsers = userList.filter(u => {
    const roleMatch = selectedRole === 'All' || 
                      (selectedRole === 'Super Admin' && u.role === 'super_admin') ||
                      (selectedRole === 'Admin IT/HR' && u.role === 'admin') ||
                      (selectedRole === 'Farm Staff' && u.role === 'farm_staff') ||
                      (selectedRole === 'Farmers' && (u.role === 'farmer' || !u.role));
    const searchMatch = (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (u.rsbsa || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (u.sector || '').toLowerCase().includes(searchTerm.toLowerCase());
    return roleMatch && searchMatch;
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    const newUser = {
      ...formData,
      id: `USR-${Date.now().toString().slice(-4)}`,
      roleLabel: formData.role === 'super_admin' ? 'Super Admin' : formData.role === 'admin' ? 'Admin IT/HR' : formData.role === 'farm_staff' ? 'Farm Staff' : 'Farmer Member',
      status: 'Active',
      lastActive: 'Just now'
    };
    if (addUser) {
      addUser(newUser);
    }
    setShowAddModal(false);
    setFormData({
      name: '',
      email: '',
      role: 'farmer',
      sector: 'Sector A',
      rsbsa: 'RSBSA-04-',
      phone: '+63 9',
    });
  };

  const getRoleBadge = (role) => {
    switch (role) {
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
            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', 
            background: '#11592c', color: '#ffffff', border: 'none', 
            borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(17,89,44,0.2)'
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
            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '700' }}>91.7%</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Regularly logging farm field records
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Pending / Inactive
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#d97706' }}>{inactiveUsers}</span>
            <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: '700' }}>Requires Review</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '4px', display: 'block' }}>
            Account validation or re-activation
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
          { id: 'All', label: `All Users (${userList.length})` },
          { id: 'Super Admin', label: 'Super Admin (1)' },
          { id: 'Admin IT/HR', label: 'Admin IT/HR (1)' },
          { id: 'Farm Staff', label: 'Farm Staff (2)' },
          { id: 'Farmers', label: 'Farmers (8)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedRole(tab.id)}
            style={{
              padding: '10px 18px',
              fontSize: '0.82rem',
              fontWeight: selectedRole === tab.id ? '700' : '600',
              color: selectedRole === tab.id ? '#11592c' : '#64748b',
              background: 'transparent',
              border: 'none',
              borderBottom: selectedRole === tab.id ? '2px solid #11592c' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* User Directory Table Container */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {/* Search & Filter Bar */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text"
              placeholder="Search user name, email, RSBSA ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 34px', fontSize: '0.82rem', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }}
            />
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Showing {filteredUsers.length} accounts
          </span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '700' }}>
                <th style={{ padding: '12px 16px' }}>User</th>
                <th style={{ padding: '12px 16px' }}>System Role</th>
                <th style={{ padding: '12px 16px' }}>Sector / RSBSA</th>
                <th style={{ padding: '12px 16px' }}>Account Status</th>
                <th style={{ padding: '12px 16px' }}>Last Active</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const roleBadge = getRoleBadge(user.role);
                const initials = (user.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                const isActive = user.status === 'Active' || user.isActive === true;

                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '34px', height: '34px', borderRadius: '50%',
                          background: '#dcfce7', color: '#11592c',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: '800', fontSize: '0.78rem'
                        }}>
                          {initials}
                        </div>
                        <div>
                          <strong style={{ color: '#0f172a', display: 'block', fontSize: '0.85rem' }}>{user.name}</strong>
                          <span style={{ color: '#64748b', fontSize: '0.72rem' }}>{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 8px', borderRadius: '4px',
                        fontSize: '0.72rem', fontWeight: '700',
                        background: roleBadge.bg, color: roleBadge.color
                      }}>
                        {roleBadge.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>
                      <div>{user.sector || 'General'}</div>
                      {user.rsbsa && user.rsbsa !== 'N/A' && (
                        <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: '600' }}>{user.rsbsa}</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        padding: '3px 8px', borderRadius: '12px',
                        fontSize: '0.72rem', fontWeight: '700',
                        background: isActive ? '#dcfce7' : '#f1f5f9',
                        color: isActive ? '#15803d' : '#64748b'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isActive ? '#16a34a' : '#94a3b8' }} />
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.75rem' }}>
                      {user.lastActive || 'Recently'}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button 
                          onClick={() => {
                            if (toggleUserStatus) {
                              toggleUserStatus(user.id);
                            }
                          }}
                          title="Toggle Account Status"
                          style={{ padding: '6px 10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer', color: '#334155' }}
                        >
                          {isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        {deleteUser && user.role !== 'super_admin' && (
                          <button 
                            onClick={() => {
                              if (window.confirm(`Delete user ${user.name}?`)) {
                                deleteUser(user.id);
                              }
                            }}
                            title="Delete User"
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add User */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Enroll New Cooperative User</h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0 0' }}>Provision system credentials and field assignments</p>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddUser}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Maria Clara Santos"
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="maria.santos@farmer.ph"
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>System Role</label>
                  <select 
                    value={formData.role} 
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fff' }}
                  >
                    <option value="farmer">Farmer Member</option>
                    <option value="farm_staff">Farm Staff</option>
                    <option value="admin">Admin IT/HR</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Assigned Sector / Plot</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sector B (Plot P-021)"
                    value={formData.sector} 
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>RSBSA ID (Farmers)</label>
                  <input 
                    type="text" 
                    placeholder="RSBSA-04-XXXX"
                    value={formData.rsbsa} 
                    onChange={(e) => setFormData({ ...formData, rsbsa: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '8px 16px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '8px 20px', background: '#11592c', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}
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
