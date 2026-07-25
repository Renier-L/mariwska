import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Cloud } from 'lucide-react';

const Header = () => {
  const { tenantInfo, currentUser } = useAuth();

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px 40px 0px 40px',
      background: 'transparent',
      fontSize: '0.85rem'
    }}>
      {/* Left Tenant Info matching screenshots */}
      <div>
        <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', lineHeight: 1.2 }}>
          {tenantInfo.name}
        </h4>
        <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
          Tenant · {tenantInfo.id}
        </span>
      </div>

      {/* Right User & Cloud Sync info matching screenshots */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Cloud sync · Live Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.75rem',
          color: '#15803d',
          background: '#dcfce7',
          padding: '4px 12px',
          borderRadius: '16px',
          fontWeight: '600',
          border: '1px solid #86efac'
        }}>
          <Cloud size={14} />
          {tenantInfo.status}
        </div>

        {/* User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ textAlign: 'right', leading: 1.1 }}>
            <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#111827' }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>
              {currentUser.role}
            </div>
          </div>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: '#0c3619',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '0.8rem'
          }}>
            {currentUser.initials}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
