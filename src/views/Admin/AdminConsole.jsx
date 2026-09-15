import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminPdfs } from '../../data/mockData';
import { 
  Users, 
  ShieldCheck, 
  Megaphone, 
  Plus, 
  Search, 
  Check, 
  Bell, 
  Printer, 
  Download, 
  Lock,
  X,
  Radio,
  FileText,
  Trash2,
  CheckCircle2,
  Ban,
  UserX,
  UserCheck,
  Edit,
  Pencil,
  RefreshCw,
  Phone,
  Eye,
  MapPin,
  Award,
  Calendar,
  Archive,
  ArchiveRestore,
  Clock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { generateOfficialReportPDF } from '../../utils/pdfGenerator';


const AdminConsole = ({ activeTab }) => {
  const { 
    users, 
    crops,
    livestock,
    validations,
    schedules,
    toggleUserStatus, 
    addUser,
    updateUser, 
    deleteUser, 
    announcements, 
    publishAnnouncement,
    deleteAnnouncement,
    toggleArchiveAnnouncement,
    permissionsMatrix, 
    togglePermission,
    syncSeedToSupabase 
  } = useAuth();

  const [roleFilter, setRoleFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementText, setAnnouncementText] = useState('');
  const [annStartDate, setAnnStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [annEndDate, setAnnEndDate] = useState(() => new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
  const [annTabFilter, setAnnTabFilter] = useState('active'); // 'active' | 'archived' | 'all'
  const [pushToggle, setPushToggle] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // Add Modal State
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('Farmer');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('+63 917 555 0100');
  const [newUserPlot, setNewUserPlot] = useState('Plot P-007 (Vegetable Sector)');
  const [newUserRsbsa, setNewUserRsbsa] = useState('RSBSA-03-1425-001');
  const [newUserCert, setNewUserCert] = useState('PGS Certified Organic Farmer');
  const [newUserEmerg, setNewUserEmerg] = useState('Maria Lopez (+63 918 777 8888)');
  const [newUserPass, setNewUserPass] = useState('password123');

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUserId, setEditUserId] = useState('');
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('Farmer');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('+63 917 555 0100');
  const [editPlot, setEditPlot] = useState('');
  const [editRsbsa, setEditRsbsa] = useState('');
  const [editCert, setEditCert] = useState('');
  const [editEmerg, setEditEmerg] = useState('');
  const [editPass, setEditPass] = useState('password123');

  // Member Detail Inspector State
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);

  // Multi-Select Checkbox State
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      u.name.toLowerCase().includes(q) || 
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.toLowerCase().includes(q)) ||
      (u.rsbsaNo && u.rsbsaNo.toLowerCase().includes(q)) ||
      (u.assignedPlot && u.assignedPlot.toLowerCase().includes(q));
    return matchesRole && matchesSearch;
  });

  const toggleSelectUser = (id) => {
    setSelectedUserIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllUsers = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map(u => u.id));
    }
  };

  const handleBulkDisable = () => {
    selectedUserIds.forEach(id => toggleUserStatus(id));
    setSelectedUserIds([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedUserIds.length} selected user accounts?`)) {
      selectedUserIds.forEach(id => deleteUser(id));
      setSelectedUserIds([]);
    }
  };

  const handlePublish = () => {
    if (!announcementText.trim()) {
      alert('Mangyaring mag-type muna ng announcement text!');
      return;
    }
    publishAnnouncement({
      title: announcementTitle.trim() || 'Cooperative Broadcast Notice',
      content: announcementText,
      instantPush: pushToggle,
      startDate: annStartDate,
      endDate: annEndDate
    });
    alert(`📢 Announcement Published Successfully!\n• Start Date: ${annStartDate}\n• Expiration Date: ${annEndDate}\n• Instant Push: ${pushToggle ? 'ACTIVE' : 'OFF'}`);
    setAnnouncementTitle('');
    setAnnouncementText('');
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    addUser({
      name: newUserName,
      role: newUserRole,
      email: newUserEmail,
      phone: newUserPhone || '+63 917 555 0100',
      assignedPlot: newUserPlot || 'Plot P-007 (Vegetable Sector)',
      rsbsaNo: newUserRsbsa || 'RSBSA-03-1425-001',
      certification: newUserCert || 'PGS Certified Organic Farmer',
      emergencyContact: newUserEmerg || 'Family Contact (+63 918 555 0100)',
      joinDate: new Date().toISOString().split('T')[0],
      password: newUserPass || 'password123',
      status: true
    });

    alert(`✅ Member account created for ${newUserName} (${newUserRole})!\n• Email: ${newUserEmail}\n• RSBSA No: ${newUserRsbsa}\n• Assigned Plot: ${newUserPlot}\n• Organic Cert: ${newUserCert}\nActive & ready to log in.`);
    setShowAddModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('+63 917 555 0100');
    setNewUserPlot('Plot P-007 (Vegetable Sector)');
    setNewUserRsbsa('RSBSA-03-1425-001');
    setNewUserCert('PGS Certified Organic Farmer');
    setNewUserEmerg('Maria Lopez (+63 918 777 8888)');
    setNewUserPass('password123');
  };

  const handleOpenEditModal = (u) => {
    setEditUserId(u.id);
    setEditName(u.name);
    setEditRole(u.role);
    setEditEmail(u.email);
    setEditPhone(u.phone || '+63 917 555 0100');
    setEditPlot(u.assignedPlot || 'Plot P-007 (Vegetable Sector)');
    setEditRsbsa(u.rsbsaNo || 'RSBSA-03-1425-001');
    setEditCert(u.certification || 'PGS Certified Organic Farmer');
    setEditEmerg(u.emergencyContact || 'Family Contact (+63 918 555 0100)');
    setEditPass(u.password || 'password123');
    setShowEditModal(true);
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (!editUserId || !editName) return;

    updateUser(editUserId, {
      name: editName,
      role: editRole,
      email: editEmail,
      phone: editPhone,
      assignedPlot: editPlot,
      rsbsaNo: editRsbsa,
      certification: editCert,
      emergencyContact: editEmerg,
      password: editPass
    });

    alert(`✅ Account updated live for ${editName} (${editRole})!\n• Assigned Sector: ${editPlot}\n• RSBSA ID: ${editRsbsa}\nChanges synced to local state and Supabase.`);
    setShowEditModal(false);
  };

  const [pdfBannerNotice, setPdfBannerNotice] = useState('');

  const activeUsersCount = React.useMemo(() => {
    return (users || []).filter(u => u.status !== false).length;
  }, [users]);

  const totalDatabaseRecords = React.useMemo(() => {
    return (users?.length || 0) + (validations?.length || 0) + (crops?.length || 0) + (livestock?.length || 0) + (schedules?.length || 0);
  }, [users, validations, crops, livestock, schedules]);

  const pendingOrFlaggedLogs = React.useMemo(() => {
    return (validations || []).filter(v => v.status === 'Pending' || v.status === 'Overdue' || v.status === 'Rejected').length;
  }, [validations]);

  const dynamicPipelineData = React.useMemo(() => {
    const totalRecs = totalDatabaseRecords || 63;
    const flagged = pendingOrFlaggedLogs;
    const baseOps = Math.max(100, totalRecs * 10);

    return [
      { time: '00h', requests: Math.round(baseOps * 0.52), errors: flagged > 3 ? 2 : (flagged > 0 ? 1 : 0) },
      { time: '03h', requests: Math.round(baseOps * 0.64), errors: 0 },
      { time: '06h', requests: Math.round(baseOps * 0.78), errors: flagged > 2 ? 1 : 0 },
      { time: '09h', requests: Math.round(baseOps * 0.92), errors: flagged > 1 ? 1 : 0 },
      { time: '12h', requests: Math.round(baseOps * 0.98), errors: 0 },
      { time: '15h', requests: Math.round(baseOps * 1.06), errors: flagged > 0 ? 1 : 0 },
      { time: '18h', requests: Math.round(baseOps * 1.16), errors: flagged > 4 ? 2 : (flagged > 0 ? 1 : 0) },
      { time: '21h', requests: Math.round(baseOps * 1.26), errors: 0 },
      { time: '23h', requests: Math.round(baseOps * 1.34), errors: flagged > 0 ? 1 : 0 },
    ];
  }, [totalDatabaseRecords, pendingOrFlaggedLogs]);

  const liveSupabaseStreamLogs = React.useMemo(() => {
    const logs = [];
    (announcements || []).slice(0, 3).forEach((a, idx) => {
      logs.push({
        id: `ann-${idx}`,
        table: 'public.announcements',
        action: 'INSERT / BROADCAST',
        record: `"${a.title || 'Cooperative Announcement'}"`,
        author: a.author || 'Liza Cruz (Admin)',
        time: a.date || 'Just now',
        status: 'LIVE SYNCED'
      });
    });
    (validations || []).slice(0, 3).forEach((v, idx) => {
      logs.push({
        id: `val-${idx}`,
        table: 'public.task_validations',
        action: v.status === 'Validated' ? 'VALIDATE' : 'QUEUE SUBMIT',
        record: `${v.farmer} · ${v.activity || v.taskType} (${v.plot || 'Plot P-007'})`,
        author: v.farmer,
        time: v.timestamp || 'Just now',
        status: v.status === 'Validated' ? 'VALIDATED' : 'REQUIRES REVIEW'
      });
    });
    (users || []).slice(0, 2).forEach((u, idx) => {
      logs.push({
        id: `user-${idx}`,
        table: 'public.users',
        action: 'AUTH SYNC',
        record: `${u.name} (${u.role})`,
        author: 'System Auth',
        time: 'Active Session',
        status: u.status !== false ? 'ACTIVE' : 'DISABLED'
      });
    });
    return logs;
  }, [announcements, validations, users]);

  const handleDownloadPDF = (title, category = 'all') => {
    try {
      const docTitle = typeof title === 'string' && title.trim() ? title : 'MARIKHA Administrative Master Report';
      generateOfficialReportPDF(docTitle, category, { crops, livestock, validations, schedules, users });
      setPdfBannerNotice(`📄 Admin PDF Report generated & downloaded: "${docTitle}" (Live Supabase Data)`);
      setTimeout(() => setPdfBannerNotice(''), 6000);
    } catch (err) {
      console.error('PDF generation error:', err);
    }
  };

  // 1. System Operations Dashboard
  const renderOperations = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>
            System Operations Dashboard
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Real-time data pipelines, active sessions, and interactive cooperative-wide broadcasts
          </p>
        </div>

        <button
          onClick={syncSeedToSupabase}
          className="btn-primary"
          style={{ background: '#0c3619', padding: '10px 18px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          title="Push all initial user accounts, announcements, and task validations into Supabase cloud database tables"
        >
          <RefreshCw size={16} /> Sync All Data to Supabase Cloud
        </button>
      </div>

      {pdfBannerNotice && (
        <div style={{
          background: '#0c3619', color: '#86efac', border: '1.5px solid #86efac', padding: '12px 18px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(12,54,25,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={18} color="#86efac" />
            <span>{pdfBannerNotice}</span>
          </div>
          <button onClick={() => setPdfBannerNotice('')} style={{ background: 'none', border: 'none', color: '#86efac', cursor: 'pointer', fontWeight: '800' }}>✕</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600' }}>Active Member Accounts</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827' }}>{activeUsersCount} Accounts</div>
          <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: '600' }}>Live Member Directory</div>
        </div>

        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600' }}>Sync Throughput</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#11592c' }}>{totalDatabaseRecords} Records</div>
          <div style={{ fontSize: '0.72rem', color: '#11592c', fontWeight: '600' }}>Supabase Live Sync</div>
        </div>

        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600' }}>Pipeline Errors / Flags</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: pendingOrFlaggedLogs > 0 ? '#d97706' : '#16a34a' }}>{pendingOrFlaggedLogs} Logs</div>
          <div style={{ fontSize: '0.72rem', color: pendingOrFlaggedLogs > 0 ? '#d97706' : '#16a34a', fontWeight: '600' }}>
            {pendingOrFlaggedLogs > 0 ? 'Requires Review' : '0 Flags Active'}
          </div>
        </div>

        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600' }}>Announcements Live</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827' }}>{announcements.length} Notices</div>
          <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: '600' }}>Broadcast Pipeline</div>
        </div>
      </div>

      <div className="m-card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#111827', margin: 0 }}>
              Real-Time Data Flow Pipeline (Live Supabase Stream)
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Dynamic database throughput & flagged verification queue — last 24h
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '0.72rem', fontWeight: '700' }}>
            <span style={{ color: '#11592c', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ■ Database Operations ({totalDatabaseRecords} Live Records)
            </span>
            <span style={{ color: pendingOrFlaggedLogs > 0 ? '#dc2626' : '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ■ Flagged Audits ({pendingOrFlaggedLogs} Flags)
            </span>
          </div>
        </div>
        <div style={{ height: '210px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dynamicPipelineData}>
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip />
              <Area type="monotone" dataKey="requests" name="Database Operations" stroke="#11592c" fill="#dcfce7" fillOpacity={0.6} />
              <Area type="monotone" dataKey="errors" name="Flagged Audits" stroke="#e53e3e" fill="#fee2e2" fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Supabase Operations Stream & Log Feed Card */}
      <div className="m-card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Radio size={16} color="#16a34a" /> Live Supabase Database Operations Stream ({liveSupabaseStreamLogs.length} Transactions)
          </h4>
          <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: '700', background: '#dcfce7', padding: '3px 10px', borderRadius: '12px', border: '1px solid #86efac' }}>
            🟢 Live Stream Active
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', textAlign: 'left', color: '#475569', fontWeight: '700' }}>
                <th style={{ padding: '10px 12px' }}>Database Table</th>
                <th style={{ padding: '10px 12px' }}>Action Type</th>
                <th style={{ padding: '10px 12px' }}>Record Detail</th>
                <th style={{ padding: '10px 12px' }}>Origin Author</th>
                <th style={{ padding: '10px 12px' }}>Timestamp</th>
                <th style={{ padding: '10px 12px' }}>Pipeline Status</th>
              </tr>
            </thead>
            <tbody>
              {liveSupabaseStreamLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 12px', fontWeight: '700', color: '#0f172a', fontFamily: 'monospace' }}>{log.table}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span className="pill pill-low" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#334155', fontWeight: '600' }}>{log.record}</td>
                  <td style={{ padding: '10px 12px', color: '#64748b' }}>{log.author}</td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{log.time}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      color: log.status === 'REQUIRES REVIEW' ? '#d97706' : '#15803d',
                      background: log.status === 'REQUIRES REVIEW' ? '#fef3c7' : '#dcfce7',
                      padding: '3px 8px',
                      borderRadius: '6px'
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

      {/* Global Announcement Publisher */}
      <div className="m-card" style={{ border: '1px solid #fbd38d', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Megaphone size={18} color="#d97706" />
              Publish Cooperative-Wide Global Announcement
            </h4>
            <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
              Reaches all Farmers, Farm Staff, and Executives across web and mobile clients.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: '600' }}>
            <Bell size={15} color="#4b5563" />
            Instant push notification
            <label className="toggle-switch">
              <input type="checkbox" checked={pushToggle} onChange={() => setPushToggle(!pushToggle)} />
              <span className="slider" />
            </label>
          </div>
        </div>

        <input
          type="text"
          value={announcementTitle}
          onChange={(e) => setAnnouncementTitle(e.target.value)}
          placeholder="Notice Title (e.g. Fertilizer Distribution Schedule)"
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1.5px solid #cbd5e1',
            fontSize: '0.85rem',
            marginBottom: '10px',
            fontWeight: '700',
            outline: 'none',
            background: '#ffffff'
          }}
        />

        <textarea
          value={announcementText}
          onChange={(e) => setAnnouncementText(e.target.value)}
          placeholder="I-type dito ang bagong abiso para sa mga magsasaka..."
          rows={3}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '0.85rem',
            marginBottom: '16px',
            outline: 'none'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={handlePublish} className="btn-orange">
            <Megaphone size={16} /> Publish Announcement
          </button>
        </div>
      </div>

      {/* Interactive Announcements List Feed */}
      <div className="m-card">
        <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#111827', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Radio size={16} color="#16a34a" /> Live Cooperative Broadcast Feed (Click to inspect detail)
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {announcements.map((ann) => (
            <div
              key={ann.id}
              onClick={() => setSelectedAnnouncement(ann)}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '800', fontSize: '0.88rem', color: '#111827' }}>
                    {ann.title || 'Cooperative Announcement'}
                  </span>
                  {ann.instantPush && (
                    <span className="pill pill-high" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                      Push Active
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.78rem', color: '#4b5563', margin: 0 }}>
                  {ann.content}
                </p>
                <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '6px' }}>
                  Posted by {ann.author || 'Liza Cruz (Admin)'} · {ann.date}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Are you sure you want to delete announcement "${ann.title}"?`)) {
                      deleteAnnouncement(ann.id);
                    }
                  }}
                  style={{
                    background: '#fff1f2',
                    border: '1px solid #fecdd3',
                    color: '#e11d48',
                    borderRadius: '7px',
                    padding: '6px 11px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Trash2 size={13} color="#e11d48" /> Delete Notice
                </button>
                <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                  Inspect Audit →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 2. User Accounts & Member Records
  const renderUserAccounts = () => {
    const allCount = users.length;
    const execCount = users.filter(u => u.role === 'Executive').length;
    const adminCount = users.filter(u => u.role === 'Admin').length;
    const staffCount = users.filter(u => u.role === 'Farm Staff').length;
    const farmerCount = users.filter(u => u.role === 'Farmer').length;

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              Member Records Management Module
              <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '4px 12px', borderRadius: '20px', fontWeight: '800' }}>
                🟢 Supabase Realtime Live
              </span>
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              Designed schema data models, full CRUD operations (Create, Read, Update, Delete), searching, filtering, and live Supabase Cloud synchronization
            </p>
          </div>

          <button onClick={() => setShowAddModal(true)} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontWeight: '800' }}>
            <Plus size={16} /> Create New Member Record
          </button>
        </div>

        {/* Directory Quick Stat Summary Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
          <div className="m-card" style={{ padding: '14px 18px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700' }}>TOTAL DIRECTORY</span>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>{allCount} Members</div>
            <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: '700' }}>Active Registry</span>
          </div>

          <div className="m-card" style={{ padding: '14px 18px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700' }}>REGISTERED FARMERS</span>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#15803d' }}>{farmerCount} Members</div>
            <span style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: '700' }}>RSBSA & Organic Certified</span>
          </div>

          <div className="m-card" style={{ padding: '14px 18px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700' }}>FARM STAFF & VALIDATORS</span>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#b45309' }}>{staffCount} Staff</div>
            <span style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: '700' }}>Field Supervisors</span>
          </div>

          <div className="m-card" style={{ padding: '14px 18px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700' }}>ADMINS & EXECUTIVES</span>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1e1b4b' }}>{execCount + adminCount} Officers</div>
            <span style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: '700' }}>System Governance</span>
          </div>
        </div>

        <div className="m-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { name: 'All', count: allCount },
                { name: 'Executive', count: execCount },
                { name: 'Admin', count: adminCount },
                { name: 'Farm Staff', count: staffCount },
                { name: 'Farmer', count: farmerCount }
              ].map(r => (
                <button
                  key={r.name}
                  onClick={() => setRoleFilter(r.name)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    background: roleFilter === r.name ? '#0c3619' : '#f1f5f9',
                    color: roleFilter === r.name ? '#ffffff' : '#4b5563',
                    cursor: 'pointer'
                  }}
                >
                  {r.name} ({r.count})
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search name, email, RSBSA ID, or plot..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 34px',
                  borderRadius: '8px',
                  border: '1.5px solid #94a3b8',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  color: '#0f172a',
                  background: '#ffffff',
                  WebkitTextFillColor: '#0f172a',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {selectedUserIds.length > 0 && (
            <div style={{
              background: '#f0fdf4', border: '1px solid #86efac', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#166534' }}>
                ✓ {selectedUserIds.length} user accounts selected
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleBulkDisable} className="btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                  Toggle Selected Status ({selectedUserIds.length})
                </button>
                <button onClick={handleBulkDelete} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>
                  Delete Selected ({selectedUserIds.length})
                </button>
              </div>
            </div>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: '1.5px solid #e5e7eb', color: '#4b5563', fontSize: '0.75rem', textAlign: 'left' }}>
                  <th style={{ padding: '12px 14px', width: '36px' }}>
                    <input
                      type="checkbox"
                      checked={selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={toggleSelectAllUsers}
                      style={{ accentColor: '#0c3619', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </th>
                  <th style={{ padding: '12px 14px', fontWeight: '700' }}>MEMBER PROFILE</th>
                  <th style={{ padding: '12px 14px', fontWeight: '700' }}>ROLE & ORGANIC CERTIFICATION</th>
                  <th style={{ padding: '12px 14px', fontWeight: '700' }}>ASSIGNED SECTOR / PLOT</th>
                  <th style={{ padding: '12px 14px', fontWeight: '700' }}>CONTACT & EMERGENCY</th>
                  <th style={{ padding: '12px 14px', fontWeight: '700', textAlign: 'center' }}>STATUS</th>
                  <th style={{ padding: '12px 14px', fontWeight: '700', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => {
                  const isProtectedAdmin = u.role === 'Executive' || u.role === 'Admin';
                  const rsbsa = u.rsbsaNo || (u.role === 'Farmer' ? 'RSBSA-03-1425-001' : 'RSBSA-03-1000-COOP');
                  const cert = u.certification || (u.role === 'Farmer' ? 'PGS Certified Organic Farmer' : u.role === 'Farm Staff' ? 'PGS Level II Supervisor' : 'Certified Organic Auditor');
                  const plot = u.assignedPlot || (u.role === 'Executive' ? 'Administrative HQ' : u.role === 'Admin' ? 'Operations & Compliance Center' : 'Plot P-007 (Tomato Diamante)');
                  const emerg = u.emergencyContact || 'Family Contact (+63 918 555 0100)';

                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(u.id)}
                          onChange={() => toggleSelectUser(u.id)}
                          style={{ accentColor: '#0c3619', width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                      </td>

                      {/* Member Profile + RSBSA */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%', background: '#e2eae0', color: '#0c3619',
                            fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0
                          }}>
                            {u.initials || (u.name ? u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U')}
                          </div>
                          <div>
                            <span style={{ fontWeight: '700', color: '#111827', display: 'block', fontSize: '0.85rem' }}>{u.name}</span>
                            <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', fontWeight: '700', color: '#15803d', background: '#dcfce7', padding: '1px 6px', borderRadius: '4px' }}>
                              {rsbsa}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role & Organic Cert */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                          <span className={`pill ${
                            u.role === 'Executive' ? 'pill-flowering' :
                            u.role === 'Admin' ? 'pill-compliant' :
                            u.role === 'Farm Staff' ? 'pill-high' : 'pill-harvest'
                          }`}>
                            {u.role}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: '600' }}>
                            🌱 {cert}
                          </span>
                        </div>
                      </td>

                      {/* Assigned Plot / Sector */}
                      <td style={{ padding: '12px 14px', color: '#1e293b', fontWeight: '600', fontSize: '0.8rem' }}>
                        📍 {plot}
                      </td>

                      {/* Contact & Emergency */}
                      <td style={{ padding: '12px 14px', fontSize: '0.76rem' }}>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>📞 {u.phone}</div>
                        <div style={{ color: '#64748b' }}>✉️ {u.email}</div>
                        <div style={{ fontSize: '0.68rem', color: '#dc2626', fontWeight: '600', marginTop: '2px' }}>
                          🆘 {emerg}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <span
                          className={`pill ${u.status !== false ? 'pill-compliant' : ''}`}
                          style={{
                            padding: '4px 10px',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: u.status !== false ? '#dcfce7' : '#f1f5f9',
                            color: u.status !== false ? '#15803d' : '#64748b',
                            border: u.status !== false ? '1px solid #86efac' : '1px solid #cbd5e1'
                          }}
                        >
                          {u.status !== false ? <CheckCircle2 size={12} /> : <Ban size={12} />}
                          {u.status !== false ? (isProtectedAdmin ? `Active (${u.role})` : 'Active') : 'Disabled'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
                          {/* INSPECT PROMPT BUTTON */}
                          <button
                            type="button"
                            onClick={() => setSelectedUserDetail({ ...u, rsbsaNo: rsbsa, certification: cert, assignedPlot: plot, emergencyContact: emerg })}
                            title="Inspect Full Member Profile"
                            style={{
                              background: '#f0fdf4',
                              border: '1px solid #86efac',
                              color: '#15803d',
                              borderRadius: '7px',
                              padding: '5px 9px',
                              fontSize: '0.73rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Eye size={13} color="#15803d" /> Inspect
                          </button>

                          {/* EDIT BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal({ ...u, rsbsaNo: rsbsa, certification: cert, assignedPlot: plot, emergencyContact: emerg })}
                            title="Edit Member Profile & Attributes"
                            style={{
                              background: '#eff6ff',
                              border: '1px solid #93c5fd',
                              color: '#1d4ed8',
                              borderRadius: '7px',
                              padding: '5px 9px',
                              fontSize: '0.73rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Pencil size={13} color="#1d4ed8" /> Edit
                          </button>

                          {/* DISABLE BUTTON */}
                          {!isProtectedAdmin && (
                            <button
                              type="button"
                              onClick={() => toggleUserStatus(u.id)}
                              style={{
                                background: u.status !== false ? '#f8fafc' : '#f0fdf4',
                                border: u.status !== false ? '1px solid #cbd5e1' : '1px solid #86efac',
                                color: u.status !== false ? '#475569' : '#15803d',
                                borderRadius: '7px',
                                padding: '5px 9px',
                                fontSize: '0.73rem',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              {u.status !== false ? 'Disable' : 'Enable'}
                            </button>
                          )}

                          {/* DELETE BUTTON */}
                          {!isProtectedAdmin && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete user account "${u.name}" (${u.role})?`)) {
                                  deleteUser(u.id);
                                }
                              }}
                              title="Delete User Account"
                              style={{
                                background: '#fff1f2',
                                border: '1px solid #fecdd3',
                                color: '#e11d48',
                                borderRadius: '7px',
                                padding: '5px 9px',
                                fontSize: '0.73rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Trash2 size={13} color="#e11d48" /> Delete
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

        {/* INSPECT MEMBER PROFILE DETAIL MODAL */}
        {selectedUserDetail && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000
          }}>
            <div className="m-card" style={{
              width: '100%', maxWidth: '520px', padding: '0', borderRadius: '20px',
              overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #0c3619 0%, #15803d 100%)',
                padding: '22px 28px', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', color: '#ffffff',
                    fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem'
                  }}>
                    {selectedUserDetail.initials || selectedUserDetail.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                      {selectedUserDetail.name}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: '#86efac', fontWeight: '700' }}>
                      {selectedUserDetail.role} · Member since {selectedUserDetail.joinDate || '2024-03-15'}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedUserDetail(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ padding: '24px', background: '#ffffff' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', display: 'block' }}>RSBSA REGISTRY ID</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#15803d', fontFamily: 'monospace' }}>
                      {selectedUserDetail.rsbsaNo}
                    </span>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', display: 'block' }}>ORGANIC CERTIFICATION</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>
                      🌱 {selectedUserDetail.certification}
                    </span>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', display: 'block' }}>ASSIGNED FIELD PLOT / SECTOR</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>
                    📍 {selectedUserDetail.assignedPlot}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                  <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', display: 'block' }}>CONTACT INFO</span>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a' }}>📞 {selectedUserDetail.phone}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>✉️ {selectedUserDetail.email}</div>
                  </div>

                  <div style={{ background: '#fef2f2', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fecdd3' }}>
                    <span style={{ fontSize: '0.7rem', color: '#991b1b', fontWeight: '700', display: 'block' }}>EMERGENCY CONTACT</span>
                    <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#991b1b' }}>
                      🆘 {selectedUserDetail.emergencyContact}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    onClick={() => {
                      const target = selectedUserDetail;
                      setSelectedUserDetail(null);
                      handleOpenEditModal(target);
                    }}
                    className="btn-primary"
                    style={{ padding: '9px 18px', fontSize: '0.82rem' }}
                  >
                    ✏️ Edit Member Profile
                  </button>
                  <button onClick={() => setSelectedUserDetail(null)} className="btn-outline" style={{ padding: '9px 16px', fontSize: '0.82rem' }}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CREATE USER ACCOUNT MODAL (FULL ENRICHED FIELDS WITH HIGH CONTRAST INPUTS) */}
        {showAddModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000
          }}>
            <div className="m-card" style={{
              width: '100%', maxWidth: '620px', padding: '0', borderRadius: '20px',
              overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #0c3619 0%, #15803d 100%)',
                padding: '20px 24px', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={20} color="#86efac" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>Create New User Account</h3>
                    <span style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: '600' }}>Enriched cooperative registration with RSBSA ID & field sector plot</span>
                  </div>
                </div>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateUser} style={{ padding: '24px', background: '#ffffff', maxHeight: '80vh', overflowY: 'auto' }}>
                
                {/* Section 1: Role & System Access */}
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#15803d', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                    👤 1. SYSTEM ROLE & ACCESS LEVEL
                  </span>
                  <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>System Access Role *</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #94a3b8', fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', background: '#ffffff', WebkitTextFillColor: '#0f172a', outline: 'none' }}
                  >
                    <option value="Farmer">Farmer (Mobile App User & Cooperative Field Member)</option>
                    <option value="Farm Staff">Farm Staff (Activity Validator & Field Supervisor)</option>
                    <option value="Admin">Admin (Cooperative Administrator)</option>
                    <option value="Executive">Executive (Super Admin / Executive Governance)</option>
                  </select>
                </div>

                {/* Section 2: Account Credentials & Contact */}
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#15803d', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>
                    📞 2. PERSONAL CREDENTIALS & CONTACT INFO
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>Full Name *</label>
                      <input type="text" required placeholder="e.g. Danilo Rivera" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #94a3b8', fontSize: '0.85rem', outline: 'none', fontWeight: '700', color: '#0f172a', background: '#ffffff', WebkitTextFillColor: '#0f172a' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>Phone Number *</label>
                      <input type="text" required placeholder="+63 917 555 0100" value={newUserPhone} onChange={(e) => setNewUserPhone(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #94a3b8', fontSize: '0.85rem', outline: 'none', fontWeight: '700', color: '#0f172a', background: '#ffffff', WebkitTextFillColor: '#0f172a' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>Email Address *</label>
                      <input type="email" required placeholder="danilo@mariwska.coop" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #94a3b8', fontSize: '0.85rem', outline: 'none', fontWeight: '700', color: '#0f172a', background: '#ffffff', WebkitTextFillColor: '#0f172a' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>Initial Password *</label>
                      <input type="text" required placeholder="password123" value={newUserPass} onChange={(e) => setNewUserPass(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #94a3b8', fontSize: '0.85rem', outline: 'none', fontWeight: '700', color: '#0f172a', background: '#ffffff', WebkitTextFillColor: '#0f172a' }} />
                    </div>
                  </div>
                </div>

                {/* Section 3: Relevant Agricultural & Registry Fields */}
                <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '10px', border: '1.5px solid #86efac', marginBottom: '20px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#166534', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>
                    🌾 3. RELEVANT COOPERATIVE DATA FIELDS (RSBSA, PLOT & CERTIFICATION)
                  </span>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>RSBSA Registry ID</label>
                      <input type="text" placeholder="RSBSA-03-1425-001" value={newUserRsbsa} onChange={(e) => setNewUserRsbsa(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #94a3b8', fontSize: '0.85rem', outline: 'none', fontWeight: '800', fontFamily: 'monospace', color: '#15803d', background: '#ffffff', WebkitTextFillColor: '#15803d' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>Assigned Sector / Field Plot</label>
                      <input type="text" placeholder="Plot P-007 (Vegetable Sector)" value={newUserPlot} onChange={(e) => setNewUserPlot(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #94a3b8', fontSize: '0.85rem', outline: 'none', fontWeight: '700', color: '#0f172a', background: '#ffffff', WebkitTextFillColor: '#0f172a' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>Organic Certification Level</label>
                      <input type="text" placeholder="PGS Certified Organic Farmer" value={newUserCert} onChange={(e) => setNewUserCert(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #94a3b8', fontSize: '0.85rem', outline: 'none', fontWeight: '700', color: '#0f172a', background: '#ffffff', WebkitTextFillColor: '#0f172a' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>Emergency Contact Person & Phone</label>
                      <input type="text" placeholder="Maria Lopez (+63 918 777 8888)" value={newUserEmerg} onChange={(e) => setNewUserEmerg(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #94a3b8', fontSize: '0.85rem', outline: 'none', fontWeight: '700', color: '#0f172a', background: '#ffffff', WebkitTextFillColor: '#0f172a' }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-outline" style={{ padding: '10px 18px', fontSize: '0.85rem', fontWeight: '700' }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.85rem', background: '#0c3619', fontWeight: '800' }}>✓ Create Account & Sync Live</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT USER ACCOUNT MODAL (FULL ENRICHED FIELDS WITH HIGH CONTRAST INPUTS) */}
        {showEditModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000
          }}>
            <div className="m-card" style={{
              width: '100%', maxWidth: '620px', padding: '0', borderRadius: '20px',
              overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #0c3619 0%, #15803d 100%)',
                padding: '20px 24px', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Pencil size={20} color="#86efac" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>Edit Member Profile & Attributes</h3>
                    <span style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: '600' }}>Update contact info, sector plot, RSBSA ID, and certification</span>
                  </div>
                </div>
                <button onClick={() => setShowEditModal(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} style={{ padding: '24px', background: '#ffffff', maxHeight: '80vh', overflowY: 'auto' }}>
                
                {/* Section 1: System Access Role */}
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#15803d', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                    👤 1. SYSTEM ROLE & ACCESS LEVEL
                  </span>
                  <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>System Access Role</label>
                  {editRole === 'Executive' || editRole === 'Admin' ? (
                    <div style={{ padding: '10px 14px', background: '#f0fdf4', borderRadius: '8px', border: '1.5px solid #86efac', fontWeight: '800', color: '#0c3619', fontSize: '0.85rem' }}>
                      🔒 Protected Core Administrator ({editRole})
                    </div>
                  ) : (
                    <select value={editRole} onChange={(e) => setEditRole(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #94a3b8', fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', background: '#ffffff', WebkitTextFillColor: '#0f172a' }}>
                      <option value="Farmer">Farmer (Mobile App User & Cooperative Field Member)</option>
                      <option value="Farm Staff">Farm Staff (Activity Validator & Field Inspector)</option>
                    </select>
                  )}
                </div>

                {/* Section 2: Personal Credentials */}
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#15803d', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>
                    📞 2. PERSONAL CREDENTIALS & CONTACT INFO
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>Full Name *</label>
                      <input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #94a3b8', fontSize: '0.85rem', outline: 'none', fontWeight: '700', color: '#0f172a', background: '#ffffff', WebkitTextFillColor: '#0f172a' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>Phone Number *</label>
                      <input type="text" required value={editPhone} onChange={(e) => setEditPhone(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #94a3b8', fontSize: '0.85rem', outline: 'none', fontWeight: '700', color: '#0f172a', background: '#ffffff', WebkitTextFillColor: '#0f172a' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>Email Address *</label>
                      <input type="email" required value={editEmail} onChange={(e) => setEditEmail(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #94a3b8', fontSize: '0.85rem', outline: 'none', fontWeight: '700', color: '#0f172a', background: '#ffffff', WebkitTextFillColor: '#0f172a' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>Password *</label>
                      <input type="text" required value={editPass} onChange={(e) => setEditPass(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #94a3b8', fontSize: '0.85rem', outline: 'none', fontWeight: '700', color: '#0f172a', background: '#ffffff', WebkitTextFillColor: '#0f172a' }} />
                    </div>
                  </div>
                </div>

                {/* Section 3: Agricultural Relevant Fields */}
                <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '10px', border: '1.5px solid #86efac', marginBottom: '20px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#166534', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>
                    🌾 3. RELEVANT COOPERATIVE DATA FIELDS (RSBSA, PLOT & CERTIFICATION)
                  </span>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>RSBSA Farmer ID</label>
                      <input type="text" value={editRsbsa} onChange={(e) => setEditRsbsa(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #94a3b8', fontSize: '0.85rem', outline: 'none', fontWeight: '800', fontFamily: 'monospace', color: '#15803d', background: '#ffffff', WebkitTextFillColor: '#15803d' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>Assigned Sector / Field Plot</label>
                      <input type="text" value={editPlot} onChange={(e) => setEditPlot(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #94a3b8', fontSize: '0.85rem', outline: 'none', fontWeight: '700', color: '#0f172a', background: '#ffffff', WebkitTextFillColor: '#0f172a' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>Organic Certification Level</label>
                      <input type="text" value={editCert} onChange={(e) => setEditCert(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #94a3b8', fontSize: '0.85rem', outline: 'none', fontWeight: '700', color: '#0f172a', background: '#ffffff', WebkitTextFillColor: '#0f172a' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>Emergency Contact Person & Phone</label>
                      <input type="text" value={editEmerg} onChange={(e) => setEditEmerg(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #94a3b8', fontSize: '0.85rem', outline: 'none', fontWeight: '700', color: '#0f172a', background: '#ffffff', WebkitTextFillColor: '#0f172a' }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                  <button type="button" onClick={() => setShowEditModal(false)} className="btn-outline" style={{ padding: '10px 18px', fontSize: '0.85rem', fontWeight: '700' }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.85rem', background: '#0c3619', fontWeight: '800' }}>✓ Save Changes & Sync Live</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 3. Security Roles & Permissions Matrix
  const renderPermissions = () => (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>
          Roles & Security Permissions Matrix
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          Configure live capability access controls for each cooperative role across web and mobile clients
        </p>
      </div>

      <div className="m-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#111827', margin: 0 }}>
            Live System Capability Access Matrix (4 Core System Roles)
          </h4>
          <span className="pill pill-compliant" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
            ✓ Enforced Live across All Portals
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontSize: '0.78rem', textAlign: 'left' }}>
              <th style={{ padding: '12px 14px', fontWeight: '800' }}>ROLE</th>
              <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: '800' }}>📖 READ LOGS</th>
              <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: '800' }}>✍️ WRITE ENTRIES</th>
              <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: '800' }}>🔍 EXECUTE VALIDATIONS</th>
              <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: '800' }}>🛡️ BYPASS AUDITS</th>
              <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: '800' }}>✨ ACCESS ML</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(permissionsMatrix).filter(r => r !== 'PGS Auditor').map(role => (
              <tr key={role} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '14px', fontWeight: '800', color: '#111827' }}>
                  {role}
                </td>
                {['readLogs', 'writeEntries', 'executeValidations', 'bypassAudits', 'accessML'].map(cap => (
                  <td key={cap} style={{ padding: '14px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={!!permissionsMatrix[role]?.[cap]}
                      onChange={() => togglePermission(role, cap)}
                      style={{ accentColor: '#0c3619', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 4. Announcements & Push Broadcasts Tab (With Start/End Dates & Archive Module)
  const renderAnnouncements = () => {
    const activeAnnouncements = announcements.filter(a => !a.archived);
    const archivedAnnouncements = announcements.filter(a => a.archived);

    const displayedAnnouncements = annTabFilter === 'active' 
      ? activeAnnouncements 
      : annTabFilter === 'archived' 
      ? archivedAnnouncements 
      : announcements;

    return (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>
            Announcement Management & Push Alerts Module
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Schedule broadcast notices with start/end validity dates, instant push alerts, and notice archiving
          </p>
        </div>

        {/* Global Announcement Publisher with Date Controls */}
        <div className="m-card" style={{ border: '1.5px solid #d97706', marginBottom: '20px', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Megaphone size={18} color="#d97706" />
                Publish Cooperative Announcement with Start & End Validity Dates
              </h4>
              <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                Reaches all Farmers, Farm Staff, and Executives across web and mobile clients.
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: '700', color: '#0f172a' }}>
              <Bell size={15} color="#d97706" />
              Instant push alert
              <label className="toggle-switch">
                <input type="checkbox" checked={pushToggle} onChange={() => setPushToggle(!pushToggle)} />
                <span className="slider" />
              </label>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
              Announcement Header / Title *
            </label>
            <input
              type="text"
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              placeholder="Notice Title (e.g. Fertilizer Distribution Schedule)"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #94a3b8',
                fontSize: '0.85rem',
                fontWeight: '700',
                color: '#0f172a',
                outline: 'none',
                background: '#ffffff',
                WebkitTextFillColor: '#0f172a'
              }}
            />
          </div>

          {/* Start & End Dates Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                🗓️ Start Broadcast Date *
              </label>
              <input
                type="date"
                value={annStartDate}
                onChange={(e) => setAnnStartDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #94a3b8',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#0f172a',
                  outline: 'none',
                  background: '#ffffff',
                  WebkitTextFillColor: '#0f172a'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                ⏳ Expiration / End Date *
              </label>
              <input
                type="date"
                value={annEndDate}
                onChange={(e) => setAnnEndDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #94a3b8',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#0f172a',
                  outline: 'none',
                  background: '#ffffff',
                  WebkitTextFillColor: '#0f172a'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
              Announcement Details & Instructions *
            </label>
            <textarea
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="I-type dito ang bagong abiso para sa mga magsasaka..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1.5px solid #94a3b8',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#0f172a',
                outline: 'none',
                background: '#ffffff',
                WebkitTextFillColor: '#0f172a'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button onClick={handlePublish} className="btn-orange" style={{ padding: '10px 22px', fontSize: '0.85rem', fontWeight: '800' }}>
              <Megaphone size={16} /> Publish Announcement
            </button>
          </div>
        </div>

        {/* Interactive Feed Header with Active vs Archived Tabs */}
        <div className="m-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Radio size={16} color="#16a34a" /> Live Cooperative Broadcast Feed ({displayedAnnouncements.length} Notices)
            </h4>

            {/* Filter Capsule Buttons */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'active', label: `📢 Active Broadcasts (${activeAnnouncements.length})` },
                { id: 'archived', label: `📦 Archived Notices (${archivedAnnouncements.length})` },
                { id: 'all', label: `All Notices (${announcements.length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setAnnTabFilter(tab.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    background: annTabFilter === tab.id ? '#0c3619' : '#f1f5f9',
                    color: annTabFilter === tab.id ? '#ffffff' : '#4b5563',
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayedAnnouncements.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#64748b', fontSize: '0.85rem', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                {annTabFilter === 'archived' 
                  ? '📦 No archived announcements found.' 
                  : '📢 No active announcements published yet. Write an announcement above to broadcast live!'}
              </div>
            ) : (
              displayedAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  onClick={() => setSelectedAnnouncement(ann)}
                  style={{
                    background: ann.archived ? '#f8fafc' : '#ffffff',
                    border: ann.archived ? '1px solid #cbd5e1' : '1.5px solid #bbf7d0',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: ann.archived ? 'none' : '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '800', fontSize: '0.9rem', color: '#111827' }}>
                        {ann.title || 'Cooperative Announcement'}
                      </span>
                      {ann.archived ? (
                        <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#64748b', background: '#e2e8f0', padding: '2px 8px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                          📦 Archived Notice
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#15803d', background: '#dcfce7', padding: '2px 8px', borderRadius: '12px', border: '1px solid #86efac' }}>
                          🟢 Active Broadcast
                        </span>
                      )}
                      {ann.instantPush && !ann.archived && (
                        <span className="pill pill-high" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                          Push Active
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#334155', margin: 0, fontWeight: '500', lineHeight: 1.4 }}>
                      {ann.content}
                    </p>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '8px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <span>👤 Author: <strong style={{ color: '#0f172a' }}>{ann.author || 'Liza Cruz (Admin)'}</strong></span>
                      <span>🗓️ Start Date: <strong style={{ color: '#15803d' }}>{ann.startDate || ann.date}</strong></span>
                      <span>⏳ End Date: <strong style={{ color: '#d97706' }}>{ann.endDate || '2026-09-30'}</strong></span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* ARCHIVE / UNARCHIVE BUTTON */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleArchiveAnnouncement(ann.id);
                      }}
                      style={{
                        background: ann.archived ? '#f0fdf4' : '#f8fafc',
                        border: ann.archived ? '1px solid #86efac' : '1px solid #cbd5e1',
                        color: ann.archived ? '#15803d' : '#475569',
                        borderRadius: '7px',
                        padding: '6px 11px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      {ann.archived ? <ArchiveRestore size={13} color="#15803d" /> : <Archive size={13} color="#475569" />}
                      {ann.archived ? 'Unarchive' : 'Archive Notice'}
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to delete announcement "${ann.title}"?`)) {
                          deleteAnnouncement(ann.id);
                        }
                      }}
                      style={{
                        background: '#fff1f2',
                        border: '1px solid #fecdd3',
                        color: '#e11d48',
                        borderRadius: '7px',
                        padding: '6px 11px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <Trash2 size={13} color="#e11d48" /> Delete
                    </button>

                    <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                      Inspect Audit →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  // 5. Admin Reports
  const renderReports = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>
            Administrative Reports
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Cooperative-wide compliance records and system audit logs
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleDownloadPDF('Administrative Master Consolidated Report', 'admin')} className="btn-outline">
            <Printer size={15} /> Print (PDF)
          </button>
          <button onClick={() => handleDownloadPDF('Administrative Master Consolidated Report', 'admin')} className="btn-primary">
            <Download size={15} /> Export Bundle
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {adminPdfs.map(d => (
          <div key={d.title} className="m-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
              <FileText size={22} color="#0c3619" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827' }}>{d.title}</h4>
                <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>{d.date} · {d.size}</span>
              </div>
            </div>
            <button onClick={() => handleDownloadPDF(d.title)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Download size={13} /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  let currentView = renderOperations();
  if (activeTab === 'user-accounts' || activeTab === 'member-records') currentView = renderUserAccounts();
  if (activeTab === 'roles-permissions') currentView = renderPermissions();
  if (activeTab === 'announcements') currentView = renderAnnouncements();
  if (activeTab === 'reports') currentView = renderReports();

  return (
    <>
      {currentView}

      {/* Selected Announcement Detail Modal with Start/End Dates & Archive Control */}
      {selectedAnnouncement && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="m-card" style={{ width: '520px', background: '#fff', padding: '24px', borderRadius: '16px', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <button onClick={() => setSelectedAnnouncement(null)} style={{ position: 'absolute', right: '16px', top: '16px', border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: '800' }}>✕</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '12px', color: '#d97706' }}>
                <Megaphone size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                  {selectedAnnouncement.title || 'Cooperative Announcement'}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Posted by {selectedAnnouncement.author || 'Liza Cruz (Admin)'}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>BROADCAST START DATE</span>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#15803d' }}>
                  🗓️ {selectedAnnouncement.startDate || selectedAnnouncement.date}
                </span>
              </div>

              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>EXPIRATION / END DATE</span>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#d97706' }}>
                  ⏳ {selectedAnnouncement.endDate || '2026-09-30'}
                </span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px', fontSize: '0.85rem', color: '#334155', lineHeight: 1.5, fontWeight: '500' }}>
              {selectedAnnouncement.content}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b', marginBottom: '20px', background: selectedAnnouncement.archived ? '#f1f5f9' : '#f0fdf4', padding: '10px 12px', borderRadius: '8px', border: selectedAnnouncement.archived ? '1px solid #cbd5e1' : '1px solid #86efac' }}>
              <span>📦 Status: <strong style={{ color: selectedAnnouncement.archived ? '#64748b' : '#16a34a' }}>{selectedAnnouncement.archived ? 'Archived Notice' : 'Active Live Broadcast'}</strong></span>
              <span>🌐 Audience: <strong style={{ color: '#0c3619' }}>All Members</strong></span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  toggleArchiveAnnouncement(selectedAnnouncement.id);
                  setSelectedAnnouncement(null);
                }}
                className="btn-outline"
                style={{ padding: '8px 14px', fontSize: '0.8rem', fontWeight: '700' }}
              >
                {selectedAnnouncement.archived ? '🔓 Restore Notice' : '📦 Archive Notice'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete announcement "${selectedAnnouncement.title}"?`)) {
                    deleteAnnouncement(selectedAnnouncement.id);
                    setSelectedAnnouncement(null);
                  }
                }}
                style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer' }}
              >
                🗑️ Delete Notice
              </button>
              <button onClick={() => setSelectedAnnouncement(null)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminConsole;
