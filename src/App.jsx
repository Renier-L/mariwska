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

const MainContent = () => {
  const { currentRole, activePushNotice, dismissPushNotice } = useAuth();
  
  // Persist activeTab per role in localStorage so page refresh maintains exact position & view!
  const [activeTab, setActiveTabState] = useState(() => {
    try {
      const savedTab = localStorage.getItem(`marikha_active_tab_${currentRole}`);
      if (savedTab) return savedTab;
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
      if (savedTab) {
        setActiveTabState(savedTab);
      } else {
        if (currentRole === 'super_admin') setActiveTabState('dashboard');
        else if (currentRole === 'admin') setActiveTabState('operations-dashboard');
        else if (currentRole === 'farm_staff') setActiveTabState('operations-dashboard');
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
          {currentRole === 'farm_staff' && <FarmStaffDashboard activeTab={activeTab} />}
        </main>
      </div>

      {/* Floating Instant Push Notification Toast Banner */}
      {activePushNotice && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          width: '360px',
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
            <span>By {activePushNotice.author}</span>
            <button
              onClick={() => {}}
              style={{ background: '#11592c', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer' }}
            >
              Open Notice Chat →
            </button>
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
