import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Archive, 
  ArchiveRestore, 
  Trash2, 
  X, 
  Calendar, 
  Radio, 
  Bell, 
  CheckCircle2,
  Clock,
  Send
} from 'lucide-react';

const AdminAnnouncementModule = ({
  announcements = [],
  publishAnnouncement,
  deleteAnnouncement,
  toggleArchiveAnnouncement,
  currentUser = {}
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tabFilter, setTabFilter] = useState('all'); // 'all' | 'active' | 'scheduled' | 'expired' | 'archived'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingAnnouncement, setViewingAnnouncement] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState('all');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
  const [instantPush, setInstantPush] = useState(true);

  // Status helper
  const now = new Date().toISOString().split('T')[0];

  const getStatus = (ann) => {
    if (ann.archived) return { key: 'archived', label: 'Archived', bg: '#f1f5f9', color: '#64748b', border: '#cbd5e1' };
    if (ann.endDate && ann.endDate < now) return { key: 'expired', label: 'Expired', bg: '#fee2e2', color: '#b91c1c', border: '#fecdd3' };
    if (ann.startDate && ann.startDate > now) return { key: 'scheduled', label: 'Scheduled', bg: '#eff6ff', color: '#0369a1', border: '#bfdbfe' };
    return { key: 'active', label: 'Active Broadcast', bg: '#dcfce7', color: '#15803d', border: '#86efac' };
  };

  // Counts
  const totalCount = announcements.length;
  const activeCount = announcements.filter(a => getStatus(a).key === 'active').length;
  const scheduledCount = announcements.filter(a => getStatus(a).key === 'scheduled').length;
  const expiredOrArchivedCount = announcements.filter(a => getStatus(a).key === 'expired' || getStatus(a).key === 'archived').length;

  // Filtered Announcements
  const filteredAnnouncements = announcements
    .filter(a => {
      const isFarmStaffPrivate = 
        (a.targetAudience === 'farmers' && (a.author?.toLowerCase().includes('staff') || a.author?.toLowerCase().includes('farm staff'))) ||
        (a.title?.startsWith('[Target: Farmers Only') && a.author?.toLowerCase().includes('staff'));
      return !isFarmStaffPrivate;
    })
    .filter(a => {
    const status = getStatus(a).key;
    if (tabFilter !== 'all' && status !== tabFilter) return false;

    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      (a.title && a.title.toLowerCase().includes(q)) ||
      (a.content && a.content.toLowerCase().includes(q)) ||
      (a.author && a.author.toLowerCase().includes(q))
    );
  });

  const handleOpenCreate = () => {
    setTitle('');
    setContent('');
    setTargetAudience('all');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
    setInstantPush(true);
    setShowCreateModal(true);
  };

  const handleSaveCreate = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and message content.');
      return;
    }

    if (publishAnnouncement) {
      publishAnnouncement({
        title: title.trim(),
        content: content.trim(),
        targetAudience,
        startDate,
        endDate,
        instantPush,
        author: currentUser?.name || currentUser?.fullName || 'Liza Cruz (Admin IT/HR)'
      });
    }

    setShowCreateModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#111827', margin: '0 0 4px 0', letterSpacing: '-0.4px' }}>
            Announcement Management
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
            Create, schedule, and manage announcements for cooperative members.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
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
          <Plus size={16} /> Create Announcement
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div className="m-card" style={{ padding: '16px 18px', borderLeft: '4px solid #11592c' }}>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700' }}>Total Broadcasts</span>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', margin: '4px 0' }}>{totalCount}</div>
          <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: '600' }}>Cooperative Communications</span>
        </div>

        <div className="m-card" style={{ padding: '16px 18px', borderLeft: '4px solid #16a34a' }}>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700' }}>Active Broadcasts</span>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#15803d', margin: '4px 0' }}>{activeCount}</div>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Currently visible to members</span>
        </div>

        <div className="m-card" style={{ padding: '16px 18px', borderLeft: '4px solid #0284c7' }}>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700' }}>Scheduled Broadcasts</span>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0369a1', margin: '4px 0' }}>{scheduledCount}</div>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Queued for future release</span>
        </div>

        <div className="m-card" style={{ padding: '16px 18px', borderLeft: '4px solid #94a3b8' }}>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700' }}>Expired / Archived</span>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#475569', margin: '4px 0' }}>{expiredOrArchivedCount}</div>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Past broadcast archive</span>
        </div>
      </div>

      {/* Directory Card */}
      <div className="m-card" style={{ padding: '20px' }}>
        {/* Controls Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
            {[
              { id: 'all', label: `All (${totalCount})` },
              { id: 'active', label: `Active (${activeCount})` },
              { id: 'scheduled', label: `Scheduled (${scheduledCount})` },
              { id: 'expired', label: 'Expired' },
              { id: 'archived', label: 'Archived' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTabFilter(tab.id)}
                style={{
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  background: tabFilter === tab.id ? '#ffffff' : 'transparent',
                  color: tabFilter === tab.id ? '#11592c' : '#64748b',
                  boxShadow: tabFilter === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search announcements..."
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
        </div>

        {/* Announcements List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredAnnouncements.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
              No announcements found matching the current filter.
            </div>
          ) : (
            filteredAnnouncements.map((ann) => {
              const status = getStatus(ann);

              return (
                <div
                  key={ann.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '14px',
                    position: 'relative'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        background: status.bg,
                        color: status.color,
                        border: `1px solid ${status.border}`
                      }}>
                        {status.label}
                      </span>

                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: '700',
                        background: '#eff6ff',
                        color: '#1e40af',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        Audience: {ann.targetAudience || 'All Members'}
                      </span>

                      {ann.instantPush && status.key === 'active' && (
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: '700',
                          background: '#fef3c7',
                          color: '#b45309',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Radio size={10} /> Push Active
                        </span>
                      )}

                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginLeft: 'auto' }}>
                        Published: {ann.startDate || ann.date || 'Recent'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
                      {ann.title}
                    </h4>

                    <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0 0 10px 0', lineHeight: 1.45 }}>
                      {ann.content}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.72rem', color: '#64748b' }}>
                      <span>By: <strong>{ann.author || 'Danilo Cruz (Admin IT/HR)'}</strong></span>
                      {ann.endDate && (
                        <span>Valid until: <strong>{ann.endDate}</strong></span>
                      )}
                    </div>
                  </div>

                  {/* Actions 3-dot Button */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === ann.id ? null : ann.id)}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '5px 8px',
                        cursor: 'pointer',
                        color: '#64748b'
                      }}
                    >
                      <MoreVertical size={14} />
                    </button>

                    {activeMenuId === ann.id && (
                      <div style={{
                        position: 'absolute',
                        right: 0,
                        top: '32px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        zIndex: 100,
                        width: '140px',
                        textAlign: 'left',
                        padding: '4px 0'
                      }}>
                        <button
                          onClick={() => {
                            setViewingAnnouncement(ann);
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
                          <Eye size={13} color="#0284c7" /> View Details
                        </button>

                        <button
                          onClick={() => {
                            if (toggleArchiveAnnouncement) toggleArchiveAnnouncement(ann.id);
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
                            color: '#d97706',
                            cursor: 'pointer'
                          }}
                        >
                          {ann.archived ? <ArchiveRestore size={13} /> : <Archive size={13} />}
                          {ann.archived ? 'Restore Notice' : 'Archive Notice'}
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete announcement "${ann.title}"?`)) {
                              if (deleteAnnouncement) deleteAnnouncement(ann.id);
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
                          <Trash2 size={13} /> Delete Notice
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      {viewingAnnouncement && (
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dcfce7', color: '#11592c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Megaphone size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>{viewingAnnouncement.title}</h3>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>By {viewingAnnouncement.author || 'Danilo Cruz (Admin IT/HR)'}</span>
                </div>
              </div>
              <button onClick={() => setViewingAnnouncement(null)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>TARGET AUDIENCE</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#11592c' }}>{viewingAnnouncement.targetAudience || 'All Members'}</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>BROADCAST TIMEFRAME</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>{viewingAnnouncement.startDate || viewingAnnouncement.date} to {viewingAnnouncement.endDate || 'Ongoing'}</span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px', fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
              {viewingAnnouncement.content}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setViewingAnnouncement(null)} className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.78rem' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE ANNOUNCEMENT MODAL */}
      {showCreateModal && (
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
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>Create Cooperative Announcement</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Announcement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Organic Fertilizer Distribution Notice"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #11592c', fontSize: '0.82rem', fontWeight: '700', color: '#11592c', background: '#f0fdf4' }}
                >
                  <option value="all">🌐 Everyone Across All Platforms (Cooperative-Wide)</option>
                  <option value="farmers">🌾 Farmers Only (Mobile App Directives)</option>
                  <option value="staff">👥 Farm Staff Operations Only</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Message Content</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Enter broadcast message details for cooperative members..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Publish / Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Expiration Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <input
                  type="checkbox"
                  id="instantPushToggle"
                  checked={instantPush}
                  onChange={(e) => setInstantPush(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="instantPushToggle" style={{ fontSize: '0.75rem', fontWeight: '700', color: '#334155', cursor: 'pointer' }}>
                  Send Instant Push Notification to active member devices
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-outline" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.78rem' }}>
                  Dispatch Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncementModule;
