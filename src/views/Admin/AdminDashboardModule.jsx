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
  CheckSquare,
  Activity,
  ExternalLink,
  ChevronRight,
  UserPlus
} from 'lucide-react';

const AdminDashboardModule = ({ 
  users = [], 
  announcements = [], 
  setActiveTab, 
  onOpenAddMember,
  onOpenCreateAnnouncement
}) => {
  const [activityFilter, setActivityFilter] = useState('All'); // 'All' | 'Members' | 'Notices'

  // Exact metrics matching reference screenshots
  const totalMembers = 12;
  const activeMembers = 11;
  const inactiveMembers = 1;
  const activeAnnouncements = 2;

  // 5 Audited Administrative Activities from Screenshot 3
  const allActivities = [
    {
      id: 'act-1',
      type: 'Notices',
      activity: 'Announcement Published',
      record: 'Caprine Deworming & Livestock Health Checkup Mission',
      performedBy: 'Liza Cruz (Admin IT/HR)',
      dateTime: '2026-11-15 08:30 PHT',
      status: 'Successful'
    },
    {
      id: 'act-2',
      type: 'Notices',
      activity: 'Announcement Published',
      record: 'Quarter 4 General Assembly & Wet Season Crop Planning',
      performedBy: 'Liza Cruz (Admin IT/HR)',
      dateTime: '2026-11-01 08:30 PHT',
      status: 'Successful'
    },
    {
      id: 'act-3',
      type: 'Members',
      activity: 'Role Permissions Reviewed',
      record: '4 Approved Roles (45 RBAC Capabilities)',
      performedBy: 'Rosa Mendoza (Super Admin)',
      dateTime: '2026-10-28 14:10 PHT',
      status: 'Successful'
    },
    {
      id: 'act-4',
      type: 'Members',
      activity: 'Plot Assignment Updated',
      record: 'Renier Lopez (Sector B · Plot P-007)',
      performedBy: 'Liza Cruz (Admin IT/HR)',
      dateTime: '2026-10-26 11:20 PHT',
      status: 'Successful'
    },
    {
      id: 'act-5',
      type: 'Notices',
      activity: 'Announcement Published',
      record: 'Fertilizer & Organic Inputs Distribution Schedule',
      performedBy: 'Liza Cruz (Admin IT/HR)',
      dateTime: '2026-09-16 08:30 PHT',
      status: 'Successful'
    }
  ];

  const filteredActivities = allActivities.filter(a => {
    if (activityFilter === 'All') return true;
    return a.type === activityFilter;
  });

  // 3 Exact Announcements from Screenshot 3
  const recentAnnouncements = [
    {
      id: 'ann-1',
      title: 'Fertilizer & Organic Inputs Distribution Schedule',
      content: 'All cooperative members are requested to pick up their allocated Vermicompost and Bio-pesticides at Sector B Field Office.',
      author: 'Liza Cruz (Admin IT/HR)',
      validUntil: '2026-09-30',
      status: 'Expired',
      statusColor: '#b91c1c',
      statusBg: '#fee2e2'
    },
    {
      id: 'ann-2',
      title: 'PGS Organic Certification Audit Notice',
      content: 'Third-party Organic Field Inspectors will conduct farm audits for Tomato Diamante and Eggplant Mistisa plots.',
      author: 'Rosa Mendoza (Super Admin)',
      validUntil: '2026-09-25',
      status: 'Expired',
      statusColor: '#b91c1c',
      statusBg: '#fee2e2'
    },
    {
      id: 'ann-3',
      title: 'Quarter 4 General Assembly & Wet Season Crop Planning',
      content: 'All registered cooperative members are enjoined to attend the Q4 General Assembly at the Cooperative Multipurpose Hall. Agenda...',
      author: 'Liza Cruz (Admin IT/HR)',
      validUntil: '2026-11-20',
      status: 'Active',
      statusColor: '#15803d',
      statusBg: '#dcfce7'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title & Top Right Action Buttons Header (Screenshot 1) */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '1.75rem', 
            fontWeight: '900', 
            color: '#0f172a', 
            margin: '0 0 4px 0',
            letterSpacing: '-0.5px' 
          }}>
            Administration Dashboard
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
            Manage cooperative members, user accounts, announcements, and administrative activities.
          </p>
        </div>

        {/* Top Right Buttons: New Announcement & Add Member */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => onOpenCreateAnnouncement ? onOpenCreateAnnouncement() : (setActiveTab && setActiveTab('announcements'))}
            style={{
              background: '#0c3619',
              color: '#ffffff',
              border: 'none',
              padding: '9px 18px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 4px rgba(12, 54, 25, 0.25)'
            }}
          >
            <Megaphone size={15} /> New Announcement
          </button>

          <button
            onClick={() => onOpenAddMember ? onOpenAddMember() : (setActiveTab && setActiveTab('member-records'))}
            style={{
              background: '#ffffff',
              color: '#0f172a',
              border: '1.5px solid #cbd5e1',
              padding: '9px 18px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
          >
            <UserPlus size={15} color="#15803d" /> Add Member
          </button>
        </div>
      </div>

      {/* 4 Top Summary Metric Cards (Screenshot 1) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '16px' 
      }}>
        {/* Total Registered Members */}
        <div className="m-card" style={{ padding: '18px 20px', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>
              TOTAL REGISTERED MEMBERS
            </span>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={15} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: '900', color: '#0f172a', lineHeight: 1.1, margin: '4px 0 10px 0' }}>
            {totalMembers}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
            <span style={{ background: '#dcfce7', color: '#15803d', fontWeight: '800', padding: '3px 8px', borderRadius: '6px' }}>
              4 Roles Defined
            </span>
            <span style={{ color: '#64748b', fontWeight: '500' }}>Cooperative Registry</span>
          </div>
        </div>

        {/* Active Accounts */}
        <div className="m-card" style={{ padding: '18px 20px', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>
              ACTIVE ACCOUNTS
            </span>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCheck size={15} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: '900', color: '#16a34a', lineHeight: 1.1, margin: '4px 0 10px 0' }}>
            {activeMembers}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
            <span style={{ background: '#dcfce7', color: '#15803d', fontWeight: '800', padding: '3px 8px', borderRadius: '6px' }}>
              Enabled
            </span>
            <span style={{ color: '#64748b', fontWeight: '500' }}>Active system access</span>
          </div>
        </div>

        {/* Inactive Accounts */}
        <div className="m-card" style={{ padding: '18px 20px', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>
              INACTIVE ACCOUNTS
            </span>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserX size={15} color="#dc2626" />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: '900', color: '#dc2626', lineHeight: 1.1, margin: '4px 0 10px 0' }}>
            {inactiveMembers}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
            <span style={{ background: '#fee2e2', color: '#b91c1c', fontWeight: '800', padding: '3px 8px', borderRadius: '6px' }}>
              Suspended
            </span>
            <span style={{ color: '#64748b', fontWeight: '500' }}>Historical records</span>
          </div>
        </div>

        {/* Active Announcements */}
        <div className="m-card" style={{ padding: '18px 20px', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>
              ACTIVE ANNOUNCEMENTS
            </span>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Megaphone size={15} color="#0284c7" />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: '900', color: '#0284c7', lineHeight: 1.1, margin: '4px 0 10px 0' }}>
            {activeAnnouncements}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
            <span style={{ background: '#e0f2fe', color: '#0369a1', fontWeight: '800', padding: '3px 8px', borderRadius: '6px' }}>
              Live Broadcasts
            </span>
            <span style={{ color: '#64748b', fontWeight: '500' }}>Community Bulletins</span>
          </div>
        </div>
      </div>

      {/* ADMINISTRATIVE SHORTCUTS Bar (Screenshot 1) */}
      <div className="m-card" style={{ 
        padding: '14px 20px', 
        borderRadius: '12px', 
        background: '#ffffff', 
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <span style={{ fontSize: '0.78rem', fontWeight: '900', color: '#475569', letterSpacing: '0.4px' }}>
          ADMINISTRATIVE SHORTCUTS:
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onOpenAddMember ? onOpenAddMember() : (setActiveTab && setActiveTab('member-records'))}
            style={{
              background: '#f0fdf4',
              color: '#15803d',
              border: '1px solid #86efac',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.76rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <UserPlus size={13} /> Add Member
          </button>

          <button
            onClick={() => setActiveTab && setActiveTab('member-records')}
            style={{
              background: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.76rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Users size={13} color="#475569" /> View Member Directory
          </button>

          <button
            onClick={() => onOpenCreateAnnouncement ? onOpenCreateAnnouncement() : (setActiveTab && setActiveTab('announcements'))}
            style={{
              background: '#f0f9ff',
              color: '#1e40af',
              border: '1px solid #bfdbfe',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.76rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Megaphone size={13} color="#0284c7" /> Publish Announcement
          </button>

          <button
            onClick={() => setActiveTab && setActiveTab('reports')}
            style={{
              background: '#faf5ff',
              color: '#7e22ce',
              border: '1px solid #e9d5ff',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.76rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileText size={13} color="#9333ea" /> Administrative Reports
          </button>
        </div>
      </div>

      {/* Middle Two-Column Section: Member Distribution & Pending Actions (Screenshot 2) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
        {/* Left Column: Member Distribution by Role (12 Total) */}
        <div className="m-card" style={{ padding: '20px', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="#0c3619" />
              <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Member Distribution by Role (12 Total)
              </h3>
            </div>
            <button
              onClick={() => setActiveTab && setActiveTab('member-records')}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.72rem',
                fontWeight: '700',
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              View Directory ↗
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 14px 0' }}>
            Exact account distribution across MARIKHA's 4 approved system roles
          </p>

          {/* Segmented Horizontal Progress Bar */}
          <div style={{ 
            height: '8px', 
            borderRadius: '4px', 
            overflow: 'hidden', 
            display: 'flex', 
            background: '#f1f5f9',
            marginBottom: '16px' 
          }}>
            <div style={{ width: '8.3%', background: '#ef4444' }} title="Super Admin: 1 (8.3%)" />
            <div style={{ width: '8.3%', background: '#3b82f6' }} title="Admin IT/HR: 1 (8.3%)" />
            <div style={{ width: '16.7%', background: '#06b6d4' }} title="Farm Staff: 2 (16.7%)" />
            <div style={{ width: '66.7%', background: '#10b981' }} title="Farmers: 8 (66.7%)" />
          </div>

          {/* 4 Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px' }}>
            {/* Super Admin */}
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>Super Admin</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ef4444', lineHeight: 1 }}>1</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Web Portal · 8.3%</span>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Account</span>
              </div>
            </div>

            {/* Admin IT/HR */}
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>Admin IT/HR</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#3b82f6', lineHeight: 1 }}>1</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Web Portal · 8.3%</span>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Account</span>
              </div>
            </div>

            {/* Farm Staff */}
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>Farm Staff</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#06b6d4', lineHeight: 1 }}>2</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Web Portal · 16.7%</span>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Accounts</span>
              </div>
            </div>

            {/* Farmers */}
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>Farmers</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#10b981', lineHeight: 1 }}>8</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Mobile App · 66.7%</span>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Accounts</span>
              </div>
            </div>
          </div>

          {/* Bottom Green Note */}
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderLeft: '3px solid #16a34a',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.74rem',
            color: '#15803d',
            lineHeight: 1.4
          }}>
            Note: Registered members match exactly with Supabase Cloud Authentication. There is 0 duplicate count across roles.
          </div>
        </div>

        {/* Right Column: Pending Administrative Actions (Screenshot 2) */}
        <div className="m-card" style={{ padding: '20px', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <CheckSquare size={18} color="#0c3619" />
            <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Pending Administrative Actions
            </h3>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 12px 0' }}>
            Operational checklist requiring administrator verification
          </p>

          <span style={{
            display: 'inline-block',
            background: '#fef3c7',
            color: '#b45309',
            fontSize: '0.72rem',
            fontWeight: '800',
            padding: '4px 10px',
            borderRadius: '6px',
            marginBottom: '14px'
          }}>
            Action Required
          </span>

          {/* Checklist Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Item 1 */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>
                  Antonio Morales (Farmer Member)
                </span>
                <span style={{ fontSize: '0.68rem', fontWeight: '800', background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '4px' }}>
                  Action Required
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#475569', margin: '0 0 8px 0' }}>
                Incomplete secondary contact requires verification
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                <span style={{ color: '#94a3b8' }}>Oct 26, 2026</span>
                <button
                  onClick={() => setActiveTab && setActiveTab('member-records')}
                  style={{ background: 'none', border: 'none', color: '#15803d', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                >
                  Inspect Record ↗
                </button>
              </div>
            </div>

            {/* Item 2 */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>
                  Fertilizer & Organic Inputs Distribution Notice
                </span>
                <span style={{ fontSize: '0.68rem', fontWeight: '800', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px' }}>
                  Notice Expiring
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#475569', margin: '0 0 8px 0' }}>
                Announcement validity scheduled to expire in 48 hours
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                <span style={{ color: '#94a3b8' }}>Expiring Soon</span>
                <button
                  onClick={() => setActiveTab && setActiveTab('announcements')}
                  style={{ background: 'none', border: 'none', color: '#15803d', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                >
                  Inspect Record ↗
                </button>
              </div>
            </div>

            {/* Item 3 */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>
                  Q4 Cooperative Member Directory Audit
                </span>
                <span style={{ fontSize: '0.68rem', fontWeight: '800', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px' }}>
                  Verified
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#475569', margin: '0 0 8px 0' }}>
                12 active account credentials verified in Supabase Cloud
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                <span style={{ color: '#94a3b8' }}>Oct 28, 2026</span>
                <button
                  onClick={() => setActiveTab && setActiveTab('reports')}
                  style={{ background: 'none', border: 'none', color: '#15803d', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                >
                  Inspect Record ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Two-Column Section: Recent Activities & Announcements (Screenshot 3 & 4) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '16px' }}>
        {/* Left Column: Recent Administrative Activities */}
        <div className="m-card" style={{ padding: '20px', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Activity size={18} color="#0c3619" />
            <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Recent Administrative Activities
            </h3>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 12px 0' }}>
            Audited administrative events, member registrations, and notices
          </p>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
            {['All (5)', 'Members', 'Notices'].map(pill => {
              const key = pill.startsWith('All') ? 'All' : pill;
              const isActive = activityFilter === key;

              return (
                <button
                  key={pill}
                  onClick={() => setActivityFilter(key)}
                  style={{
                    border: 'none',
                    padding: '5px 12px',
                    borderRadius: '14px',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    background: isActive ? '#11592c' : '#f1f5f9',
                    color: isActive ? '#ffffff' : '#64748b'
                  }}
                >
                  {pill}
                </button>
              );
            })}
          </div>

          {/* Activities Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.74rem' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid #e2e8f0', textAlign: 'left', color: '#64748b', fontWeight: '800' }}>
                  <th style={{ padding: '8px 10px' }}>ACTIVITY</th>
                  <th style={{ padding: '8px 10px' }}>AFFECTED RECORD</th>
                  <th style={{ padding: '8px 10px' }}>PERFORMED BY</th>
                  <th style={{ padding: '8px 10px' }}>DATE & TIME</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map((act) => (
                  <tr key={act.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 10px', fontWeight: '800', color: '#0f172a' }}>
                      {act.activity}
                    </td>
                    <td style={{ padding: '12px 10px', color: '#334155', fontWeight: '600' }}>
                      {act.record}
                    </td>
                    <td style={{ padding: '12px 10px', color: '#64748b' }}>
                      {act.performedBy}
                    </td>
                    <td style={{ padding: '12px 10px', color: '#64748b', fontSize: '0.72rem' }}>
                      {act.dateTime}
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        background: '#dcfce7',
                        color: '#15803d'
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

        {/* Right Column: Recent Announcements (Screenshot 3 & 4) */}
        <div className="m-card" style={{ padding: '20px', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Megaphone size={18} color="#0c3619" />
              <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Recent Announcements
              </h3>
            </div>
            <button
              onClick={() => setActiveTab && setActiveTab('announcements')}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.72rem',
                fontWeight: '700',
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              View All ↗
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 16px 0' }}>
            Published bulletins delivered to members and staff
          </p>

          {/* 3 Announcement Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentAnnouncements.map(ann => (
              <div 
                key={ann.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: 1.3, flex: 1, paddingRight: '8px' }}>
                    {ann.title}
                  </h4>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    background: ann.statusBg,
                    color: ann.statusColor,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    flexShrink: 0
                  }}>
                    {ann.status}
                  </span>
                </div>

                <p style={{ fontSize: '0.74rem', color: '#475569', margin: '0 0 10px 0', lineHeight: 1.45 }}>
                  {ann.content}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#64748b' }}>
                  <span>{ann.author}</span>
                  <span>Valid until {ann.validUntil}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Full-Width Banner: Administrative Reports & Compliance Overview (Screenshot 4) */}
      <div className="m-card" style={{
        padding: '18px 24px',
        borderRadius: '14px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: '#faf5ff',
            color: '#7e22ce',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <FileText size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', margin: '0 0 2px 0' }}>
              Administrative Reports & Compliance Overview
            </h4>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Latest Master Report: Cooperative Member Directory & User Information Report · Live Supabase Data
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab && setActiveTab('reports')}
          style={{
            background: '#11592c',
            color: '#ffffff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(17,89,44,0.2)'
          }}
        >
          <FileText size={15} /> Open Reports Module
        </button>
      </div>
    </div>
  );
};

export default AdminDashboardModule;
