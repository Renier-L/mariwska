import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Ban, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Calendar, 
  ShieldCheck,
  Lock,
  Download,
  AlertCircle
} from 'lucide-react';

const AdminMemberRecordsModule = ({
  users = [],
  addUser,
  updateUser,
  deleteUser,
  toggleUserStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Add Form State
  const [addName, setAddName] = useState('');
  const [addRole, setAddRole] = useState('Farmer');
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('+63 917 555 0100');
  const [addPlot, setAddPlot] = useState('Plot P-007 (Tomato Diamante)');
  const [addRsbsa, setAddRsbsa] = useState('RSBSA-03-1425-001');
  const [addCert, setAddCert] = useState('PGS Certified Organic Farmer');
  const [addEmerg, setAddEmerg] = useState('Maria Lopez (+63 918 777 8888)');
  const [addPass, setAddPass] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  // Edit Form State
  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('Farmer');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPlot, setEditPlot] = useState('');
  const [editRsbsa, setEditRsbsa] = useState('');
  const [editCert, setEditCert] = useState('');
  const [editEmerg, setEditEmerg] = useState('');

  // Summary counts
  const totalCount = users.length;
  const farmerCount = users.filter(u => u.role === 'Farmer').length;
  const staffCount = users.filter(u => u.role === 'Farm Staff').length;
  const adminCount = users.filter(u => u.role === 'Admin' || u.role === 'Executive' || u.role === 'Super Admin').length;

  // Filtered Users
  const filteredUsers = users.filter(u => {
    // Role filter
    if (roleFilter === 'Farmer' && u.role !== 'Farmer') return false;
    if (roleFilter === 'Farm Staff' && u.role !== 'Farm Staff') return false;
    if (roleFilter === 'Administrators' && (u.role !== 'Admin' && u.role !== 'Executive' && u.role !== 'Super Admin')) return false;

    // Status filter
    const isActive = u.status !== false && u.status !== 'Inactive';
    if (statusFilter === 'Active' && !isActive) return false;
    if (statusFilter === 'Inactive' && isActive) return false;

    // Search query
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.toLowerCase().includes(q)) ||
      (u.rsbsaNo && u.rsbsaNo.toLowerCase().includes(q)) ||
      (u.assignedPlot && u.assignedPlot.toLowerCase().includes(q))
    );
  });

  const handleOpenAdd = () => {
    setAddName('');
    setAddRole('Farmer');
    setAddEmail('');
    setAddPhone('+63 917 555 0100');
    setAddPlot('Plot P-007 (Tomato Diamante)');
    setAddRsbsa('RSBSA-03-1425-001');
    setAddCert('PGS Certified Organic Farmer');
    setAddEmerg('Family Contact (+63 918 555 0100)');
    setAddPass('password123');
    setShowAddModal(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!addName.trim() || !addEmail.trim()) {
      alert('Please fill in member name and email address.');
      return;
    }

    const newUser = {
      name: addName.trim(),
      role: addRole,
      email: addEmail.trim(),
      phone: addPhone.trim(),
      assignedPlot: addPlot,
      rsbsaNo: addRsbsa,
      certification: addCert,
      emergencyContact: addEmerg,
      joinDate: new Date().toISOString().split('T')[0],
      password: addPass,
      status: true
    };

    if (addUser) addUser(newUser);
    setShowAddModal(false);
  };

  const handleOpenEdit = (user) => {
    setEditId(user.id);
    setEditName(user.name || '');
    setEditRole(user.role || 'Farmer');
    setEditEmail(user.email || '');
    setEditPhone(user.phone || '+63 917 555 0100');
    setEditPlot(user.assignedPlot || '');
    setEditRsbsa(user.rsbsaNo || '');
    setEditCert(user.certification || '');
    setEditEmerg(user.emergencyContact || '');
    setEditingUser(user);
    setActiveMenuId(null);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    if (updateUser) {
      updateUser(editId, {
        name: editName.trim(),
        role: editRole,
        email: editEmail.trim(),
        phone: editPhone.trim(),
        assignedPlot: editPlot,
        rsbsaNo: editRsbsa,
        certification: editCert,
        emergencyContact: editEmerg
      });
    }
    setEditingUser(null);
  };

  const getRoleBadge = (role) => {
    if (role === 'Executive' || role === 'Super Admin') {
      return { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe', label: role === 'Executive' ? 'Executive' : 'Super Admin' };
    }
    if (role === 'Admin') {
      return { bg: '#eff6ff', color: '#0284c7', border: '#bfdbfe', label: 'Admin IT/HR' };
    }
    if (role === 'Farm Staff') {
      return { bg: '#fef3c7', color: '#d97706', border: '#fde68a', label: 'Farm Staff' };
    }
    return { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', label: 'Farmer' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#111827', margin: '0 0 4px 0', letterSpacing: '-0.4px' }}>
            Member Records
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
            Manage cooperative members, their information, certifications, and farm assignments.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{
            background: '#11592c',
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '0.82rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(17,89,44,0.2)'
          }}
        >
          <Plus size={16} /> Add Member
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div className="m-card" style={{ padding: '16px 18px', borderLeft: '4px solid #11592c' }}>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700' }}>Total Registered</span>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', margin: '4px 0' }}>{totalCount}</div>
          <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: '600' }}>Active Cooperative Members</span>
        </div>

        <div className="m-card" style={{ padding: '16px 18px', borderLeft: '4px solid #16a34a' }}>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700' }}>Registered Farmers</span>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#15803d', margin: '4px 0' }}>{farmerCount}</div>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Organic crop & goat producers</span>
        </div>

        <div className="m-card" style={{ padding: '16px 18px', borderLeft: '4px solid #d97706' }}>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700' }}>Farm Staff</span>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#b45309', margin: '4px 0' }}>{staffCount}</div>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Field supervisors & veterinary</span>
        </div>

        <div className="m-card" style={{ padding: '16px 18px', borderLeft: '4px solid #0284c7' }}>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700' }}>Administrative</span>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0369a1', margin: '4px 0' }}>{adminCount}</div>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Governance & IT/HR roles</span>
        </div>
      </div>

      {/* Directory Table Card with Filters */}
      <div className="m-card" style={{ padding: '20px' }}>
        {/* Controls Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
          {/* Role Filter Tabs */}
          <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
            {['All', 'Farmer', 'Farm Staff', 'Administrators'].map(tab => (
              <button
                key={tab}
                onClick={() => setRoleFilter(tab)}
                style={{
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  background: roleFilter === tab ? '#ffffff' : 'transparent',
                  color: roleFilter === tab ? '#11592c' : '#64748b',
                  boxShadow: roleFilter === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                }}
              >
                {tab === 'All' ? `All Members (${totalCount})` : tab}
              </button>
            ))}
          </div>

          {/* Search & Status Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                placeholder="Search member, RSBSA..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px 8px 32px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.76rem',
                  outline: 'none'
                }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.76rem',
                fontWeight: '600',
                color: '#334155',
                outline: 'none',
                background: '#fff'
              }}
            >
              <option value="All">All Status</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Member Records Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', textAlign: 'left', color: '#475569', fontWeight: '700' }}>
                <th style={{ padding: '10px 14px' }}>Member Name & Account</th>
                <th style={{ padding: '10px 14px' }}>System Role</th>
                <th style={{ padding: '10px 14px' }}>Farm / Sector Assignment</th>
                <th style={{ padding: '10px 14px' }}>RSBSA & Certification</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>Account Status</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                    No member records found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleStyle = getRoleBadge(user.role);
                  const isDanilo = user.name === 'Danilo Cruz';
                  const isActive = user.status !== false && user.status !== 'Inactive';

                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      {/* Member & Initials */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: isDanilo ? '#11592c' : '#e2e8f0',
                            color: isDanilo ? '#ffffff' : '#334155',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '0.75rem',
                            flexShrink: 0
                          }}>
                            {user.initials || (user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'M')}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.82rem' }}>
                                {user.name}
                              </span>
                              {isDanilo && (
                                <span style={{
                                  fontSize: '0.62rem',
                                  fontWeight: '800',
                                  background: '#11592c',
                                  color: '#fff',
                                  padding: '1px 5px',
                                  borderRadius: '4px'
                                }}>
                                  YOU
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* System Role */}
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          background: roleStyle.bg,
                          color: roleStyle.color,
                          border: `1px solid ${roleStyle.border}`
                        }}>
                          {roleStyle.label}
                        </span>
                      </td>

                      {/* Farm Assignment */}
                      <td style={{ padding: '12px 14px', color: '#334155' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={12} color="#15803d" />
                          <span>{user.assignedPlot || 'General Cooperative'}</span>
                        </div>
                      </td>

                      {/* RSBSA & Cert */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#0f172a' }}>
                          {user.rsbsaNo || 'RSBSA Registered'}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Award size={10} /> {user.certification || 'PGS Organic Level 1'}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          background: isActive ? '#dcfce7' : '#fef3c7',
                          color: isActive ? '#15803d' : '#b45309',
                          border: isActive ? '1px solid #86efac' : '1px solid #fde68a'
                        }}>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 14px', textAlign: 'center', position: 'relative' }}>
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === user.id ? null : user.id)}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            padding: '4px 6px',
                            cursor: 'pointer',
                            color: '#64748b'
                          }}
                        >
                          <MoreVertical size={14} />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === user.id && (
                          <div style={{
                            position: 'absolute',
                            right: '16px',
                            top: '40px',
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                            zIndex: 100,
                            width: '150px',
                            textAlign: 'left',
                            padding: '4px 0'
                          }}>
                            <button
                              onClick={() => {
                                setViewingUser(user);
                                setActiveMenuId(null);
                              }}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: 'none',
                                background: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.75rem',
                                color: '#334155',
                                cursor: 'pointer'
                              }}
                            >
                              <Eye size={13} color="#0284c7" /> View Profile
                            </button>

                            <button
                              onClick={() => handleOpenEdit(user)}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: 'none',
                                background: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.75rem',
                                color: '#334155',
                                cursor: 'pointer'
                              }}
                            >
                              <Edit size={13} color="#15803d" /> Edit Details
                            </button>

                            <button
                              onClick={() => {
                                if (toggleUserStatus) toggleUserStatus(user.id);
                                setActiveMenuId(null);
                              }}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: 'none',
                                background: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.75rem',
                                color: isActive ? '#b45309' : '#15803d',
                                cursor: 'pointer'
                              }}
                            >
                              <Ban size={13} /> {isActive ? 'Disable Account' : 'Reactivate'}
                            </button>

                            {!isDanilo && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete member record "${user.name}"?`)) {
                                    if (deleteUser) deleteUser(user.id);
                                  }
                                  setActiveMenuId(null);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: 'none',
                                  background: 'transparent',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  fontSize: '0.75rem',
                                  color: '#dc2626',
                                  cursor: 'pointer',
                                  borderTop: '1px solid #f1f5f9'
                                }}
                              >
                                <Trash2 size={13} /> Delete Member
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW MEMBER PROFILE MODAL */}
      {viewingUser && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="m-card" style={{ width: '500px', background: '#fff', padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#11592c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                  {viewingUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>{viewingUser.name}</h3>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{viewingUser.email}</span>
                </div>
              </div>
              <button onClick={() => setViewingUser(null)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>SYSTEM ROLE</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#11592c' }}>{viewingUser.role}</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>RSBSA REGISTRY</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>{viewingUser.rsbsaNo || 'RSBSA-03-1425'}</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>ASSIGNED SECTOR</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>{viewingUser.assignedPlot || 'Sector HQ'}</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>CONTACT PHONE</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>{viewingUser.phone || '+63 917 555 0100'}</span>
              </div>
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#15803d', display: 'block' }}>ORGANIC CERTIFICATION & COMPLIANCE</span>
              <span style={{ fontSize: '0.78rem', color: '#166534' }}>{viewingUser.certification || 'PGS Certified Organic Farmer · Level 1 Verified'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => {
                  setViewingUser(null);
                  handleOpenEdit(viewingUser);
                }}
                className="btn-outline"
                style={{ padding: '6px 14px', fontSize: '0.78rem' }}
              >
                Edit Record
              </button>
              <button onClick={() => setViewingUser(null)} className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.78rem' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="m-card" style={{ width: '520px', background: '#fff', padding: '24px', borderRadius: '16px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>Register New Member</h3>
              <button onClick={() => setShowAddModal(false)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Fernando Poe"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>System Role</label>
                  <select
                    value={addRole}
                    onChange={(e) => setAddRole(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                  >
                    <option value="Farmer">Farmer</option>
                    <option value="Farm Staff">Farm Staff</option>
                    <option value="Admin">Admin IT/HR</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="member@mariwska.coop"
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                  <input
                    type="text"
                    value={addPhone}
                    onChange={(e) => setAddPhone(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>RSBSA Number</label>
                  <input
                    type="text"
                    value={addRsbsa}
                    onChange={(e) => setAddRsbsa(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Assigned Plot / Sector</label>
                <input
                  type="text"
                  value={addPlot}
                  onChange={(e) => setAddPlot(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Initial Temporary Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={addPass}
                    onChange={(e) => setAddPass(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '8px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.7rem', color: '#64748b' }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-outline" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.78rem' }}>
                  Save Member Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {editingUser && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="m-card" style={{ width: '520px', background: '#fff', padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>Edit Member Record</h3>
              <button onClick={() => setEditingUser(null)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>System Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                  >
                    <option value="Farmer">Farmer</option>
                    <option value="Farm Staff">Farm Staff</option>
                    <option value="Admin">Admin IT/HR</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>RSBSA Number</label>
                  <input
                    type="text"
                    value={editRsbsa}
                    onChange={(e) => setEditRsbsa(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Assigned Plot / Sector</label>
                <input
                  type="text"
                  value={editPlot}
                  onChange={(e) => setEditPlot(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setEditingUser(null)} className="btn-outline" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.78rem' }}>
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMemberRecordsModule;
