import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Clock, 
  UserCheck, 
  ChevronRight, 
  SlidersHorizontal 
} from 'lucide-react';
import AdminRolesPermissionsModule from '../Admin/AdminRolesPermissionsModule';

const RolesPermissionsModule = () => {
  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix' | 'audit'

  // Security audit events
  const auditLogs = [
    { id: 'SEC-101', event: 'Role Elevation Attempt Blocked', actor: 'danilo.cruz@marikha.org', ip: '120.29.88.14', time: 'Today, 11:24 AM', status: 'Blocked' },
    { id: 'SEC-102', event: 'Random Forest Risk Model Weights Committed', actor: 'rosa.mendoza@marikha.org', ip: '112.198.74.22', time: 'Today, 09:15 AM', status: 'Success' },
    { id: 'SEC-103', event: 'Farmer Account Deactivated (C. Silang)', actor: 'danilo.cruz@marikha.org', ip: '120.29.88.14', time: 'Yesterday, 03:40 PM', status: 'Success' },
    { id: 'SEC-104', event: 'Super Admin Multi-Factor Authentication Passed', actor: 'rosa.mendoza@marikha.org', ip: '112.198.74.22', time: 'Nov 02, 08:00 AM', status: 'Success' },
    { id: 'SEC-105', event: 'Access Control Policy Updated (Farm Staff -> View-Only)', actor: 'rosa.mendoza@marikha.org', ip: '112.198.74.22', time: 'Nov 01, 02:15 PM', status: 'Success' }
  ];

  return (
    <div className="superadmin-module animate-fade-in" style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Sub-Tabs: Matrix vs Security Audit Trail */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1.5px solid #e2e8f0', marginBottom: '20px' }}>
        {[
          { id: 'matrix', label: 'Access Control & Permissions Matrix', icon: SlidersHorizontal },
          { id: 'audit', label: 'Security Event Audit Trail (Immutable)', icon: ShieldAlert }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 18px',
                fontSize: '0.82rem',
                fontWeight: activeTab === tab.id ? '800' : '600',
                color: activeTab === tab.id ? '#11592c' : '#64748b',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2.5px solid #11592c' : '2.5px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'matrix' ? (
        <AdminRolesPermissionsModule />
      ) : (
        /* Audit Trail */
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
              Security & Privilege Elevation Audit Log
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Immutable audit events recorded across all sessions and API tokens in Supabase
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
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
        </div>
      )}
    </div>
  );
};

export default RolesPermissionsModule;
