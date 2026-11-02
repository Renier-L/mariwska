import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Cloud, UserCheck, Pencil, X, Megaphone, Bell, Send, HelpCircle, ShieldCheck } from 'lucide-react';

const Header = () => {
 const { tenantInfo, currentUser, currentRole, selectedSeason, setSelectedSeason, updateProfile, publishAnnouncement } = useAuth();
 const [showProfileModal, setShowProfileModal] = useState(false);
  const [showRoleGuide, setShowRoleGuide] = useState(false);
 const [nameInput, setNameInput] = useState('');
 const [phoneInput, setPhoneInput] = useState('');
 const [passInput, setPassInput] = useState('');

 // Announcement Modal State
 const [showAnnModal, setShowAnnModal] = useState(false);
 const [annTitle, setAnnTitle] = useState('');
 const [annContent, setAnnContent] = useState('');
 const [annPush, setAnnPush] = useState(true);
 const [isPublishing, setIsPublishing] = useState(false);

 const canBroadcast = currentRole === 'admin';


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

 alert(' Profile updated live! Your name and credentials have been synced across all modules and Supabase.');
 setShowProfileModal(false);
 };

 const handlePublishAnnSubmit = async (e) => {
 e.preventDefault();
 if (!annContent.trim()) {
 alert(' Mangyaring mag-input muna ng announcement text!');
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
 alert(' Global Announcement Published Live & Instant Push Pop-Up Broadcasted across all connected clients!');
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
		padding: '20px 32px 0px 32px',
		maxWidth: '1600px',
		width: '100%',
		margin: '0 auto',
		boxSizing: 'border-box',
		background: 'transparent',
		fontSize: '0.85rem'
	}}>
 {/* Left Tenant Info matching screenshots */}
 <div>
 				<h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.2, margin: 0 }}>
					Antipolo Organic Farming Cooperative
				</h4>
				<span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '600' }}>
					Tenant · {tenantInfo.id || 'ANT-ORG-001'}
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
 Broadcast Announcement
 </button>
 )}


 				{/* Cloud sync · Live Badge */}
				<div style={{
					display: 'flex',
					alignItems: 'center',
					gap: '6px',
					fontSize: '0.74rem',
					color: '#15803d',
					background: '#dcfce7',
					padding: '5px 12px',
					borderRadius: '20px',
					fontWeight: '700',
					border: '1px solid #86efac'
				}}>
					<span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a' }}></span>
					Cloud Sync · Live
				</div>

       <button onClick={() => setShowRoleGuide(true)} style={{ display: "none" }} title="System Architecture" aria-hidden="true" />

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
 {currentRole === 'super_admin' ? 'Super Admin' : (currentRole === 'admin' ? 'Administrator' : (currentRole === 'farm_staff' ? 'Farm Staff' : (currentUser?.role || 'User')))}
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
 {isPublishing ? 'Publishing...' : ' Send Live Push Broadcast'}
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
 <button type="submit" style={{ borderRadius: '10px', padding: '10px 20px', fontWeight: '800', background: '#0c3619', color: '#ffffff', border: 'none', cursor: 'pointer' }}> Save & Update Realtime</button>
 </div>
 </form>
 </div>
 </div>
 )}
 
      {/* ROLE ARCHITECTURE & HIERARCHY MODAL (Adviser Question: Know the difference between Admin & Super Admin) */}
      {showRoleGuide && (
        <div 
          onClick={() => setShowRoleGuide(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.65)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '820px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
          >
            <button 
              onClick={() => setShowRoleGuide(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ background: '#dcfce7', padding: '8px', borderRadius: '10px', color: '#15803d' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                  System Architecture & Role Hierarchy
                </h2>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Clear operational scope defining Super Administrator, Administrator, and Farm Staff
                </span>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '16px 0 20px 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              {/* Card 1: Super Admin */}
              <div style={{ background: '#f8fafc', border: '2px solid #86efac', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.7rem', background: '#dcfce7', color: '#15803d', fontWeight: '800', padding: '2px 8px', borderRadius: '12px' }}>
                    TIER 1 (GLOBAL)
                  </span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#11592c', margin: '0 0 6px 0' }}>
                  Super Administrator
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '12px', lineHeight: 1.4 }}>
                  Platform governance across multi-tenant organic cooperatives.
                </p>
                <div style={{ fontSize: '0.72rem', color: '#1e293b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div> <strong>Multi-Tenant:</strong> Cross-cooperative platform administration</div>
                  <div> <strong>Analytics:</strong> Global harvest output & trend forecasting</div>
                  <div> <strong>Decision Support:</strong> AI predictive horizon & strategic policy</div>
                  <div> <strong>Governance:</strong> System-wide audit trail logs & compliance export</div>
                </div>
              </div>

              {/* Card 2: Administrator */}
              <div style={{ background: '#f8fafc', border: '2px solid #93c5fd', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.7rem', background: '#dbeafe', color: '#1d4ed8', fontWeight: '800', padding: '2px 8px', borderRadius: '12px' }}>
                    TIER 2 (COOP)
                  </span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e40af', margin: '0 0 6px 0' }}>
                  Administrator
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '12px', lineHeight: 1.4 }}>
                  Local cooperative operations, member records & communication.
                </p>
                <div style={{ fontSize: '0.72rem', color: '#1e293b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div> <strong>Member Directory:</strong> Farmer account registration & RSBSA ID</div>
                  <div> <strong>Security Matrix:</strong> Role-based permissions configuration</div>
                  <div> <strong>Broadcasts:</strong> Cooperative announcements & mobile push</div>
                  <div> <strong>Sync Pipeline:</strong> Supabase cloud data flow monitoring</div>
                </div>
              </div>

              {/* Card 3: Farm Staff */}
              <div style={{ background: '#f8fafc', border: '2px solid #fde047', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.7rem', background: '#fef9c3', color: '#a16207', fontWeight: '800', padding: '2px 8px', borderRadius: '12px' }}>
                    TIER 3 (FIELD)
                  </span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#854d0e', margin: '0 0 6px 0' }}>
                  Farm Staff
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '12px', lineHeight: 1.4 }}>
                  Field verification, geotagged proof review & crop monitoring.
                </p>
                <div style={{ fontSize: '0.72rem', color: '#1e293b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div> <strong>Activity Validation:</strong> Inspect photo proofs & GPS locations</div>
                  <div> <strong>Crop Management:</strong> Plot stages & predicted harvest time</div>
                  <div> <strong>Critical Alerts:</strong> Quick-link response to synthetic input risks</div>
                  <div> <strong>Farmer Oversight:</strong> Assigned plot supervision & livestock logs</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: '600' }}>
                 <strong>Adviser Alignment:</strong> Roles follow standard multi-tier organic cooperative hierarchy under Republic Act 11511 (Organic Agriculture Act).
              </span>
              <button 
                onClick={() => setShowRoleGuide(false)}
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.75rem' }}
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
 );
};

export default Header;
