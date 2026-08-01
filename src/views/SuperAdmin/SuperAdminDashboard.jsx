import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { superAdminPdfs } from '../../data/mockData';
import { 
  Sprout, 
  Binary, 
  Search, 
  FileText, 
  Printer, 
  Download, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import jsPDF from 'jspdf';

// Overview Dashboard Data
const overviewTrendData = [
  { month: 'Jan', index: 62, target: 60 },
  { month: 'Feb', index: 68, target: 66 },
  { month: 'Mar', index: 71, target: 70 },
  { month: 'Apr', index: 74, target: 72 },
  { month: 'May', index: 80, target: 76 },
  { month: 'Jun', index: 84, target: 78 },
  { month: 'Jul', index: 90, target: 80 },
  { month: 'Aug', index: 92, target: 81 },
];

const yieldShareData = [
  { name: 'Tomato', value: 412, color: '#11592c' },
  { name: 'Eggplant', value: 305, color: '#d97706' },
  { name: 'Okra', value: 240, color: '#452c1e' },
  { name: 'Squash', value: 158, color: '#16a34a' },
];

// Analytics Data
const productivityTrendData = [
  { month: 'J', index: 40 },
  { month: 'F', index: 52 },
  { month: 'M', index: 45 },
  { month: 'A', index: 42 },
  { month: 'M', index: 43 },
  { month: 'J', index: 58 },
  { month: 'J', index: 65 },
  { month: 'A', index: 60 },
  { month: 'S', index: 72 },
  { month: 'O', index: 68 },
  { month: 'N', index: 75 },
  { month: 'D', index: 80 },
];

const harvestPerformanceData = [
  { crop: 'Tomato', y2024: 300, y2025: 412 },
  { crop: 'Eggplant', y2024: 250, y2025: 305 },
  { crop: 'Okra', y2024: 180, y2025: 240 },
  { crop: 'Squash', y2024: 120, y2025: 158 },
];

const forecastData = [
  { week: 'W1', actual: 60, predicted: 60 },
  { week: 'W2', actual: 64, predicted: 65 },
  { week: 'W3', actual: 68, predicted: 69 },
  { week: 'W4', actual: 72, predicted: 74 },
  { week: 'W5', actual: null, predicted: 78 },
  { week: 'W6', actual: null, predicted: 83 },
  { week: 'W7', actual: null, predicted: 87 },
  { week: 'W8', actual: null, predicted: 90 },
];

const SuperAdminDashboard = ({ activeTab, setActiveTab }) => {
  const { crops, livestock, validations, handleValidationAction } = useAuth();
  const [directoryTab, setDirectoryTab] = useState('crop');
  const [reportsSubTab, setReportsSubTab] = useState('pdf'); // Default to PDF Documents view to show matching screenshot
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Dispatch agronomist team to plots P-021 and P-034 for fertilizer recalibration within 5 days.', checked: false },
    { id: 2, text: 'Reassign irrigation slot 14:00–16:00 to cluster B based on rainfall deficit pattern (RF importance 0.34).', checked: true },
    { id: 3, text: 'Increase tomato planting allocation by 18% next season — predicted ROI uplift +12.4%.', checked: false },
    { id: 4, text: 'Schedule PGS re-inspection for farmer T. Lopez before next harvest window (Sep 28).', checked: true },
  ]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = (title) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("MARIKHA Super Admin Report", 20, 20);
    doc.setFontSize(13);
    doc.text(title, 20, 32);
    doc.setFontSize(10);
    doc.text("Antipolo Organic Farming Cooperative · ANT-ORG-001", 20, 42);
    doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 20, 50);
    doc.text("Verified crop, livestock, compliance and strategic forecast data.", 20, 68);
    doc.save(`${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  };

  const toggleChecklist = (id) => {
    setChecklist(checklist.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  // 1. Cooperative Operations Overview (Dashboard Tab)
  const renderOverviewDashboard = () => (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>
          Cooperative Operations Overview
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          Real-time strategic snapshot across all member farms
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <div className="m-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase' }}>TOTAL ACTIVE CROP PLOTS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', margin: '2px 0' }}>142</div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>^+6 this month</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e4f0e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#11592c' }}>
            <Sprout size={20} />
          </div>
        </div>

        <div className="m-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase' }}>LIVE LIVESTOCK HEADCOUNT</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', margin: '2px 0' }}>380</div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>^+12 this week</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
            <Binary size={20} />
          </div>
        </div>

        <div className="m-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase' }}>OVERALL PGS COMPLIANCE</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', margin: '2px 0' }}>94.2%</div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>^+1.4% vs Q2</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className="m-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase' }}>PENDING OPERATIONS CONCERNS</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', margin: '2px 0' }}>7</div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>^Active alerts</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
            <AlertCircle size={20} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div className="m-card">
          <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#111827' }}>Cooperative Productivity Trends</h4>
          <span style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block', marginBottom: '14px' }}>Monthly yield index vs target</span>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overviewTrendData}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="index" name="Index" stroke="#11592c" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="target" name="Target" stroke="#d97706" strokeWidth={2} strokeDasharray="3 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="m-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#111827' }}>Organic Yield Performance</h4>
            <span style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block', marginBottom: '10px' }}>Share of total harvested output by crop</span>
          </div>
          <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={yieldShareData} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={4}>
                  {yieldShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconSize={8} formatter={(val) => <span style={{ fontSize: '0.72rem', color: '#4b5563' }}>{val}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="m-card">
        <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#111827', marginBottom: '14px' }}>
          Pending Operations Concerns
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { plot: 'P-021', text: 'Fertilizer log overdue (3 days)', status: 'Warning', cls: 'pill-high' },
            { plot: 'P-007', text: 'Goat herd vaccination window closing', status: 'Critical', cls: 'pill-critical' },
            { plot: 'P-034', text: 'Irrigation frequency below threshold', status: 'Warning', cls: 'pill-high' },
          ].map((item, idx) => (
            <div key={idx} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '6px', fontFamily: 'monospace', fontWeight: '700', fontSize: '0.75rem' }}>
                  {item.plot}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#374151' }}>{item.text}</span>
              </div>
              <span className={`pill ${item.cls}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 2. Crop Production & Live Farmer Submissions Monitoring
  const renderCropMonitoring = () => (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>
          Crop Production & Live Mobile Submissions
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          Real-time field registry synchronized live with Farmer Mobile App & Supabase
        </p>
      </div>

      <div className="tab-capsule-container" style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab && setActiveTab('crop-monitoring')}
          className={`tab-capsule-btn ${activeTab === 'crop-monitoring' ? 'active' : ''}`}
        >
          🌾 Crop Production Directory
        </button>
        <button
          onClick={() => setActiveTab && setActiveTab('livestock-monitoring')}
          className={`tab-capsule-btn ${activeTab === 'livestock-monitoring' ? 'active' : ''}`}
        >
          🐄 Livestock Operational Registry
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '700' }}>TOTAL ACTIVE CROPS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#11592c', marginTop: '4px' }}>{crops.length} Plots</div>
        </div>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '700' }}>FARMER SUBMISSIONS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#d97706', marginTop: '4px' }}>{validations ? validations.length : 0} Logs</div>
        </div>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '700' }}>HARVEST READY</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#16a34a', marginTop: '4px' }}>412 kg</div>
        </div>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '700' }}>AVG YIELD PER HECTARE</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0284c7', marginTop: '4px' }}>4.8 Tons</div>
        </div>
      </div>

      <div className="m-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ padding: '16px', background: '#fafafa', borderBottom: '1px solid #e5e7eb', fontWeight: '800', fontSize: '0.95rem', color: '#11592c' }}>
          🌾 Active Field Plots Registry
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontSize: '0.78rem', textAlign: 'left' }}>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Crop Variety</th>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Plot</th>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Growth Stage</th>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Fertilizer Application</th>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Irrigation</th>
              <th style={{ padding: '14px 16px', fontWeight: '700', textAlign: 'right' }}>Historical Yield</th>
            </tr>
          </thead>
          <tbody>
            {crops.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '14px 16px', fontWeight: '700', color: '#111827' }}>{c.variety}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '6px', fontFamily: 'monospace', fontWeight: '700', fontSize: '0.75rem', color: '#334155'
                  }}>
                    {c.plot}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className={`pill pill-${c.growthStage.toLowerCase()}`}>
                    {c.growthStage}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: '#374151' }}>{c.fertilizer}</td>
                <td style={{ padding: '14px 16px', color: '#374151' }}>{c.irrigation}</td>
                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '700', color: '#11592c' }}>{c.yield}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Live Farmer Mobile Submissions Feed */}
      <div className="m-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '16px', background: '#f0fdf4', borderBottom: '1px solid #bbf7d0', fontWeight: '800', fontSize: '0.95rem', color: '#15803d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>📱 Live Farmer Mobile Logs & Photo Proofs</span>
          <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '12px' }}>
            Supabase Sync Active
          </span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontSize: '0.78rem', textAlign: 'left' }}>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Farmer Name</th>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Plot</th>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Activity</th>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Photo Proof</th>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Notes</th>
              <th style={{ padding: '14px 16px', fontWeight: '700', textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {validations && validations.map((v) => (
              <tr key={v.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '14px 16px', fontWeight: '700', color: '#111827' }}>{v.farmer}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '6px', fontFamily: 'monospace', fontWeight: '700', fontSize: '0.75rem' }}>
                    {v.plot}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: '#15803d', fontWeight: '600' }}>{v.activity}</td>
                <td style={{ padding: '14px 16px' }}>
                  {v.photo_url ? (
                    <img src={v.photo_url} alt="Proof" style={{ width: '48px', height: '36px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #cbd5e1' }} />
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>No Photo</span>
                  )}
                </td>
                <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.8rem' }}>{v.notes}</td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  {v.status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleValidationAction(v.id, 'Validated')}
                        style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                      >
                        ✓ Validate
                      </button>
                      <button 
                        onClick={() => handleValidationAction(v.id, 'Rejected')}
                        style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  ) : (
                    <span className={`pill ${v.status === 'Validated' ? 'pill-compliant' : 'pill-critical'}`}>
                      {v.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 3. Livestock Operational Registry
  const renderLivestockMonitoring = () => (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>
          Livestock Operational Registry & Health Management
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          Cooperative herd monitoring, vaccination coverage & weight gain metrics
        </p>
      </div>

      <div className="tab-capsule-container" style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab && setActiveTab('crop-monitoring')}
          className={`tab-capsule-btn ${activeTab === 'crop-monitoring' ? 'active' : ''}`}
        >
          🌾 Crop Production Directory
        </button>
        <button
          onClick={() => setActiveTab && setActiveTab('livestock-monitoring')}
          className={`tab-capsule-btn ${activeTab === 'livestock-monitoring' ? 'active' : ''}`}
        >
          🐄 Livestock Operational Registry
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '700' }}>TOTAL HEAD COUNT</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#11592c', marginTop: '4px' }}>380 Heads</div>
        </div>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '700' }}>ACTIVE HERD GROUPS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#d97706', marginTop: '4px' }}>{livestock.length} Groups</div>
        </div>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '700' }}>VACCINATION RATE</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#16a34a', marginTop: '4px' }}>96.4%</div>
        </div>
        <div className="m-card">
          <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '700' }}>AVG WEIGHT GAIN</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0284c7', marginTop: '4px' }}>+1.2 kg/wk</div>
        </div>
      </div>

      <div className="m-card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontSize: '0.78rem', textAlign: 'left' }}>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Group / Flock</th>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Plot Location</th>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Head Count</th>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Vaccination Coverage</th>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Health Status</th>
              <th style={{ padding: '14px 16px', fontWeight: '700', textAlign: 'right' }}>Avg Daily Gain</th>
            </tr>
          </thead>
          <tbody>
            {livestock.map((l) => (
              <tr key={l.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '14px 16px', fontWeight: '700', color: '#111827' }}>{l.group}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '6px', fontFamily: 'monospace', fontWeight: '700', fontSize: '0.75rem', color: '#334155'
                  }}>
                    {l.plot}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontWeight: '700' }}>{l.headCount} heads</td>
                <td style={{ padding: '14px 16px' }}>{l.vaccination}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span className="pill pill-compliant">{l.healthStatus}</span>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '700', color: '#11592c' }}>{l.dailyGain}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 4. Analytics & Intelligence Hub
  const renderAnalytics = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>
            Analytics & Intelligence Hub
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Cooperative productivity metrics, historical harvest performance & compliance stats
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#0c3619',
          color: '#ffffff',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '0.78rem',
          fontWeight: '700'
        }}>
          <BarChart3 size={15} color="#86efac" />
          Analytics Engine · Active
        </div>
      </div>

      <div className="tab-capsule-container" style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab && setActiveTab('analytics')}
          className={`tab-capsule-btn ${activeTab === 'analytics' ? 'active' : ''}`}
        >
          📊 Analytics & Intelligence
        </button>
        <button
          onClick={() => setActiveTab && setActiveTab('decision-support')}
          className={`tab-capsule-btn ${activeTab === 'decision-support' ? 'active' : ''}`}
        >
          🧠 AI Decision Support Engine
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <div className="m-card">
          <h4 style={{ fontSize: '0.82rem', fontWeight: '700', color: '#111827' }}>Productivity Trend</h4>
          <span style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block', marginBottom: '10px' }}>Monthly yield index</span>
          <div style={{ height: '120px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productivityTrendData}>
                <Line type="monotone" dataKey="index" stroke="#11592c" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="m-card">
          <h4 style={{ fontSize: '0.82rem', fontWeight: '700', color: '#111827' }}>Harvest Performance</h4>
          <span style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block', marginBottom: '10px' }}>2024 vs 2025 by crop</span>
          <div style={{ height: '120px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={harvestPerformanceData}>
                <Bar dataKey="y2024" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
                <Bar dataKey="y2025" fill="#11592c" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="m-card">
          <h4 style={{ fontSize: '0.82rem', fontWeight: '700', color: '#111827' }}>Farmer Performance</h4>
          <span style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block', marginBottom: '10px' }}>Top 5 RF performance score</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[{ name: 'L. Reyes', score: 94 }, { name: 'R. Dela Cruz', score: 88 }, { name: 'G. Bautista', score: 82 }].map(f => (
              <div key={f.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: '600', marginBottom: '2px' }}>
                  <span>{f.name}</span>
                  <span>{f.score}</span>
                </div>
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${f.score}%`, height: '100%', background: '#d97706' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="m-card">
          <h4 style={{ fontSize: '0.82rem', fontWeight: '700', color: '#111827' }}>Compliance Statistics</h4>
          <span style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block', marginBottom: '10px' }}>Quarterly PGS rating</span>
          <div style={{ height: '120px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{q:'Q1',v:82},{q:'Q2',v:88},{q:'Q3',v:92},{q:'Q4',v:94}]}>
                <Line type="monotone" dataKey="v" stroke="#16a34a" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  // 5. Decision Support Engine (Dedicated Screen)
  const renderDecisionSupport = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>
            Decision Support Engine & AI Strategy
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Random Forest algorithmic yield forecasting & farm intervention recommendations
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#0c3619',
          color: '#ffffff',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '0.78rem',
          fontWeight: '700'
        }}>
          <Sparkles size={15} color="#86efac" />
          Random Forest Engine · Online
        </div>
      </div>

      <div className="tab-capsule-container" style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab && setActiveTab('analytics')}
          className={`tab-capsule-btn ${activeTab === 'analytics' ? 'active' : ''}`}
        >
          📊 Analytics & Intelligence
        </button>
        <button
          onClick={() => setActiveTab && setActiveTab('decision-support')}
          className={`tab-capsule-btn ${activeTab === 'decision-support' ? 'active' : ''}`}
        >
          🧠 AI Decision Support Engine
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '16px' }}>
        <div className="m-card">
          <div style={{ marginBottom: '12px' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#111827' }}>Algorithmic Yield & Trend Forecast</h4>
            <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>8-week predictive horizon · confidence 86%</span>
          </div>
          <div style={{ height: '210px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="actual" name="Actual" stroke="#11592c" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="predicted" name="RF Predicted" stroke="#d97706" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="m-card">
          <div style={{ marginBottom: '14px' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} color="#d97706" />
              Farms Requiring Strategic Intervention
            </h4>
            <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>Sorted by RF risk score (desc)</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { plot: 'P-021', name: 'J. Aquino', reason: 'Missed 3 fertilizer cycles', risk: '87% - Critical', cls: 'pill-critical' },
              { plot: 'P-034', name: 'R. Mendoza', reason: 'Irrigation frequency below target', risk: '74% - High', cls: 'pill-high' },
              { plot: 'P-055', name: 'T. Lopez', reason: 'Yield 22% below cluster mean', risk: '68% - High', cls: 'pill-high' },
              { plot: 'P-082', name: 'F. Pascual', reason: 'Late harvest reporting', risk: '61% - Medium', cls: 'pill-medium' },
            ].map(farm => (
              <div key={farm.plot} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb'
              }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.8rem' }}>
                    <span style={{ fontFamily: 'monospace', color: '#11592c', marginRight: '6px' }}>{farm.plot}</span>
                    {farm.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{farm.reason}</div>
                </div>
                <span className={`pill ${farm.cls}`}>{farm.risk}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="m-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ marginBottom: '14px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#16a34a" />
                System-Generated Recommendations
              </h4>
              <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>Operational checklist for executive planning</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {checklist.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 10px', borderRadius: '8px',
                    background: item.checked ? '#f0fdf4' : '#f9fafb', border: item.checked ? '1px solid #86efac' : '1px solid #e5e7eb', cursor: 'pointer', fontSize: '0.75rem'
                  }}
                >
                  <span style={{
                    width: '18px', height: '18px', borderRadius: '50%', background: item.checked ? '#11592c' : '#cbd5e1',
                    color: '#fff', fontSize: '0.68rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px'
                  }}>
                    {idx + 1}
                  </span>
                  <span style={{ color: item.checked ? '#15803d' : '#374151', textDecoration: item.checked ? 'line-through' : 'none' }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
            Commit to Strategic Plan
          </button>
        </div>
      </div>
    </div>
  );

  // 6. Super Admin Reports
  const renderReports = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>
            Super Admin Reports & Compliance
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Operational reports consolidated from crop, livestock, farmer activity, harvest, compliance and productivity records
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handlePrint} className="btn-outline">
            <Printer size={15} /> Print
          </button>
          <button onClick={() => handleDownloadPDF('Super Admin Consolidated Report')} className="btn-primary">
            <FileText size={15} /> Generate PDF
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <div className="m-card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e4f0e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#11592c' }}>
            <Sprout size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600' }}>Crop Records</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827' }}>1,284</div>
          </div>
        </div>

        <div className="m-card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
            <Binary size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600' }}>Livestock Records</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827' }}>380</div>
          </div>
        </div>

        <div className="m-card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600' }}>PGS Compliance</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827' }}>94.2%</div>
          </div>
        </div>

        <div className="m-card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600' }}>Productivity Index</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827' }}>+18.4%</div>
          </div>
        </div>
      </div>

      <div className="tab-capsule-container" style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setReportsSubTab('summary')}
          className={`tab-capsule-btn ${reportsSubTab === 'summary' ? 'active' : ''}`}
        >
          Summary Reports
        </button>
        <button
          onClick={() => setReportsSubTab('historical')}
          className={`tab-capsule-btn ${reportsSubTab === 'historical' ? 'active' : ''}`}
        >
          Historical Reports
        </button>
        <button
          onClick={() => setReportsSubTab('pdf')}
          className={`tab-capsule-btn ${reportsSubTab === 'pdf' ? 'active' : ''}`}
        >
          PDF Documents
        </button>
      </div>

      {reportsSubTab === 'summary' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="m-card">
            <h4 style={{ fontSize: '0.82rem', fontWeight: '800', color: '#11592c', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px' }}>
              CROP PRODUCTION SNAPSHOT
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Active plots</span><strong>142</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Avg yield/plot</span><strong>289 kg</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Top variety</span><strong>Tomato - Diamante</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Harvest events (30d)</span><strong>47</strong></div>
            </div>
          </div>

          <div className="m-card">
            <h4 style={{ fontSize: '0.82rem', fontWeight: '800', color: '#11592c', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px' }}>
              LIVESTOCK OPERATIONS SNAPSHOT
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total head</span><strong>380</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Groups</span><strong>27</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Vaccination coverage</span><strong>96%</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Avg daily gain</span><strong>+1.2 kg/wk</strong></div>
            </div>
          </div>
        </div>
      )}

      {reportsSubTab === 'historical' && (
        <div className="m-card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontSize: '0.78rem', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px' }}>Report</th>
                <th style={{ padding: '12px 16px' }}>Type</th>
                <th style={{ padding: '12px 16px' }}>Source records</th>
                <th style={{ padding: '12px 16px' }}>Generated</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {superAdminPdfs.map((doc) => (
                <tr key={doc.title} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: '#111827' }}>{doc.title}</td>
                  <td style={{ padding: '14px 16px' }}><span className="pill pill-seedling">{doc.type}</span></td>
                  <td style={{ padding: '14px 16px', color: '#6b7280' }}>Cooperative-wide</td>
                  <td style={{ padding: '14px 16px', color: '#6b7280' }}>{doc.date}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDownloadPDF(doc.title)}
                      style={{ color: '#11592c', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Download size={14} /> {doc.size}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PDF Documents Grid */}
      {reportsSubTab === 'pdf' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {superAdminPdfs.map((doc) => (
            <div key={doc.title} className="m-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={20} color="#0c3619" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111827', lineHeight: 1.2, marginBottom: '4px' }}>{doc.title}</h4>
                  <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>{doc.date} · {doc.size}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button
                  onClick={() => handleDownloadPDF(doc.title)}
                  style={{
                    flex: 1,
                    background: '#0c3619',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={14} /> PDF
                </button>
                <button
                  onClick={handlePrint}
                  style={{
                    width: '36px',
                    height: '34px',
                    borderRadius: '8px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#374151'
                  }}
                >
                  <Printer size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (activeTab === 'crop-monitoring') return renderCropMonitoring();
  if (activeTab === 'livestock-monitoring') return renderLivestockMonitoring();
  if (activeTab === 'analytics') return renderAnalytics();
  if (activeTab === 'decision-support') return renderDecisionSupport();
  if (activeTab === 'reports') return renderReports();
  return renderOverviewDashboard();
};

export default SuperAdminDashboard;
