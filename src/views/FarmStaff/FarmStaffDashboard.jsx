import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { farmStaffPdfs } from '../../data/mockData';
import { 
  CheckSquare, 
  ShieldAlert, 
  Trees, 
  Binary, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Download, 
  Printer, 
  Camera,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';

// Dynamic Relative Time Formatter (Just now, 5m ago, 2h ago, Yesterday, Aug 4)
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'Just now';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return String(timestamp);

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 30) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Full Timestamp Formatter (e.g. Aug 4, 2026 · 2:52 PM)
const formatFullTimestamp = (timestamp) => {
  if (!timestamp) return new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return String(timestamp);
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
};

const FarmStaffDashboard = ({ activeTab }) => {
  const { validations, handleValidationAction, mlClassifications } = useAuth();
  const [selectedValId, setSelectedValId] = useState(validations[0]?.id || 'val-1');
  const [staffNote, setStaffNote] = useState('');
  const [reportsTab, setReportsTab] = useState('productivity');
  const [farmerSearchQuery, setFarmerSearchQuery] = useState('');
  const [previewModalUrl, setPreviewModalUrl] = useState(null);

  const filteredValidations = validations.filter(v => {
    const query = farmerSearchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (v.farmer && v.farmer.toLowerCase().includes(query)) ||
      (v.plot && v.plot.toLowerCase().includes(query)) ||
      (v.taskType && v.taskType.toLowerCase().includes(query)) ||
      (v.activity && v.activity.toLowerCase().includes(query))
    );
  });

  const selectedValidation = filteredValidations.find(v => v.id === selectedValId) || filteredValidations[0] || validations[0];

  const handleApprove = () => {
    if (!selectedValidation) return;
    handleValidationAction(selectedValidation.id, 'approve', staffNote);
    setStaffNote('');
    alert(`✓ Task #${selectedValidation.id} approved & committed to cloud!`);
  };

  const handleReject = () => {
    if (!selectedValidation) return;
    handleValidationAction(selectedValidation.id, 'reject', staffNote);
    setStaffNote('');
    alert(`⚠️ Task #${selectedValidation.id} rejected / correction requested!`);
  };

  const handleDownloadPDF = (title) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("MARIKHA Farm Staff Report", 20, 20);
    doc.text(title, 20, 30);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 40);
    doc.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  };

  // Helper to resolve valid photo URL or null fallback
  const getDisplayPhoto = (valObj) => {
    if (!valObj) return null;
    let url = valObj.photoUrl || valObj.photo_url || valObj.photo;
    const notes = valObj.farmerNote || valObj.notes || '';

    if (!url || typeof url !== 'string' || (!url.startsWith('data:image') && !url.startsWith('http://') && !url.startsWith('https://'))) {
      if (notes.includes('[PHOTO_URL:')) {
        const match = notes.match(/\[PHOTO_URL:([^\]]+)\]/);
        if (match && match[1]) url = match[1];
      } else if (notes.includes('data:image')) {
        const match = notes.match(/data:image\/[^\s\]"']+/);
        if (match) url = match[0];
      } else if (notes.includes('http://') || notes.includes('https://')) {
        const match = notes.match(/https?:\/\/[^\s\]"']+/);
        if (match) url = match[0];
      }
    }

    if (url && typeof url === 'string') {
      if (url.startsWith('data:image')) return url;
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
    }
    return null;
  };

  // 1. Operations & Verification Dashboard
  const renderOperations = () => (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>
          Operations & Verification Dashboard
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          Field validation queue prioritized by operational urgency
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Pending Validations</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827' }}>{validations.length}</div>
        </div>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Critical Alerts</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#dc2626' }}>4</div>
        </div>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Validated Today</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#11592c' }}>61</div>
        </div>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Avg. Response Time</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827' }}>11m</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
        <div className="m-card">
          <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#111827' }}>
            Pending Farmer Task Submissions - Timeline
          </h4>
          <span style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block', marginBottom: '16px' }}>
            Submitted today · sorted by urgency
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {validations.map((t, idx) => (
              <div key={t.id || idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                background: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#6b7280', fontFamily: 'monospace' }}>{t.timestamp || 'Just now'}</span>
                  <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontWeight: '700', fontSize: '0.75rem', color: '#334155' }}>
                    {t.plot}
                  </span>
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '0.82rem', color: '#111827', marginRight: '6px' }}>{t.farmer}</span>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{t.taskType || t.activity}</span>
                  </div>
                </div>
                <span className={`pill ${t.urgencyCls || 'pill-medium'}`}>{t.urgency || 'Normal'}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="m-card" style={{ borderLeft: '4px solid #dc2626' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <AlertTriangle size={16} /> Localized Critical Alerts
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
              <div style={{ background: '#fef2f2', padding: '8px 10px', borderRadius: '6px', border: '1px solid #fecaca' }}>
                <strong style={{ color: '#991b1b' }}>P-021:</strong> Suspected synthetic input - PGS breach risk
              </div>
              <div style={{ background: '#fffbeb', padding: '8px 10px', borderRadius: '6px', border: '1px solid #fef3c7' }}>
                <strong style={{ color: '#92400e' }}>P-007:</strong> Goat vaccination window closes in 36h
              </div>
              <div style={{ background: '#fffbeb', padding: '8px 10px', borderRadius: '6px', border: '1px solid #fef3c7' }}>
                <strong style={{ color: '#92400e' }}>P-055:</strong> Compost log incomplete 4 days
              </div>
            </div>
          </div>

          <div className="m-card">
            <h4 style={{ fontSize: '0.82rem', fontWeight: '800', color: '#111827' }}>Organic Safety Index Trend</h4>
            <span style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block', marginBottom: '10px' }}>Cooperative-wide - last 14 days</span>
            <div style={{ height: '120px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={safetyIndexData}>
                  <Line type="monotone" dataKey="val" stroke="#16a34a" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 2. Farmer Activity Validation Panel with ASPECT RATIO & SHAPE PRESERVATION
  const renderValidationPanel = () => {
    const selectedValidation = filteredValidations.find(v => v.id === selectedValId) || filteredValidations[0] || validations[0];
    const photoToRender = selectedValidation ? getDisplayPhoto(selectedValidation) : null;

    if (validations.length === 0) {
      return (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>
              Farmer Activity Validation Panel
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              0 submissions awaiting field-verification review
            </p>
          </div>
          <div className="m-card" style={{ textAlign: 'center', padding: '40px 20px', background: '#f8fafc', border: '1.5px dashed #cbd5e1' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎉</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', marginBottom: '6px' }}>
              All Farmer Task Submissions Reviewed!
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '450px', margin: '0 auto 16px' }}>
              There are currently no pending farmer activity logs awaiting review. When a farmer submits a new activity log via the mobile app, it will appear here in real time.
            </p>
            <span className="pill pill-compliant" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
              ✓ Validation Queue 100% Up to Date
            </span>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>
            Farmer Activity Validation Panel
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            {validations.length} submissions awaiting field-verification review
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
          {/* Left Column: Incoming Task Queue */}
          <div className="m-card">
            <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111827' }}>Incoming Digital Task Logs</h4>
            <span style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block', marginBottom: '10px' }}>
              Raw inputs submitted by mobile farmers
            </span>

            <div style={{ marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="🔍 Search farmer name or plot..."
                value={farmerSearchQuery}
                onChange={(e) => setFarmerSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1.5px solid #11592c',
                  fontSize: '0.78rem',
                  outline: 'none',
                  fontWeight: '600',
                  background: '#ffffff'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredValidations.length === 0 ? (
                <div style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center', padding: '16px 8px' }}>
                  No farmer logs matching "{farmerSearchQuery}"
                </div>
              ) : (
                filteredValidations.map(v => {
                  const isSel = v.id === selectedValId;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedValId(v.id)}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        background: isSel ? '#f0fdf4' : '#f9fafb',
                        border: isSel ? '2px solid #11592c' : '1px solid #e5e7eb',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Camera size={18} color={isSel ? '#11592c' : '#94a3b8'} />
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#6b7280', fontFamily: 'monospace' }}>
                            {v.plot} · {formatRelativeTime(v.createdAt || v.created_at || v.timestamp)}
                          </div>
                          <div style={{ fontWeight: '800', fontSize: '0.82rem', color: '#111827' }}>{v.farmer}</div>
                          <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: '600' }}>{v.taskType || v.activity}</div>
                        </div>
                      </div>
                      <ChevronRight size={16} color="#94a3b8" />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Validation Control Card */}
          {selectedValidation ? (
            <div className="m-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800' }}>Validation Control Card</h4>
                <span style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: '700' }}>Submission #{selectedValidation.id}</span>
              </div>

              {/* AUTO-CENTERED HIGH-RES AMBIENT PHOTO VIEWER */}
              <div style={{
                width: '100%',
                minHeight: '280px',
                maxHeight: '420px',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#0f172a',
                marginBottom: '16px',
                position: 'relative',
                border: '1px solid #334155',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {photoToRender ? (
                  <div 
                    onClick={() => setPreviewModalUrl(photoToRender)}
                    title="Click to enlarge image"
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '350px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'zoom-in',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={photoToRender}
                      alt=""
                      style={{
                        position: 'absolute',
                        top: 0, left: 0, width: '100%', height: '100%',
                        objectFit: 'cover',
                        filter: 'blur(22px) brightness(0.35)',
                        transform: 'scale(1.15)'
                      }}
                    />
                    <img
                      src={photoToRender}
                      alt="Field verification photo"
                      style={{
                        position: 'relative',
                        maxWidth: '96%',
                        maxHeight: '330px',
                        objectFit: 'contain',
                        objectPosition: 'center',
                        margin: '0 auto',
                        borderRadius: '8px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                        display: 'block'
                      }}
                    />
                    <div style={{
                      position: 'absolute', bottom: 10, left: 10, background: 'rgba(15, 23, 42, 0.88)',
                      color: '#ffffff', padding: '6px 14px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.12)'
                    }}>
                      <MapPin size={14} color="#86efac" /> Mobile Uploaded Field Verification Photo · Click to Enlarge 🔍
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                    <Camera size={40} color="#64748b" style={{ marginBottom: '10px' }} />
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#cbd5e1' }}>
                      No Image Uploaded
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                      Mobile user submitted log without camera picture
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px', fontSize: '0.8rem' }}>
                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#64748b', fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>FARMER</span>
                  <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{selectedValidation.farmer}</strong>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#64748b', fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>PLOT</span>
                  <strong style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#0f172a' }}>{selectedValidation.plot}</strong>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#64748b', fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>TASK TYPE</span>
                  <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{selectedValidation.taskType || selectedValidation.activity}</strong>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#64748b', fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>REALTIME LOCATION</span>
                  <strong style={{ fontSize: '0.82rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="#15803d" /> {selectedValidation.location || selectedValidation.gps || 'Sumulong Highway, Antipolo City'}
                  </strong>
                </div>
                <div style={{ gridColumn: 'span 2', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#64748b', fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>SUBMITTED DATE & TIME</span>
                  <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="#0284c7" /> {formatFullTimestamp(selectedValidation.createdAt || selectedValidation.created_at)} ({formatRelativeTime(selectedValidation.createdAt || selectedValidation.created_at)})
                  </strong>
                </div>
              </div>

              <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', padding: '12px 14px', borderRadius: '10px', fontSize: '0.82rem', marginBottom: '16px' }}>
                <span style={{ fontWeight: '800', color: '#166534', display: 'block', marginBottom: '2px' }}>FARMER NOTE / COMMENT: </span>
                <span style={{ color: '#111827', fontWeight: '700' }}>
                  "{(() => {
                    const raw = selectedValidation.farmerNote || selectedValidation.notes || '';
                    const cleaned = raw.replace(/\[PHOTO_URL:[^\]]+\]/gi, '').replace(/\[Photo Proof:[^\]]+\]/gi, '').trim();
                    return cleaned || 'No notes provided';
                  })()}"
                </span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Staff Evaluation Notes
                </label>
                <textarea
                  value={staffNote}
                  onChange={(e) => setStaffNote(e.target.value)}
                  placeholder="Document field check observations, corrections requested, or supporting evidence..."
                  rows={2}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button onClick={handleApprove} className="btn-primary" style={{ justifyContent: 'center', padding: '12px', fontSize: '0.88rem' }}>
                  ✓ Approve & Commit to Cloud
                </button>
                <button onClick={handleReject} style={{
                  background: '#dc2626', color: '#ffffff', fontWeight: '800', padding: '12px', borderRadius: '8px', border: 'none', fontSize: '0.88rem', cursor: 'pointer'
                }}>
                  ✕ Reject / Request Correction
                </button>
              </div>
            </div>
          ) : (
            <div className="m-card" style={{ textAlign: 'center', padding: '50px 20px', background: '#ffffff', borderRadius: '12px' }}>
              <CheckCircle2 size={48} color="#16a34a" style={{ marginBottom: '12px', margin: '0 auto', display: 'block' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111827', marginBottom: '6px' }}>
                No Awaiting Activity Validations
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', maxWidth: '360px', margin: '0 auto' }}>
                All mobile farmer logs have been processed! New submissions will automatically appear live in real time.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 3. Machine Learning Audit & Risk Dashboard
  const renderMLAudit = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>
            Machine Learning Audit & Risk Dashboard
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Random Forest compliance classification · operational risk scoring
          </p>
        </div>

        <div style={{
          background: '#0c3619', color: '#ffffff', padding: '6px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          <Sparkles size={15} color="#86efac" /> RF Model · v2.4
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        <div className="m-card">
          <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#111827' }}>Random Forest Compliance Classifier</h4>
          <span style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block', marginBottom: '14px' }}>
            Fertilizer applications + PGS checklist evaluation
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mlClassifications.map(item => (
              <div key={item.id} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#f9fafb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.82rem' }}>
                    <span style={{ fontFamily: 'monospace', color: '#11592c', marginRight: '6px' }}>{item.plot}</span>
                    {item.farmer}
                  </div>
                  <span className={`pill ${
                    item.status === 'Compliant' ? 'pill-compliant' :
                    item.status === 'For Review' ? 'pill-review' : 'pill-noncompliant'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#4b5563', marginBottom: '4px' }}>{item.details}</div>
                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                  <strong>RECOMMENDED ACTION: </strong>{item.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="m-card">
            <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111827' }}>Operational Risk Assessment</h4>
            <span style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block', marginBottom: '12px' }}>
              Probability scoring · prescriptive intervention
            </span>

            <div style={{
              background: '#fffbeb', border: '1px solid #fef3c7', padding: '14px', borderRadius: '10px', textAlign: 'center', marginBottom: '14px'
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase' }}>FARM VULNERABILITY SCORE</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#d97706' }}>64 <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>/ 100</span></div>
              <span className="pill pill-high">Elevated Risk</span>
              <p style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '6px' }}>
                Driven primarily by missed scheduled tasks and incomplete documentation across plots P-021, P-055, and P-082.
              </p>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#6b7280', marginBottom: '6px' }}>
                RANDOM FOREST FEATURE IMPORTANCE
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { name: 'Missed scheduled tasks (30d)', pct: 31, val: '6' },
                  { name: 'Incomplete records (open)', pct: 24, val: '4' },
                  { name: 'Compliance breaches (90d)', pct: 18, val: '1' },
                  { name: 'Average reporting delay', pct: 15, val: '1.8 d' },
                  { name: 'Weather exposure index', pct: 12, val: 'Med' },
                ].map(f => (
                  <div key={f.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: '600' }}>
                      <span>{f.name}</span>
                      <span>{f.pct}% ({f.val})</span>
                    </div>
                    <div style={{ height: '5px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${f.pct}%`, height: '100%', background: '#d97706' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '10px', borderRadius: '6px', fontSize: '0.72rem' }}>
              <strong style={{ color: '#15803d', display: 'block', marginBottom: '4px' }}>PREVENTIVE SUGGESTIONS</strong>
              <ul style={{ paddingLeft: '14px', color: '#111827' }}>
                <li>Push targeted reminders to top-3 highest-risk farmers via mobile app.</li>
                <li>Schedule pre-emptive on-site visit for cluster B within 7 days.</li>
                <li>Re-run RF risk pass after next sync window (05:00 daily).</li>
              </ul>
              <button onClick={() => alert('Preventive Plan Applied!')} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px', fontSize: '0.75rem', padding: '6px' }}>
                Apply Preventive Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 4. Farm Staff Reports
  const renderReports = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>
            Farm Staff Reports
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Operational reports and monitoring documents from validated activities, crop & livestock records, compliance and risk assessments
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => window.print()} className="btn-outline">
            <Printer size={15} /> Print
          </button>
          <button onClick={() => handleDownloadPDF('Farm Staff Export Bundle')} className="btn-primary">
            <Download size={15} /> Export Bundle
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Validated Activities (30d)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827' }}>248</div>
        </div>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Crop Records Tracked</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#11592c' }}>412</div>
        </div>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Livestock Records</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827' }}>27 groups</div>
        </div>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Risk Findings (open)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#d97706' }}>9</div>
        </div>
      </div>

      <div className="tab-capsule-container" style={{ marginBottom: '20px' }}>
        {['productivity', 'activity', 'compliance', 'documents'].map(t => (
          <button
            key={t}
            onClick={() => setReportsTab(t)}
            className={`tab-capsule-btn ${reportsTab === t ? 'active' : ''}`}
            style={{ textTransform: 'capitalize' }}
          >
            {t}
          </button>
        ))}
      </div>

      {reportsTab === 'productivity' && (
        <div className="m-card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontSize: '0.78rem', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px' }}>Plot</th>
                <th style={{ padding: '12px 14px' }}>Farmer</th>
                <th style={{ padding: '12px 14px' }}>Crop / Livestock</th>
                <th style={{ padding: '12px 14px' }}>Validated Acts</th>
                <th style={{ padding: '12px 14px' }}>Yield</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Risk</th>
              </tr>
            </thead>
            <tbody>
              {[
                { plot: 'P-007', farmer: 'Maria Santos', item: 'Tomato · Diamante', acts: 18, yield: '412 kg', risk: 'Low', cls: 'pill-low' },
                { plot: 'P-021', farmer: 'Mang Juan Dela Cruz', item: 'Eggplant', acts: 15, yield: '305 kg', risk: 'Medium', cls: 'pill-medium' },
                { plot: 'P-034', farmer: 'Glenda Bautista', item: 'Okra', acts: 21, yield: '240 kg', risk: 'Low', cls: 'pill-low' },
                { plot: 'P-055', farmer: 'Pedro Ocampo', item: 'Goat group GT-014', acts: 12, yield: '—', risk: 'High', cls: 'pill-high' },
                { plot: 'P-082', farmer: 'Aling Nena Rivera', item: 'Squash · Suprema', acts: 9, yield: '158 kg', risk: 'Low', cls: 'pill-low' },
              ].map(row => (
                <tr key={row.plot} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: '700' }}>{row.plot}</td>
                  <td style={{ padding: '12px 14px', fontWeight: '700' }}>{row.farmer}</td>
                  <td style={{ padding: '12px 14px' }}>{row.item}</td>
                  <td style={{ padding: '12px 14px' }}>{row.acts}</td>
                  <td style={{ padding: '12px 14px' }}>{row.yield}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <span className={`pill ${row.cls}`}>{row.risk}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reportsTab === 'activity' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="m-card">
            <h4 style={{ fontSize: '0.82rem', fontWeight: '800', color: '#11592c', marginBottom: '12px' }}>VALIDATED ACTIVITIES BREAKDOWN</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Watering</span><strong>94</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Fertilizer (organic)</span><strong>62</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Harvest</span><strong>47</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Livestock feeding</span><strong>31</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Vaccination</span><strong>14</strong></div>
            </div>
          </div>

          <div className="m-card">
            <h4 style={{ fontSize: '0.82rem', fontWeight: '800', color: '#11592c', marginBottom: '12px' }}>SUBMISSION PERFORMANCE</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>On-time submissions</span><strong>91%</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Average review time</span><strong>2h 14m</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Rejected / corrected</span><strong>12</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Auto-approved</span><strong>186</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Manual review</span><strong>62</strong></div>
            </div>
          </div>
        </div>
      )}

      {reportsTab === 'compliance' && (
        <div className="m-card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontSize: '0.78rem', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px' }}>Compliance area</th>
                <th style={{ padding: '12px 14px' }}>Pass</th>
                <th style={{ padding: '12px 14px' }}>Fail</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { area: 'Fertilizer organic certification', pass: 38, fail: 2, status: 'Compliant', cls: 'pill-compliant' },
                { area: 'Pesticide-free verification', pass: 40, fail: 0, status: 'Compliant', cls: 'pill-compliant' },
                { area: 'Livestock vaccination records', pass: 24, fail: 3, status: 'Watch', cls: 'pill-review' },
                { area: 'Field rotation policy', pass: 35, fail: 5, status: 'Watch', cls: 'pill-review' },
                { area: 'PGS documentation upload', pass: 31, fail: 9, status: 'Action', cls: 'pill-noncompliant' },
              ].map(r => (
                <tr key={r.area} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 14px', fontWeight: '700' }}>{r.area}</td>
                  <td style={{ padding: '12px 14px', color: '#16a34a', fontWeight: '700' }}>{r.pass}</td>
                  <td style={{ padding: '12px 14px', color: '#dc2626', fontWeight: '700' }}>{r.fail}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}><span className={`pill ${r.cls}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reportsTab === 'documents' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {farmStaffPdfs.map(d => (
            <div key={d.title} className="m-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                <FileText size={22} color="#11592c" style={{ flexShrink: 0, marginTop: '2px' }} />
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
      )}
    </div>
  );

  const renderContainerWithModal = (content) => (
    <>
      {content}
      {/* FULLSCREEN LIGHTBOX IMAGE MODAL */}
      {previewModalUrl && (
        <div 
          onClick={() => setPreviewModalUrl(null)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0, 0, 0, 0.92)', zIndex: 99999, display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <button 
              onClick={() => setPreviewModalUrl(null)}
              style={{
                position: 'absolute', top: '-42px', right: '0', background: '#ef4444',
                color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px',
                fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              ✕ Close Preview
            </button>
            <img 
              src={previewModalUrl} 
              alt="Enlarged verification proof" 
              style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }} 
            />
          </div>
        </div>
      )}
    </>
  );

  if (activeTab === 'activity-validation') return renderContainerWithModal(renderValidationPanel());
  if (activeTab === 'ml-audit') return renderContainerWithModal(renderMLAudit());
  if (activeTab === 'reports') return renderContainerWithModal(renderReports());
  return renderContainerWithModal(renderOperations());
};

export default FarmStaffDashboard;
