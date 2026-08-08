import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Cloud, UserCheck, Pencil, X } from 'lucide-react';

const Header = () => {
  const { tenantInfo, currentUser, updateProfile } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [passInput, setPassInput] = useState('');

  const handleOpenModal = () => {
    if (!currentUser) return;
    setNameInput(currentUser.name || '');
    setPhoneInput(currentUser.phone || '+63 917 555 0100');
    setPassInput(currentUser.password || 'password123');
    setShowProfileModal(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    updateProfile({
      name: nameInput.trim(),
      phone: phoneInput.trim() || '+63 917 555 0100',
      password: passInput.trim() || 'password123'
    });

    alert('✅ Profile updated live! Your name and credentials have been synced across all modules and Supabase.');
    setShowProfileModal(false);
  };

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

        {/* User Profile Trigger Button */}
        <button
          onClick={handleOpenModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#ffffff',
            border: '1.5px solid #e2e8f0',
            padding: '6px 14px',
            borderRadius: '24px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'all 0.15s ease'
          }}
          title="Click to Edit My Profile & Name"
        >
          <div style={{ textAlign: 'right', lineHeight: 1.1 }}>
            <div style={{ fontWeight: '800', fontSize: '0.82rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {currentUser?.name || 'Ramon Bautista'} <Pencil size={11} color="#15803d" />
            </div>
            <div style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: '700' }}>
              {currentUser?.role || 'Farm Staff'}
            </div>
          </div>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0c3619 0%, #15803d 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '0.8rem'
          }}>
            {currentUser?.initials || (currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : 'FS')}
          </div>
        </button>
      </div>

      {/* EDIT MY PROFILE MODAL */}
      {showProfileModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000
        }}>
          <div className="m-card" style={{
            width: '100%', maxWidth: '440px', padding: '0', borderRadius: '20px',
            overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0c3619 0%, #15803d 100%)',
              padding: '20px 24px', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCheck size={20} color="#86efac" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>Edit My Profile</h3>
                  <span style={{ fontSize: '0.75rem', color: '#86efac' }}>Logged in as {currentUser.role}</span>
                </div>
              </div>
              <button onClick={() => setShowProfileModal(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '6px' }}>My Full Name</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', background: '#f8fafc', fontWeight: '700' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '6px' }}>Mobile Phone Number</label>
                <input
                  type="text"
                  required
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', background: '#f8fafc', fontWeight: '600' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '6px' }}>Password</label>
                <input
                  type="text"
                  required
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', background: '#f8fafc' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                <button type="button" onClick={() => setShowProfileModal(false)} style={{ borderRadius: '10px', padding: '10px 18px', fontWeight: '700', border: '1px solid #cbd5e1', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ borderRadius: '10px', padding: '10px 20px', fontWeight: '800', background: '#0c3619', color: '#ffffff', border: 'none', cursor: 'pointer' }}>✓ Save & Update Realtime</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
