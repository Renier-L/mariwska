import React, { useState } from 'react';
import { 
  BrainCircuit, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Send, 
  Sliders, 
  ChevronRight, 
  TrendingUp, 
  Activity, 
  Sparkles, 
  Layers, 
  Clock, 
  X, 
  ExternalLink,
  Megaphone
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

const DecisionSupportModule = () => {
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [showBroadcastPush, setShowBroadcastPush] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [filterRisk, setFilterRisk] = useState('All');
  const [searchFarm, setSearchFarm] = useState('');
  const [approvedPlans, setApprovedPlans] = useState({});

  // 8-week predictive yield curve data (W5-W8 Future Actuals = null)
  const yieldHorizonData = [
    { week: 'W1', actual: 68, predicted: 67 },
    { week: 'W2', actual: 74, predicted: 75 },
    { week: 'W3', actual: 79, predicted: 78 },
    { week: 'W4', actual: 82, predicted: 84 },
    { week: 'W5', actual: null, predicted: 88 },
    { week: 'W6', actual: null, predicted: 91 },
    { week: 'W7', actual: null, predicted: 94 },
    { week: 'W8', actual: null, predicted: 96 },
  ];

  // Feature importance weights
  const featureWeights = [
    { name: 'Rainfall Deficit Pattern', weight: 34, color: '#11592c' },
    { name: 'Soil Nitrogen Deficiency', weight: 28, color: '#16a34a' },
    { name: 'Temperature Anomaly', weight: 22, color: '#d97706' },
    { name: 'Harvest Window Timing', weight: 16, color: '#2563eb' },
  ];

  // Farms requiring attention
  const farmsRequiringIntervention = [
    {
      plot: 'Plot P-007',
      crop: 'Tomato (Diamante Max)',
      issue: 'High nutrient demand phase · Soil Nitrogen deficiency risk 28%',
      riskScore: 76,
      riskLevel: 'High',
      farmer: 'Juan Dela Cruz'
    },
    {
      plot: 'Plot P-021',
      crop: 'Eggplant (Mistisa)',
      issue: 'Rainfall deficit index 34% · Monitor soil moisture sensor',
      riskScore: 58,
      riskLevel: 'Moderate',
      farmer: 'Roberto Cruz'
    },
    {
      plot: 'Plot P-094',
      crop: 'Okra (Smooth Green)',
      issue: 'Routine pest pressure check · Neem barrier scheduled',
      riskScore: 24,
      riskLevel: 'Low',
      farmer: 'Maria Santos'
    },
    {
      plot: 'Plot P-082',
      crop: 'Squash (Suprema)',
      issue: 'Optimal canopy shading · Moisture retention compliant',
      riskScore: 18,
      riskLevel: 'Optimal',
      farmer: 'Elena Gomez'
    }
  ];

  // Recommendations Action Plan
  const recommendations = [
    {
      id: 'REC-01',
      num: '1',
      action: 'Deploy automated drip fertigation cycle for Plot P-021 (Tomato Diamante) to mitigate 34% rainfall deficit',
      impact: 'Prevents 18% moisture-stress yield penalty',
      tag: 'Plot P-021 · Eggplant / Tomato'
    },
    {
      id: 'REC-02',
      num: '2',
      action: 'Schedule organic Foliar Nitrogen spray for Plot P-007 (Eggplant) to reverse 28% soil nutrient depletion',
      impact: 'Restores vegetative vigour within 72 hours',
      tag: 'Plot P-007 · Tomato'
    },
    {
      id: 'REC-03',
      num: '3',
      action: 'Initiate heat stress micro-shading protocol across Sector B plots for 22% temperature anomaly',
      impact: 'Reduces midday leaf wilting & blossom drop',
      tag: 'Sector B · Multiple Plots'
    },
    {
      id: 'REC-04',
      num: '4',
      action: 'Adjust Goat Herd Pen #2 feed formulation to +1.4 kg/wk daily gain target',
      impact: 'Optimizes dry matter intake for Boer flock',
      tag: 'Herd B-02 · Pen Bravo'
    }
  ];

  const handleRunAudit = () => {
    setIsRunningAudit(true);
    setTimeout(() => {
      setIsRunningAudit(false);
      alert('Live Risk Audit complete. 100 decision trees evaluated across 6 plots. Risk boundaries refreshed.');
    }, 700);
  };

  const handleCommitRecommendations = () => {
    setShowBroadcastPush(true);
  };

  const filteredFarms = farmsRequiringIntervention.filter(f => {
    const matchRisk = filterRisk === 'All' || f.riskLevel === filterRisk;
    const matchSearch = f.plot.toLowerCase().includes(searchFarm.toLowerCase()) ||
                        f.crop.toLowerCase().includes(searchFarm.toLowerCase()) ||
                        f.farmer.toLowerCase().includes(searchFarm.toLowerCase());
    return matchRisk && matchSearch;
  });

  return (
    <div className="superadmin-module animate-fade-in" style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto', position: 'relative' }}>
      {/* Toast Notification (matching media_1793713237949.png) */}
      {showBroadcastPush && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 99999,
          background: '#ffffff', borderRadius: '14px', border: '1px solid #fed7aa',
          boxShadow: '0 12px 24px -4px rgba(0,0,0,0.12)', padding: '16px 20px',
          maxWidth: '420px', width: '100%', animation: 'slideInRight 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c2410c' }}>
                <Megaphone size={16} />
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LIVE BROADCAST PUSH</span>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  RF Strategic Action Plan Committed
                </h4>
              </div>
            </div>
            <button 
              onClick={() => setShowBroadcastPush(false)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
            >
              <X size={16} />
            </button>
          </div>

          <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.4 }}>
            Super Admin committed live RF risk mitigation plan: Automated fertigation, Nitrogen spray boost, and advance harvest windows deployed.
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>By Rosa Mendoza</span>
            <button 
              onClick={() => { setShowNoticeModal(true); setShowBroadcastPush(false); }}
              style={{ background: '#11592c', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
            >
              Open Notice Modal
            </button>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#dcfce7', color: '#11592c', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '6px' }}>
            <BrainCircuit size={14} /> RF Classifier · 100 Trees · 94.2% Acc
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            Random Forest Decision Support & Predictive Yield Engine
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Machine Learning predictive risk model, feature importance weighting & live intervention recommendations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleRunAudit}
            disabled={isRunningAudit}
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 16px', 
              background: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', 
              borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' 
            }}
          >
            <RefreshCw size={14} className={isRunningAudit ? 'animate-spin' : ''} />
            {isRunningAudit ? 'Auditing Trees...' : 'Run Live Risk Audit'}
          </button>
          <button 
            onClick={handleCommitRecommendations}
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', 
              background: '#11592c', color: '#ffffff', border: 'none', 
              borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(17,89,44,0.2)'
            }}
          >
            <Send size={15} /> Commit Recommendations to Supabase
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Monitored Field Sectors
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0f172a' }}>6</span>
            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '700' }}>Plots</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Under active ML risk surveillance
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Require Attention
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#d97706' }}>2</span>
            <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: '700' }}>Alerts</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '4px', display: 'block' }}>
            Plot P-007 (Tomato) & Plot P-021 (Eggplant)
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            RF Confidence Range
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#11592c' }}>74% – 89%</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Across 100 aggregated decision trees
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Mitigation Plans
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#16a34a' }}>4</span>
            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '700' }}>Actions</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Generated from model feature weights
          </span>
        </div>
      </div>

      {/* 3-Column Diagnostic Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '20px', marginBottom: '24px' }}>
        {/* Column 1: Predictive Yield Horizon */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Predictive Yield Horizon
              </h4>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>8-week predictive yield curve (Actual vs RF Model)</span>
            </div>
            <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '700' }}>
              Confidence 96.4%
            </span>
          </div>

          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yieldHorizonData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[50, 100]} />
                <Tooltip 
                  contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.75rem' }} 
                />
                <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: '4px' }} />
                <Line type="monotone" dataKey="actual" name="Actual Harvest" stroke="#11592c" strokeWidth={2.5} dot={{ fill: '#11592c', r: 3 }} connectNulls={false} />
                <Line type="monotone" dataKey="predicted" name="RF Model Trajectory" stroke="#d97706" strokeWidth={2} strokeDasharray="4 4" dot={{ fill: '#d97706', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', display: 'block', marginTop: '6px' }}>
            Note: Weeks W5–W8 indicate forward forecast (Future Actuals = NULL).
          </span>
        </div>

        {/* Column 2: Key Growth & Soil Influence Factors */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
            Key Growth & Soil Influence Factors
          </h4>
          <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block', marginBottom: '16px' }}>
            Gini impurity contribution ratio per environmental variable
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {featureWeights.map((f) => (
              <div key={f.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '5px' }}>
                  <span style={{ color: '#334155', fontWeight: '600' }}>{f.name}</span>
                  <strong style={{ color: '#0f172a' }}>{f.weight}%</strong>
                </div>
                <div style={{ height: '6px', width: '100%', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${f.weight * 2.5}%`, background: f.color, borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '16px', fontSize: '0.72rem', color: '#475569' }}>
            <strong>Dominant Factor:</strong> Moisture stress accounts for 34% of yield variance this quarter.
          </div>
        </div>

        {/* Column 3: Farms Requiring Attention */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={15} color="#d97706" />
              <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Farms Requiring Attention
              </h4>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Classified live by RF model risk score</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <select 
              value={filterRisk} 
              onChange={(e) => setFilterRisk(e.target.value)}
              style={{ padding: '6px 10px', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#fff' }}
            >
              <option value="All">All Risk Levels</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
              <option value="Optimal">Optimal</option>
            </select>
            <input 
              type="text" 
              placeholder="Search plot or farmer..." 
              value={searchFarm} 
              onChange={(e) => setSearchFarm(e.target.value)}
              style={{ width: '100%', padding: '6px 10px', fontSize: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
            {filteredFarms.map((farm) => (
              <div key={farm.plot} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: farm.riskLevel === 'High' ? '#fffbeb' : '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                  <strong style={{ fontSize: '0.8rem', color: '#0f172a' }}>{farm.plot} · {farm.crop}</strong>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: '700',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: farm.riskLevel === 'High' ? '#fee2e2' : farm.riskLevel === 'Moderate' ? '#fef3c7' : '#dcfce7',
                    color: farm.riskLevel === 'High' ? '#b91c1c' : farm.riskLevel === 'Moderate' ? '#b45309' : '#15803d'
                  }}>
                    {farm.riskScore}% – {farm.riskLevel}
                  </span>
                </div>
                <p style={{ fontSize: '0.72rem', color: '#475569', margin: 0 }}>{farm.issue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Section: Recommendations & Action Plan */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#16a34a" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Random Forest Recommendations & Action Plan
              </h3>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Operational action plan generated from model feature weights
            </span>
          </div>

          <button 
            onClick={handleCommitRecommendations}
            style={{ 
              padding: '8px 18px', background: '#11592c', color: '#ffffff', 
              border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' 
            }}
          >
            Commit Recommendations to Supabase
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          {recommendations.map((rec) => {
            const isApproved = approvedPlans[rec.id];
            return (
              <div 
                key={rec.id} 
                style={{ 
                  border: isApproved ? '1px solid #86efac' : '1px solid #e2e8f0', 
                  borderRadius: '10px', padding: '14px', background: isApproved ? '#f0fdf4' : '#f8fafc',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: isApproved ? '#16a34a' : '#11592c', color: '#fff', fontSize: '0.72rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {rec.num}
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b' }}>{rec.tag}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: '600', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                    {rec.action}
                  </p>
                  <span style={{ fontSize: '0.74rem', color: '#16a34a', display: 'block', marginBottom: '12px' }}>
                    Impact: {rec.impact}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                  <button 
                    onClick={() => {
                      setApprovedPlans(prev => ({ ...prev, [rec.id]: !prev[rec.id] }));
                    }}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      border: 'none',
                      background: isApproved ? '#dcfce7' : '#11592c',
                      color: isApproved ? '#15803d' : '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    {isApproved ? '✓ Dispatched' : 'Approve & Dispatch'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notice Modal */}
      {showNoticeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Megaphone size={20} color="#11592c" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Live Broadcast Notice Details</h3>
              </div>
              <button onClick={() => setShowNoticeModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={15} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.82rem', color: '#334155', lineHeight: 1.5, marginBottom: '20px' }}>
              <p style={{ margin: '0 0 10px 0' }}>
                <strong>Broadcast Author:</strong> Rosa Mendoza (Super Admin)
              </p>
              <p style={{ margin: '0 0 10px 0' }}>
                <strong>Broadcast Time:</strong> Just now · Real-time WebSocket push
              </p>
              <p style={{ margin: 0 }}>
                <strong>Notice Payload:</strong> 4 automated field mitigation dispatches synchronized to Supabase table <code>operational_tasks</code>. Assigned farmers will receive push notifications on the MARIKHA mobile client.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowNoticeModal(false)} style={{ padding: '8px 18px', background: '#11592c', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}>
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecisionSupportModule;
