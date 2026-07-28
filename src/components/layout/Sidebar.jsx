import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Sprout, 
  Binary, 
  BarChart3, 
  BrainCircuit, 
  FileText, 
  LogOut, 
  Users, 
  ShieldCheck, 
  Megaphone,
  CheckSquare,
  ShieldAlert,
  Trees,
  RefreshCw,
  Sparkles
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { currentRole, loginAsRole } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  let portalTitle = 'Super Admin Portal';
  let navItems = [];

  if (currentRole === 'super_admin') {
    portalTitle = 'Super Admin Portal';
    navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'crop-monitoring', label: 'Crop Monitoring', icon: Sprout },
      { id: 'livestock-monitoring', label: 'Livestock Monitoring', icon: Binary },
      { id: 'analytics', label: 'Analytics', icon: BarChart3, secondaryId: 'decision-support' },
      { id: 'decision-support', label: 'Decision Support', icon: BrainCircuit, secondaryId: 'analytics' },
      { id: 'reports', label: 'Reports', icon: FileText },
    ];
  } else if (currentRole === 'admin') {
    portalTitle = 'Administrator Console';
    navItems = [
      { id: 'operations-dashboard', label: 'Operations Dashboard', icon: LayoutDashboard },
      { id: 'user-accounts', label: 'User Accounts', icon: Users },
      { id: 'member-records', label: 'Member Records', icon: Users },
      { id: 'roles-permissions', label: 'Roles & Permissions', icon: ShieldCheck },
      { id: 'announcements', label: 'Announcements', icon: Megaphone },
      { id: 'reports', label: 'Reports', icon: FileText },
    ];
  } else if (currentRole === 'farm_staff') {
    portalTitle = 'Farm Staff Validation';
    navItems = [
      { id: 'operations-dashboard', label: 'Operations Dashboard', icon: LayoutDashboard },
      { id: 'activity-validation', label: 'Activity Validation', icon: CheckSquare },
      { id: 'ml-audit', label: 'ML Audit & Risk', icon: ShieldAlert },
      { id: 'crop-management', label: 'Crop Management', icon: Trees },
      { id: 'livestock-management', label: 'Livestock Management', icon: Binary },
      { id: 'reports', label: 'Reports', icon: FileText },
    ];
  }

  return (
    <aside className="sidebar-nav">
      <div>
        {/* Brand Header matching Screenshot 2 & Images 2, 4, 5 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', paddingLeft: '4px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem'
          }}>
            🌱
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', lineHeight: 1.1 }}>
              MARIKHA
            </h2>
            <div style={{ fontSize: '0.68rem', color: '#86efac', fontWeight: '500' }}>
              {portalTitle}
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.secondaryId && (activeTab === item.id || activeTab === item.secondaryId));
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#ffffff' : '#a7f3d0',
                  background: isActive ? '#175429' : 'transparent',
                  border: isActive ? '1px solid #23733b' : '1px solid transparent',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={17} color={isActive ? '#ffffff' : '#a7f3d0'} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px', position: 'relative' }}>
        {/* Role Switcher Menu Trigger */}
        <button
          onClick={() => setShowRoleMenu(!showRoleMenu)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '8px 12px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.08)',
            color: '#a7f3d0',
            fontSize: '0.75rem',
            fontWeight: '600',
            marginBottom: '8px'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={12} /> Switch Dashboard
          </span>
          <span>▲</span>
        </button>

        {/* Role Switch Popup */}
        {showRoleMenu && (
          <div style={{
            position: 'absolute',
            bottom: '80px',
            left: '0',
            right: '0',
            background: '#0a2e15',
            border: '1px solid #23733b',
            borderRadius: '10px',
            padding: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            zIndex: 200
          }}>
            <button
              onClick={() => { loginAsRole('super_admin'); setShowRoleMenu(false); }}
              style={{ padding: '8px', borderRadius: '6px', textAlign: 'left', color: '#fff', fontSize: '0.78rem', fontWeight: currentRole === 'super_admin' ? '700' : '400' }}
            >
              👑 Super Admin Portal
            </button>
            <button
              onClick={() => { loginAsRole('admin'); setShowRoleMenu(false); }}
              style={{ padding: '8px', borderRadius: '6px', textAlign: 'left', color: '#fff', fontSize: '0.78rem', fontWeight: currentRole === 'admin' ? '700' : '400' }}
            >
              ⚙️ Administrator Console
            </button>
            <button
              onClick={() => { loginAsRole('farm_staff'); setShowRoleMenu(false); }}
              style={{ padding: '8px', borderRadius: '6px', textAlign: 'left', color: '#fff', fontSize: '0.78rem', fontWeight: currentRole === 'farm_staff' ? '700' : '400' }}
            >
              🌾 Farm Staff Validation
            </button>
            <button
              onClick={() => { loginAsRole('mobile_app'); setShowRoleMenu(false); }}
              style={{ padding: '8px', borderRadius: '6px', textAlign: 'left', color: '#fff', fontSize: '0.78rem', fontWeight: currentRole === 'mobile_app' ? '700' : '400' }}
            >
              📱 Farm Mobile App View
            </button>
          </div>
        )}

        {/* Sign Out Link */}
        <button
          onClick={() => loginAsRole('login')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 12px',
            color: '#a7f3d0',
            fontSize: '0.85rem',
            fontWeight: '500',
            opacity: 0.9,
            width: '100%'
          }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
