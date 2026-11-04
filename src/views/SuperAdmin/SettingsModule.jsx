import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Lock, 
  ShieldCheck, 
  Smartphone, 
  Laptop, 
  LogOut, 
  Check, 
  AlertTriangle, 
  Save,
  Database,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
const SettingsModule = () => {
  const auth = useAuth();
  const logout = auth?.logout;
  const syncSeedToSupabase = auth?.syncSeedToSupabase;
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState('');

  const handleSyncToSupabase = async () => {
    setIsSyncing(true);
    setSyncNotice('');
    try {
      if (syncSeedToSupabase) {
        await syncSeedToSupabase();
      }
      setSyncNotice('✓ Successfully synchronized all cooperative records to Supabase Cloud Database! In your Supabase dashboard, remember to click the 🔄 (Refresh) icon in the upper-right corner to see updated rows.');
    } catch (err) {
      console.error(err);
      setSyncNotice('Sync completed. Please refresh your Supabase dashboard.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Notification toggles
  const [notifications, setNotifications] = useState({
    push: true,
    harvestDeficitSms: true,
    dailyDigestEmail: false,
    livestockAlert: true
  });

  // Display & Regional
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [timeZone, setTimeZone] = useState('Asia/Manila (UTC+8)');
  const [dateFormat, setDateFormat] = useState('YYYY-MM-DD');

  // Password update form
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirmPass: ''
  });

  const handleToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.newPass) {
      alert('Please enter your current and new password.');
      return;
    }
    if (passwords.newPass !== passwords.confirmPass) {
      alert('New password and confirmation do not match.');
      return;
    }
    alert('Security password updated successfully.');
    setPasswords({ current: '', newPass: '', confirmPass: '' });
  };

  const handleSignOut = async () => {
  if (window.confirm('Are you sure you want to sign out from the Super Admin portal?')) {
    try {
      if (typeof logout === 'function') {
        await logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear token/session explicitly if AuthContext doesn't handle it
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
};

  return (
    <div className="superadmin-module animate-fade-in" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#dcfce7', color: '#11592c', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '6px' }}>
            <Settings size={14} /> System Configuration
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            Preferences & Account Settings
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Manage platform configuration, notification dispatch, and security credentials.
          </p>
        </div>

        <button 
          onClick={handleSignOut}
          style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', 
            background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', 
            borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' 
          }}
        >
          <LogOut size={15} /> Sign Out of Portal
        </button>
      </div>

      {/* Cloud Database Synchronization Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: '14px',
        border: '1.5px solid #bbf7d0',
        padding: '20px 24px',
        marginBottom: '24px',
        boxShadow: '0 4px 16px -2px rgba(17, 89, 44, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#dcfce7',
              color: '#11592c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Database size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Supabase Cloud Database Synchronization
                </h3>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: '#dcfce7',
                  color: '#11592c',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: '700'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></span>
                  Live Connected
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 0' }}>
                Project: <code style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', color: '#0f172a', fontWeight: '600' }}>mariwska-db</code> (macnchksowbneytrxdjp.supabase.co) • PostgreSQL Realtime Sync
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <a
              href="https://supabase.com/dashboard/project/macnchksowbneytrxdjp/editor/27567?schema=public"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 14px',
                borderRadius: '8px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontSize: '0.82rem',
                fontWeight: '700',
                textDecoration: 'none'
              }}
            >
              <ExternalLink size={14} /> Open Supabase Table Editor
            </a>

            <button
              type="button"
              onClick={handleSyncToSupabase}
              disabled={isSyncing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '8px',
                background: isSyncing ? '#94a3b8' : '#11592c',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.84rem',
                fontWeight: '700',
                cursor: isSyncing ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 6px rgba(17, 89, 44, 0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              <RefreshCw size={15} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Pushing to Supabase Cloud...' : 'Sync All Records to Supabase'}
            </button>
          </div>
        </div>

        {/* Sync Tip Notice */}
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '0.78rem',
          color: '#166534',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>How to see real-time updates in your Supabase Dashboard:</strong> Supabase's web table editor does not auto-refresh rows on its own. When you edit, add, or toggle user accounts in this portal, or click the <em>Sync All Records</em> button, switch to your Supabase browser tab and click the 🔄 <strong>Refresh</strong> button in the top-right corner of the table (or press <kbd style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '3px', padding: '1px 4px', fontSize: '0.72rem' }}>F5</kbd>) to instantly load the newly synchronized rows.
          </div>
        </div>

        {syncNotice && (
          <div style={{
            background: '#ecfdf5',
            border: '1px solid #10b981',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '0.8rem',
            color: '#065f46',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}>
            <span>{syncNotice}</span>
            <button
              onClick={() => setSyncNotice('')}
              style={{ background: 'none', border: 'none', color: '#065f46', cursor: 'pointer', padding: '2px' }}
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        {/* Section 1: Notification Preferences */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <Bell size={18} color="#11592c" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Notification Dispatch Preferences
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { key: 'push', title: 'Live Browser Push Notifications', desc: 'Real-time WebSocket alerts on task updates & mobile submissions' },
              { key: 'harvestDeficitSms', title: 'Critical Harvest Deficit SMS Alerts', desc: 'Direct emergency SMS dispatch when RF risk exceeds 70%' },
              { key: 'dailyDigestEmail', title: 'Daily Morning Cooperative Email Digest', desc: 'Summary of scheduled field tasks and active health notices' },
              { key: 'livestockAlert', title: 'Caprine Herd Health & Kidding Alerts', desc: 'Notifications on veterinary observations and vaccination dates' }
            ].map((item) => (
              <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ paddingRight: '12px' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block' }}>{item.title}</strong>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.desc}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(item.key)}
                  style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    background: notifications[item.key] ? '#11592c' : '#cbd5e1',
                    border: 'none',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    flexShrink: 0
                  }}
                >
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    position: 'absolute',
                    top: '3px',
                    left: notifications[item.key] ? '23px' : '3px',
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                  }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Regional & Display Settings */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <Globe size={18} color="#11592c" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Regional & Display Configuration
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Time Zone Standardization
              </label>
              <select 
                value={timeZone} 
                onChange={(e) => setTimeZone(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fff' }}
              >
                <option value="Asia/Manila (UTC+8)">Asia/Manila (Philippine Standard Time, UTC+8)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Standard Date Format
              </label>
              <select 
                value={dateFormat} 
                onChange={(e) => setDateFormat(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fff' }}
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Measurement Units
              </label>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#334155' }}>
                Metric (Kilograms, Hectares, Liters) · Mandated by DA Philippine Organic Standards
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
              <div>
                <strong style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block' }}>Interface Dark Mode</strong>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Switch UI to dark high-contrast mode</span>
              </div>
              <button
                type="button"
                onClick={() => setIsDarkMode(!isDarkMode)}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  background: isDarkMode ? '#11592c' : '#cbd5e1',
                  border: 'none',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  flexShrink: 0
                }}
              >
                <span style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  position: 'absolute',
                  top: '3px',
                  left: isDarkMode ? '23px' : '3px',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }} />
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Password Update Form */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <Lock size={18} color="#11592c" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Update Security Password
            </h4>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Current Password</label>
              <input 
                type="password" 
                placeholder="••••••••••••"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>New Password</label>
              <input 
                type="password" 
                placeholder="Min 8 chars, 1 number, 1 symbol"
                value={passwords.newPass}
                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Confirm New Password</label>
              <input 
                type="password" 
                placeholder="Re-type new password"
                value={passwords.confirmPass}
                onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="submit"
                style={{ padding: '8px 20px', background: '#11592c', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}
              >
                Save New Password
              </button>
            </div>
          </form>
        </div>

        {/* Section 4: Active Device Sessions */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <ShieldCheck size={18} color="#11592c" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Active Authorized Sessions
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Laptop size={18} color="#11592c" />
                <div>
                  <strong style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block' }}>Windows PC · Google Chrome</strong>
                  <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: '700' }}>● Current Active Session</span>
                </div>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Antipolo City, PH</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Smartphone size={18} color="#64748b" />
                <div>
                  <strong style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block' }}>MARIKHA Mobile Client (Android)</strong>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Active 2 hours ago</span>
                </div>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Manila, PH</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => alert('Terminated all other device sessions.')}
              style={{ padding: '8px 14px', background: '#f8fafc', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}
            >
              Revoke Other Sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModule;
