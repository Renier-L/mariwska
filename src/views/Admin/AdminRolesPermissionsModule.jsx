import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Info, 
  Check, 
  Minus, 
  Users, 
  Sprout, 
  Megaphone, 
  FileText, 
  SlidersHorizontal,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const AdminRolesPermissionsModule = () => {
  const [selectedRoleTab, setSelectedRoleTab] = useState('All');
  const [expandedCategory, setExpandedCategory] = useState({
    members: true,
    operations: true,
    broadcasts: true,
    reports: true,
    security: true
  });

  const toggleCategory = (cat) => {
    setExpandedCategory(prev => ({ ...prev, [cat]: !prev [cat] }));
  };

  // 5 Roles Overview
  const roles = [
    {
      id: 'super_admin',
      name: 'Superadmin',
      badge: 'Platform Governance',
      bg: '#f5f3ff',
      color: '#7c3aed',
      border: '#ddd6fe',
      members: 1,
      description: 'Complete system oversight, cloud database syncing, security RBAC configuration, and full platform access.'
    },
    {
      id: 'admin',
      name: 'Admin IT/HR',
      badge: 'Cooperative Administration',
      bg: '#eff6ff',
      color: '#0284c7',
      border: '#bfdbfe',
      members: 1,
      description: 'Manages member records, user accounts, announcements dispatch, and cooperative administrative reports.'
    },
    {
      id: 'executive',
      name: 'Executive',
      badge: 'Governance & Audit',
      bg: '#f0fdf4',
      color: '#15803d',
      border: '#bbf7d0',
      members: 1,
      description: 'Strategic governance board oversight, official sign-offs, production summaries, and audit reviews.'
    },
    {
      id: 'farm_staff',
      name: 'Farm Staff',
      badge: 'Field Operations Supervision',
      bg: '#fef3c7',
      color: '#d97706',
      border: '#fde68a',
      members: 2,
      description: 'Validates farmer task submissions, oversees crop sectors and caprine livestock health routines.'
    },
    {
      id: 'farmer',
      name: 'Farmer',
      badge: 'Field Producer',
      bg: '#f1f5f9',
      color: '#334155',
      border: '#cbd5e1',
      members: 8,
      description: 'Logs daily farm activities via mobile, reviews assigned plots/herds, and receives broadcast announcements.'
    }
  ];

  // RBAC Matrix Definitions
  const permissionCategories = [
    {
      id: 'members',
      name: 'Member & Account Management',
      icon: Users,
      permissions: [
        { label: 'Register new cooperative member', super: true, admin: true, exec: false, staff: false, farmer: false },
        { label: 'Edit member personal & farm details', super: true, admin: true, exec: false, staff: false, farmer: false },
        { label: 'Deactivate / Reactivate user accounts', super: true, admin: true, exec: false, staff: false, farmer: false },
        { label: 'Delete user accounts permanently', super: true, admin: false, exec: false, staff: false, farmer: false }
      ]
    },
    {
      id: 'operations',
      name: 'Farm Operations & Field Supervision',
      icon: Sprout,
      permissions: [
        { label: 'Validate farmer mobile submissions', super: true, admin: false, exec: false, staff: true, farmer: false },
        { label: 'Submit field logs with GPS and photos', super: true, admin: false, exec: false, staff: true, farmer: true },
        { label: 'Manage crop sectors & goat herd pens', super: true, admin: false, exec: false, staff: true, farmer: false },
        { label: 'Create cooperative operational tasks', super: true, admin: false, exec: true, staff: true, farmer: false }
      ]
    },
    {
      id: 'broadcasts',
      name: 'Announcements & Communications',
      icon: Megaphone,
      permissions: [
        { label: 'Create & dispatch announcements', super: true, admin: true, exec: true, staff: false, farmer: false },
        { label: 'Trigger instant push notification alerts', super: true, admin: true, exec: true, staff: false, farmer: false },
        { label: 'Archive / Delete broadcast notices', super: true, admin: true, exec: false, staff: false, farmer: false },
        { label: 'View broadcasts on mobile & web', super: true, admin: true, exec: true, staff: true, farmer: true }
      ]
    },
    {
      id: 'reports',
      name: 'Administrative Reports & Data Export',
      icon: FileText,
      permissions: [
        { label: 'Generate member directories & RSBSA rosters', super: true, admin: true, exec: true, staff: false, farmer: false },
        { label: 'Export official PDF dossiers & CSV files', super: true, admin: true, exec: true, staff: true, farmer: false },
        { label: 'Review production audit summaries', super: true, admin: false, exec: true, staff: false, farmer: false }
      ]
    },
    {
      id: 'security',
      name: 'Platform Security & Configuration',
      icon: Lock,
      permissions: [
        { label: 'Modify role permission matrix (RBAC)', super: true, admin: false, exec: false, staff: false, farmer: false },
        { label: 'Seed cloud database tables', super: true, admin: false, exec: false, staff: false, farmer: false },
        { label: 'View audit logs & activity history', super: true, admin: true, exec: true, staff: false, farmer: false }
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#111827', margin: '0 0 4px 0', letterSpacing: '-0.4px' }}>
          Roles & Permissions
        </h1>
        <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
          View system roles, access permissions, and assigned capabilities.
        </p>
      </div>

      {/* Read-Only Notice Banner */}
      <div style={{
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: '#dbeafe',
          color: '#1d4ed8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Info size={18} />
        </div>
        <div style={{ fontSize: '0.78rem', color: '#1e40af' }}>
          <strong style={{ display: 'block', fontWeight: '800' }}>Read-Only Role Directory</strong>
          You can view role permissions. Only the Superadmin can modify permission settings.
        </div>
      </div>

      {/* 5 Roles Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
        {roles.map(r => (
          <div 
            key={r.id}
            className="m-card" 
            style={{ 
              padding: '16px',
              borderTop: `4px solid ${r.color}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>{r.name}</span>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: '700',
                background: r.bg,
                color: r.color,
                border: `1px solid ${r.border}`,
                padding: '2px 6px',
                borderRadius: '6px'
              }}>
                {r.members} {r.members === 1 ? 'user' : 'users'}
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: r.color, marginBottom: '6px' }}>
              {r.badge}
            </div>
            <p style={{ fontSize: '0.72rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>
              {r.description}
            </p>
          </div>
        ))}
      </div>

      {/* RBAC Permission Capability Matrix */}
      <div className="m-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', margin: 0 }}>
              System Capability Matrix
            </h3>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Granular role breakdown across cooperative modules
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.72rem', color: '#64748b' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={10} />
              </span>
              Allowed
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Minus size={10} />
              </span>
              Restricted
            </span>
          </div>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {permissionCategories.map(cat => {
            const Icon = cat.icon;
            const isExpanded = expandedCategory[cat.id];

            return (
              <div key={cat.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                {/* Accordion Header */}
                <button
                  onClick={() => toggleCategory(cat.id)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#f8fafc',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#dcfce7', color: '#11592c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={14} />
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>
                      {cat.name}
                    </span>
                  </div>
                  {isExpanded ? <ChevronDown size={16} color="#64748b" /> : <ChevronRight size={16} color="#64748b" />}
                </button>

                {/* Table Content */}
                {isExpanded && (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
                      <thead>
                        <tr style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'center' }}>
                          <th style={{ padding: '8px 16px', textAlign: 'left' }}>Capability / Action</th>
                          <th style={{ padding: '8px 12px', width: '90px' }}>Superadmin</th>
                          <th style={{ padding: '8px 12px', width: '90px', background: '#f0f9ff' }}>Admin IT/HR</th>
                          <th style={{ padding: '8px 12px', width: '90px' }}>Executive</th>
                          <th style={{ padding: '8px 12px', width: '90px' }}>Farm Staff</th>
                          <th style={{ padding: '8px 12px', width: '90px' }}>Farmer</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cat.permissions.map((p, pIdx) => (
                          <tr key={pIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '10px 16px', color: '#1e293b', fontWeight: '600' }}>
                              {p.label}
                            </td>

                            {/* Super */}
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              {p.super ? (
                                <span style={{ display: 'inline-flex', width: '20px', height: '20px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', alignItems: 'center', justifyContent: 'center' }}>
                                  <Check size={12} />
                                </span>
                              ) : (
                                <span style={{ display: 'inline-flex', width: '20px', height: '20px', borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', alignItems: 'center', justifyContent: 'center' }}>
                                  <Minus size={12} />
                                </span>
                              )}
                            </td>

                            {/* Admin */}
                            <td style={{ padding: '10px 12px', textAlign: 'center', background: '#f0f9ff' }}>
                              {p.admin ? (
                                <span style={{ display: 'inline-flex', width: '20px', height: '20px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', alignItems: 'center', justifyContent: 'center' }}>
                                  <Check size={12} />
                                </span>
                              ) : (
                                <span style={{ display: 'inline-flex', width: '20px', height: '20px', borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', alignItems: 'center', justifyContent: 'center' }}>
                                  <Minus size={12} />
                                </span>
                              )}
                            </td>

                            {/* Exec */}
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              {p.exec ? (
                                <span style={{ display: 'inline-flex', width: '20px', height: '20px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', alignItems: 'center', justifyContent: 'center' }}>
                                  <Check size={12} />
                                </span>
                              ) : (
                                <span style={{ display: 'inline-flex', width: '20px', height: '20px', borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', alignItems: 'center', justifyContent: 'center' }}>
                                  <Minus size={12} />
                                </span>
                              )}
                            </td>

                            {/* Staff */}
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              {p.staff ? (
                                <span style={{ display: 'inline-flex', width: '20px', height: '20px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', alignItems: 'center', justifyContent: 'center' }}>
                                  <Check size={12} />
                                </span>
                              ) : (
                                <span style={{ display: 'inline-flex', width: '20px', height: '20px', borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', alignItems: 'center', justifyContent: 'center' }}>
                                  <Minus size={12} />
                                </span>
                              )}
                            </td>

                            {/* Farmer */}
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              {p.farmer ? (
                                <span style={{ display: 'inline-flex', width: '20px', height: '20px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', alignItems: 'center', justifyContent: 'center' }}>
                                  <Check size={12} />
                                </span>
                              ) : (
                                <span style={{ display: 'inline-flex', width: '20px', height: '20px', borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', alignItems: 'center', justifyContent: 'center' }}>
                                  <Minus size={12} />
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminRolesPermissionsModule;
