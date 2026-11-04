import React, { useState } from 'react';
import { 
  UserCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Calendar, 
  ShieldCheck, 
  Lock, 
  Edit, 
  X, 
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

const AdminProfileModule = ({ currentUser = {} }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [phone, setPhone] = useState(currentUser.phone || '+63 917 555 0102');
  const [emergencyContact, setEmergencyContact] = useState(currentUser.emergencyContact || 'Mark Cruz (+63 918 333 4444)');
  const [bio, setBio] = useState('Administrative IT/HR Lead overseeing cooperative member records, user access governance, and field communication pipelines.');

  const adminName = currentUser.name || 'Danilo Cruz';
  const adminEmail = currentUser.email || 'danilo.cruz@marikha.org';
  const adminRole = 'Admin IT/HR';
  const adminId = 'ADM-2023-002';

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setShowEditModal(false);
    alert('Profile updated successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#111827', margin: '0 0 4px 0', letterSpacing: '-0.4px' }}>
            My Profile
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
            Manage your personal profile, cooperative credentials, and administrative account details.
          </p>
        </div>

        <button
          onClick={() => setShowEditModal(true)}
          style={{
            background: '#11592c',
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '0.82rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(17,89,44,0.2)'
          }}
        >
          <Edit size={16} /> Edit Profile
        </button>
      </div>

      {/* Main Profile Overview Hero Card */}
      <div className="m-card" style={{ padding: '24px', borderLeft: '4px solid #11592c' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: '#11592c',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            fontWeight: '800',
            boxShadow: '0 4px 10px rgba(17,89,44,0.25)'
          }}>
            DC
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                {adminName}
              </h2>
              <span style={{
                background: '#eff6ff',
                color: '#0284c7',
                border: '1px solid #bfdbfe',
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                {adminRole}
              </span>
              <span style={{
                background: '#dcfce7',
                color: '#15803d',
                border: '1px solid #86efac',
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }} />
                Active Account
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 8px 0' }}>
              Member ID: <strong>{adminId}</strong> · Antipolo Organic Farming Cooperative (MARIKHA)
            </p>

            <p style={{ fontSize: '0.76rem', color: '#475569', margin: 0, lineHeight: 1.45, maxWidth: '640px' }}>
              {bio}
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Personal & Contact Information */}
        <div className="m-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={18} color="#15803d" /> Personal Information
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>FULL LEGAL NAME</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>{adminName}</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>COOPERATIVE EMAIL</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>{adminEmail}</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>PRIMARY MOBILE PHONE</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>{phone}</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>EMERGENCY CONTACT</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>{emergencyContact}</span>
            </div>
          </div>
        </div>

        {/* Cooperative & Administrative Info */}
        <div className="m-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#15803d" /> Cooperative & Access Credentials
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>ASSIGNED ADMINISTRATIVE SECTOR</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>Operations & Compliance Center, Antipolo HQ</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>ADMINISTRATIVE RSBSA ID</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>RSBSA-03-1002-ADM</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>PROFESSIONAL CERTIFICATION</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#15803d' }}>Certified Organic Auditor · Level II Compliance</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>DATE OF APPOINTMENT</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>May 20, 2023 (Active 3+ Years)</span>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="m-card" style={{ width: '480px', background: '#fff', padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>Edit My Profile</h3>
              <button onClick={() => setShowEditModal(false)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Primary Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Emergency Contact</label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Administrative Bio</label>
                <textarea
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn-outline" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.78rem' }}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfileModule;
