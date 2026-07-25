import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './views/Auth/Login';
import SuperAdminDashboard from './views/SuperAdmin/SuperAdminDashboard';
import AdminConsole from './views/Admin/AdminConsole';
import FarmStaffDashboard from './views/FarmStaff/FarmStaffDashboard';
import MobileAppSimulator from './components/mobile/MobileAppSimulator';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import './styles/theme.css';

const MainContent = () => {
  const { currentRole } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Reset tab defaults when switching roles
  useEffect(() => {
    if (currentRole === 'super_admin') setActiveTab('dashboard');
    else if (currentRole === 'admin') setActiveTab('operations-dashboard');
    else if (currentRole === 'farm_staff') setActiveTab('operations-dashboard');
  }, [currentRole]);

  if (currentRole === 'login') {
    return <Login />;
  }

  if (currentRole === 'mobile_app') {
    return <MobileAppSimulator />;
  }

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-viewport">
        <Header />
        <main className="content-inner">
          {currentRole === 'super_admin' && <SuperAdminDashboard activeTab={activeTab} />}
          {currentRole === 'admin' && <AdminConsole activeTab={activeTab} />}
          {currentRole === 'farm_staff' && <FarmStaffDashboard activeTab={activeTab} />}
        </main>
      </div>
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
