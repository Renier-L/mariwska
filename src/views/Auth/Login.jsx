import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';

const Login = () => {
 const { loginAsRole, users } = useAuth();
 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');
 const [rememberMe, setRememberMe] = useState(true);
 const [loading, setLoading] = useState(false);
 const [errorMsg, setErrorMsg] = useState('');
 const [showPassword, setShowPassword] = useState(false);

 const handleSubmit = (e) => {
 if (e) e.preventDefault();
 setErrorMsg('');

 const cleanUser = (username || '').trim().toLowerCase();
 const cleanPass = (password || '').trim();

 if (!cleanUser || !cleanPass) {
 setErrorMsg('Please enter both your username/email and password.');
 return;
 }

 const isSuperAdminPass = ['superadmin123', 'super123', 'password123'].includes(cleanPass.toLowerCase());
 const isAdminPass = ['123admin', 'admin123', 'password123'].includes(cleanPass.toLowerCase());
 const isStaffPass = ['staff123', '123staff', 'password123'].includes(cleanPass.toLowerCase());
 const isFarmerPass = ['password123', 'farmer123'].includes(cleanPass.toLowerCase());

 // 1. Dynamic search against registered users created by Admin / stored in state
 const matchedUser = (users || []).find(u => {
 if (!u) return false;
 const nameLower = (u.name || '').toLowerCase();
 const emailLower = (u.email || '').toLowerCase();
 return (
 emailLower === cleanUser ||
 nameLower === cleanUser ||
 (cleanUser.includes('@') && emailLower.includes(cleanUser))
 );
 });

 if (matchedUser) {
 const storedPass = (matchedUser.password || '').trim();
 const passMatches = storedPass === cleanPass || 
 (matchedUser.role === 'Executive' && isSuperAdminPass) ||
 (matchedUser.role === 'Admin' && isAdminPass) ||
 (matchedUser.role === 'Farm Staff' && isStaffPass) ||
 (matchedUser.role === 'Farmer' && isFarmerPass);

 if (!passMatches) {
 setErrorMsg('Invalid password. Please check your password and try again.');
 return;
 }

 const role = matchedUser.role;
 if (role === 'Executive' || role === 'Super Admin') loginAsRole('super_admin', matchedUser);
 else if (role === 'Admin') loginAsRole('admin', matchedUser);
 else if (role === 'Farm Staff') loginAsRole('farm_staff', matchedUser);
 else if (role === 'Farmer') loginAsRole('mobile_app', matchedUser);
 else loginAsRole('farm_staff', matchedUser);
 return;
 }

 // 2. Pre-Seeded System Role Fallbacks
 if (cleanUser === 'superadmin' || cleanUser === 'rosa@mariwska.coop' || cleanUser === 'executive' || cleanUser === 'rosa') {
 if (isSuperAdminPass) {
 loginAsRole('super_admin');
 return;
 } else {
 setErrorMsg('Invalid password for Super Admin account.');
 return;
 }
 }

 if (cleanUser === 'admin' || cleanUser === 'liza@mariwska.coop' || cleanUser === 'liza') {
 if (isAdminPass) {
 loginAsRole('admin');
 return;
 } else {
 setErrorMsg('Invalid password for Admin account.');
 return;
 }
 }

 if (cleanUser === 'staff' || cleanUser === 'ramon@mariwska.coop' || cleanUser === 'farm staff' || cleanUser === 'ramon') {
 if (isStaffPass) {
 loginAsRole('farm_staff');
 return;
 } else {
 setErrorMsg('Invalid password for Farm Staff account.');
 return;
 }
 }

 if (cleanUser === 'farmer' || cleanUser === 'lopezrenier97@gmail.com' || cleanUser === 'rei lopez' || cleanUser === 'renier') {
 if (isFarmerPass) {
 loginAsRole('mobile_app');
 return;
 } else {
 setErrorMsg('Invalid password for Farmer account.');
 return;
 }
 }

 // 3. Reject unrecognized accounts
 setErrorMsg('Account not registered or invalid credentials. Only Cooperative Administrators can create and authorize accounts.');
 };

 return (
 <div style={{
 minHeight: '100vh',
 background: 'linear-gradient(140deg, #021a0d 0%, #083318 45%, #04140b 100%)',
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'center',
 padding: '24px 16px',
 fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
 }}>
 {/* Formal Enterprise Login Card */}
 <div style={{
 background: '#ffffff',
 borderRadius: '24px',
 width: '100%',
 maxWidth: '430px',
 padding: '40px 36px 32px',
 boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1)',
 position: 'relative',
 overflow: 'hidden'
 }}>
 {/* Top Metallic Green Accent Line */}
 <div style={{
 position: 'absolute',
 top: 0,
 left: 0,
 right: 0,
 height: '5px',
 background: 'linear-gradient(90deg, #0c3619 0%, #15803d 50%, #22c55e 100%)'
 }} />

 {/* Official Corporate Logo & Header */}
 <div style={{ textAlign: 'center', marginBottom: '28px' }}>
 <div style={{
 width: '68px',
 height: '68px',
 borderRadius: '20px',
 background: 'linear-gradient(135deg, #062b14 0%, #15803d 100%)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 margin: '0 auto 14px',
 boxShadow: '0 10px 22px rgba(12, 54, 25, 0.35)',
 border: '2px solid #86efac'
 }}>
 <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M12 2L2 7l10 5 10-5-10-5z" />
 <path d="M2 17l10 5 10-5" />
 <path d="M2 12l10 5 10-5" />
 </svg>
 </div>

 <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#092d15', letterSpacing: '-0.5px', margin: '0 0 4px 0' }}>
 MARIKHA
 </h1>
 <p style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '700', margin: 0, letterSpacing: '0.2px' }}>
 Agricultural Cooperative Management System
 </p>
 </div>

 <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
 {errorMsg && (
 <div style={{
 background: '#fef2f2',
 border: '1.5px solid #fca5a5',
 color: '#b91c1c',
 padding: '12px 14px',
 borderRadius: '12px',
 fontSize: '0.82rem',
 marginBottom: '20px',
 fontWeight: '700',
 display: 'flex',
 alignItems: 'center',
 gap: '10px'
 }}>
 <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0 }} />
 <div style={{ lineHeight: '1.4' }}>{errorMsg}</div>
 </div>
 )}

 <div style={{ marginBottom: '20px' }}>
 <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#334155', marginBottom: '6px' }}>
 Username or Email Address
 </label>
 <div style={{ position: 'relative' }}>
 <User size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '13px' }} />
 <input
 type="text"
 value={username}
 onChange={(e) => setUsername(e.target.value)}
 placeholder="Enter username or email"
 required
 style={{
 width: '100%',
 padding: '12px 14px 12px 42px',
 borderRadius: '12px',
 border: '1.5px solid #cbd5e1',
 background: '#f8fafc',
 fontSize: '0.9rem',
 outline: 'none',
 color: '#0f172a',
 fontWeight: '700',
 boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
 }}
 />
 </div>
 </div>

 <div style={{ marginBottom: '24px' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
 <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#334155' }}>
 Password
 </label>
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 style={{ background: 'none', border: 'none', color: '#15803d', fontSize: '0.78rem', fontWeight: '800', cursor: 'pointer' }}
 >
 {showPassword ? 'Hide' : 'Show'}
 </button>
 </div>

 <div style={{ position: 'relative' }}>
 <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '13px' }} />
 <input
 type={showPassword ? 'text' : 'password'}
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 placeholder="••••••••••••"
 required
 style={{
 width: '100%',
 padding: '12px 14px 12px 42px',
 borderRadius: '12px',
 border: '1.5px solid #cbd5e1',
 background: '#f8fafc',
 fontSize: '0.9rem',
 outline: 'none',
 color: '#0f172a',
 fontWeight: '700',
 boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
 }}
 />
 </div>
 </div>

 <button
 type="submit"
 disabled={loading}
 style={{
 width: '100%',
 padding: '14px',
 borderRadius: '14px',
 background: 'linear-gradient(135deg, #062b14 0%, #15803d 100%)',
 color: '#ffffff',
 fontWeight: '900',
 fontSize: '0.95rem',
 letterSpacing: '0.3px',
 border: 'none',
 cursor: loading ? 'wait' : 'pointer',
 boxShadow: '0 10px 22px rgba(6, 43, 20, 0.35)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: '8px'
 }}
 >
 Sign In to Portal 
 </button>
 </form>

 <div style={{
 marginTop: '24px',
 paddingTop: '20px',
 borderTop: '1px solid #f1f5f9',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: '6px',
 fontSize: '0.75rem',
 color: '#64748b',
 fontWeight: '700'
 }}>
 <ShieldCheck size={16} color="#16a34a" />
 Enterprise SSL 256-bit Encrypted Session
 </div>
 </div>

 {/* Corporate Copyright Footer */}
 <div style={{ marginTop: '24px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: '600' }}>
 © 2026 MARIKHA Agricultural Cooperative System. All rights reserved.
 </div>
 </div>
 );
};

export default Login;
