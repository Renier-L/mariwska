import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Cloud, UserCheck, Pencil, X, Megaphone, Bell, Send } from 'lucide-react';

const Header = () => {
  const { tenantInfo, currentUser, currentRole, updateProfile, publishAnnouncement } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [passInput, setPassInput] = useState('');

  // Announcement Modal State
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPush, setAnnPush] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  const canBroadcast = currentRole === 'super_admin' || currentRole === 'admin' || currentUser?.role === 'Executive' || currentUser?.role === 'Admin';


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

  const handlePublishAnnSubmit = async (e) => {
    e.preventDefault();
    if (!annContent.trim()) {
      alert('⚠️ Mangyaring mag-input muna ng announcement text!');
      return;
    }

    setIsPublishing(true);
    try {
      if (publishAnnouncement) {
        await publishAnnouncement({
          title: annTitle.trim() || 'Cooperative Broadcast Notice',
          content: annContent.trim(),
          instantPush: annPush
        });
      }
      alert('📢 Global Announcement Published Live & Instant Push Pop-Up Broadcasted across all connected clients!');
      setAnnTitle('');
      setAnnContent('');
      setShowAnnModal(false);
    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      setIsPublishing(false);
    }
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

      {/* Right User & Quick Actions info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Quick Announcement Push Button - Admin & Super Admin Only */}
        {canBroadcast && (
          <button
            onClick={() => setShowAnnModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '7px 16px',
              borderRadius: '20px',
              fontWeight: '700',
              fontSize: '0.78rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)',
              transition: 'all 0.15s ease'
            }}
            title="Publish Live Cooperative Broadcast & Instant Push Notice"
          >
            <Megaphone size={15} />
            📢 Broadcast Announcement
          </button>
        )}


        {/* Cloud sync · Live Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.75rem',
          color: '#15803d',
          background: '#dcfce7',
          padding: '6px 14px',
          borderRadius: '20px',
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

      {/* QUICK BROADCAST ANNOUNCEMENT POP-UP MODAL */}
      {showAnnModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000
        }}>
          <div className="m-card" style={{
            width: '100%', maxWidth: '500px', padding: '0', borderRadius: '20px',
            overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              padding: '20px 24px', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Megaphone size={22} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                    Publish Live Broadcast Announcement
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#fef3c7' }}>
                    Sends live pop-up push notification across web and mobile
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowAnnModal(false)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePublishAnnSubmit} style={{ padding: '24px', background: '#ffffff' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                  Notice Title
                </label>
                <input
                  type="text"
                  placeholder="Notice Title (e.g. Organic Fertilizer Advisory)"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                  Announcement Details / Content *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="I-type dito ang bagong abiso para sa mga magsasaka..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    lineHeight: 1.5
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: '700', color: '#334155' }}>
                  <Bell size={16} color="#d97706" /> Trigger Live Pop-Up Broadcast
                </div>
                <input
                  type="checkbox"
                  checked={annPush}
                  onChange={(e) => setAnnPush(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAnnModal(false)}
                  style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishing}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Send size={15} />
                  {isPublishing ? 'Publishing...' : '🚀 Send Live Push Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
