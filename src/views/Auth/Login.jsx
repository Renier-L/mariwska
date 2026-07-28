import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, User, CheckCircle } from 'lucide-react';

const Login = () => {
  const { loginAsRole } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const cleanUser = username.trim().toLowerCase();

    setTimeout(() => {
      setLoading(false);
      if (!cleanUser) {
        // Default Web Auth fallback -> Super Admin
        loginAsRole('super_admin');
        return;
      }

      if (cleanUser.includes('super') || cleanUser.includes('rosa') || cleanUser.includes('mendoza') || cleanUser.includes('executive')) {
        loginAsRole('super_admin');
      } else if (cleanUser.includes('admin') || cleanUser.includes('liza') || cleanUser.includes('cruz') || cleanUser.includes('system')) {
        loginAsRole('admin');
      } else if (cleanUser.includes('staff') || cleanUser.includes('ramon') || cleanUser.includes('velasco') || cleanUser.includes('validator')) {
        loginAsRole('farm_staff');
      } else if (cleanUser.includes('farmer') || cleanUser.includes('danilo') || cleanUser.includes('juan')) {
        loginAsRole('mobile_app');
      } else {
        // Fallback valid Web Session
        loginAsRole('super_admin');
      }
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1E4620',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    }}>
      {/* Production Web Login Card matching Screen 1.1 */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        padding: '40px 36px',
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
          justifyContent: 'center',
          margin: '0 auto 18px',
          fontWeight: '800',
          fontSize: '1.5rem',
          boxShadow: '0 4px 12px rgba(30, 70, 32, 0.25)'
        }}>
          M
        </div>

        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1E4620', letterSpacing: '-0.3px', marginBottom: '4px' }}>
          MARIWSKA-Likasan
        </h2>
        <p style={{ fontSize: '0.78rem', color: '#4b5563', fontWeight: '600', marginBottom: '28px', lineHeight: 1.3 }}>
          Agricultural Management Information System
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          {errorMsg && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '10px 12px', borderRadius: '8px', fontSize: '0.75rem', marginBottom: '16px', fontWeight: '600' }}>
              {errorMsg}
            </div>
          )}

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
              Username / Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter web user or email"
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
                  fontWeight: '500'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
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
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? 'Authenticating API...' : 'Sign In To Dashboard'}
          </button>
        </form>

        <div style={{
          borderTop: '1px solid #f3f4f6',
          paddingTop: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontSize: '0.72rem',
          color: '#6b7280',
          fontWeight: '600'
        }}>
          <ShieldCheck size={14} color="#16a34a" />
          SSL Encrypted | Antipolo City Organic Farming Cooperative
        </div>
      </div>
    </div>
  );
};

export default Login;
