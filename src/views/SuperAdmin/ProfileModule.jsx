import React, { useState } from 'react';
import { 
  UserCheck, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Building2, 
  Camera, 
  Edit3, 
  Lock, 
  Key, 
  CheckCircle2, 
  Calendar, 
  X, 
  Save 
} from 'lucide-react';

const ProfileModule = () => {
  const [profile, setProfile] = useState({
    name: 'Rosa Mendoza',
    title: 'Super Admin / General Manager',
    email: 'rosa.mendoza@marikha.org',
    phone: '+63 917 882 4591',
    cooperative: 'Antipolo Organic Farming Cooperative',
    tenantCode: 'ANT-ORG-001',
    office: 'Central Operations Office, Antipolo City',
    accessLevel: 'Level 5 (Root System Governance)',
    joinedDate: 'March 15, 2024',
    twoFactor: 'Enabled (Authenticator App)'
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ ...profile });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile({ ...editFormData });
    setShowEditModal(false);
    alert('Profile information updated successfully.');
  };

  return (
    <div className="superadmin-module animate-fade-in" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Profile Card */}
      <div style={{
        background: 'linear-gradient(135deg, #11592c 0%, #0c3619 100%)',
        borderRadius: '16px',
        padding: '32px',
        color: '#ffffff',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 4px 12px rgba(17,89,44,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Avatar with Camera Icon */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: '#ffffff',
              color: '#11592c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: '800',
              border: '3px solid #86efac'
            }}>
              RM
            </div>
            <button 
              onClick={() => alert('Change profile avatar photo')}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#16a34a',
                color: '#ffffff',
                border: '2px solid #ffffff',
                borderRadius: '50%',
                width: '26px',
                height: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Upload New Photo"
            >
              <Camera size={13} />
            </button>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>
                {profile.name}
              </h2>
              <span style={{ background: '#dcfce7', color: '#11592c', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '800' }}>
                Active Account
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#bbf7d0', margin: '0 0 4px 0', fontWeight: '600' }}>
              {profile.title}
            </p>
            <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
              {profile.cooperative} · {profile.tenantCode}
            </span>
          </div>
        </div>

        <button 
          onClick={() => { setEditFormData({ ...profile }); setShowEditModal(true); }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: '#ffffff',
            color: '#11592c',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <Edit3 size={15} /> Edit Profile
        </button>
      </div>

      {/* 3 Detail Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Card 1: Personal Details */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <UserCheck size={18} color="#11592c" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Personal Information
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.82rem' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem' }}>Official Full Name:</span>
              <strong style={{ color: '#0f172a' }}>{profile.name}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem' }}>Primary Email Address:</span>
              <strong style={{ color: '#0f172a' }}>{profile.email}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem' }}>Mobile Phone Number:</span>
              <strong style={{ color: '#0f172a' }}>{profile.phone}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem' }}>Cooperative Enrolment Date:</span>
              <strong style={{ color: '#0f172a' }}>{profile.joinedDate}</strong>
            </div>
          </div>
        </div>

        {/* Card 2: Cooperative & Station Details */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <Building2 size={18} color="#11592c" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Cooperative & Office Details
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.82rem' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem' }}>Registered Entity:</span>
              <strong style={{ color: '#0f172a' }}>{profile.cooperative}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem' }}>Multi-Tenant Code:</span>
              <strong style={{ color: '#11592c' }}>{profile.tenantCode}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem' }}>Assigned Operating Station:</span>
              <strong style={{ color: '#0f172a' }}>{profile.office}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem' }}>System Access Clearance:</span>
              <strong style={{ color: '#16a34a' }}>{profile.accessLevel}</strong>
            </div>
          </div>
        </div>

        {/* Card 3: Security & Session Status */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <ShieldCheck size={18} color="#11592c" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Account Security Status
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.82rem' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem' }}>Password Hash:</span>
              <strong style={{ color: '#0f172a', letterSpacing: '2px' }}>••••••••••••••••</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem' }}>2-Factor Authentication:</span>
              <strong style={{ color: '#16a34a' }}>{profile.twoFactor}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem' }}>Current Session IP:</span>
              <strong style={{ color: '#0f172a' }}>112.198.74.22 (Antipolo City, PH)</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem' }}>Session Token Expiry:</span>
              <strong style={{ color: '#0f172a' }}>In 7 days (Auto-refreshed)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Edit Profile Information</h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0 0' }}>Update contact information and official title</p>
              </div>
              <button onClick={() => setShowEditModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Full Name</label>
                <input 
                  type="text" 
                  value={editFormData.name} 
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Official Title</label>
                <input 
                  type="text" 
                  value={editFormData.title} 
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Email Address</label>
                  <input 
                    type="email" 
                    value={editFormData.email} 
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Mobile Phone</label>
                  <input 
                    type="text" 
                    value={editFormData.phone} 
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Operating Office Station</label>
                <input 
                  type="text" 
                  value={editFormData.office} 
                  onChange={(e) => setEditFormData({ ...editFormData, office: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  style={{ padding: '8px 16px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '8px 20px', background: '#11592c', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileModule;
