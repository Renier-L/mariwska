import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Megaphone, 
  ShieldCheck, 
  Plus, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Sparkles,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';

const AdminDashboardModule = ({ 
  users = [], 
  announcements = [], 
  setActiveTab, 
  onOpenAddMember,
  onOpenCreateAnnouncement,
  selectedSeason,
  setSelectedSeason
}) => {
  // Statistics
  const totalMembers = users.length || 12;
  const activeMembers = users.filter(u => u.status !== false && u.status !== 'Inactive').length;
  const inactiveMembers = totalMembers - activeMembers;
  const activeRate = totalMembers > 0 ? ((activeMembers / totalMembers) * 100).toFixed(1) : 100;

  // Active Announcements
  const activeAnnouncements = announcements.filter(a => !a.archived);
  const activeAnnouncementsCount = activeAnnouncements.length;

  // Role Breakdown
  const superAdminCount = users.filter(u => u.role === 'Super Admin' || u.role === 'Executive').length || 1;
  const adminCount = users.filter(u => u.role === 'Admin').length || 1;
  const farmStaffCount = users.filter(u => u.role === 'Farm Staff').length || 2;
  const farmerCount = users.filter(u => u.role === 'Farmer').length || 8;

  // Recent 5 Administrative Activities with clean data (no undefined or missing author)
  const recentActivities = [
    {
      id: 'act-1',
      activity: 'Account Profile Verification',
      record: 'Corazon Silang (Farmer Member)',
      performedBy: 'Danilo Cruz (Admin IT/HR)',
      dateTime: 'Nov 4, 2026 · 10:15 AM',
      status: 'Pending Review',
      statusType: 'pending'
    },
    {
      id: 'act-2',
      activity: 'Cooperative Broadcast Dispatched',
      record: 'Fertilizer & Organic Inputs Notice',
      performedBy: 'Danilo Cruz (Admin IT/HR)',
      dateTime: 'Nov 3, 2026 · 02:40 PM',
      status: 'Broadcast Active',
      statusType: 'success'
    },
    {
      id: 'act-3',
      activity: 'RSBSA & Pen Assignment Update',
      record: 'Renier Lopez (Plot P-007 / Herd GT-003)',
      performedBy: 'Rosa Mendoza (Executive)',
      dateTime: 'Nov 2, 2026 · 11:20 AM',
      status: 'Completed',
      statusType: 'success'
    },
    {
      id: 'act-4',
      activity: 'Staff Supervision Sector Sync',
      record: 'Arnel Bautista (Sector B Oversight)',
      performedBy: 'Danilo Cruz (Admin IT/HR)',
      dateTime: 'Nov 1, 2026 · 09:10 AM',
      status: 'Completed',
      statusType: 'success'
    },
    {
      id: 'act-5',
      activity: 'Quarterly RBAC Security Audit',
      record: '5 System Roles Validated',
      performedBy: 'System Security Engine',
      dateTime: 'Oct 30, 2026 · 05:00 PM',
      status: 'Verified',
      statusType: 'success'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Dashboard Top Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '1.65rem', 
            fontWeight: '800', 
            color: '#111827', 
            margin: '0 0 4px 0',
            letterSpacing: '-0.4px' 
          }}>
            Administration Dashboard
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
            Manage cooperative members, user accounts, announcements, and administrative activities.
          </p>
        </div>

        {/* Season & Live Time Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            padding: '6px 12px',
            borderRadius: '10px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            fontSize: '0.78rem',
            color: '#0f172a'
          }}>
            <Calendar size={14} color="#15803d" />
            <span style={{ fontWeight: '600', color: '#64748b' }}>Active Season:</span>
            <select
              value={selectedSeason || 'Wet Season 2026'}
              onChange={(e) => setSelectedSeason && setSelectedSeason(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontWeight: '700',
                color: '#11592c',
                cursor: 'pointer',
                outline: 'none',
                fontSize: '0.78rem'
              }}
            >
              <option value="Wet Season 2026">Wet Season 2026</option>
              <option value="Dry Season 2025-2026">Dry Season 2025-2026</option>
              <option value="Wet Season 2025">Wet Season 2025</option>
              <option value="All Seasons">All Seasons</option>
            </select>
          </div>

          <div style={{
            background: '#dcfce7',
            border: '1px solid #86efac',
            color: '#11592c',
            padding: '6px 12px',
            borderRadius: '10px',
            fontSize: '0.75rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }}></span>
            Danilo Cruz (Admin IT/HR)
          </div>
        </div>
      </div>

      {/* 4 Administrative Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '14px' 
      }}>
        {/* Total Registered Members */}
        <div className="m-card" style={{ padding: '16px 18px', borderLeft: '4px solid #11592c' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>Total Members</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={16} color="#11592c" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>
            {totalMembers}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.74rem' }}>
            <span style={{ color: '#16a34a', fontWeight: '700', background: '#f0fdf4', padding: '1px 6px', borderRadius: '4px' }}>
              {activeMembers} Active
            </span>
            <span style={{ color: '#94a3b8' }}>Cooperative Roster</span>
          </div>
        </div>

        {/* Active Accounts */}
        <div className="m-card" style={{ padding: '16px 18px', borderLeft: '4px solid #16a34a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>Active Accounts</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCheck size={16} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#15803d', lineHeight: 1.1 }}>
            {activeMembers}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.74rem' }}>
            <span style={{ color: '#15803d', fontWeight: '700' }}>
              {activeRate}% active rate
            </span>
            <span style={{ color: '#94a3b8' }}>• Normal status</span>
          </div>
        </div>

        {/* Inactive Accounts */}
        <div className="m-card" style={{ padding: '16px 18px', borderLeft: '4px solid #d97706' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>Inactive Accounts</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserX size={16} color="#d97706" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: inactiveMembers > 0 ? '#b45309' : '#0f172a', lineHeight: 1.1 }}>
            {inactiveMembers}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.74rem' }}>
            {inactiveMembers > 0 ? (
              <span style={{ background: '#fef3c7', color: '#b45309', fontWeight: '700', padding: '1px 6px', borderRadius: '4px' }}>
                Needs review
              </span>
            ) : (
              <span style={{ color: '#16a34a', fontWeight: '700' }}>0 flags</span>
            )}
            <span style={{ color: '#94a3b8' }}>• Corazon Silang</span>
          </div>
        </div>

        {/* Active Announcements */}
        <div className="m-card" style={{ padding: '16px 18px', borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>Active Announcements</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Megaphone size={16} color="#0284c7" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0369a1', lineHeight: 1.1 }}>
            {activeAnnouncementsCount}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.74rem' }}>
            <span style={{ color: '#0369a1', fontWeight: '700', background: '#f0f9ff', padding: '1px 6px', borderRadius: '4px' }}>
              Live broadcast
            </span>
            <span style={{ color: '#94a3b8' }}>• All members reach</span>
          </div>
        </div>
      </div>

      {/* Member Distribution & Quick Actions Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Member Distribution by Role */}
        <div className="m-card" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                Member Distribution by Role
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                Cooperative roster classified by administrative responsibility
              </p>
            </div>
            <button
              onClick={() => setActiveTab && setActiveTab('member-records')}
              style={{
                background: '#f0fdf4',
                color: '#11592c',
                border: '1px solid #bbf7d0',
                padding: '5px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              View All Members <ArrowRight size={13} />
            </button>
          </div>

          {/* Proportional Segmented Progress Bar */}
          <div style={{ 
            height: '10px', 
            borderRadius: '6px', 
            overflow: 'hidden', 
            display: 'flex', 
            background: '#f1f5f9',
            marginBottom: '16px' 
          }}>
            <div style={{ width: `${(superAdminCount / totalMembers) * 100}%`, background: '#7c3aed' }} title={`Governance / Superadmin: ${superAdminCount}`} />
            <div style={{ width: `${(adminCount / totalMembers) * 100}%`, background: '#0284c7' }} title={`Admin IT/HR: ${adminCount}`} />
            <div style={{ width: `${(farmStaffCount / totalMembers) * 100}%`, background: '#d97706' }} title={`Farm Staff: ${farmStaffCount}`} />
            <div style={{ width: `${(farmerCount / totalMembers) * 100}%`, background: '#16a34a' }} title={`Farmer Members: ${farmerCount}`} />
          </div>

          {/* Role Chips */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7c3aed' }} />
                <span style={{ fontSize: '0.78rem', color: '#334155', fontWeight: '600' }}>Governance / Exec</span>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>{superAdminCount}</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }} />
                <span style={{ fontSize: '0.78rem', color: '#334155', fontWeight: '600' }}>Admin IT/HR</span>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>{adminCount}</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d97706' }} />
                <span style={{ fontSize: '0.78rem', color: '#334155', fontWeight: '600' }}>Farm Staff</span>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>{farmStaffCount}</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }} />
                <span style={{ fontSize: '0.78rem', color: '#334155', fontWeight: '600' }}>Farmer Members</span>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>{farmerCount}</span>
            </div>
          </div>
        </div>

        {/* Quick Administrative Actions Panel */}
        <div className="m-card" style={{ padding: '18px 20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', margin: '0 0 4px 0' }}>
            Quick Administrative Actions
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 14px 0' }}>
            Direct access to common cooperative administration tasks
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <button
              onClick={() => onOpenAddMember ? onOpenAddMember() : (setActiveTab && setActiveTab('member-records'))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: '10px',
                background: '#11592c',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.78rem',
                textAlign: 'left',
                transition: 'transform 0.1s ease'
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={16} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800' }}>Add Member</span>
                <span style={{ fontSize: '0.68rem', opacity: 0.9 }}>Register new user</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab && setActiveTab('member-records')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: '10px',
                background: '#ffffff',
                color: '#0f172a',
                border: '1.5px solid #e2e8f0',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.78rem',
                textAlign: 'left'
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={16} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800' }}>Member Records</span>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Manage roster</span>
              </div>
            </button>

            <button
              onClick={() => onOpenCreateAnnouncement ? onOpenCreateAnnouncement() : (setActiveTab && setActiveTab('announcements'))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: '10px',
                background: '#ffffff',
                color: '#0f172a',
                border: '1.5px solid #e2e8f0',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.78rem',
                textAlign: 'left'
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#eff6ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Megaphone size={16} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800' }}>Announcements</span>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Post broadcasts</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab && setActiveTab('reports')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: '10px',
                background: '#ffffff',
                color: '#0f172a',
                border: '1.5px solid #e2e8f0',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.78rem',
                textAlign: 'left'
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={16} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800' }}>Generate Report</span>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>PDF & CSV Export</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Pending Administrative Attention Panel */}
      <div style={{
        background: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: '12px',
        padding: '14px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: '#fef3c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#b45309',
            flexShrink: 0
          }}>
            <AlertTriangle size={18} />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#92400e', display: 'block' }}>
              Pending Administrative Attention (1 Inactive Account)
            </span>
            <span style={{ fontSize: '0.75rem', color: '#b45309' }}>
              Farmer Corazon Silang (Plot P-055, Ampalaya) requires organic certification renewal before seasonal reactivation.
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab && setActiveTab('member-records')}
          style={{
            background: '#b45309',
            color: '#ffffff',
            border: 'none',
            padding: '6px 14px',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Review Member
        </button>
      </div>

      {/* Recent Administrative Activities Table (Cleaned Presentation) */}
      <div className="m-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', margin: 0 }}>
              Recent Administrative Activities
            </h3>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Last 5 administrative operations and member directory audit entries
            </span>
          </div>
          <button
            onClick={() => setActiveTab && setActiveTab('member-records')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#15803d',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            View Member Directory <ArrowRight size={13} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569', fontWeight: '700' }}>
                <th style={{ padding: '10px 14px' }}>Activity / Action</th>
                <th style={{ padding: '10px 14px' }}>Affected Record / Member</th>
                <th style={{ padding: '10px 14px' }}>Performed By</th>
                <th style={{ padding: '10px 14px' }}>Date / Time (UTC+8)</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((act) => (
                <tr key={act.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                    {act.activity}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>
                    {act.record}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#475569', fontWeight: '600' }}>
                    {act.performedBy}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '0.74rem' }}>
                    {act.dateTime}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      background: act.statusType === 'pending' ? '#fef3c7' : '#dcfce7',
                      color: act.statusType === 'pending' ? '#b45309' : '#15803d',
                      border: act.statusType === 'pending' ? '1px solid #fde68a' : '1px solid #86efac'
                    }}>
                      {act.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Announcements & Broadcasts Preview (Max 3 Items) */}
      <div className="m-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', margin: 0 }}>
              Recent Announcements & Broadcasts
            </h3>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Cooperative notices scheduled or currently active for members
            </span>
          </div>
          <button
            onClick={() => setActiveTab && setActiveTab('announcements')}
            style={{
              background: '#f0fdf4',
              color: '#11592c',
              border: '1px solid #bbf7d0',
              padding: '5px 12px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Manage Announcements <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {announcements.slice(0, 3).map((ann, idx) => {
            const isArchived = ann.archived === true;
            const now = new Date().toISOString().split('T')[0];
            const isExpired = ann.endDate && ann.endDate < now;
            let statusBadge = { label: 'Active Broadcast', bg: '#dcfce7', color: '#15803d' };
            if (isArchived) statusBadge = { label: 'Archived', bg: '#f1f5f9', color: '#64748b' };
            else if (isExpired) statusBadge = { label: 'Expired', bg: '#fee2e2', color: '#b91c1c' };
            else if (ann.startDate && ann.startDate > now) statusBadge = { label: 'Scheduled', bg: '#eff6ff', color: '#0369a1' };

            return (
              <div 
                key={ann.id || idx}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: '700',
                      background: statusBadge.bg,
                      color: statusBadge.color,
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}>
                      {statusBadge.label}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {ann.date || ann.startDate || 'Recent'}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                    {ann.title}
                  </h4>
                  <p style={{ 
                    fontSize: '0.74rem', 
                    color: '#475569', 
                    margin: 0, 
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {ann.content}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '8px', fontSize: '0.7rem', color: '#64748b' }}>
                  <span>Audience: <strong>All Members</strong></span>
                  <span>By: <strong>{ann.author || 'Danilo Cruz (Admin)'}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardModule;
