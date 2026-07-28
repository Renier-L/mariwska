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

const safetyIndexData = [
  { day: 'D1', val: 78 },
  { day: 'D3', val: 84 },
  { day: 'D5', val: 88 },
  { day: 'D7', val: 86 },
  { day: 'D9', val: 80 },
  { day: 'D11', val: 81 },
  { day: 'D14', val: 92 },
];

const FarmStaffDashboard = ({ activeTab }) => {
  const { validations, handleValidationAction, mlClassifications } = useAuth();
  const [selectedValId, setSelectedValId] = useState(validations[0]?.id || 'val-1');
  const [staffNote, setStaffNote] = useState('');
  const [reportsTab, setReportsTab] = useState('productivity');

  const selectedValidation = validations.find(v => v.id === selectedValId) || validations[0];

  const handleApprove = () => {
    if (!selectedValidation) return;
    handleValidationAction(selectedValidation.id, 'approve', staffNote);
    setStaffNote('');
    alert(`Task ${selectedValidation.plot} approved & committed to cloud!`);
  };

  const handleReject = () => {
    if (!selectedValidation) return;
    handleValidationAction(selectedValidation.id, 'reject', staffNote);
    setStaffNote('');
    alert(`Task ${selectedValidation.plot} rejected / correction requested!`);
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

  // 1. Operations & Verification Dashboard (New Image 2)
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
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827' }}>23</div>
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
            {[
              { time: '06:42', plot: 'P-007', name: 'M. Santos', task: 'Watering', urgency: 'Urgent', cls: 'pill-critical' },
              { time: '07:15', plot: 'P-021', name: 'J. Dela Cruz', task: 'Fertilizer · vermicompost 12kg', urgency: 'Urgent', cls: 'pill-critical' },
              { time: '08:03', plot: 'P-034', name: 'G. Bautista', task: 'Harvest · okra 18kg', urgency: 'Normal', cls: 'pill-medium' },
              { time: '09:21', plot: 'P-055', name: 'P. Ocampo', task: 'Feeding · goat herd GT-014', urgency: 'Normal', cls: 'pill-medium' },
              { time: '10:45', plot: 'P-082', name: 'F. Pascual', task: 'Watering', urgency: 'Routine', cls: 'pill-seedling' },
              { time: '11:30', plot: 'P-094', name: 'T. Lopez', task: 'Fertilizer · compost tea 9L', urgency: 'Routine', cls: 'pill-seedling' },
            ].map((t, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                background: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#6b7280', fontFamily: 'monospace' }}>{t.time}</span>
                  <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontWeight: '700', fontSize: '0.75rem', color: '#334155' }}>
                    {t.plot}
                  </span>
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '0.82rem', color: '#111827', marginRight: '6px' }}>{t.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{t.task}</span>
                  </div>
                </div>
                <span className={`pill ${t.cls}`}>{t.urgency}</span>
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

  // 2. Farmer Activity Validation Panel
  const renderValidationPanel = () => (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>
          Farmer Activity Validation Panel
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          {validations.length} submissions awaiting field-verification review
        </p>
      </div>

      {validations.length === 0 ? (
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
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
          <div className="m-card">
            <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111827' }}>Incoming Digital Task Logs</h4>
            <span style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block', marginBottom: '12px' }}>
              Raw inputs submitted by mobile farmers
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {validations.map(v => {
                const isSel = v.id === selectedValId;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedValId(v.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: isSel ? '#f0fdf4' : '#f9fafb',
                      border: isSel ? '2px solid #11592c' : '1px solid #e5e7eb',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Camera size={16} color={isSel ? '#11592c' : '#94a3b8'} />
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#6b7280', fontFamily: 'monospace' }}>
                          {v.plot} · {v.timestamp}
                        </div>
                        <div style={{ fontWeight: '700', fontSize: '0.8rem', color: '#111827' }}>{v.farmer}</div>
                        <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{v.taskType || v.activity}</div>
                      </div>
                    </div>
                    <ChevronRight size={14} color="#94a3b8" />
                  </div>
                );
              })}
            </div>
          </div>

          {selectedValidation && (
            <div className="m-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '800' }}>Validation Control Card</h4>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Submission #{selectedValidation.id}</span>
              </div>

              <div style={{
                width: '100%', height: '190px', borderRadius: '10px', overflow: 'hidden', background: '#e2e8f0', marginBottom: '14px', position: 'relative'
              }}>
                <img
                  src={selectedValidation.photoUrl || selectedValidation.photo_url || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb12735?w=600&auto=format&fit=crop&q=60'}
                  alt="Field verification"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.65)',
                  color: '#ffffff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <MapPin size={12} /> Field-verification photo · GPS tagged
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px', fontSize: '0.78rem' }}>
                <div style={{ background: '#f9fafb', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.68rem', textTransform: 'uppercase', display: 'block' }}>FARMER</span>
                  <strong>{selectedValidation.farmer}</strong>
                </div>
                <div style={{ background: '#f9fafb', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.68rem', textTransform: 'uppercase', display: 'block' }}>PLOT</span>
                  <strong style={{ fontFamily: 'monospace' }}>{selectedValidation.plot}</strong>
                </div>
                <div style={{ background: '#f9fafb', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.68rem', textTransform: 'uppercase', display: 'block' }}>TASK TYPE</span>
                  <strong>{selectedValidation.taskType || selectedValidation.activity}</strong>
                </div>
                <div style={{ background: '#f9fafb', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.68rem', textTransform: 'uppercase', display: 'block' }}>LOCATION</span>
                  <strong>{selectedValidation.location || selectedValidation.gps}</strong>
                </div>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '8px 10px', borderRadius: '6px', fontSize: '0.75rem', marginBottom: '14px' }}>
                <span style={{ fontWeight: '700', color: '#15803d' }}>FARMER NOTE: </span>
                {selectedValidation.farmerNote || selectedValidation.notes}
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                  Staff Evaluation Notes
                </label>
                <textarea
                  value={staffNote}
                  onChange={(e) => setStaffNote(e.target.value)}
                  placeholder="Document field check observations, corrections requested, or supporting evidence..."
                  rows={2}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.78rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button onClick={handleApprove} className="btn-primary" style={{ justifyContent: 'center' }}>
                  ✓ Approve & Commit to Cloud
                </button>
                <button onClick={handleReject} style={{
                  background: '#dc2626', color: '#ffffff', fontWeight: '700', padding: '9px', borderRadius: '8px', border: 'none', fontSize: '0.82rem'
                }}>
                  ✕ Reject / Request Correction
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // 3. Machine Learning Audit & Risk Dashboard (New Image 5)
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

  // 4. Farm Staff Reports (Screenshots 1, 2, 3, 4, 5)
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

  if (activeTab === 'activity-validation') return renderValidationPanel();
  if (activeTab === 'ml-audit') return renderMLAudit();
  if (activeTab === 'reports') return renderReports();
  return renderOperations();
};

export default FarmStaffDashboard;
