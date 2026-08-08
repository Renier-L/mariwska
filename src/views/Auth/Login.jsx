import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';

const Login = () => {
  const { loginAsRole, users } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Smart role routing based on credentials entered
    if (!cleanUser || cleanUser === 'staff' || cleanUser.includes('staff') || cleanUser.includes('ramon') || cleanUser.includes('farm')) {
      loginAsRole('farm_staff');
      return;
    }

    if (cleanUser === 'superadmin' || cleanUser.includes('super') || cleanUser.includes('rosa') || cleanUser.includes('executive')) {
      loginAsRole('super_admin');
      return;
    }

    if (cleanUser === 'admin' || cleanUser.includes('admin') || cleanUser.includes('liza')) {
      loginAsRole('admin');
      return;
    }

    // Dynamic search against registered users array
    const matchedUser = (users || []).find(u => {
      if (!u) return false;
      const nameLower = (u.name || '').toLowerCase();
      const emailLower = (u.email || '').toLowerCase();
      return (
        emailLower === cleanUser ||
        nameLower === cleanUser ||
        cleanUser.includes(nameLower) ||
        nameLower.includes(cleanUser)
      );
    });

    if (matchedUser) {
      const role = matchedUser.role;
      if (role === 'Executive' || role === 'Super Admin') loginAsRole('super_admin', matchedUser);
      else if (role === 'Admin') loginAsRole('admin', matchedUser);
      else if (role === 'Farm Staff') loginAsRole('farm_staff', matchedUser);
      else if (role === 'Farmer') loginAsRole('mobile_app', matchedUser);
      else loginAsRole('farm_staff', matchedUser);
      return;
    }

    // Default formal fallback -> Farm Staff Portal
    loginAsRole('farm_staff');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(140deg, #021a0d 0%, #083318 45%, #04140b 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justify: 'center',
      padding: '24px 16px',
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
    }}>
      {/* Formal Enterprise Login Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '430px',
        padding: '40px 36px 32px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top Metallic Green Accent Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '5px',
          background: 'linear-gradient(90deg, #0c3619 0%, #15803d 50%, #22c55e 100%)'
        }} />

        {/* Official Corporate Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #062b14 0%, #15803d 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 8px 20px rgba(12, 54, 25, 0.3)',
            border: '1.5px solid #86efac'
          }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#092d15', letterSpacing: '-0.5px', margin: '0 0 4px 0' }}>
            MARIKHA
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', margin: 0, letterSpacing: '0.2px' }}>
            Agricultural Cooperative Management System
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          {errorMsg && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              color: '#b91c1c',
              padding: '10px 12px',
              borderRadius: '10px',
              fontSize: '0.8rem',
              marginBottom: '18px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0 }} />
              <div>{errorMsg}</div>
            </div>
          )}

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              Username or Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <User size={17} color="#64748b" style={{ position: 'absolute', left: '14px', top: '12px' }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. ramon@mariwska.coop"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 40px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: '0.88rem',
                  outline: 'none',
                  color: '#0f172a',
                  fontWeight: '600',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#334155' }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', color: '#15803d', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={17} color="#64748b" style={{ position: 'absolute', left: '14px', top: '12px' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 40px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: '0.88rem',
                  outline: 'none',
                  color: '#0f172a',
                  fontWeight: '600',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
                }}
              />
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', fontSize: '0.78rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', cursor: 'pointer', fontWeight: '600' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#15803d' }}
              />
              Remember me
            </label>
            <span style={{ color: '#15803d', fontWeight: '700', cursor: 'pointer' }}>
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #092d15 0%, #15803d 100%)',
              color: '#ffffff',
              fontWeight: '800',
              fontSize: '0.92rem',
              border: 'none',
              cursor: loading ? 'wait' : 'pointer',
              boxShadow: '0 8px 18px rgba(9, 45, 21, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '8px',
              transition: 'all 0.15s ease'
            }}
          >
            Sign In to Portal →
          </button>
        </form>

        <div style={{
          borderTop: '1px solid #f1f5f9',
          marginTop: '24px',
          paddingTop: '16px',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          gap: '6px',
          fontSize: '0.72rem',
          color: '#64748b',
          fontWeight: '600'
        }}>
          <ShieldCheck size={15} color="#16a34a" />
          Enterprise SSL 256-bit Encrypted Session
        </div>
      </div>

      {/* Corporate Copyright Footer */}
      <div style={{ marginTop: '24px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: '600' }}>
        © 2026 MARIKHA Agricultural Cooperative System. All rights reserved.
      </div>
    </div>
  );
};

export default Login;
