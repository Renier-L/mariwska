import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './views/Auth/Login';
import SuperAdminDashboard from './views/SuperAdmin/SuperAdminDashboard';
import AdminConsole from './views/Admin/AdminConsole';
import FarmStaffDashboard from './views/FarmStaff/FarmStaffDashboard';
import MobileAppSimulator from './components/mobile/MobileAppSimulator';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import { Bell, X, Megaphone, Loader2 } from 'lucide-react';
import './styles/theme.css';

const VALID_TABS = {
  super_admin: ['dashboard', 'activity-monitoring', 'scheduling', 'announcements', 'crop-monitoring', 'livestock-monitoring', 'analytics', 'decision-support', 'reports'],
  admin: ['operations-dashboard', 'user-accounts', 'member-records', 'roles-permissions', 'announcements', 'reports'],
  farm_staff: ['operations-dashboard', 'activity-validation', 'ml-audit', 'crop-management', 'livestock-management', 'reports']
};

const MainContent = () => {
  const { currentRole, activePushNotice, dismissPushNotice } = useAuth();
  const [showFullNoticeModal, setShowFullNoticeModal] = useState(false);
  
  // Persist activeTab per role in localStorage so page refresh maintains exact position & view!
  const [activeTab, setActiveTabState] = useState(() => {
    try {
      const savedTab = localStorage.getItem(`marikha_active_tab_${currentRole}`);
      const validList = VALID_TABS[currentRole] || [];
      if (savedTab && validList.includes(savedTab)) return savedTab;
    } catch (e) {}
    if (currentRole === 'super_admin') return 'dashboard';
    if (currentRole === 'admin') return 'operations-dashboard';
    if (currentRole === 'farm_staff') return 'operations-dashboard';
    return 'dashboard';
  });

  const setActiveTab = (tabId) => {
    setActiveTabState(tabId);
    try {
      localStorage.setItem(`marikha_active_tab_${currentRole}`, tabId);
    } catch (e) {}
  };

  // Restore tab on role change if available in localStorage
  useEffect(() => {
    try {
      const savedTab = localStorage.getItem(`marikha_active_tab_${currentRole}`);
      const validList = VALID_TABS[currentRole] || [];
      if (savedTab && validList.includes(savedTab)) {
        setActiveTabState(savedTab);
      } else {
        if (currentRole === 'super_admin') setActiveTabState('dashboard');
        else if (currentRole === 'admin') setActiveTabState('operations-dashboard');
        else if (currentRole === 'farm_staff') setActiveTabState('operations-dashboard');
        else setActiveTabState('dashboard');
      }
    } catch (e) {}
  }, [currentRole]);

  if (currentRole === 'login') {
    return <Login />;
  }

  if (currentRole === 'mobile_app') {
    return <MobileAppSimulator />;
  }

  return (
    <div className="app-container" style={{ position: 'relative' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-viewport">
        <Header />
        <main className="content-inner">
          {currentRole === 'super_admin' && <SuperAdminDashboard activeTab={activeTab} setActiveTab={setActiveTab} />}
          {currentRole === 'admin' && <AdminConsole activeTab={activeTab} />}
          {currentRole === 'farm_staff' && <FarmStaffDashboard activeTab={activeTab} setActiveTab={setActiveTab} />}
        </main>
      </div>

      {/* Floating Instant Push Notification Toast Banner */}
      {activePushNotice && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 99999,
          width: '380px',
          background: '#ffffff',
          border: '2px solid #d97706',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
          padding: '16px 18px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#d97706', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Megaphone size={16} />
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#d97706', textTransform: 'uppercase' }}>
                  📢 LIVE BROADCAST PUSH
                </span>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                  {activePushNotice.title}
                </h4>
              </div>
            </div>
            <button onClick={dismissPushNotice} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
              <X size={18} />
            </button>
          </div>

          <p style={{ fontSize: '0.78rem', color: '#374151', marginBottom: '12px', lineHeight: 1.4 }}>
            {activePushNotice.content}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '10px', fontSize: '0.7rem', color: '#6b7280' }}>
            <span>By {activePushNotice.author || 'Liza Cruz (Admin)'}</span>
            <button
              onClick={() => setShowFullNoticeModal(true)}
              style={{ background: '#11592c', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer' }}
            >
              Open Notice Modal →
            </button>
          </div>
        </div>
      )}

      {/* POP-UP ANNOUNCEMENT MODAL */}
      {(showFullNoticeModal || (activePushNotice && activePushNotice._autoOpenModal)) && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000
        }}>
          <div className="m-card" style={{
            width: '100%', maxWidth: '520px', padding: '0', borderRadius: '20px',
            overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #11592c 0%, #16a34a 100%)',
              padding: '20px 24px', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Megaphone size={22} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                    {activePushNotice?.title || 'Cooperative Announcement'}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#dcfce7' }}>
                    Official Live Broadcast · {activePushNotice?.date || new Date().toISOString().split('T')[0]}
                  </span>
                </div>
              </div>
              <button
                onClick={() => { setShowFullNoticeModal(false); dismissPushNotice(); }}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px', background: '#ffffff' }}>
              <div style={{ fontSize: '0.78rem', color: '#4b5563', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: '700', color: '#11592c' }}>Author:</span>
                <span>{activePushNotice?.author || 'Liza Cruz (Admin)'}</span>
              </div>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px 18px',
                fontSize: '0.9rem',
                color: '#1e293b',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                marginBottom: '20px'
              }}>
                {activePushNotice?.content}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => { setShowFullNoticeModal(false); dismissPushNotice(); }}
                  className="btn-primary"
                  style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                >
                  ✓ Acknowledge & Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;
