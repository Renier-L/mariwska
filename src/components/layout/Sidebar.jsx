import React from 'react';
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
  Trees
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { currentRole, loginAsRole } = useAuth();

  let portalTitle = 'Super Admin Portal';
  let navItems = [];

  if (currentRole === 'super_admin') {
    portalTitle = 'Super Admin Portal';
    navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'crop-monitoring', label: 'Crop Monitoring', icon: Sprout },
      { id: 'livestock-monitoring', label: 'Livestock Monitoring', icon: Binary },
      { id: 'analytics', label: 'Analytics & Intelligence', icon: BarChart3 },
      { id: 'decision-support', label: 'Decision Support Engine', icon: BrainCircuit },
      { id: 'reports', label: 'Reports & Compliance', icon: FileText },
    ];
  } else if (currentRole === 'admin') {
    portalTitle = 'Administrator Console';
    navItems = [
      { id: 'operations-dashboard', label: 'Operations Dashboard', icon: LayoutDashboard },
      { id: 'user-accounts', label: 'User Accounts', icon: Users },
      { id: 'member-records', label: 'Member Directory', icon: Users },
      { id: 'roles-permissions', label: 'Roles & Permissions', icon: ShieldCheck },
      { id: 'announcements', label: 'Announcements Push', icon: Megaphone },
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
        {/* Brand Header matching MARIKHA branding */}
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
            const isActive = activeTab === item.id;
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

      {/* Bottom Footer Section: Clean Sign Out Button */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px' }}>
        <button
          onClick={() => loginAsRole('login')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '10px',
            color: '#a7f3d0',
            fontSize: '0.85rem',
            fontWeight: '600',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            width: '100%',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
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
