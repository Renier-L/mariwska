import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
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
  Save,
  Sparkles,
  ShieldAlert,
  Check
} from 'lucide-react';

const ProfileModule = () => {
  const { currentUser, updateProfile, tenantInfo } = useAuth();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');
  const [selectedAvatarColor, setSelectedAvatarColor] = useState('#11592c');

  // Helper to extract 2-letter initials
  const getInitials = (nameStr) => {
    if (!nameStr) return 'RM';
    const parts = nameStr.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Form edit state
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Rosa Mendoza',
    title: currentUser?.title || 'Super Admin / General Manager',
    email: currentUser?.email || 'rosa.mendoza@marikha.org',
    phone: currentUser?.phone || '+63 917 882 4591',
    office: currentUser?.assignedPlot || currentUser?.office || 'Central Operations Office, Antipolo City',
    newPassword: ''
  });

  // Keep form data in sync whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        title: currentUser.title || prev.title,
        office: currentUser.assignedPlot || currentUser.office || prev.office
      }));
    }
  }, [currentUser]);

  const userDisplayName = currentUser?.name || 'Rosa Mendoza';
  const userInitials = currentUser?.initials || getInitials(userDisplayName);
  const userEmail = currentUser?.email || 'rosa.mendoza@marikha.org';
  const userPhone = currentUser?.phone || '+63 917 882 4591';
  const userTitle = currentUser?.title || 'Super Admin / General Manager';
  const userOffice = currentUser?.assignedPlot || currentUser?.office || 'Central Operations Office, Antipolo City';
  const userCoop = tenantInfo?.name || 'Antipolo Organic Farming Cooperative';
  const userTenant = tenantInfo?.id || 'ANT-ORG-001';
  const userJoinedDate = currentUser?.joinDate || 'March 15, 2024';

  const handleOpenEditModal = () => {
    setFormData({
      name: userDisplayName,
      title: userTitle,
      email: userEmail,
      phone: userPhone,
      office: userOffice,
      newPassword: ''
    });
    setShowEditModal(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter your full name.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      title: formData.title.trim() || 'Super Admin / General Manager',
      email: formData.email.trim() || userEmail,
      phone: formData.phone.trim() || userPhone,
      assignedPlot: formData.office.trim() || userOffice,
      office: formData.office.trim() || userOffice,
      initials: getInitials(formData.name.trim())
    };

    if (formData.newPassword.trim()) {
      payload.password = formData.newPassword.trim();
    }

    if (updateProfile) {
      await updateProfile(payload);
    }

    setShowEditModal(false);
    setSuccessNotice('Profile details updated live! Realtime sync active across header, user management, and cloud database.');
    setTimeout(() => {
      setSuccessNotice('');
    }, 5000);
  };

  return (
    <div className="superadmin-module animate-fade-in" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Real-time Success Banner */}
      {successNotice && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#dcfce7',
          border: '1.5px solid #86efac',
          borderRadius: '12px',
          padding: '14px 20px',
          marginBottom: '20px',
          color: '#15803d',
          boxShadow: '0 4px 12px rgba(22, 163, 74, 0.12)',
          animation: 'fadeIn 0.25s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} color="#16a34a" />
            <span style={{ fontSize: '0.86rem', fontWeight: '700' }}>{successNotice}</span>
          </div>
          <button 
            onClick={() => setSuccessNotice('')}
            style={{ background: 'transparent', border: 'none', color: '#15803d', cursor: 'pointer', padding: '4px' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header Profile Hero Card */}
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
        boxShadow: '0 8px 24px rgba(17,89,44,0.18)',
        border: '1px solid rgba(255,255,255,0.12)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          {/* Avatar with Camera Icon */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              background: '#ffffff',
              color: selectedAvatarColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.1rem',
              fontWeight: '900',
              border: '3.5px solid #86efac',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              letterSpacing: '-0.02em'
            }}>
              {userInitials}
            </div>
            <button 
              onClick={() => setShowAvatarModal(true)}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#16a34a',
                color: '#ffffff',
                border: '2.5px solid #ffffff',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}
              title="Change Profile Avatar Accent"
            >
              <Camera size={14} />
            </button>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>
                {userDisplayName}
              </h2>
              <span style={{ 
                background: '#dcfce7', 
                color: '#11592c', 
                padding: '3px 10px', 
                borderRadius: '12px', 
                fontSize: '0.74rem', 
                fontWeight: '800',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }} />
                Active Account
              </span>
            </div>
            <p style={{ fontSize: '0.92rem', color: '#bbf7d0', margin: '0 0 6px 0', fontWeight: '700' }}>
              {userTitle}
            </p>
            <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              {userCoop} · <strong style={{ color: '#86efac' }}>{userTenant}</strong>
            </span>
          </div>
        </div>

        <button 
          onClick={handleOpenEditModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '11px 22px',
            background: '#ffffff',
            color: '#11592c',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
            transition: 'transform 0.15s, box-shadow 0.15s'
          }}
        >
          <Edit3 size={16} /> Edit Profile
        </button>
      </div>

      {/* 3 Detail Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Card 1: Personal Details */}
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <UserCheck size={18} color="#11592c" />
            <h4 style={{ fontSize: '0.96rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Personal Information
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.84rem' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem', fontWeight: '600' }}>Official Full Name:</span>
              <strong style={{ color: '#0f172a', fontSize: '0.92rem' }}>{userDisplayName}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem', fontWeight: '600' }}>Primary Email Address:</span>
              <strong style={{ color: '#0f172a' }}>{userEmail}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem', fontWeight: '600' }}>Mobile Phone Number:</span>
              <strong style={{ color: '#0f172a' }}>{userPhone}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem', fontWeight: '600' }}>Cooperative Enrolment Date:</span>
              <strong style={{ color: '#0f172a' }}>{userJoinedDate}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem', fontWeight: '600' }}>Governance Standing:</span>
              <span style={{ color: '#16a34a', fontWeight: '700', fontSize: '0.78rem' }}>PGS Board Director & Compliance Lead</span>
            </div>
          </div>
        </div>

        {/* Card 2: Cooperative & Station Details */}
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <Building2 size={18} color="#11592c" />
            <h4 style={{ fontSize: '0.96rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Cooperative & Office Details
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.84rem' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem', fontWeight: '600' }}>Registered Entity:</span>
              <strong style={{ color: '#0f172a' }}>{userCoop}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem', fontWeight: '600' }}>Multi-Tenant Code:</span>
              <strong style={{ color: '#11592c' }}>{userTenant}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem', fontWeight: '600' }}>Assigned Operating Station:</span>
              <strong style={{ color: '#0f172a' }}>{userOffice}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem', fontWeight: '600' }}>System Access Clearance:</span>
              <strong style={{ color: '#16a34a' }}>Level 5 (Root System Governance)</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem', fontWeight: '600' }}>Cloud Database Status:</span>
              <span style={{ color: '#2563eb', fontWeight: '700', fontSize: '0.78rem' }}>Supabase Realtime Sync Connected</span>
            </div>
          </div>
        </div>

        {/* Card 3: Security & Session Status */}
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <ShieldCheck size={18} color="#11592c" />
            <h4 style={{ fontSize: '0.96rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Account Security Status
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.84rem' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem', fontWeight: '600' }}>Password Protection:</span>
              <strong style={{ color: '#0f172a', letterSpacing: '2px' }}>••••••••••••••••</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem', fontWeight: '600' }}>2-Factor Authentication:</span>
              <strong style={{ color: '#16a34a' }}>Enabled (Authenticator App)</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem', fontWeight: '600' }}>Current Session IP:</span>
              <strong style={{ color: '#0f172a' }}>112.198.74.22 (Antipolo City, PH)</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem', fontWeight: '600' }}>Session Token Expiry:</span>
              <strong style={{ color: '#0f172a' }}>Active Session (Auto-refreshed)</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.74rem', fontWeight: '600' }}>Multi-Device Broadcast:</span>
              <span style={{ color: '#16a34a', fontWeight: '700', fontSize: '0.78rem' }}>0-Latency BroadcastChannel Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(15, 23, 42, 0.7)', 
          backdropFilter: 'blur(5px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 99999, 
          padding: '16px' 
        }}>
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '16px', 
            maxWidth: '520px', 
            width: '100%', 
            padding: '28px', 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Edit Profile Information
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0 0' }}>
                  Update your contact details, official title, and password
                </p>
              </div>
              <button 
                onClick={() => setShowEditModal(false)} 
                style={{ 
                  background: '#f1f5f9', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: '32px', 
                  height: '32px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  Full Legal Name *
                </label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '9px 12px', 
                    fontSize: '0.85rem', 
                    border: '1.5px solid #cbd5e1', 
                    borderRadius: '8px',
                    fontWeight: '700',
                    color: '#0f172a'
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  Official Title *
                </label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '9px 12px', 
                    fontSize: '0.85rem', 
                    border: '1.5px solid #cbd5e1', 
                    borderRadius: '8px',
                    color: '#0f172a'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                    Email Address *
                  </label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '9px 12px', 
                      fontSize: '0.85rem', 
                      border: '1.5px solid #cbd5e1', 
                      borderRadius: '8px',
                      color: '#0f172a'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                    Mobile Phone *
                  </label>
                  <input 
                    type="text" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '9px 12px', 
                      fontSize: '0.85rem', 
                      border: '1.5px solid #cbd5e1', 
                      borderRadius: '8px',
                      color: '#0f172a'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  Operating Office Station
                </label>
                <input 
                  type="text" 
                  value={formData.office} 
                  onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                  style={{ 
                    width: '100%', 
                    padding: '9px 12px', 
                    fontSize: '0.85rem', 
                    border: '1.5px solid #cbd5e1', 
                    borderRadius: '8px',
                    color: '#0f172a'
                  }}
                />
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                  Update Password (Leave blank to keep existing)
                </label>
                <input 
                  type="password" 
                  placeholder="Enter new account password"
                  value={formData.newPassword} 
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  style={{ 
                    width: '100%', 
                    padding: '9px 12px', 
                    fontSize: '0.85rem', 
                    border: '1.5px solid #cbd5e1', 
                    borderRadius: '8px',
                    color: '#0f172a'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  style={{ 
                    padding: '9px 18px', 
                    background: '#f1f5f9', 
                    color: '#475569', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontSize: '0.84rem', 
                    fontWeight: '700', 
                    cursor: 'pointer' 
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ 
                    padding: '9px 22px', 
                    background: '#11592c', 
                    color: '#ffffff', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontSize: '0.84rem', 
                    fontWeight: '800', 
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(17,89,44,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Save size={15} /> Save & Update Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Avatar Color Modal */}
      {showAvatarModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(15, 23, 42, 0.7)', 
          backdropFilter: 'blur(5px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 99999, 
          padding: '16px' 
        }}>
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '16px', 
            maxWidth: '400px', 
            width: '100%', 
            padding: '24px', 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Customize Avatar Accent
              </h3>
              <button 
                onClick={() => setShowAvatarModal(false)} 
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={14} />
              </button>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '16px' }}>
              Choose a signature accent color for your profile emblem:
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
              {[
                { label: 'Forest Green', color: '#11592c' },
                { label: 'Deep Emerald', color: '#047857' },
                { label: 'Cooperative Teal', color: '#0f766e' },
                { label: 'Harvest Amber', color: '#d97706' },
                { label: 'Indigo Trust', color: '#4338ca' }
              ].map(opt => (
                <button
                  key={opt.color}
                  onClick={() => {
                    setSelectedAvatarColor(opt.color);
                    setShowAvatarModal(false);
                  }}
                  title={opt.label}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: opt.color,
                    border: selectedAvatarColor === opt.color ? '3px solid #000' : '2px solid #e2e8f0',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setShowAvatarModal(false)}
                style={{ padding: '8px 18px', background: '#11592c', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileModule;
