import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, UserCheck, Smartphone, Lock } from 'lucide-react';

const Login = () => {
  const { loginAsRole } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  // Web Portal accounts strictly for Super Admin, Admin, and Farm Staff
  const webAccounts = [
    { name: 'Rosa Mendoza', role: 'Super Admin', user: 'rosa@mariwska.coop', pass: 'password123', roleKey: 'super_admin' },
    { name: 'Liza Cruz', role: 'Administrator', user: 'liza@mariwska.coop', pass: 'password123', roleKey: 'admin' },
    { name: 'Ramon Velasco', role: 'Farm Staff', user: 'ramon@mariwska.coop', pass: 'password123', roleKey: 'farm_staff' },
  ];

  const handleSelectQuickAccount = (acc) => {
    setUsername(acc.user);
    setPassword(acc.pass);
    setErrorMsg('');
    setInfoMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setLoading(true);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    setTimeout(() => {
      setLoading(false);

      if (cleanPass !== 'password123' && cleanPass.length < 4) {
        setErrorMsg('Invalid password! Default system password is password123');
        return;
      }

      // STRICT ROLE ROUTING ENFORCEMENT
      if (cleanUser.includes('farmer') || cleanUser.includes('juan') || cleanUser.includes('maria') || cleanUser.includes('pedro') || cleanUser.includes('glenda') || cleanUser.includes('danilo')) {
        setErrorMsg('📱 Farmer accounts access MARIKHA via the React Native Android Mobile App. Web Portal access is strictly reserved for Cooperative Staff & Admins!');
        setInfoMsg('Please launch the React Native Mobile App in /mobile-app to log in as a Farmer.');
        return;
      }

      if (cleanUser.includes('super') || cleanUser.includes('rosa') || cleanUser.includes('mendoza') || cleanUser.includes('executive')) {
        loginAsRole('super_admin');
      } else if (cleanUser.includes('admin') || cleanUser.includes('liza') || cleanUser.includes('cruz') || cleanUser.includes('system')) {
        loginAsRole('admin');
      } else if (cleanUser.includes('staff') || cleanUser.includes('ramon') || cleanUser.includes('velasco') || cleanUser.includes('validator')) {
        loginAsRole('farm_staff');
      } else {
        // Default to Super Admin for unrecognized web credentials
        loginAsRole('super_admin');
      }
    }, 400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1E4620',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justify: 'center',
      padding: '24px',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    }}>
      {/* Production Web Login Card for MARIKHA */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '430px',
        padding: '36px 32px',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Circle Emblem Logo */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#1E4620',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          margin: '0 auto 16px',
          fontWeight: '800',
          fontSize: '1.5rem',
          boxShadow: '0 4px 12px rgba(30, 70, 32, 0.25)'
        }}>
          M
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1E4620', letterSpacing: '-0.3px', marginBottom: '2px' }}>
          MARIKHA WEB PORTAL
        </h2>
        <p style={{ fontSize: '0.78rem', color: '#4b5563', fontWeight: '600', marginBottom: '20px', lineHeight: 1.3 }}>
          Cooperative Management & Staff Validation System
        </p>

        {/* Web Portal Allowed Roles Badge */}
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '12px', marginBottom: '20px', textAlign: 'left' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <UserCheck size={14} /> Web Portal Authorized User Profiles
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {webAccounts.map(acc => (
              <button
                key={acc.name}
                type="button"
                onClick={() => handleSelectQuickAccount(acc)}
                style={{
                  background: username === acc.user ? '#166534' : '#ffffff',
                  color: username === acc.user ? '#ffffff' : '#1e293b',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '8px 6px',
                  fontSize: '0.68rem',
                  fontWeight: '700',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: '800' }}>{acc.name.split(' ')[0]}</div>
                <div style={{ fontSize: '0.62rem', opacity: 0.85 }}>{acc.role}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          {errorMsg && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '12px', borderRadius: '10px', fontSize: '0.78rem', marginBottom: '16px', fontWeight: '600', lineHeight: 1.4 }}>
              {errorMsg}
            </div>
          )}

          {infoMsg && (
            <div style={{ background: '#eff6ff', border: '1px solid #93c5fd', color: '#1e40af', padding: '10px 12px', borderRadius: '8px', fontSize: '0.75rem', marginBottom: '16px', fontWeight: '600' }}>
              {infoMsg}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
              Web User Email / Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. rosa@mariwska.coop"
              required
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                background: '#f9fafb',
                fontSize: '0.85rem',
                outline: 'none',
                color: '#111827',
                fontWeight: '600'
              }}
            />
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
              Password (Default: password123)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                background: '#f9fafb',
                fontSize: '0.85rem',
                outline: 'none',
                color: '#111827'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '10px',
              background: '#1E4620',
              color: '#ffffff',
              fontWeight: '800',
              fontSize: '0.92rem',
              border: 'none',
              cursor: loading ? 'wait' : 'pointer',
              marginBottom: '20px',
              transition: 'background 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '8px'
            }}
          >
            {loading ? 'Authenticating Staff Credentials...' : 'Sign In To Web Portal'}
          </button>
        </form>

        <div style={{
          borderTop: '1px solid #f3f4f6',
          paddingTop: '14px',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          gap: '6px',
          fontSize: '0.72rem',
          color: '#6b7280',
          fontWeight: '600'
        }}>
          <Smartphone size={14} color="#059669" />
          Farmers use React Native Mobile App · Web reserved for Staff & Admins
        </div>
      </div>
    </div>
  );
};

export default Login;
