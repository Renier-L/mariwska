import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Check, 
  X, 
  AlertTriangle, 
  Info, 
  Clock, 
  UserCheck, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

const RolesPermissionsModule = () => {
  const [activeTab, setActiveTab] = useState('matrix');

  // Role permissions definitions
  const permissionsModules = [
    {
      name: 'System Governance & Global Settings',
      permissions: [
        { id: 'gov_tenant', name: 'Tenant Multi-Cooperative Provisioning', super: 'Protected', admin: 'Restricted', staff: 'Restricted', farmer: 'Restricted' },
        { id: 'gov_backup', name: 'Database Snapshots & Cloud Restore', super: 'Protected', admin: 'Restricted', staff: 'Restricted', farmer: 'Restricted' },
        { id: 'gov_audit', name: 'System Security & Audit Log Inspection', super: 'Granted', admin: 'Granted', staff: 'Restricted', farmer: 'Restricted' }
      ]
    },
    {
      name: 'Crop & Livestock Farm Operations',
      permissions: [
        { id: 'crop_edit', name: 'Register & Modify Crop Plots', super: 'Granted', admin: 'Granted', staff: 'Granted', farmer: 'Restricted' },
        { id: 'livestock_reg', name: 'Caprine Herd Registration & Demographics', super: 'Granted', admin: 'Granted', staff: 'Granted', farmer: 'Restricted' },
        { id: 'task_dispatch', name: 'Operational Task Creation & Dispatch', super: 'Granted', admin: 'Granted', staff: 'Granted', farmer: 'Restricted' },
        { id: 'field_log', name: 'Mobile Field Log & Activity Submission', super: 'Granted', admin: 'Granted', staff: 'Granted', farmer: 'Granted' }
      ]
    },
    {
      name: 'Machine Learning & Predictive Engine',
      permissions: [
        { id: 'ml_weights', name: 'Retrain Random Forest Regressor & Risk Model', super: 'Granted', admin: 'Restricted', staff: 'Restricted', farmer: 'Restricted' },
        { id: 'ml_commit', name: 'Commit Automated Recommendations to Supabase', super: 'Granted', admin: 'Granted', staff: 'Restricted', farmer: 'Restricted' },
        { id: 'ml_view', name: 'Inspect Yield Horizon & Variance Analytics', super: 'Granted', admin: 'Granted', staff: 'Granted', farmer: 'Restricted' }
      ]
    },
    {
      name: 'User Management & Security Policies',
      permissions: [
        { id: 'usr_create', name: 'Create & Deactivate Member Accounts', super: 'Granted', admin: 'Granted', staff: 'Restricted', farmer: 'Restricted' },
        { id: 'usr_roles', name: 'Modify RBAC Permissions Matrix', super: 'Protected', admin: 'Restricted', staff: 'Restricted', farmer: 'Restricted' },
        { id: 'usr_pwd', name: 'Force Security Password Reset', super: 'Granted', admin: 'Granted', staff: 'Restricted', farmer: 'Restricted' }
      ]
    }
  ];

  // Security audit events
  const auditLogs = [
    { id: 'SEC-101', event: 'Role Elevation Attempt Blocked', actor: 'danilo.cruz@marikha.org', ip: '120.29.88.14', time: 'Today, 11:24 AM', status: 'Blocked' },
    { id: 'SEC-102', event: 'Random Forest Risk Model Weights Committed', actor: 'rosa.mendoza@marikha.org', ip: '112.198.74.22', time: 'Today, 09:15 AM', status: 'Success' },
    { id: 'SEC-103', event: 'Farmer Account Deactivated (C. Silang)', actor: 'danilo.cruz@marikha.org', ip: '120.29.88.14', time: 'Yesterday, 03:40 PM', status: 'Success' },
    { id: 'SEC-104', event: 'Super Admin Multi-Factor Authentication Passed', actor: 'rosa.mendoza@marikha.org', ip: '112.198.74.22', time: 'Nov 02, 08:00 AM', status: 'Success' }
  ];

  const renderBadge = (status) => {
    if (status === 'Protected') {
      return (
        <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '800', background: '#dcfce7', color: '#11592c', border: '1px solid #bbf7d0' }}>
          🛡 Protected
        </span>
      );
    }
    if (status === 'Granted') {
      return (
        <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700', background: '#f0fdf4', color: '#16a34a' }}>
          ✓ Granted
        </span>
      );
    }
    return (
      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '600', background: '#f1f5f9', color: '#94a3b8' }}>
        ✕ Restricted
      </span>
    );
  };

  return (
    <div className="superadmin-module animate-fade-in" style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#dcfce7', color: '#11592c', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '6px' }}>
            <ShieldCheck size={14} /> Role-Based Access Control (RBAC)
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            Roles & Security Policies
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Configure granular module permissions, access tiers, and security audit log.
          </p>
        </div>
      </div>

      {/* 4 Role Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          {
            role: 'Super Admin',
            tier: 'Level 5 · Root Governance',
            desc: 'Multi-cooperative tenant oversight, technical health, model weights & security policies.',
            users: '1 user (R. Mendoza)',
            badge: '#11592c'
          },
          {
            role: 'Admin IT/HR',
            tier: 'Level 4 · Operational Administration',
            desc: 'Member records, cooperative announcements, staff assignment & report generation.',
            users: '1 user (D. Cruz)',
            badge: '#3730a3'
          },
          {
            role: 'Farm Staff',
            tier: 'Level 3 · Field Validation',
            desc: 'Activity validation, crop & livestock supervision, clinical observations & task dispatch.',
            users: '2 users (A. Bautista, V. Reyes)',
            badge: '#92400e'
          },
          {
            role: 'Farmer Member',
            tier: 'Level 1 · Field Reporting',
            desc: 'Mobile harvest logs, field task checklist execution & agronomic recommendations.',
            users: '8 active farmers',
            badge: '#16a34a'
          }
        ].map((r) => (
          <div key={r.role} style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{r.role}</strong>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: r.badge }} />
            </div>
            <span style={{ fontSize: '0.72rem', color: r.badge, fontWeight: '700', display: 'block', marginBottom: '8px' }}>
              {r.tier}
            </span>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 12px 0', lineHeight: 1.4 }}>
              {r.desc}
            </p>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#334155', background: '#f8fafc', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
              {r.users}
            </span>
          </div>
        ))}
      </div>

      {/* Sub-Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
        {[
          { id: 'matrix', label: 'Capability Permissions Matrix' },
          { id: 'audit', label: 'Security Event Audit Trail' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              fontSize: '0.82rem',
              fontWeight: activeTab === tab.id ? '700' : '600',
              color: activeTab === tab.id ? '#11592c' : '#64748b',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #11592c' : '2px solid transparent',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'matrix' ? (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
              Granular Module Access Matrix
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Access tiers enforced by PostgreSQL Row-Level Security (RLS) policies on Supabase
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '700' }}>
                  <th style={{ padding: '12px 16px' }}>Module Capability</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Super Admin</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Admin IT/HR</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Farm Staff</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Farmer Member</th>
                </tr>
              </thead>
              <tbody>
                {permissionsModules.map((group) => (
                  <React.Fragment key={group.name}>
                    <tr style={{ background: '#f1f5f9', fontWeight: '800', color: '#1e293b' }}>
                      <td colSpan={5} style={{ padding: '8px 16px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {group.name}
                      </td>
                    </tr>
                    {group.permissions.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px', color: '#0f172a', fontWeight: '600' }}>{p.name}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>{renderBadge(p.super)}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>{renderBadge(p.admin)}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>{renderBadge(p.staff)}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>{renderBadge(p.farmer)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Audit Trail */
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
              Security & Privilege Elevation Audit Log
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Immutable audit events recorded across all sessions and API tokens
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '700' }}>
                <th style={{ padding: '12px 16px' }}>Event ID</th>
                <th style={{ padding: '12px 16px' }}>Action & Description</th>
                <th style={{ padding: '12px 16px' }}>Actor Account</th>
                <th style={{ padding: '12px 16px' }}>Source IP</th>
                <th style={{ padding: '12px 16px' }}>Timestamp</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0f172a' }}>{log.id}</td>
                  <td style={{ padding: '12px 16px', color: '#334155', fontWeight: '600' }}>{log.event}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{log.actor}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontFamily: 'monospace' }}>{log.ip}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{log.time}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700',
                      background: log.status === 'Success' ? '#dcfce7' : '#fee2e2',
                      color: log.status === 'Success' ? '#15803d' : '#b91c1c'
                    }}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RolesPermissionsModule;
