import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Lock, 
  ShieldCheck, 
  LogOut, 
  Eye, 
  EyeOff, 
  Save, 
  CheckCircle2,
  Clock,
  Laptop
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSettingsModule = () => {
  const { loginAsRole } = useAuth();

  // Notification Toggles
  const [inAppNotice, setInAppNotice] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [instantPush, setInstantPush] = useState(true);

  // Preference Toggles
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('Asia/Manila (UTC+8)');

  // Password State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState('');

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPass || !newPass) {
      alert('Please enter your current and new password.');
      return;
    }
    if (newPass !== confirmPass) {
      alert('New password and confirmation do not match.');
      return;
    }

    setPasswordNotice('Password changed successfully! Changes saved.');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => setPasswordNotice(''), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#111827', margin: '0 0 4px 0', letterSpacing: '-0.4px' }}>
          Settings & Preferences
        </h1>
        <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
          Configure administrative notification alerts, regional preferences, and account security.
        </p>
      </div>

      {passwordNotice && (
        <div style={{
          background: '#dcfce7',
          border: '1px solid #86efac',
          borderRadius: '10px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.8rem',
          fontWeight: '700',
          color: '#15803d'
        }}>
          <CheckCircle2 size={16} /> {passwordNotice}
        </div>
      )}

      {/* 2-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Notifications & Regional */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Notification Alerts */}
          <div className="m-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="#15803d" /> Notification Channels
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a', display: 'block' }}>In-App Toast Alerts</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Show toast alerts for member status changes and broadcasts</span>
                </div>
                <input
                  type="checkbox"
                  checked={inAppNotice}
                  onChange={(e) => setInAppNotice(e.target.checked)}
                  style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a', display: 'block' }}>Weekly Administrative Digest</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Receive weekly member summary to cooperative email</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailDigest}
                  onChange={(e) => setEmailDigest(e.target.checked)}
                  style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a', display: 'block' }}>Instant Broadcast Push</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Dispatch immediate browser push when creating announcements</span>
                </div>
                <input
                  type="checkbox"
                  checked={instantPush}
                  onChange={(e) => setInstantPush(e.target.checked)}
                  style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                />
              </div>
            </div>
          </div>

          {/* Regional & System Preferences */}
          <div className="m-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} color="#15803d" /> Regional & System Preferences
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '4px' }}>SYSTEM TIMEZONE</span>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.76rem', background: '#fff' }}
                >
                  <option value="Asia/Manila (UTC+8)">Philippine Standard Time (PST · UTC+8:00)</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                </select>
              </div>

              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '4px' }}>DISPLAY LANGUAGE</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.76rem', background: '#fff' }}
                >
                  <option value="English">English (Philippines)</option>
                  <option value="Filipino">Filipino / Tagalog</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Sessions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Account Password & Security */}
          <div className="m-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} color="#15803d" /> Account Security & Password
            </h3>

            <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                  Current Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '10px', top: '8px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                  New Password
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                  Confirm New Password
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Repeat new password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: '#11592c',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '4px'
                }}
              >
                <Save size={14} /> Update Password
              </button>
            </form>
          </div>

          {/* Active Session & Sign Out */}
          <div className="m-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Laptop size={18} color="#15803d" /> Active Administrative Session
            </h3>

            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a' }}>Web Portal · Chrome on Windows</span>
                <span style={{ fontSize: '0.68rem', fontWeight: '700', background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '4px' }}>
                  Current Session
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Antipolo City, Philippines · IP 120.29.74.x · Logged in today
              </span>
            </div>

            <button
              onClick={() => loginAsRole('login')}
              style={{
                background: '#fff1f2',
                color: '#e11d48',
                border: '1px solid #fecdd3',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%'
              }}
            >
              <LogOut size={15} /> Sign Out from Admin Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsModule;
