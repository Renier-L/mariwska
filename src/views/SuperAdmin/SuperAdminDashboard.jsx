import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Sprout, 
  Binary, 
  CalendarDays, 
  BarChart3, 
  BrainCircuit, 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles, 
  Activity, 
  ArrowUpRight, 
  ArrowDown, 
  ChevronRight, 
  RotateCcw, 
  Filter, 
  Layers, 
  Radio, 
  Megaphone, 
  Trash2, 
  Clock, 
  Check, 
  X, 
  ShieldCheck, 
  Database,
  ArrowDownCircle,
  ExternalLink
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
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Sub-modules
import CropMonitoringModule from './CropMonitoringModule';
import LivestockMonitoringModule from './LivestockMonitoringModule';
import SchedulesTaskModule from './SchedulesTaskModule';
import AgriculturalAnalyticsModule from './AgriculturalAnalyticsModule';
import DecisionSupportModule from './DecisionSupportModule';
import ReportsExportModule from './ReportsExportModule';
import UserManagementModule from './UserManagementModule';
import RolesPermissionsModule from './RolesPermissionsModule';
import ProfileModule from './ProfileModule';
import SettingsModule from './SettingsModule';

const SuperAdminDashboard = ({ activeTab, setActiveTab }) => {
  const { 
    users = [], 
    crops = [], 
    livestock = [], 
    schedules = [], 
    announcements = [], 
    addCrop, 
    updateCrop, 
    deleteCrop, 
    addLivestock, 
    updateLivestock, 
    deleteLivestock, 
    addUser, 
    updateUser, 
    deleteUser, 
    toggleUserStatus, 
    addSchedule, 
    updateScheduleStatus, 
    deleteSchedule, 
    publishAnnouncement, 
    deleteAnnouncement 
  } = useAuth();

  // Overview internal state
  const [trendSeason, setTrendSeason] = useState('2026');
  const [chartToggle, setChartToggle] = useState('forecast'); // 'forecast' or 'share'
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementAudience, setAnnouncementAudience] = useState('all'); // 'all', 'farmers', 'scheduling', 'staff'
  const [broadcastSuccessNotice, setBroadcastSuccessNotice] = useState('');

  // Overview Productivity Trend Data (Jan - Aug 2026)
  const overviewTrendData = [
    { month: 'Jan', index: 58, target: 55 },
    { month: 'Feb', index: 64, target: 60 },
    { month: 'Mar', index: 71, target: 66 },
    { month: 'Apr', index: 75, target: 71 },
    { month: 'May', index: 80, target: 75 },
    { month: 'Jun', index: 85, target: 78 },
    { month: 'Jul', index: 90, target: 82 },
    { month: 'Aug', index: 94, target: 85 },
  ];

  // Grouped Bar Chart: Actual harvests vs Random Forest forecast (Jun - Nov)
  const yieldComparisonData = [
    { month: 'Jun', actual: 320, forecast: 340 },
    { month: 'Jul', actual: 360, forecast: 375 },
    { month: 'Aug', actual: 410, forecast: 405 },
    { month: 'Sep', actual: 430, forecast: 445 },
    { month: 'Oct (est)', actual: 460, forecast: 480 },
    { month: 'Nov (est)', actual: null, forecast: 520 },
  ];

  // Crop share pie data
  const cropShareData = [
    { name: 'Tomato', value: 412, color: '#11592c' },
    { name: 'Eggplant', value: 305, color: '#d97706' },
    { name: 'Okra', value: 240, color: '#2563eb' },
    { name: 'Squash', value: 158, color: '#16a34a' },
  ];

  // Exactly 3 Active Alerts (1 Critical, 2 Warnings)
  const activeAlertsList = [
    {
      id: 'ALT-01',
      level: 'Critical',
      target: 'Plot P-007 · Tomato (Diamante Max)',
      issue: 'High nutrient demand phase · Soil Nitrogen deficiency risk 28% & blossom drop alert',
      responsible: 'Juan Dela Cruz (RSBSA-04-1234) · Sector A',
      due: 'Immediate Action (Due within 24 hours)',
      actionText: 'Dispatch Drip Fertigation',
      type: 'crop',
      riskScore: 76
    },
    {
      id: 'ALT-02',
      level: 'Warning',
      target: 'Plot P-021 · Eggplant (Mistisa)',
      issue: 'Rainfall deficit index 34% · Soil moisture sensor indicates dry root zone below 30%',
      responsible: 'Roberto Cruz (RSBSA-04-5678) · Sector B',
      due: 'Due within 48 hours',
      actionText: 'Inspect Emitter Lines',
      type: 'crop',
      riskScore: 58
    },
    {
      id: 'ALT-03',
      level: 'Warning',
      target: 'Herd HRD-GT-002 · Boer Goats (Pen Bravo)',
      issue: 'Routine hoof trimming & deworming booster window closing in 48 hours',
      responsible: 'Roberto Cruz (RSBSA-04-5678) · Pen Bravo',
      due: 'Due Nov 10, 2026',
      actionText: 'Schedule Vet Visit',
      type: 'livestock',
      riskScore: 54
    }
  ];

  // Statistics counts
  const totalUsersCount = 12;
  const activeUsersCount = 11;
  const totalCropsCount = crops.length > 0 ? crops.length : 6;
  const totalGoatsCount = livestock.reduce((acc, l) => acc + (parseInt(l.heads, 10) || 0), 0) || 380;
  const scheduledTasksCount = schedules.length > 0 ? schedules.length : 18;

  // Handle publishing announcement
  const handlePublishAnnouncement = (e) => {
    e.preventDefault();
    const cleanText = announcementText.trim();
    let cleanTitle = announcementTitle.trim();

    if (!cleanText && !cleanTitle) {
      alert('Please enter announcement text or title.');
      return;
    }

    if (!cleanTitle) {
      cleanTitle = 
        announcementAudience === 'farmers' ? 'Farmer Field Activity Directive' :
        announcementAudience === 'scheduling' ? 'Cooperative Operations & Scheduling Protocol' :
        announcementAudience === 'staff' ? 'Farm Staff Operations Notice' : 'Cooperative General Operational Directive';
    }

    if (publishAnnouncement) {
      publishAnnouncement({
        title: cleanTitle,
        content: cleanText || cleanTitle,
        targetAudience: announcementAudience,
        author: 'Rosa Mendoza (Super Admin)',
        instantPush: true
      });
    }

    setAnnouncementTitle('');
    setAnnouncementText('');
    setBroadcastSuccessNotice(`✓ Notice broadcast live to: ${
      announcementAudience === 'farmers' ? '🌾 Farmers Only (Mobile Directives)' :
      announcementAudience === 'scheduling' ? '📅 Operations & Scheduling Protocols' :
      announcementAudience === 'staff' ? '👥 Farm Staff Operations' : '🌐 Cooperative-Wide (All Roles & Mobile)'
    }`);
    setTimeout(() => setBroadcastSuccessNotice(''), 5000);
  };

  const scrollToConcernQueue = () => {
    const el = document.getElementById('concern-queue-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Render Overview Dashboard (Matches media_1793713113535.png)
  const renderOverviewDashboard = () => (
    <div className="superadmin-module animate-fade-in" style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
            {/* Overview Title & Subtitle (Tenant header already in global Header bar) */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
          Super Admin Overview & System Governance
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
          Multi-cooperative tenant oversight, technical health, and real-time operational status.
        </p>
      </div>

      {/* Row 1: 4 System Governance Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div 
          onClick={() => setActiveTab && setActiveTab('user-accounts')}
          style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px 20px', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              TOTAL REGISTERED USERS
            </span>
            <Users size={16} color="#2563eb" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#0f172a', margin: '6px 0 2px 0' }}>
            {totalUsersCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: '600' }}>
            Across 5 cooperative clusters →
          </span>
        </div>

        <div 
          onClick={() => setActiveTab && setActiveTab('user-accounts')}
          style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px 20px', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ACTIVE ACCOUNTS
            </span>
            <CheckCircle2 size={16} color="#16a34a" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#11592c', margin: '6px 0 2px 0' }}>
            {activeUsersCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '600' }}>
            91.7% active engagement rate →
          </span>
        </div>

        <div 
          onClick={() => setActiveTab && setActiveTab('user-accounts')}
          style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px 20px', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PENDING ACCOUNT REQUESTS
            </span>
            <Clock size={16} color="#d97706" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#d97706', margin: '6px 0 2px 0' }}>
            1
          </div>
          <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: '600' }}>
            Requires validation & approval →
          </span>
        </div>

        {/* Card 4: System Alerts -> Directs to Alerts Modal & Concern Queue */}
        <div 
          onClick={() => setShowAlertsModal(true)}
          style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #fed7aa', padding: '18px 20px', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', boxShadow: '0 2px 4px rgba(239,68,68,0.06)' }}
          title="Click to inspect all 3 active alerts (1 critical, 2 warnings)"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SYSTEM & OPERATIONAL ALERTS
            </span>
            <AlertTriangle size={16} color="#ef4444" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#ef4444', margin: '6px 0 2px 0' }}>
            3
          </div>
          <span style={{ fontSize: '0.75rem', color: '#b91c1c', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            1 critical, 2 warnings active →
          </span>
        </div>
      </div>

      {/* Row 2: Cooperative Agricultural Operations Section */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '22px', marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 2px 0' }}>
            Cooperative Agricultural Operations
          </h3>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Real-time aggregated field production, livestock headcount, and operational task dispatch
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {/* Card 1: Crop Plots */}
          <div 
            onClick={() => setActiveTab && setActiveTab('crop-monitoring')}
            style={{ background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '16px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>REGISTERED CROP PLOTS</span>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: '4px 0 2px 0' }}>
                  142 Plots
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                  6 commercial varieties active
                </span>
              </div>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#11592c' }}>
                <Sprout size={16} />
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#11592c', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View Crop Registry ↗
            </span>
          </div>

          {/* Card 2: Livestock */}
          <div 
            onClick={() => setActiveTab && setActiveTab('livestock-monitoring')}
            style={{ background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '16px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>LIVE LIVESTOCK HERD</span>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: '4px 0 2px 0' }}>
                  380 Heads
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                  4 active goat herd groups
                </span>
              </div>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309' }}>
                <Binary size={16} />
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View Livestock Herd ↗
            </span>
          </div>

          {/* Card 3: Schedules */}
          <div 
            onClick={() => setActiveTab && setActiveTab('scheduling')}
            style={{ background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '16px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>SCHEDULED FIELD TASKS</span>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: '4px 0 2px 0' }}>
                  18 Tasks
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                  Next 7 days dispatched
                </span>
              </div>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3730a3' }}>
                <CalendarDays size={16} />
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#3730a3', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View Schedules & Tasks ↗
            </span>
          </div>

          {/* Card 4: Unresolved Concerns -> Scrolls directly to concern queue section */}
          <div 
            onClick={scrollToConcernQueue}
            style={{ background: '#fef2f2', borderRadius: '10px', border: '1px solid #fecaca', padding: '16px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#b91c1c', textTransform: 'uppercase' }}>UNRESOLVED FIELD CONCERNS</span>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#b91c1c', margin: '4px 0 2px 0' }}>
                  3 Items
                </div>
                <span style={{ fontSize: '0.72rem', color: '#991b1b', display: 'block', marginBottom: '8px' }}>
                  1 critical window, 2 warnings
                </span>
              </div>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b91c1c' }}>
                <AlertTriangle size={16} />
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#b91c1c', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Inspect Concern Queue ↓
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: Dual Charts (Trends & Machine Learning Yield) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Left Chart: Cooperative Productivity Trends */}
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a', margin: '0 0 2px 0' }}>
                Cooperative Productivity Trends
              </h4>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Monthly agricultural output index vs target baseline
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <select 
                value={trendSeason} 
                onChange={(e) => setTrendSeason(e.target.value)}
                style={{ padding: '5px 10px', fontSize: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#fff' }}
              >
                <option value="2026">2026 Season</option>
                <option value="2025">2025 Season</option>
              </select>
              <button 
                onClick={() => alert('Productivity baseline cycle reset to Q4 2026 standards.')}
                style={{ padding: '5px 10px', fontSize: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#f8fafc', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <RotateCcw size={12} /> Reset Cycle
              </button>
            </div>
          </div>

          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overviewTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[40, 100]} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.75rem' }} />
                <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: '4px' }} />
                <Line type="monotone" dataKey="index" name="Actual Performance Index" stroke="#11592c" strokeWidth={2.5} dot={{ fill: '#11592c', r: 3 }} />
                <Line type="monotone" dataKey="target" name="Target Baseline" stroke="#d97706" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Organic Yield & Random Forest Prediction (Random Forest) */}
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="#11592c" />
                <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Organic Yield & Random Forest Prediction
                </h4>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Actual harvests vs Random Forest forecast (v2.4)
              </span>
            </div>

            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '6px', padding: '2px' }}>
              <button 
                onClick={() => setChartToggle('forecast')}
                style={{
                  padding: '4px 10px', fontSize: '0.72rem', fontWeight: '700', borderRadius: '4px', border: 'none',
                  background: chartToggle === 'forecast' ? '#11592c' : 'transparent',
                  color: chartToggle === 'forecast' ? '#ffffff' : '#64748b', cursor: 'pointer'
                }}
              >
                RF Forecast
              </button>
              <button 
                onClick={() => setChartToggle('share')}
                style={{
                  padding: '4px 10px', fontSize: '0.72rem', fontWeight: '700', borderRadius: '4px', border: 'none',
                  background: chartToggle === 'share' ? '#11592c' : 'transparent',
                  color: chartToggle === 'share' ? '#ffffff' : '#64748b', cursor: 'pointer'
                }}
              >
                Crop Share
              </button>
            </div>
          </div>

          {/* Small prediction banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '8px 12px', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: '700' }}>
              Predicted Harvest: 1,602 kg (Q4 2026)
            </span>
            <span style={{ fontSize: '0.72rem', color: '#11592c', fontWeight: '800', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>
              RF v2.4 (94.8% R²)
            </span>
          </div>

          <div style={{ height: '185px', width: '100%' }}>
            {chartToggle === 'forecast' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yieldComparisonData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.72rem' }} />
                  <Bar dataKey="actual" name="Actual Harvest" fill="#11592c" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="forecast" name="RF Model Forecast" fill="#d97706" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={cropShareData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {cropShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Row 4: Dedicated Unresolved Field Concerns & Live Risk Queue Section (Shows ALL 3 Items: 1 Crit, 2 Warn) */}
      <div id="concern-queue-section" style={{ background: '#ffffff', borderRadius: '14px', border: '2px solid #fed7aa', padding: '22px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="#dc2626" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Unresolved Field Concerns & Live Risk Queue
              </h3>
              <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '800' }}>
                3 Active Items (1 Critical, 2 Warnings)
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Real-time operational exceptions detected by sensors and Random Forest classification
            </span>
          </div>

          <button 
            onClick={() => setActiveTab && setActiveTab('decision-support')}
            style={{ padding: '7px 14px', background: '#11592c', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            Launch Decision Support <ExternalLink size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          {activeAlertsList.map((alertItem) => {
            const isCrit = alertItem.level === 'Critical';
            return (
              <div 
                key={alertItem.id} 
                style={{ 
                  borderRadius: '10px', 
                  border: isCrit ? '1.5px solid #f87171' : '1.5px solid #fcd34d', 
                  background: isCrit ? '#fef2f2' : '#fffbeb', 
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {alertItem.type === 'livestock' ? <Binary size={14} color="#b45309" /> : <Sprout size={14} color="#15803d" />}
                      <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{alertItem.target}</strong>
                    </div>
                    <span style={{
                      padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '800',
                      background: isCrit ? '#fee2e2' : '#fef3c7',
                      color: isCrit ? '#b91c1c' : '#b45309',
                      border: isCrit ? '1px solid #fca5a5' : '1px solid #fde68a'
                    }}>
                      {alertItem.riskScore}% · {alertItem.level}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#334155', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                    {alertItem.issue}
                  </p>

                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '4px' }}>
                    Responsible: <strong>{alertItem.responsible}</strong>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: isCrit ? '#b91c1c' : '#b45309', fontWeight: '700' }}>
                    {alertItem.due}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '10px' }}>
                  <button 
                    onClick={() => {
                      alert(`Dispatched operational resolution for ${alertItem.target}: "${alertItem.actionText}".`);
                    }}
                    style={{
                      padding: '6px 12px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: '700',
                      background: isCrit ? '#dc2626' : '#d97706', color: '#ffffff', border: 'none', cursor: 'pointer'
                    }}
                  >
                    {alertItem.actionText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 5: Live Cooperative Announcements Publisher */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Megaphone size={18} color="#11592c" />
          <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            Broadcast Cooperative Notices & Directives
          </h4>
        </div>

        <form onSubmit={handlePublishAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 320px) 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: '800', color: '#334155', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Target Recipient / Audience:
              </label>
              <select 
                value={announcementAudience}
                onChange={(e) => setAnnouncementAudience(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', fontSize: '0.82rem', fontWeight: '700', border: '1.5px solid #11592c', borderRadius: '8px', background: '#f0fdf4', color: '#11592c', outline: 'none' }}
              >
                <option value="all">🌐 Cooperative-Wide (All Roles & Mobile)</option>
                <option value="farmers">🌾 Farmers Only (Mobile App Directives)</option>
                <option value="scheduling">📅 Scheduling & Operational Protocols</option>
                <option value="staff">👥 Farm Staff Operations</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: '800', color: '#334155', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Directive Title:
              </label>
              <input 
                type="text" 
                placeholder="Notice Title (Optional - auto-assigned if blank)"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                style={{ width: '100%', padding: '9px 14px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <textarea 
              placeholder="Enter directive body, operational instructions, or scheduled activity guidelines..."
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              style={{ flex: 1, height: '64px', padding: '10px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px', resize: 'none' }}
            />
            <button 
              type="submit"
              style={{ padding: '0 26px', background: '#11592c', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.84rem', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', boxShadow: '0 2px 4px rgba(17,89,44,0.2)' }}
            >
              <span>Broadcast Notice</span>
              <span style={{ fontSize: '0.67rem', opacity: 0.9, fontWeight: '500' }}>Cloud & Mobile Sync</span>
            </button>
          </div>

          {broadcastSuccessNotice && (
            <div style={{ padding: '10px 14px', background: '#ecfdf5', color: '#065f46', border: '1.5px solid #6ee7b7', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{broadcastSuccessNotice}</span>
            </div>
          )}
        </form>

        {/* Existing Announcements Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(announcements && announcements.length > 0 ? announcements : [
            { id: 'ANN-01', title: 'PGS Quarterly Audit Verification', content: 'DA municipal organic peer-review committee arriving on November 12 for composite soil testing.', author: 'Rosa Mendoza', date: 'Today, 09:00 AM', targetAudience: 'all', audienceLabel: 'All Cooperative Members' },
            { id: 'ANN-02', title: 'Boer Flock Hoof Trimming Reminder', content: 'Staff assigned to Pen Bravo must complete antiseptic foot bath before 11:00 AM.', author: 'Dr. V. Reyes', date: 'Yesterday', targetAudience: 'staff', audienceLabel: 'Farm Staff Operations' }
          ]).map((ann) => {
            const isFarmerTarget = ann.targetAudience === 'farmers' || ann.title?.includes('Farmers Only') || ann.audienceLabel?.includes('Farmers');
            const isSchedTarget = ann.targetAudience === 'scheduling' || ann.title?.includes('Scheduling');
            const isStaffTarget = ann.targetAudience === 'staff' || ann.title?.includes('Farm Staff');

            return (
              <div key={ann.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>{ann.title}</strong>
                    <span style={{ 
                      fontSize: '0.68rem', 
                      fontWeight: '800', 
                      padding: '2px 8px', 
                      borderRadius: '12px',
                      background: isFarmerTarget ? '#dbeafe' : isSchedTarget ? '#fef3c7' : isStaffTarget ? '#f3e8ff' : '#dcfce7',
                      color: isFarmerTarget ? '#1e40af' : isSchedTarget ? '#92400e' : isStaffTarget ? '#6b21a8' : '#11592c'
                    }}>
                      {ann.audienceLabel || (isFarmerTarget ? '🌾 Farmers Only (Mobile)' : isSchedTarget ? '📅 Scheduling Protocol' : isStaffTarget ? '👥 Farm Staff' : '🌐 Cooperative-Wide')}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#475569', display: 'block', lineHeight: 1.4 }}>{ann.content}</span>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginTop: '3px' }}>By {ann.author} · {ann.date}</span>
                </div>
                {deleteAnnouncement && (
                  <button 
                    onClick={() => deleteAnnouncement(ann.id)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px', marginLeft: '12px' }}
                    title="Delete notice"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Active System Alerts (Shows all 3 items: 1 Crit, 2 Warn) */}
      {showAlertsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '600px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} color="#dc2626" />
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    Active System & Operational Alerts
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    1 critical action window, 2 active operational warnings
                  </span>
                </div>
              </div>
              <button onClick={() => setShowAlertsModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {activeAlertsList.map((a) => {
                const isCrit = a.level === 'Critical';
                return (
                  <div key={a.id} style={{ padding: '12px 14px', borderRadius: '8px', border: isCrit ? '1.5px solid #fca5a5' : '1.5px solid #fde68a', background: isCrit ? '#fef2f2' : '#fffbeb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.84rem', color: '#0f172a' }}>{a.target}</strong>
                      <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '800', background: isCrit ? '#fee2e2' : '#fef3c7', color: isCrit ? '#b91c1c' : '#b45309' }}>
                        {a.riskScore}% · {a.level}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#475569', margin: '0 0 6px 0' }}>{a.issue}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{a.responsible}</span>
                      <button 
                        onClick={() => {
                          alert(`Action dispatched: ${a.actionText}`);
                          setShowAlertsModal(false);
                        }}
                        style={{ padding: '4px 10px', fontSize: '0.72rem', fontWeight: '700', borderRadius: '4px', background: isCrit ? '#dc2626' : '#d97706', color: '#fff', border: 'none', cursor: 'pointer' }}
                      >
                        {a.actionText}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
              <button 
                onClick={() => {
                  setShowAlertsModal(false);
                  setActiveTab && setActiveTab('decision-support');
                }}
                style={{ background: '#11592c', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Open Full Decision Support Engine <ExternalLink size={14} />
              </button>
              <button 
                onClick={() => setShowAlertsModal(false)}
                style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Switch between tabs
  let currentView = renderOverviewDashboard();

  if (activeTab === 'crop-monitoring') {
    currentView = (
      <CropMonitoringModule 
        crops={crops} 
        addCrop={addCrop} 
        updateCrop={updateCrop} 
        deleteCrop={deleteCrop} 
      />
    );
  } else if (activeTab === 'livestock-monitoring') {
    currentView = (
      <LivestockMonitoringModule 
        livestock={livestock} 
        addLivestock={addLivestock} 
        updateLivestock={updateLivestock} 
        deleteLivestock={deleteLivestock} 
      />
    );
  } else if (activeTab === 'scheduling') {
    currentView = (
      <SchedulesTaskModule 
        schedules={schedules} 
        addSchedule={addSchedule} 
        updateScheduleStatus={updateScheduleStatus} 
        deleteSchedule={deleteSchedule} 
      />
    );
  } else if (activeTab === 'analytics') {
    currentView = <AgriculturalAnalyticsModule />;
  } else if (activeTab === 'decision-support') {
    currentView = <DecisionSupportModule />;
  } else if (activeTab === 'reports') {
    currentView = <ReportsExportModule />;
  } else if (activeTab === 'user-accounts') {
    currentView = (
      <UserManagementModule 
        users={users} 
        addUser={addUser} 
        updateUser={updateUser} 
        deleteUser={deleteUser} 
        toggleUserStatus={toggleUserStatus} 
      />
    );
  } else if (activeTab === 'roles-permissions' || activeTab === 'audit-logs') {
    currentView = <RolesPermissionsModule />;
  } else if (activeTab === 'profile') {
    currentView = <ProfileModule />;
  } else if (activeTab === 'settings') {
    currentView = <SettingsModule />;
  }

  return currentView;
};

export default SuperAdminDashboard;
