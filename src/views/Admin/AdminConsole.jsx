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
  FileText
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';

const pipelineData = [
  { time: '00h', requests: 200, errors: 3 },
  { time: '03h', requests: 260, errors: 2 },
  { time: '06h', requests: 300, errors: 4 },
  { time: '09h', requests: 280, errors: 5 },
  { time: '12h', requests: 200, errors: 1 },
  { time: '15h', requests: 220, errors: 2 },
  { time: '18h', requests: 280, errors: 3 },
  { time: '21h', requests: 350, errors: 2 },
  { time: '23h', requests: 380, errors: 3 },
];

const AdminConsole = ({ activeTab }) => {
  const { 
    users, 
    toggleUserStatus, 
    addUser, 
    announcements, 
    publishAnnouncement, 
    permissionsMatrix, 
    togglePermission 
  } = useAuth();

  const [roleFilter, setRoleFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [announcementText, setAnnouncementText] = useState(''); // Clean default empty textarea
  const [pushToggle, setPushToggle] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('Farmer');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handlePublish = () => {
    if (!announcementText.trim()) {
      alert('Mangyaring mag-type muna ng announcement text!');
      return;
    }
    publishAnnouncement(announcementText, pushToggle);
    setAnnouncementText(''); // Clear input after successful publish
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserName) return;
    addUser({
      name: newUserName,
      role: newUserRole,
      email: newUserEmail || `${newUserName.toLowerCase().replace(/\s+/g, '.')}@farmer.ph`,
      phone: newUserPhone || '+63 917 555 9999',
      status: true
    });
    setShowAddModal(false);
    setNewUserName('');
  };

  const handleDownloadPDF = (title) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("MARIKHA Administrative Report", 20, 20);
    doc.text(title, 20, 30);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 40);
    doc.text("Antipolo Organic Farming Cooperative · ANT-ORG-001", 20, 48);
    doc.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  };

  // 1. System Operations Dashboard
  const renderOperations = () => (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>
          System Operations Dashboard
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          Real-time data pipelines, active sessions, and interactive cooperative-wide broadcasts
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600' }}>Active Sessions</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827' }}>72</div>
        </div>

        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600' }}>Sync Throughput</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#11592c' }}>1.4k/min</div>
        </div>

        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600' }}>Pipeline Errors</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#d97706' }}>3</div>
        </div>

        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600' }}>Announcements Live</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827' }}>{announcements.length}</div>
        </div>
      </div>

      <div className="m-card" style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '14px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#111827' }}>Real-Time Data Flow Pipeline</h4>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Requests vs. pipeline errors - last 24h</span>
        </div>
        <div style={{ height: '210px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pipelineData}>
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip />
              <Area type="monotone" dataKey="requests" stroke="#11592c" fill="#dcfce7" fillOpacity={0.6} />
              <Area type="monotone" dataKey="errors" stroke="#e53e3e" fill="#fee2e2" fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
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

      {/* Interactive Announcements List */}
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
                justifyContent: 'space-between'
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
              <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                Inspect Audit →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Announcement Detail & Audit Modal */}
      {selectedAnnouncement && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="m-card" style={{ width: '480px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span className="pill pill-seedling" style={{ fontSize: '0.7rem', marginBottom: '4px', display: 'inline-block' }}>
                  BROADCAST AUDIT RECORD
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111827' }}>
                  {selectedAnnouncement.title || 'Cooperative Announcement'}
                </h3>
              </div>
              <button onClick={() => setSelectedAnnouncement(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', marginBottom: '14px', fontSize: '0.82rem', color: '#374151' }}>
              {selectedAnnouncement.content}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem', marginBottom: '16px' }}>
              <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '6px' }}>
                <span style={{ color: '#6b7280', display: 'block' }}>PUBLISHED BY</span>
                <strong>{selectedAnnouncement.author || 'Liza Cruz (Admin)'}</strong>
              </div>
              <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '6px' }}>
                <span style={{ color: '#6b7280', display: 'block' }}>DATE</span>
                <strong>{selectedAnnouncement.date}</strong>
              </div>
              <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '6px' }}>
                <span style={{ color: '#6b7280', display: 'block' }}>PUSH NOTIFICATION</span>
                <strong style={{ color: selectedAnnouncement.instantPush ? '#16a34a' : '#6b7280' }}>
                  {selectedAnnouncement.instantPush ? '✓ Dispatched to 147 clients' : 'Disabled'}
                </strong>
              </div>
              <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '6px' }}>
                <span style={{ color: '#6b7280', display: 'block' }}>TARGET AUDIENCE</span>
                <strong>Cooperative-wide</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedAnnouncement(null)} className="btn-primary">
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
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
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>
              User Accounts & Member Records
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              Comprehensive cooperative directory with role-based access controls
            </p>
          </div>

          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            <Plus size={16} /> Create New User Account
          </button>
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
                    color: roleFilter === r.name ? '#ffffff' : '#4b5563'
                  }}
                >
                  {r.name} {r.count}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '250px' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '9px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 34px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontSize: '0.78rem', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', fontWeight: '700' }}>MEMBER</th>
                <th style={{ padding: '12px 14px', fontWeight: '700' }}>ROLE</th>
                <th style={{ padding: '12px 14px', fontWeight: '700' }}>CONTACT</th>
                <th style={{ padding: '12px 14px', fontWeight: '700', textAlign: 'right' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', background: '#e2eae0', color: '#0c3619',
                      fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem'
                    }}>
                      {u.initials}
                    </div>
                    <span style={{ fontWeight: '700', color: '#111827' }}>{u.name}</span>
                  </td>

                  <td style={{ padding: '12px 14px' }}>
                    <span className={`pill ${
                      u.role === 'Executive' ? 'pill-flowering' :
                      u.role === 'Admin' ? 'pill-compliant' :
                      u.role === 'Farm Staff' ? 'pill-high' : 'pill-harvest'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: '#4b5563' }}>
                    <div>{u.email}</div>
                    <div style={{ color: '#94a3b8' }}>{u.phone}</div>
                  </td>

                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={u.status} onChange={() => toggleUserStatus(u.id)} />
                      <span className="slider" />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAddModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <div className="m-card" style={{ width: '420px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111827', margin: 0 }}>Create User Account</h3>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateUser}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#374151', display: 'block', marginBottom: '4px' }}>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Danilo Rivera"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.82rem' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#374151', display: 'block', marginBottom: '4px' }}>Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.82rem', fontWeight: '700' }}
                  >
                    <option value="Executive">Executive</option>
                    <option value="Admin">Admin</option>
                    <option value="Farm Staff">Farm Staff</option>
                    <option value="Farmer">Farmer</option>
                  </select>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#374151', display: 'block', marginBottom: '4px' }}>Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. danilo@farmer.ph"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.82rem' }}
                  />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#374151', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +63 917 555 0110"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.82rem' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-outline">Cancel</button>
                  <button type="submit" className="btn-primary">✓ Save Account & Sync Live</button>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>
            Security, Role & Permissions Matrix
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Tenant-isolated access configuration - changes apply cooperative-wide
          </p>
        </div>

        <button onClick={() => alert('Matrix changes committed live!')} className="btn-primary">
          <Lock size={15} /> Commit Matrix Changes
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '16px' }}>
        <div style={{ background: '#0c3619', color: '#ffffff', borderRadius: '14px', padding: '22px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <ShieldCheck size={22} color="#ffffff" />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '6px' }}>Tenant Isolation Active</h3>
          <p style={{ fontSize: '0.75rem', color: '#a7f3d0', marginBottom: '20px', lineHeight: 1.5 }}>
            All matrix mutations are scoped to <strong>ANT-ORG-001</strong>. Cross-tenant reads are blocked at API gateway and audited.
          </p>
          <div style={{ fontSize: '0.72rem', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>Last audit: <strong>Aug 14, 2025</strong></div>
            <div>Schema version: <strong>v2.4.1</strong></div>
            <div>Active roles: <strong>5</strong></div>
          </div>
        </div>

        <div className="m-card">
          <h4 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '2px' }}>Granular Access Flags</h4>
          <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '16px' }}>
            Toggle a cell to grant or revoke capability
          </span>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontSize: '0.75rem', textAlign: 'center' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>ROLE / CAPABILITY</th>
                <th style={{ padding: '10px 12px' }}>Read Logs</th>
                <th style={{ padding: '10px 12px' }}>Write Entries</th>
                <th style={{ padding: '10px 12px' }}>Execute Validations</th>
                <th style={{ padding: '10px 12px' }}>Bypass Audits</th>
                <th style={{ padding: '10px 12px' }}>Access ML Models</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(permissionsMatrix).map(role => (
                <tr key={role} style={{ borderBottom: '1px solid #f3f4f6', textAlign: 'center' }}>
                  <td style={{ textAlign: 'left', padding: '14px 12px', fontWeight: '700' }}>
                    <span className="pill pill-seedling">{role}</span>
                  </td>

                  {['readLogs', 'writeEntries', 'executeValidations', 'bypassAudits', 'accessML'].map(cap => {
                    const isChecked = permissionsMatrix[role][cap];
                    return (
                      <td key={cap} style={{ padding: '14px 12px' }}>
                        <button
                          onClick={() => togglePermission(role, cap)}
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: isChecked ? '#dcfce7' : '#f1f5f9',
                            border: isChecked ? '1px solid #86efac' : '1px solid #cbd5e1',
                            color: isChecked ? '#15803d' : 'transparent',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          {isChecked && <Check size={14} />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // 4. Administrative Reports
  const renderReports = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>
            Administrative Reports
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Administrative and organizational reports consolidated from user records, member profiles and operational information
          </p>
        </div>

        <button onClick={() => window.print()} className="btn-primary">
          <Printer size={15} /> Print Summary
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Total User Accounts</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827' }}>147</div>
        </div>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Active Members</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#11592c' }}>126</div>
        </div>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Member Cooperatives</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827' }}>8</div>
        </div>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Operational Events (30d)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#d97706' }}>412</div>
        </div>
      </div>

      <div className="m-card">
        <h4 style={{ fontSize: '0.88rem', fontWeight: '800', marginBottom: '12px' }}>Downloadable Documents</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontSize: '0.78rem', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px' }}>Document</th>
              <th style={{ padding: '10px 12px' }}>Source</th>
              <th style={{ padding: '10px 12px' }}>Generated</th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>Download</th>
            </tr>
          </thead>
          <tbody>
            {adminPdfs.map(d => (
              <tr key={d.title} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px', fontWeight: '700' }}>{d.title}</td>
                <td style={{ padding: '12px' }}><span className="pill pill-seedling">{d.source}</span></td>
                <td style={{ padding: '12px', color: '#6b7280' }}>{d.date}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <button onClick={() => handleDownloadPDF(d.title)} style={{ color: '#11592c', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Download size={13} /> {d.size}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (activeTab === 'user-accounts' || activeTab === 'member-records') return renderUserAccounts();
  if (activeTab === 'roles-permissions') return renderPermissions();
  if (activeTab === 'reports') return renderReports();
  return renderOperations();
};

export default AdminConsole;
