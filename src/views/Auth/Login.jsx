import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Users, Smartphone, Sprout } from 'lucide-react';

const Login = () => {
  const { loginAsRole } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    loginAsRole('super_admin');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0c3619',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      {/* Login Card matching Screenshot 1 exactly */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '380px',
        padding: '36px 32px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Circle M Emblem Logo */}
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: '#11592c',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          fontWeight: '800',
          fontSize: '1.4rem'
        }}>
          M
        </div>

        <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#11592c', letterSpacing: '-0.3px', marginBottom: '2px' }}>
          MARIKHA
        </h2>
        <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', marginBottom: '24px' }}>
          Agricultural Management Information System
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin user"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: '#f3f4f6',
                fontSize: '0.82rem',
                outline: 'none',
                color: '#111827'
              }}
            />
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter account security key"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: '#f3f4f6',
                fontSize: '0.82rem',
                outline: 'none',
                color: '#111827'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: '#11592c',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '20px',
              transition: 'background 0.15s ease'
            }}
          >
            Sign In To Dashboard
          </button>
        </form>

        <p style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: '500' }}>
          Antipolo City Organic Farming Cooperative
        </p>
      </div>

      {/* Quick Role Switcher Bar */}
      <div style={{ marginTop: '28px', textAlign: 'center', maxWidth: '640px' }}>
        <p style={{ color: '#86efac', fontSize: '0.78rem', fontWeight: '700', marginBottom: '12px' }}>
          ✨ SELECT ROLE DASHBOARD TO LAUNCH DIRECTLY:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          <button
            onClick={() => loginAsRole('super_admin')}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '10px',
              padding: '10px 8px',
              color: '#ffffff',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <Shield size={18} color="#86efac" style={{ margin: '0 auto 4px' }} />
            <div style={{ fontWeight: '700', fontSize: '0.78rem' }}>Super Admin</div>
            <div style={{ fontSize: '0.68rem', color: '#a7f3d0' }}>Rosa Mendoza</div>
          </button>

          <button
            onClick={() => loginAsRole('admin')}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '10px',
              padding: '10px 8px',
              color: '#ffffff',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <Users size={18} color="#86efac" style={{ margin: '0 auto 4px' }} />
            <div style={{ fontWeight: '700', fontSize: '0.78rem' }}>Admin Console</div>
            <div style={{ fontSize: '0.68rem', color: '#a7f3d0' }}>Liza Cruz</div>
          </button>

          <button
            onClick={() => loginAsRole('farm_staff')}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '10px',
              padding: '10px 8px',
              color: '#ffffff',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <Sprout size={18} color="#86efac" style={{ margin: '0 auto 4px' }} />
            <div style={{ fontWeight: '700', fontSize: '0.78rem' }}>Farm Staff</div>
            <div style={{ fontSize: '0.68rem', color: '#a7f3d0' }}>Ramon Velasco</div>
          </button>

          <button
            onClick={() => loginAsRole('mobile_app')}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '10px',
              padding: '10px 8px',
              color: '#ffffff',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <Smartphone size={18} color="#86efac" style={{ margin: '0 auto 4px' }} />
            <div style={{ fontWeight: '700', fontSize: '0.78rem' }}>Farm Mobile App</div>
            <div style={{ fontSize: '0.68rem', color: '#a7f3d0' }}>Field Logger</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
