import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  ClipboardList, 
  Sparkles, 
  Calendar, 
  ArrowLeft, 
  Wifi, 
  Battery, 
  Camera, 
  Droplets, 
  Sprout, 
  Scissors, 
  MapPin, 
  LogOut,
  Maximize2,
  Minimize2,
  Phone,
  Lock,
  Bell,
  X,
  AlertTriangle,
  Radio,
  ChevronRight,
  CheckCircle2,
  CloudSun,
  ShieldCheck,
  CheckSquare,
  Beef,
  TrendingUp,
  UploadCloud,
  Image as ImageIcon
} from 'lucide-react';

const MobileAppSimulator = () => {
  const { loginAsRole, addFarmerSubmission, announcements, activePushNotice } = useAuth();
  
  // Mobile app navigation state: 'splash', 'login', 'main'
  const [mobileScreen, setMobileScreen] = useState('home'); 
  const [mobileAuth, setMobileAuth] = useState(true);
  
  const [viewMode, setViewMode] = useState('device'); // 'device' or 'full'
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'log', 'ai', 'tasks'
  
  // Modals state
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showCropsModal, setShowCropsModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // Completed tasks state
  const [completedTasks, setCompletedTasks] = useState({});

  // REAL-TIME AUTO POPUP FOR EVERY NEW ANNOUNCEMENT
  useEffect(() => {
    if (activePushNotice) {
      setSelectedAnnouncement(activePushNotice);
      setShowHistoryModal(false); 
      setShowNotificationModal(true); // Always pop up live notice!
    }
  }, [activePushNotice]);

  // Form States
  const [mobileNumber, setMobileNumber] = useState('@danilo');
  const [pinCode, setPinCode] = useState('••••••••');
  const [logType, setLogType] = useState('crops');
  const [activity, setActivity] = useState('Watering');
  const [selectedPlot, setSelectedPlot] = useState('Plot P-007');
  const [inputAmount, setInputAmount] = useState(10);
  const [photoAttached, setPhotoAttached] = useState(false);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState('');
  const [logNote, setLogNote] = useState('');
  const [logSubmitted, setLogSubmitted] = useState(false);

  const fileInputRef = useRef(null);

  // AI Recommendation State
  const [season, setSeason] = useState('Tag-init (Dry)');
  const [location, setLocation] = useState('Block A · Cupang');
  const [soil, setSoil] = useState('Loam · moist');
  const [isCalculatingAI, setIsCalculatingAI] = useState(false);
  const [aiResult, setAiResult] = useState({
    crop: 'Tomato · Diamante',
    confidence: '87%',
    output: '412 kg',
    sacks: '~ 8 sacks',
    harvestWindow: 'Nov 18 – Dec 02, 2025'
  });

  const latestPushAnnouncement = selectedAnnouncement || activePushNotice || (announcements && announcements[0]);
  const notificationCount = announcements ? announcements.length : 0;

  // Compress image to lightweight Data URL (< 20KB) for 100% reliable cross-window & Supabase transmission
  const processImageFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const rawDataUrl = reader.result;
      const img = new Image();
      img.src = rawDataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedUrl = canvas.toDataURL('image/jpeg', 0.7);
        setPhotoPreviewUrl(compressedUrl);
        setPhotoAttached(true);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    processImageFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    processImageFile(file);
  };

  const handleMobileLogin = (e) => {
    e.preventDefault();
    setMobileAuth(true);
    setMobileScreen('main');
  };

  const handleLogSubmit = (e) => {
    e.preventDefault();
    setLogSubmitted(true);

    const finalPhotoUrl = photoPreviewUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb12735?w=600&auto=format&fit=crop&q=60';

    addFarmerSubmission({
      activity,
      plot: selectedPlot,
      amount: inputAmount,
      note: logNote,
      photoUrl: finalPhotoUrl
    });

    setTimeout(() => {
      setLogSubmitted(false);
      setLogNote('');
      setPhotoAttached(false);
      setPhotoPreviewUrl('');
      alert('✅ Activity Log submitted directly to Farm Staff for cloud validation & saved to Supabase!');
      setActiveTab('home');
    }, 600);
  };

  const handleGetSmartRecommendation = () => {
    setIsCalculatingAI(true);
    setTimeout(() => {
      setIsCalculatingAI(false);
      if (season === 'Tag-ulan (Wet)') {
        setAiResult({
          crop: 'Eggplant · Mistisa',
          confidence: '92%',
          output: '345 kg',
          sacks: '~ 7 sacks',
          harvestWindow: 'Dec 05 – Dec 20, 2025'
        });
      } else {
        setAiResult({
          crop: 'Tomato · Diamante',
          confidence: '87%',
          output: '412 kg',
          sacks: '~ 8 sacks',
          harvestWindow: 'Nov 18 – Dec 02, 2025'
        });
      }
    }, 500);
  };

  const toggleTaskCompleted = (taskId) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const getHeaderBg = () => {
    if (mobileScreen === 'splash') return '#0c3619';
    if (!mobileAuth || mobileScreen === 'login') return '#ffffff';
    if (activeTab === 'tasks') return '#d97706';
    if (activeTab === 'ai') return '#059669';
    return '#0c3619';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a2613',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px 16px',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    }}>
      {/* Simulator Control Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        width: '100%',
        maxWidth: viewMode === 'device' ? '410px' : '900px',
        marginBottom: '16px',
        color: '#ffffff'
      }}>
        <button
          onClick={() => loginAsRole('login')}
          className="btn-outline"
          style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.8rem' }}
        >
          <ArrowLeft size={15} /> Exit Mobile View
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => { setMobileScreen('splash'); setMobileAuth(false); }}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem' }}
          >
            Splash Screen
          </button>
          <button
            onClick={() => { setMobileScreen('login'); setMobileAuth(false); }}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem' }}
          >
            Mobile Login
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'device' ? 'full' : 'device')}
            style={{
              background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
              padding: '6px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px'
            }}
          >
            {viewMode === 'device' ? <><Maximize2 size={13} /> Full Screen</> : <><Minimize2 size={13} /> Device View</>}
          </button>
        </div>
      </div>

      {/* Mobile Device Container (375x812px Native Specs) */}
      <div style={{
        width: '100%',
        maxWidth: viewMode === 'device' ? '375px' : '900px',
        height: viewMode === 'device' ? '780px' : 'calc(100vh - 100px)',
        background: '#ffffff',
        borderRadius: viewMode === 'device' ? '40px' : '16px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
        border: viewMode === 'device' ? '10px solid #1a202c' : '1px solid #cbd5e1',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease'
      }}>
        {/* Top Notch */}
        {viewMode === 'device' && (
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '130px', height: '20px', background: '#1a202c', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', zIndex: 200
          }} />
        )}

        {/* Status Bar */}
        <div style={{
          height: viewMode === 'device' ? '42px' : '36px',
          background: getHeaderBg(),
          color: mobileScreen === 'login' || (!mobileAuth && mobileScreen !== 'splash') ? '#111827' : '#ffffff',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
          fontSize: '0.75rem',
          fontWeight: '700',
          paddingTop: viewMode === 'device' ? '12px' : '0',
          zIndex: 100,
          flexShrink: 0
        }}>
          <span>09:41</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wifi size={13} />
            <Battery size={15} />
          </div>
        </div>

        {/* ================= SCREEN A: SPLASH SCREEN ================= */}
        {mobileScreen === 'splash' && (
          <div style={{ flex: 1, background: '#0c3619', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px' }}>
            <div style={{
              width: '110px', height: '110px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
            }}>
              <span style={{ fontSize: '3rem' }}>🌱</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', tracking: '1px', marginBottom: '50px' }}>MARIKHA</h1>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', border: '4px solid #86efac', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '0.9rem', color: '#86efac', fontWeight: '700' }}>Loading...</span>
            </div>
            <button
              onClick={() => setMobileScreen('login')}
              style={{ marginTop: '60px', background: '#11592c', color: '#fff', padding: '12px 28px', borderRadius: '24px', fontSize: '0.85rem', fontWeight: '800', border: 'none', cursor: 'pointer' }}
            >
              Continue to Login →
            </button>
          </div>
        )}

        {/* ================= SCREEN B: MOBILE LOGIN SCREEN ================= */}
        {(mobileScreen === 'login' || (!mobileAuth && mobileScreen !== 'splash')) && (
          <div style={{ flex: 1, background: '#ffffff', padding: '30px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '84px', height: '84px', borderRadius: '50%', background: '#f0fdf4', border: '2px solid #86efac', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px'
            }}>
              <span style={{ fontSize: '2.2rem' }}>🌱</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#11592c', marginBottom: '2px' }}>MARIKHA</h2>
            <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#15803d', marginBottom: '32px' }}>Welcome Back!</p>

            <form onSubmit={handleMobileLogin} style={{ width: '100%' }}>
              <div style={{ width: '100%', marginBottom: '18px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#15803d', display: 'block', marginBottom: '6px' }}>Username</label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '2px solid #86efac', fontSize: '0.9rem', outline: 'none', color: '#15803d', fontWeight: '700' }}
                />
              </div>

              <div style={{ width: '100%', marginBottom: '10px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#15803d', display: 'block', marginBottom: '6px' }}>Password</label>
                <input
                  type="password"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '2px solid #86efac', fontSize: '0.9rem', outline: 'none', color: '#15803d' }}
                />
              </div>

              <div style={{ width: '100%', textAlign: 'right', marginBottom: '30px' }}>
                <span style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: '700', cursor: 'pointer' }}>Forgot Password?</span>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%', padding: '14px', borderRadius: '14px', background: '#11592c', color: '#ffffff', fontWeight: '800', fontSize: '1rem', border: 'none', marginBottom: '20px', cursor: 'pointer'
                }}
              >
                Login
              </button>
            </form>

            <span style={{ fontSize: '0.8rem', color: '#4b5563' }}>
              Don't have an account? <strong style={{ color: '#15803d', cursor: 'pointer' }}>Sign Up</strong>
            </span>
          </div>
        )}

        {/* ================= SCREEN C: FARMER DASHBOARD & TABS ================= */}
        {mobileAuth && mobileScreen !== 'splash' && mobileScreen !== 'login' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#edf3ec', overflow: 'hidden' }}>
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '16px' }}>

              {/* ----- HOME TAB ----- */}
              {activeTab === 'home' && (
                <div>
                  {/* Top Dark Green Header Card */}
                  <div style={{ background: '#0c3619', color: '#ffffff', padding: '18px 20px 22px 20px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#86efac', textTransform: 'uppercase', tracking: '0.5px' }}>MAGANDANG ARAW,</div>
                        <h2 style={{ fontSize: '1.35rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          Mang 👋
                        </h2>
                      </div>

                      {/* Header Notification Bell & Exit Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => { setShowNotificationModal(false); setShowHistoryModal(true); }}
                          style={{
                            background: '#d97706', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', boxShadow: '0 3px 8px rgba(0,0,0,0.3)'
                          }}
                        >
                          <Bell size={14} /> {notificationCount}
                        </button>
                        <button onClick={() => { setMobileAuth(false); setMobileScreen('login'); }} style={{ color: '#86efac', background: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '8px', border: 'none' }}>
                          <LogOut size={15} />
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#a7f3d0', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      📅 Friday, June 19 · 📍 Cupang, Antipolo · Rizal
                    </div>

                    {/* LIVE BROADCAST ANNOUNCEMENT PUSH BANNER */}
                    {latestPushAnnouncement && (
                      <div
                        onClick={() => { setSelectedAnnouncement(latestPushAnnouncement); setShowHistoryModal(false); setShowNotificationModal(true); }}
                        style={{
                          background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '12px', padding: '10px 12px', marginBottom: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'
                        }}
                      >
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#d97706', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Bell size={14} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#d97706', textTransform: 'uppercase' }}>
                            📢 LATEST ANNOUNCEMENT PUSH
                          </div>
                          <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#78350f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            "{latestPushAnnouncement.content || latestPushAnnouncement.title}"
                          </div>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: '700' }}>View →</span>
                      </div>
                    )}

                    {/* Weather Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.12)', padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)' }}>
                        <div style={{ fontSize: '0.65rem', color: '#86efac', textTransform: 'uppercase', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CloudSun size={12} /> TEMPERATURE
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '800', margin: '2px 0' }}>28°C</div>
                        <div style={{ fontSize: '0.68rem', color: '#a7f3d0' }}>Maaraw - light breeze</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.12)', padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)' }}>
                        <div style={{ fontSize: '0.65rem', color: '#86efac', textTransform: 'uppercase', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Droplets size={12} /> RAINFALL
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '800', margin: '2px 0' }}>2.4mm</div>
                        <div style={{ fontSize: '0.68rem', color: '#a7f3d0' }}>Low chance of rain</div>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Options */}
                  <div style={{ padding: '18px' }}>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#111827', marginBottom: '14px' }}>
                      What would you like to do?
                    </h3>

                    {/* 4 Big Touch Tiles Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      <div
                        onClick={() => setActiveTab('log')}
                        style={{
                          background: '#0c3619', color: '#ffffff', borderRadius: '16px', padding: '16px 14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '120px'
                        }}
                      >
                        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ClipboardList size={18} color="#86efac" />
                        </div>
                        <div style={{ fontWeight: '800', fontSize: '0.85rem', lineHeight: 1.2 }}>LOG DAILY ACTIVITY</div>
                      </div>

                      <div
                        onClick={() => setShowCropsModal(true)}
                        style={{
                          background: '#452c1e', color: '#ffffff', borderRadius: '16px', padding: '16px 14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '120px'
                        }}
                      >
                        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Sprout size={18} color="#fcd34d" />
                        </div>
                        <div style={{ fontWeight: '800', fontSize: '0.85rem', lineHeight: 1.2 }}>MY CROPS & LIVESTOCK</div>
                      </div>

                      <div
                        onClick={() => setActiveTab('tasks')}
                        style={{
                          background: '#d97706', color: '#ffffff', borderRadius: '16px', padding: '16px 14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '120px'
                        }}
                      >
                        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Calendar size={18} color="#ffffff" />
                        </div>
                        <div style={{ fontWeight: '800', fontSize: '0.85rem', lineHeight: 1.2 }}>FARMING CALENDAR</div>
                      </div>

                      <div
                        onClick={() => setActiveTab('ai')}
                        style={{
                          background: '#059669', color: '#ffffff', borderRadius: '16px', padding: '16px 14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '120px'
                        }}
                      >
                        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Sparkles size={18} color="#ffffff" />
                        </div>
                        <div style={{ fontWeight: '800', fontSize: '0.85rem', lineHeight: 1.2 }}>AI SMART RECOMMENDATION</div>
                      </div>
                    </div>

                    {/* Organic Certification Status Card */}
                    <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '14px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#166534', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>PGS ORGANIC STATUS</div>
                        <div style={{ fontWeight: '800', fontSize: '0.88rem', color: '#111827' }}>Certified · 94% complete</div>
                        <div style={{ fontSize: '0.7rem', color: '#15803d' }}>1 item needs your attention</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ----- LOG TAB ----- */}
              {activeTab === 'log' && (
                <div>
                  <div style={{ background: '#0c3619', color: '#ffffff', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => setActiveTab('home')} style={{ color: '#fff', background: 'none', border: 'none' }}><ArrowLeft size={18} /></button>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: '800' }}>Log Activity</h3>
                      <span style={{ fontSize: '0.7rem', color: '#86efac' }}>Punan ang form sa ibaba</span>
                    </div>
                  </div>

                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#e2eae0', padding: '3px', borderRadius: '12px', marginBottom: '16px' }}>
                      <button
                        onClick={() => setLogType('crops')}
                        style={{
                          padding: '8px', borderRadius: '10px', fontWeight: '800', fontSize: '0.8rem', border: 'none',
                          background: logType === 'crops' ? '#0c3619' : 'transparent',
                          color: logType === 'crops' ? '#ffffff' : '#4b5563',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                        }}
                      >
                        <Sprout size={14} /> CROPS
                      </button>
                      <button
                        onClick={() => setLogType('livestock')}
                        style={{
                          padding: '8px', borderRadius: '10px', fontWeight: '800', fontSize: '0.8rem', border: 'none',
                          background: logType === 'livestock' ? '#0c3619' : 'transparent',
                          color: logType === 'livestock' ? '#ffffff' : '#4b5563',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                        }}
                      >
                        <Beef size={14} /> LIVESTOCK
                      </button>
                    </div>

                    <form onSubmit={handleLogSubmit}>
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#111827', display: 'block', marginBottom: '6px' }}>
                          1. Select Crop Activity
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          {[
                            { name: 'Watering', icon: Droplets },
                            { name: 'Fertilizer', icon: Sprout },
                            { name: 'Weeding', icon: Scissors },
                            { name: 'Harvest', icon: ClipboardList }
                          ].map(act => {
                            const Icon = act.icon;
                            const isSel = activity === act.name;
                            return (
                              <button
                                key={act.name}
                                type="button"
                                onClick={() => setActivity(act.name)}
                                style={{
                                  padding: '12px 8px', borderRadius: '10px',
                                  background: isSel ? '#0c3619' : '#ffffff',
                                  color: isSel ? '#ffffff' : '#374151',
                                  border: isSel ? '2px solid #0c3619' : '1px solid #e5e7eb',
                                  fontWeight: '800', fontSize: '0.8rem',
                                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                                }}
                              >
                                <Icon size={18} color={isSel ? '#86efac' : '#0c3619'} />
                                {act.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#111827', display: 'block', marginBottom: '6px' }}>
                          2. Select Plot Number
                        </label>
                        <select
                          value={selectedPlot}
                          onChange={(e) => setSelectedPlot(e.target.value)}
                          style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#ffffff', fontSize: '0.82rem', fontWeight: '700' }}
                        >
                          <option value="Plot P-007">Plot P-007 (Tomato Diamante)</option>
                          <option value="Plot P-021">Plot P-021 (Eggplant Mistisa)</option>
                          <option value="Plot P-034">Plot P-034 (Okra Smooth Green)</option>
                          <option value="Plot P-055">Plot P-055 (Squash Suprema)</option>
                        </select>
                      </div>

                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#111827', display: 'block', marginBottom: '6px' }}>
                          3. Input Amount (Liters)
                        </label>
                        <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #d1d5db', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <button
                            type="button"
                            onClick={() => setInputAmount(Math.max(1, inputAmount - 5))}
                            style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#452c1e', color: '#fff', fontWeight: '800', fontSize: '1.1rem', border: 'none' }}
                          >
                            -
                          </button>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827' }}>{inputAmount}</span>
                            <span style={{ fontSize: '0.7rem', color: '#6b7280', display: 'block' }}>Liters</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setInputAmount(inputAmount + 5)}
                            style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#0c3619', color: '#fff', fontWeight: '800', fontSize: '1.1rem', border: 'none' }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Step 4: Compressed Live Camera Upload & Drag-and-Drop Image */}
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#111827', display: 'block', marginBottom: '6px' }}>
                          4. Take a Photo / Upload Image <span style={{ color: '#dc2626' }}>(Required)</span>
                        </label>

                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />

                        <div
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          style={{
                            border: '2px dashed #0c3619', borderRadius: '12px', padding: '14px', background: photoAttached ? '#f0fdf4' : '#ffffff', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease'
                          }}
                        >
                          {photoPreviewUrl ? (
                            <div>
                              <img
                                src={photoPreviewUrl}
                                alt="Uploaded proof"
                                style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }}
                              />
                              <div style={{ fontWeight: '800', fontSize: '0.8rem', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                <CheckCircle2 size={16} /> PHOTO READY (Click to change)
                              </div>
                            </div>
                          ) : (
                            <div>
                              <UploadCloud size={28} color="#0c3619" style={{ margin: '0 auto 4px' }} />
                              <div style={{ fontWeight: '800', fontSize: '0.82rem', color: '#0c3619' }}>
                                CLICK TO TAKE PHOTO OR DRAG IMAGE FILE
                              </div>
                              <div style={{ fontSize: '0.68rem', color: '#6b7280', marginTop: '2px' }}>
                                Camera upload · Drag & Drop image file supported
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#111827', display: 'block', marginBottom: '6px' }}>
                          5. Note (Optional)
                        </label>
                        <textarea
                          value={logNote}
                          onChange={(e) => setLogNote(e.target.value)}
                          placeholder="Halimbawa: ginawa kaninang umaga..."
                          rows={2}
                          style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.78rem' }}
                        />
                      </div>

                      <button
                        type="submit"
                        style={{
                          width: '100%', padding: '14px', borderRadius: '12px', background: '#0c3619', color: '#ffffff', fontWeight: '800', fontSize: '0.9rem', border: 'none', cursor: 'pointer'
                        }}
                      >
                        {logSubmitted ? 'SUBMITTING...' : 'SUBMIT LOG FOR VALIDATION'}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* ----- AI TAB ----- */}
              {activeTab === 'ai' && (
                <div>
                  <div style={{ background: '#059669', color: '#ffffff', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => setActiveTab('home')} style={{ color: '#fff', background: 'none', border: 'none' }}><ArrowLeft size={18} /></button>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={15} color="#86efac" /> AI Recommendations
                      </h3>
                      <span style={{ fontSize: '0.7rem', color: '#a7f3d0' }}>Smart na payo para sa inyong sakahan</span>
                    </div>
                  </div>

                  <div style={{ padding: '16px' }}>
                    {/* Condition Selector Card */}
                    <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '16px', marginBottom: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>
                        Sabihin sa amin ang kondisyon:
                      </h4>

                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#374151', display: 'block', marginBottom: '4px' }}>Current crop season</label>
                        <select value={season} onChange={(e) => setSeason(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #059669', background: '#ffffff', fontSize: '0.85rem', fontWeight: '700', color: '#111827' }}>
                          <option value="Tag-init (Dry)">Tag-init (Dry)</option>
                          <option value="Tag-ulan (Wet)">Tag-ulan (Wet)</option>
                        </select>
                      </div>

                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#374151', display: 'block', marginBottom: '4px' }}>Farm block location</label>
                        <select value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #059669', background: '#ffffff', fontSize: '0.85rem', fontWeight: '700', color: '#111827' }}>
                          <option value="Block A · Cupang">Block A · Cupang</option>
                          <option value="Block B · Antipolo">Block B · Antipolo</option>
                        </select>
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#374151', display: 'block', marginBottom: '4px' }}>Visible soil condition</label>
                        <select value={soil} onChange={(e) => setSoil(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #059669', background: '#ffffff', fontSize: '0.85rem', fontWeight: '700', color: '#111827' }}>
                          <option value="Loam · moist">Loam · moist</option>
                          <option value="Clay · dry">Clay · dry</option>
                        </select>
                      </div>

                      <button
                        onClick={handleGetSmartRecommendation}
                        style={{
                          width: '100%', padding: '12px', borderRadius: '10px', background: '#0c3619', color: '#ffffff', fontWeight: '800', fontSize: '0.85rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                        }}
                      >
                        {isCalculatingAI ? 'CALCULATING ML MODEL...' : <><Sparkles size={16} color="#86efac" /> GET SMART RECOMMENDATION</>}
                      </button>
                    </div>

                    {/* RF Classifier Result Card */}
                    <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '16px', marginBottom: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <span style={{ background: '#059669', color: '#fff', fontSize: '0.65rem', padding: '3px 8px', borderRadius: '4px', fontWeight: '800' }}>RF Classifier</span>
                        <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: '600' }}>Random Forest</span>
                      </div>

                      <div style={{ fontSize: '0.68rem', color: '#6b7280', fontWeight: '800', textTransform: 'uppercase' }}>RECOMMENDED CROP VARIETY</div>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0c3619', margin: '4px 0 10px 0' }}>{aiResult.crop}</h2>

                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '800', marginBottom: '4px' }}>
                          <span>SUITABILITY CONFIDENCE</span>
                          <span style={{ color: '#059669' }}>{aiResult.confidence}</span>
                        </div>
                        <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: aiResult.confidence, height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)' }} />
                        </div>
                      </div>

                      <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#6b7280', marginBottom: '6px' }}>ALTERNATIVE CROPS</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px' }}>
                          <span style={{ fontWeight: '700' }}>Eggplant · Mistisa</span>
                          <span style={{ background: '#e2e8f0', color: '#334155', padding: '2px 8px', borderRadius: '12px', fontWeight: '800', fontSize: '0.7rem' }}>74%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px' }}>
                          <span style={{ fontWeight: '700' }}>Okra · Smooth Green</span>
                          <span style={{ background: '#e2e8f0', color: '#334155', padding: '2px 8px', borderRadius: '12px', fontWeight: '800', fontSize: '0.7rem' }}>68%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px' }}>
                          <span style={{ fontWeight: '700' }}>Squash · Suprema</span>
                          <span style={{ background: '#e2e8f0', color: '#334155', padding: '2px 8px', borderRadius: '12px', fontWeight: '800', fontSize: '0.7rem' }}>52%</span>
                        </div>
                      </div>
                    </div>

                    {/* RF Regression Yield Prediction Card */}
                    <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                        <span style={{ background: '#452c1e', color: '#fff', fontSize: '0.65rem', padding: '3px 8px', borderRadius: '4px', fontWeight: '800' }}>RF Regression</span>
                        <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: '600' }}>Yield prediction</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <TrendingUp size={22} color="#0c3619" />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase' }}>ESTIMATED OUTPUT</div>
                          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827' }}>{aiResult.output}</div>
                          <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '700' }}>{aiResult.sacks}</div>
                        </div>
                      </div>

                      <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '10px', padding: '10px 12px' }}>
                        <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#92400e', textTransform: 'uppercase', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={13} /> EXPECTED HARVEST WINDOW
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#78350f' }}>
                          {aiResult.harvestWindow}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ----- TASKS TAB ----- */}
              {activeTab === 'tasks' && (
                <div>
                  <div style={{ background: '#d97706', color: '#ffffff', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => setActiveTab('home')} style={{ color: '#fff', background: 'none', border: 'none' }}><ArrowLeft size={18} /></button>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: '800' }}>Today's Smart Tasks</h3>
                      <span style={{ fontSize: '0.7rem', color: '#fef3c7' }}>Interactive farming checklist</span>
                    </div>
                  </div>

                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                      {[
                        { id: 't1', title: 'Apply compost · Plot P-021', status: 'OVERDUE', time: '● YESTERDAY', desc: 'Missed scheduled cycle · re-do today', border: '#dc2626', pill: 'pill-critical' },
                        { id: 't2', title: 'Water Plot P-007', status: 'URGENT', time: '● 06:00 TODAY', desc: 'Heat advisory · double morning ration', border: '#d97706', pill: 'pill-high' },
                        { id: 't3', title: 'Harvest okra · Plot P-034', status: 'NORMAL', time: '● 10:00 TODAY', desc: 'Pods 7–9cm length ready', border: '#16a34a', pill: 'pill-low' }
                      ].map(t => {
                        const isDone = completedTasks[t.id];
                        return (
                          <div
                            key={t.id}
                            onClick={() => toggleTaskCompleted(t.id)}
                            style={{
                              background: isDone ? '#f0fdf4' : '#ffffff',
                              borderRadius: '10px',
                              borderLeft: `4px solid ${isDone ? '#16a34a' : t.border}`,
                              border: isDone ? '1px solid #86efac' : '1px solid #e5e7eb',
                              padding: '10px 12px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justify: 'space-between'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                <span style={{ fontSize: '0.68rem', color: isDone ? '#16a34a' : t.border, fontWeight: '800' }}>{t.time}</span>
                                <span className={`pill ${isDone ? 'pill-compliant' : t.pill}`}>{isDone ? 'COMPLETED ✓' : t.status}</span>
                              </div>
                              <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: isDone ? '#15803d' : '#111827', textDecoration: isDone ? 'line-through' : 'none' }}>
                                {t.title}
                              </h4>
                              <p style={{ fontSize: '0.7rem', color: '#6b7280', margin: 0 }}>{t.desc}</p>
                            </div>
                            <div style={{
                              width: '24px', height: '24px', borderRadius: '50%',
                              background: isDone ? '#16a34a' : '#f1f5f9',
                              color: isDone ? '#fff' : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                              <CheckCircle2 size={16} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom 4-Tab Nav Bar */}
            <div style={{
              height: '52px', background: '#ffffff', borderTop: '1px solid #e5e7eb', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', alignItems: 'center', textAlign: 'center', fontSize: '0.68rem', fontWeight: '800', flexShrink: 0
            }}>
              <div onClick={() => setActiveTab('home')} style={{ color: activeTab === 'home' ? '#0c3619' : '#9ca3af', cursor: 'pointer' }}>
                <Home size={17} style={{ margin: '0 auto 2px' }} /> HOME
              </div>
              <div onClick={() => setActiveTab('log')} style={{ color: activeTab === 'log' ? '#0c3619' : '#9ca3af', cursor: 'pointer' }}>
                <ClipboardList size={17} style={{ margin: '0 auto 2px' }} /> LOG
              </div>
              <div onClick={() => setActiveTab('ai')} style={{ color: activeTab === 'ai' ? '#059669' : '#9ca3af', cursor: 'pointer' }}>
                <Sparkles size={17} style={{ margin: '0 auto 2px' }} /> AI
              </div>
              <div onClick={() => setActiveTab('tasks')} style={{ color: activeTab === 'tasks' ? '#d97706' : '#9ca3af', cursor: 'pointer' }}>
                <Calendar size={17} style={{ margin: '0 auto 2px' }} /> TASKS
              </div>
            </div>

            {/* Real-Time Announcement Push Modal (High Priority zIndex 800) */}
            {showNotificationModal && latestPushAnnouncement && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 800
              }}>
                <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', width: '100%', maxWidth: '320px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', animation: 'slideIn 0.2s ease-out' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Bell size={18} color="#d97706" />
                      <span style={{ fontWeight: '800', fontSize: '0.85rem', color: '#111827' }}>Cooperative Push Alert</span>
                    </div>
                    <button onClick={() => setShowNotificationModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                      <X size={18} />
                    </button>
                  </div>

                  <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '10px', padding: '12px', marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#78350f', marginBottom: '6px' }}>
                      {latestPushAnnouncement.title || 'Cooperative Broadcast Notice'}
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: '#92400e', lineHeight: 1.4, margin: 0, fontWeight: '700' }}>
                      "{latestPushAnnouncement.content}"
                    </p>
                  </div>

                  <div style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '16px' }}>
                    Dispatched by {latestPushAnnouncement.author || 'Liza Cruz (Admin)'} · {latestPushAnnouncement.date}
                  </div>

                  <button
                    onClick={() => setShowNotificationModal(false)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#0c3619', color: '#ffffff', fontWeight: '800', fontSize: '0.82rem', border: 'none', cursor: 'pointer' }}
                  >
                    Acknowledge Notice
                  </button>
                </div>
              </div>
            )}

            {/* Notification History List Sheet Modal */}
            {showHistoryModal && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 600
              }}>
                <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', width: '100%', maxWidth: '330px', maxHeight: '500px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Bell size={18} color="#d97706" />
                      <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', margin: 0 }}>Notification History ({announcements.length})</h3>
                    </div>
                    <button onClick={() => setShowHistoryModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                      <X size={18} />
                    </button>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                    {announcements.length === 0 ? (
                      <div style={{ fontSize: '0.78rem', color: '#6b7280', textAlign: 'center', padding: '20px' }}>No broadcast notifications yet</div>
                    ) : (
                      announcements.map((ann, idx) => (
                        <div
                          key={ann.id || idx}
                          onClick={() => { setSelectedAnnouncement(ann); setShowHistoryModal(false); setShowNotificationModal(true); }}
                          style={{
                            background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '10px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#78350f' }}>
                              "{ann.content}"
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#b45309', marginTop: '2px' }}>
                              Posted {ann.date}
                            </div>
                          </div>
                          <ChevronRight size={16} color="#d97706" />
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    onClick={() => setShowHistoryModal(false)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#0c3619', color: '#ffffff', fontWeight: '800', fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}
                  >
                    Close History
                  </button>
                </div>
              </div>
            )}

            {/* My Crops & Livestock Modal */}
            {showCropsModal && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 700
              }}>
                <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', width: '100%', maxWidth: '330px', maxHeight: '520px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sprout size={18} color="#0c3619" />
                      <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', margin: 0 }}>Crops & Livestock Directory</h3>
                    </div>
                    <button onClick={() => setShowCropsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                      <X size={18} />
                    </button>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                    {[
                      { title: 'Tomato (Diamante)', plot: 'Plot P-007', stage: 'Flowering', yield: '412 kg' },
                      { title: 'Eggplant (Mistisa)', plot: 'Plot P-021', stage: 'Vegetative', yield: '305 kg' },
                      { title: 'Okra (Smooth Green)', plot: 'Plot P-034', stage: 'Harvest', yield: '240 kg' },
                      { title: 'Squash (Suprema)', plot: 'Plot P-055', stage: 'Fruiting', yield: '158 kg' },
                      { title: 'Goat Herd GT-014', plot: 'Plot P-055', stage: '34 Head', yield: '+1.2 kg/wk' }
                    ].map(item => (
                      <div key={item.title} style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '0.82rem', color: '#111827' }}>{item.title}</div>
                          <div style={{ fontSize: '0.7rem', color: '#15803d' }}>{item.plot} · Stage: {item.stage}</div>
                        </div>
                        <span className="pill pill-seedling" style={{ fontSize: '0.7rem' }}>{item.yield}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowCropsModal(false)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#0c3619', color: '#ffffff', fontWeight: '800', fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}
                  >
                    Close Directory
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileAppSimulator;
