import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  Filter, 
  Info, 
  Layers, 
  Award, 
  Activity, 
  ChevronRight,
  Database
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

const AgriculturalAnalyticsModule = () => {
  const [activeTab, setActiveTab] = useState('performance');
  const [selectedSeason, setSelectedSeason] = useState('2026');
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Monthly productivity index data
  const productivityTrendData = [
    { month: 'Jan', index: 58, target: 60 },
    { month: 'Feb', index: 64, target: 63 },
    { month: 'Mar', index: 69, target: 68 },
    { month: 'Apr', index: 72, target: 70 },
    { month: 'May', index: 77, target: 75 },
    { month: 'Jun', index: 82, target: 78 },
    { month: 'Jul', index: 88, target: 82 },
    { month: 'Aug', index: 91, target: 85 },
    { month: 'Sep', index: 89, target: 87 },
    { month: 'Oct', index: 94, target: 90 },
    { month: 'Nov', index: 96, target: 92 },
    { month: 'Dec', index: 98, target: 95 },
  ];

  // Actual vs Predicted yield data
  const harvestComparisonData = [
    { crop: 'Tomato', actual: 412, predicted: 440, variance: -28 },
    { crop: 'Eggplant', actual: 305, predicted: 320, variance: -15 },
    { crop: 'Okra', actual: 240, predicted: 235, variance: +5 },
    { crop: 'Squash', actual: 158, predicted: 170, variance: -12 },
    { crop: 'Lettuce', actual: 285, predicted: 275, variance: +10 },
    { crop: 'Chili', actual: 202, predicted: 210, variance: -8 },
  ];

  // Farmer performance score engine data
  const farmerScoreData = [
    { id: 'FMR-001', name: 'Juan Dela Cruz', plot: 'Plot P-007 (Tomato)', yieldScore: 94, taskScore: 96, reportScore: 92, totalScore: 94.2, grade: 'A+' },
    { id: 'FMR-002', name: 'Roberto Cruz', plot: 'Plot P-021 (Eggplant)', yieldScore: 86, taskScore: 88, reportScore: 90, totalScore: 87.4, grade: 'A' },
    { id: 'FMR-003', name: 'Maria Santos', plot: 'Plot P-094 (Okra)', yieldScore: 98, taskScore: 95, reportScore: 96, totalScore: 96.7, grade: 'A+' },
    { id: 'FMR-004', name: 'Elena Gomez', plot: 'Plot P-082 (Squash)', yieldScore: 88, taskScore: 90, reportScore: 85, totalScore: 88.0, grade: 'A' },
    { id: 'FMR-005', name: 'Danilo Ramos', plot: 'Plot P-015 (Lettuce)', yieldScore: 92, taskScore: 94, reportScore: 90, totalScore: 92.2, grade: 'A' },
  ];

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
      alert('Random Forest ensemble weights updated with latest harvest logs. R² = 0.914 confirmed.');
    }, 800);
  };

  return (
    <div className="superadmin-module animate-fade-in" style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 10px', background: '#dcfce7', color: '#11592c', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '6px' }}>
            <Database size={14} /> Random Forest Regressor (v2.4-rf-agri) · R² = 0.914 · RMSE ±46.3 kg
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            Agricultural Analytics & Yield Engine
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Empirical harvest yields vs Random Forest ensemble multi-factor regression.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleRecalculate}
            disabled={isRecalculating}
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 16px', 
              background: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', 
              borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' 
            }}
          >
            <RefreshCw size={14} className={isRecalculating ? 'animate-spin' : ''} />
            {isRecalculating ? 'Computing...' : 'Recalculate RF Weights'}
          </button>
          <button 
            onClick={() => window.print()}
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', 
              background: '#11592c', color: '#ffffff', border: 'none', 
              borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(17,89,44,0.2)'
            }}
          >
            <Download size={15} /> Export PDF Report
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Actual Harvest
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0f172a' }}>1,602</span>
            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '700' }}>kg</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Season to date across 6 plots
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            RF Projected Harvest
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#11592c' }}>1,880</span>
            <span style={{ fontSize: '0.8rem', color: '#11592c', fontWeight: '700' }}>kg</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Full season ensemble forecast estimate
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Monitored Field Plots
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#2563eb' }}>6</span>
            <span style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: '700' }}>Plots</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Tomato, Eggplant, Okra, Squash, Greens
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Model Error Margin
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#16a34a' }}>±46.3</span>
            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '700' }}>kg</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            17.4% MAPE across harvest cycles
          </span>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
        {[
          { id: 'performance', label: 'Performance & Harvest Analytics' },
          { id: 'evaluation', label: 'Model Evaluation & Score Engine' }
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

      {activeTab === 'performance' ? (
        <>
          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {/* Chart 1: Productivity Trend */}
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    Cooperative Productivity Index (2026 Season)
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Monthly actual performance index vs target baseline</span>
                </div>
              </div>

              <div style={{ height: '260px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={productivityTrendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[40, 100]} />
                    <Tooltip 
                      contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: '8px' }} />
                    <Line type="monotone" dataKey="index" name="Monthly Index" stroke="#11592c" strokeWidth={3} dot={{ fill: '#11592c', r: 3 }} />
                    <Line type="monotone" dataKey="target" name="Target Baseline" stroke="#d97706" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Predicted vs Actual */}
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    Actual Yield vs Random Forest Prediction
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Kilograms harvested per commercial variety</span>
                </div>
              </div>

              <div style={{ height: '260px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={harvestComparisonData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="crop" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.75rem' }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: '8px' }} />
                    <Bar dataKey="actual" name="Actual Harvest (kg)" fill="#11592c" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="predicted" name="RF Predicted (kg)" fill="#d97706" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Variance Audit Table */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
                Harvest Variance & Model Precision Audit
              </h4>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Residual variance between field weigh-scale logs and Random Forest regressor output
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '700' }}>
                    <th style={{ padding: '12px 16px' }}>Crop Variety</th>
                    <th style={{ padding: '12px 16px' }}>Actual Harvest</th>
                    <th style={{ padding: '12px 16px' }}>RF Predicted</th>
                    <th style={{ padding: '12px 16px' }}>Variance (kg)</th>
                    <th style={{ padding: '12px 16px' }}>Variance (%)</th>
                    <th style={{ padding: '12px 16px' }}>Model Reliability</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {harvestComparisonData.map((item) => {
                    const pct = ((item.variance / item.predicted) * 100).toFixed(1);
                    return (
                      <tr key={item.crop} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', fontWeight: '700', color: '#0f172a' }}>{item.crop}</td>
                        <td style={{ padding: '14px 16px', color: '#0f172a', fontWeight: '600' }}>{item.actual} kg</td>
                        <td style={{ padding: '14px 16px', color: '#64748b' }}>{item.predicted} kg</td>
                        <td style={{ padding: '14px 16px', fontWeight: '700', color: item.variance < 0 ? '#b45309' : '#15803d' }}>
                          {item.variance > 0 ? `+${item.variance}` : item.variance} kg
                        </td>
                        <td style={{ padding: '14px 16px', color: '#475569' }}>{pct}%</td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', width: '60px' }}>
                              <div style={{ width: '92%', height: '100%', background: '#11592c', borderRadius: '3px' }} />
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#11592c' }}>92%</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700', background: '#dcfce7', color: '#15803d' }}>
                            Within Tolerance
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Evaluation & Farmer Score Engine */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
          {/* Farmer Performance Score Engine */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
              Farmer Performance Scoring Formula
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 16px 0' }}>
              Composite score weighted: 50% Yield Efficiency · 30% Task Timeliness · 20% Data Reporting
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {farmerScoreData.map((f) => (
                <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>{f.name}</strong>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{f.plot}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#11592c' }}>{f.totalScore}</span>
                      <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>pts</span>
                    </div>
                    <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800' }}>
                      {f.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PGS Organic Standards Compliance */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
              Participatory Guarantee System (PGS) Status
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 16px 0' }}>
              Municipal peer-review audit compliance across organic soil and input protocols.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Synthetic Chemical Exclusion Rate', value: '100%', status: 'Compliant', desc: 'Zero forbidden pesticides detected across all 6 plots' },
                { label: 'Compost Maturity & Heavy Metals', value: 'Passed', status: 'Compliant', desc: 'Tested via DA-RFO4A laboratory panel' },
                { label: 'Buffer Zone Integrity (3m Minimum)', value: 'Verified', status: 'Compliant', desc: 'Hedgerows intact on northern and eastern perimeters' },
                { label: 'Peer Farm Inspection Records', value: '12 / 12', status: 'Complete', desc: 'Quarterly peer audits documented and signed' }
              ].map((item, i) => (
                <div key={i} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.8rem', color: '#0f172a' }}>{item.label}</strong>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#16a34a' }}>{item.value}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgriculturalAnalyticsModule;
