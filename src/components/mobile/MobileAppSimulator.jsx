import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
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
 Image as ImageIcon,
 User,
 Mail,
 CreditCard,
 Compass,
 Users,
 Settings,
 Globe,
 Moon,
 HelpCircle,
 Info
} from 'lucide-react';

const MobileAppSimulator = () => {
 const { loginAsRole, addFarmerSubmission, announcements, activePushNotice, currentUser } = useAuth();
 
 // Mobile app navigation state: 'splash', 'login', 'main'
 const [mobileScreen, setMobileScreen] = useState('home'); 
 const [mobileAuth, setMobileAuth] = useState(true);
 
 const [viewMode, setViewMode] = useState('device'); // 'device' or 'full'
 const [activeTab, setActiveTab] = useState('home'); // 'home', 'log', 'ai', 'tasks'
 
 // Modals state
 const [showNotificationModal, setShowNotificationModal] = useState(false);
 const [showHistoryModal, setShowHistoryModal] = useState(false);
 const [showCropsModal, setShowCropsModal] = useState(false);
 const [showProfileSettingsModal, setShowProfileSettingsModal] = useState(false);
 const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

 // Profile Management State matching screenshots
 const [profileData, setProfileData] = useState({
 name: 'Mang Juan Dela Cruz',
 subtitle: 'Farmer · Member since 2021',
 pgsBadge: 'PGS Certified',
 mobile: '+63 917 555 0142',
 email: 'mang.juan@farmer.ph',
 memberId: 'MRK-2021-00874',
 barangay: 'Sto. Niño, Sariaya, Quezon',
 coordinates: '13.9611° N, 121.5266° E',
 totalArea: '0.95 hectares',
 coop: 'Likasan Organic Farmers MPC',
 standing: 'Good · No violations',
 duesPaidUntil: 'Dec 2026',
 assignedPlots: [
 { id: 'P-007', crop: 'Okra', area: '0.4 ha', status: 'Active' },
 { id: 'P-021', crop: 'Ampalaya', area: '0.3 ha', status: 'Active' },
 { id: 'P-034', crop: 'Kamatis', area: '0.25 ha', status: 'Harvesting' }
 ],
 livestock: [
 { id: 'GT-014', title: 'Native Goats', count: '12 heads' }
 ]
 });

 // Settings view & preferences state
 const [profileSubView, setProfileSubView] = useState('profile'); // 'profile' or 'settings'
 const [settingsData, setSettingsData] = useState({
 pushNotifications: false,
 smsReminders: false,
 language: 'Tagalog',
 darkMode: false,
 offlineMode: true
 });
 const [activeSettingsDialog, setActiveSettingsDialog] = useState(null); // 'password' | 'privacy' | 'help' | 'about' | 'logout' | 'contact' | 'farm' | 'coop' | 'plot' | 'livestock'
  const [pinCurrent, setPinCurrent] = useState('');
  const [pinNew, setPinNew] = useState('');
  const [pinSuccessAlert, setPinSuccessAlert] = useState(false);
  const [cacheClearSuccess, setCacheClearSuccess] = useState(false); // 'password' | 'privacy' | 'help' | 'about'

 const [tempProfile, setTempProfile] = useState(profileData);
 const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

 const handleSaveProfile = (e) => {
 e.preventDefault();
 setProfileData({ ...tempProfile });
 setProfileSaveSuccess(true);
 setTimeout(() => {
 setProfileSaveSuccess(false);
 setShowProfileSettingsModal(false);
 }, 1000);
 };

 // Translation helper for English ⇄ Tagalog across simulator
 const isTl = settingsData.language === 'Tagalog';
 const t = (en, tl) => (isTl ? (tl || en) : en);

  // Completed tasks state & Dynamic Real-Time Task Prioritization
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Apply compost - Plot P-021', status: 'OVERDUE', time: 'Yesterday · 04:00 PM', dueDate: 'Yesterday', dueTime: '04:00 PM', desc: 'Missed scheduled cycle - re-do today', border: '#ef4444', badgeBg: '#fee2e2', badgeColor: '#dc2626', urgency: 'OVERDUE', plot: 'Plot P-021', completedAt: null },
    { id: 't2', title: 'Water Plot P-007 (Tomato)', status: 'URGENT', time: 'Today · 06:00 AM', dueDate: 'Today', dueTime: '06:00 AM', desc: 'Heat advisory - double the morning ratio', border: '#f59e0b', badgeBg: '#fef3c7', badgeColor: '#d97706', urgency: 'URGENT', plot: 'Plot P-007', completedAt: null },
    { id: 't3', title: 'Feed Goat Herd GT-014', status: 'URGENT', time: 'Today · 07:30 AM', dueDate: 'Today', dueTime: '07:30 AM', desc: 'Morning ration + 5kg forage', border: '#f59e0b', badgeBg: '#fef3c7', badgeColor: '#d97706', urgency: 'URGENT', plot: 'Barn Shed 2', completedAt: null },
    { id: 't4', title: 'Harvest okra · Plot P-034', status: 'NORMAL', time: 'Today · 04:00 PM', dueDate: 'Today', dueTime: '04:00 PM', desc: 'Pods 7-9cm length ready', border: '#cbd5e1', badgeBg: '#f1f5f9', badgeColor: '#64748b', urgency: 'NORMAL', plot: 'Plot P-034', completedAt: null },
    { id: 't5', title: 'Water Plot P-002', status: 'NORMAL', time: 'Today · 05:30 PM', dueDate: 'Today', dueTime: '05:30 PM', desc: 'Evening ration - 80L drip', border: '#cbd5e1', badgeBg: '#f1f5f9', badgeColor: '#64748b', urgency: 'NORMAL', plot: 'Plot P-002', completedAt: 'Today · 06:14 AM' }
  ]);
  const [completedTasks, setCompletedTasks] = useState({ t5: true });
  const [taskCompletedTimes, setTaskCompletedTimes] = useState({ t5: 'Today · 06:14 AM' });
  const [taskFilter, setTaskFilter] = useState('ALL');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('Morning Drip Irrigation · Plot P-007');
  const [newTaskPlot, setNewTaskPlot] = useState('Plot P-007');
  const [newTaskDueDate, setNewTaskDueDate] = useState('Today');
  const [newTaskDueTime, setNewTaskDueTime] = useState('08:00 AM');
  const [newTaskUrgency, setNewTaskUrgency] = useState('URGENT');
  const [newTaskCategory, setNewTaskCategory] = useState('Irrigation');
  const [newTaskDesc, setNewTaskDesc] = useState('Inspect drip emitters and apply 15L organic foliar cycle.');
  const [selectedPlotDetail, setSelectedPlotDetail] = useState(null);

  const TASK_TEMPLATES = [
    { title: '💧 Morning Drip Irrigation', plot: 'Plot P-007', urgency: 'URGENT', category: 'Irrigation', dueDate: 'Today', dueTime: '06:00 AM', desc: 'Inspect drip emitters and apply 15L organic foliar cycle.' },
    { title: '🌿 Bed Weeding & Cultivation', plot: 'Plot P-021', urgency: 'NORMAL', category: 'Crop Care', dueDate: 'Today', dueTime: '08:30 AM', desc: 'Remove surface weeds around eggplant root zones.' },
    { title: '🧪 Organic Neem Spray Application', plot: 'Plot P-007', urgency: 'URGENT', category: 'Pest Control', dueDate: 'Today', dueTime: '02:00 PM', desc: 'Apply organic neem leaf repellent against fruit borers.' },
    { title: '🌱 Vermicompost Soil Top-Dressing', plot: 'Plot P-014', urgency: 'NORMAL', category: 'Fertilizer', dueDate: 'Tomorrow', dueTime: '07:00 AM', desc: 'Spread 15kg certified organic vermicompost per bed.' },
    { title: '🐐 Feed Goat Herd & Clean Pens', plot: 'Barn Shed 2', urgency: 'URGENT', category: 'Livestock', dueDate: 'Today', dueTime: '07:30 AM', desc: 'Deliver 25kg cut napier grass and check water troughs.' },
    { title: '🍅 Harvest Ripe Produce (PGS Spec)', plot: 'Plot P-034', urgency: 'NORMAL', category: 'Harvest', dueDate: 'Today', dueTime: '04:00 PM', desc: 'Harvest Grade A organic crops for cooperative packhouse.' }
  ];

  const handleCreateNewTask = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const finalTitle = newTaskTitle.trim() || `${newTaskCategory || 'Field Task'} · ${newTaskPlot || 'Plot P-007'}`;
    const formattedDue = `${newTaskDueDate || 'Today'} · ${newTaskDueTime || '08:00 AM'}`;
    const newTaskObj = {
      id: `task-${Date.now()}`,
      title: finalTitle,
      status: newTaskUrgency,
      time: formattedDue,
      dueDate: newTaskDueDate || 'Today',
      dueTime: newTaskDueTime || '08:00 AM',
      desc: newTaskDesc || `Scheduled for ${newTaskPlot}`,
      border: newTaskUrgency === 'OVERDUE' ? '#ef4444' : (newTaskUrgency === 'URGENT' ? '#f59e0b' : '#cbd5e1'),
      badgeBg: newTaskUrgency === 'OVERDUE' ? '#fee2e2' : (newTaskUrgency === 'URGENT' ? '#fef3c7' : '#f1f5f9'),
      badgeColor: newTaskUrgency === 'OVERDUE' ? '#dc2626' : (newTaskUrgency === 'URGENT' ? '#d97706' : '#64748b'),
      urgency: newTaskUrgency,
      plot: newTaskPlot,
      completedAt: null
    };
    setTasks(prev => [newTaskObj, ...prev]);
    setShowAddTaskModal(false);
    setNewTaskTitle('Morning Drip Irrigation · Plot P-007');
    setNewTaskDesc('');
  };

 const handleApplyRFRecommendation = () => {
 const rfTask1 = {
 id: `task-rf1-${Date.now()}`,
 title: `💧 RF Irrigation: ${aiResult.crop}`,
 status: 'URGENT',
 time: '● 06:00 TODAY',
 desc: aiResult.irrigationRec || 'Drip fertigation ratio calibrated by RF Model.',
 border: '#f59e0b',
 badgeBg: '#fef3c7',
 badgeColor: '#d97706',
 urgency: 'URGENT',
 plot: 'Plot P-007'
 };
 const rfTask2 = {
 id: `task-rf2-${Date.now()}`,
 title: `🌱 RF Soil Prep & Fertigation: ${aiResult.crop}`,
 status: 'URGENT',
 time: '● 08:30 TODAY',
 desc: aiResult.fertilizerRec || 'Organic vermicompost + bio-fertilizer application.',
 border: '#f59e0b',
 badgeBg: '#fef3c7',
 badgeColor: '#d97706',
 urgency: 'URGENT',
 plot: 'Plot P-007'
 };

 setTasks(prev => [rfTask1, rfTask2, ...prev]);
 setActiveTab('tasks');
 alert(
 isTl 
 ? `Nailapat ang ${aiResult.crop} sa Plot P-007!\nNalikha ang 2 bagong priority tasks sa checklist para sa bukid.`
 : `Successfully applied ${aiResult.crop} recommendation to Plot P-007!\nCreated 2 high-priority tasks in your Smart Task checklist.`
 );
 };

  // REAL-TIME AUTO POPUP FOR EVERY NEW DIRECTIVE / ANNOUNCEMENT
  useEffect(() => {
    if (activePushNotice) {
      setSelectedAnnouncement(activePushNotice);
      setShowHistoryModal(false); 
      setShowNotificationModal(true);
      return;
    }

    // On initial load, verify if the latest directive has been acknowledged
    const latestDirect = (farmerDirectives && farmerDirectives[0]) || (announcements && announcements[0]);
    if (latestDirect && latestDirect.id) {
      try {
        const ackId = localStorage.getItem('marikha_mobile_ack_notice_id');
        if (ackId !== String(latestDirect.id)) {
          setSelectedAnnouncement(latestDirect);
          setShowNotificationModal(true);
        }
      } catch (e) {}
    }
  }, [activePushNotice, announcements]);

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

 // RF Recommendation State (Real-time ML Data Pipeline)
 const [season, setSeason] = useState('Tag-init (Dry)');
 const [location, setLocation] = useState('Block A · Cupang');
 const [soil, setSoil] = useState('Loam · moist');
 const [soilMoisture, setSoilMoisture] = useState(65);
 const [temperature, setTemperature] = useState(29);
 const [nitrogenLevel, setNitrogenLevel] = useState('Medium (45 N)');
 const [isCalculatingAI, setIsCalculatingAI] = useState(false);
 const [aiResult, setAiResult] = useState({
 crop: 'Tomato Diamante Max',
 confidence: '94.2%',
 output: '450 kg',
 sacks: '~ 9 sacks',
 harvestWindow: 'Nov 20 - Dec 05, 2026',
 currentStage: 'Flowering & Fruit Setting (Stage 3 of 5)',
 nextStagePrediction: 'Fruit Maturation & Ripening',
 daysToNextStage: '12 days',
 fertilizerRec: 'Vermicompost (2.5 kg/bed) + Foliar Spray',
 fertilizerDosage: '2.5 kg per bed (Apply every 14 days)',
 fertilizerBoost: '+15% yield boost at Stage 3 Flowering',
 irrigationRec: '20L/bed daily (Drip Irrigation)',
 marketPrice: '₱65.00 / kg'
 });

 const farmerDirectives = (announcements || []).filter(a => 
    !a.archived && (
      a.targetAudience === 'farmers' || 
      a.targetAudience === 'all' || 
      !a.targetAudience || 
      (a.title && a.title.toLowerCase().includes('farmer')) || 
      (a.audienceLabel && a.audienceLabel.toLowerCase().includes('farmer'))
    )
  );
  const latestPushAnnouncement = selectedAnnouncement || activePushNotice || farmerDirectives[0] || (announcements && announcements[0]);
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

 const finalPhotoUrl = photoPreviewUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80';

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
 alert(' Activity Log submitted directly to Farm Staff for cloud validation & saved to Supabase!');
 setActiveTab('home');
 }, 600);
 };

 const handleGetSmartRecommendation = () => {
 setIsCalculatingAI(true);
 setTimeout(async () => {
 let recCrop = 'Tomato Diamante Max';
 let confidence = '94.2%';
 let estimatedYield = '450 kg';
 let sacks = '~ 9 sacks';
 let harvestWindow = 'Nov 20 - Dec 05, 2026';
 let currentStage = 'Flowering & Fruit Setting (Stage 3 of 5)';
 let nextStagePrediction = 'Fruit Maturation & Ripening';
 let daysToNextStage = '12 days';
 let fertilizerRec = 'Vermicompost (2.5 kg/bed) + Foliar Spray';
 let fertilizerDosage = '2.5 kg per bed (Apply every 14 days)';
 let fertilizerBoost = '+15% yield boost at Stage 3 Flowering';
 let irrigationRec = '20L/bed daily (Drip Irrigation)';
 let marketPrice = '₱65.00 / kg';

 if (season === 'Tag-ulan (Wet)') {
 if (soil.includes('Clay')) {
 recCrop = 'Eggplant Mistisa F1';
 confidence = '96.8%';
 estimatedYield = '520 kg';
 sacks = '~ 10.4 sacks';
 harvestWindow = 'Dec 10 - Jan 15, 2027';
 fertilizerRec = 'Organic Complete (14-14-14) + Neem Cake';
 fertilizerDosage = '3.0 kg per bed (Apply every 10 days)';
 fertilizerBoost = '+18% fruit weight gain';
 irrigationRec = '10L/bed (Alternate Days)';
 marketPrice = '₱55.00 / kg';
 } else {
 recCrop = 'Squash Suprema F1';
 confidence = '91.5%';
 estimatedYield = '680 kg';
 sacks = '~ 13.6 sacks';
 harvestWindow = 'Jan 05 - Feb 10, 2027';
 fertilizerRec = 'Chicken Manure Compost + Potassium Booster';
 fertilizerDosage = '4.0 kg per bed';
 fertilizerBoost = '+22% vine expansion rate';
 irrigationRec = 'Rainfed + Supplementary Drip';
 marketPrice = '₱40.00 / kg';
 }
 } else if (soilMoisture < 45) {
 recCrop = 'Ampalaya Galaxy Max';
 confidence = '93.1%';
 estimatedYield = '390 kg';
 sacks = '~ 7.8 sacks';
 harvestWindow = 'Nov 15 - Dec 20, 2026';
 fertilizerRec = 'Bio-Organic Liquid Fertilizer + Mulching';
 fertilizerDosage = '1.5 L diluted per 100L water';
 fertilizerBoost = '+12% drought resilience';
 irrigationRec = '25L/bed daily';
 marketPrice = '₱80.00 / kg';
 }

 setAiResult({
 crop: recCrop,
 confidence,
 output: estimatedYield,
 sacks,
 harvestWindow,
 currentStage,
 nextStagePrediction,
 daysToNextStage,
 fertilizerRec,
 fertilizerDosage,
 fertilizerBoost,
 irrigationRec,
 marketPrice
 });
 setIsCalculatingAI(false);

 try {
 if (supabase) {
 await supabase.from('crop_recommendations').insert([{
 farmer_name: profileData.name || 'Mang Juan Dela Cruz',
 location: location,
 season: season,
 soil_type: soil,
 soil_moisture: soilMoisture,
 recommended_crop: recCrop,
 confidence_score: confidence,
 predicted_yield_kg: estimatedYield,
 harvest_window: harvestWindow,
 created_at: new Date().toISOString()
 }]);
 }
 } catch (err) {
 console.log('Supabase sync crop_recommendations:', err);
 }
 }, 600);
 };

  const toggleTaskCompleted = (taskId) => {
    setCompletedTasks(prev => {
      const willBeDone = !prev[taskId];
      if (willBeDone) {
        const nowStr = `Today · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        setTaskCompletedTimes(times => ({ ...times, [taskId]: nowStr }));
      }
      return {
        ...prev,
        [taskId]: willBeDone
      };
    });
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
 onClick={() => setSettingsData(prev => ({ ...prev, language: prev.language === 'Tagalog' ? 'English' : 'Tagalog' }))}
 style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '5px 10px', borderRadius: '8px', fontSize: '0.74rem', fontWeight: '800', cursor: 'pointer' }}
 >
 {settingsData.language === 'Tagalog' ? '🇵🇭 Tagalog' : '🇺🇸 English'}
 </button>
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

 {/* ================= SCREEN A: SPLASH SCREEN (MATCHING IMAGE 1) ================= */}
 {mobileScreen === 'splash' && (
 <div style={{ flex: 1, background: '#00843D', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '50px' }}>
 <div style={{
 width: '52px', height: '52px', borderRadius: '50%', border: '3px solid #ffffff',
 display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'
 }}>
 <div style={{ position: 'absolute', width: '38px', height: '18px', borderRadius: '9px', border: '2.5px solid #ffffff', top: '4px' }} />
 <div style={{ position: 'absolute', width: '42px', height: '22px', borderRadius: '11px', border: '2.5px solid #ffffff', top: '14px' }} />
 <div style={{ position: 'absolute', width: '46px', height: '26px', borderRadius: '13px', border: '2.5px solid #ffffff', top: '24px' }} />
 </div>
 <h1 style={{ fontSize: '2.2rem', fontWeight: '900', letterSpacing: '2px', color: '#ffffff', margin: 0 }}>MARIKHA</h1>
 </div>

 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', marginTop: '30px' }}>
 <div style={{ width: '36px', height: '36px', border: '4px solid #ffffff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
 <span style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: '800', letterSpacing: '0.5px' }}>Loading...</span>
 </div>

 <button
 onClick={() => setMobileScreen('login')}
 style={{ marginTop: '50px', background: '#ffffff', color: '#00843D', padding: '12px 28px', borderRadius: '24px', fontSize: '0.88rem', fontWeight: '800', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
 >
 Continue to Login 
 </button>
 </div>
 )}

 {/* ================= SCREEN B: MOBILE LOGIN SCREEN (MATCHING IMAGE 2) ================= */}
 {(mobileScreen === 'login' || (!mobileAuth && mobileScreen !== 'splash')) && (
 <div style={{ flex: 1, background: '#00843D', padding: '40px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
 {/* MARIKHA Top Horizontal Logo */}
 <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
 <div style={{
 width: '48px', height: '48px', borderRadius: '50%', border: '3px solid #ffffff',
 display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'
 }}>
 <div style={{ position: 'absolute', width: '36px', height: '18px', borderRadius: '9px', border: '2.5px solid #ffffff', top: '4px' }} />
 <div style={{ position: 'absolute', width: '40px', height: '22px', borderRadius: '11px', border: '2.5px solid #ffffff', top: '14px' }} />
 <div style={{ position: 'absolute', width: '44px', height: '26px', borderRadius: '13px', border: '2.5px solid #ffffff', top: '24px' }} />
 </div>
 <h1 style={{ fontSize: '2.1rem', fontWeight: '900', letterSpacing: '2px', color: '#ffffff', margin: 0 }}>MARIKHA</h1>
 </div>

 <p style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', marginBottom: '36px', textAlign: 'center' }}>Welcome Back!</p>

 <form onSubmit={handleMobileLogin} style={{ width: '100%', maxWidth: '320px' }}>
 <div style={{ width: '100%', marginBottom: '20px' }}>
 <label style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff', display: 'block', marginBottom: '8px' }}>Username</label>
 <input
 type="text"
 value={mobileNumber}
 onChange={(e) => setMobileNumber(e.target.value)}
 placeholder="@Kuya Bert"
 style={{ width: '100%', padding: '14px 18px', borderRadius: '16px', border: 'none', background: '#ffffff', fontSize: '0.95rem', outline: 'none', color: '#1e293b', fontWeight: '700', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
 />
 </div>

 <div style={{ width: '100%', marginBottom: '24px' }}>
 <label style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff', display: 'block', marginBottom: '8px' }}>Password</label>
 <input
 type="password"
 value={pinCode}
 onChange={(e) => setPinCode(e.target.value)}
 placeholder="*******"
 style={{ width: '100%', padding: '14px 18px', borderRadius: '16px', border: 'none', background: '#ffffff', fontSize: '0.95rem', outline: 'none', color: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
 />
 </div>

 <button
 type="submit"
 style={{
 width: '100%', padding: '14px', borderRadius: '16px', background: '#ffffff', color: '#00843D', fontWeight: '800', fontSize: '1rem', border: 'none', marginBottom: '28px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
 }}
 >
 Sign In
 </button>
 </form>

 <div style={{ textAlign: 'center', marginTop: '10px' }}>
 <p style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: '800', margin: '0 0 4px 0', cursor: 'pointer' }}>Forgot Password?</p>
 <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', fontWeight: '600', margin: 0 }}>Contact Admin</p>
 </div>
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
 
 {/* Top MARIKHA Logo Header */}
 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
 <div style={{
 width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #ffffff',
 display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'
 }}>
 <div style={{ position: 'absolute', width: '22px', height: '11px', borderRadius: '5px', border: '1.5px solid #ffffff', top: '2px' }} />
 <div style={{ position: 'absolute', width: '25px', height: '13px', borderRadius: '6px', border: '1.5px solid #ffffff', top: '8px' }} />
 <div style={{ position: 'absolute', width: '28px', height: '15px', borderRadius: '7px', border: '1.5px solid #ffffff', top: '14px' }} />
 </div>
 <span style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '1.5px', color: '#ffffff' }}>MARIKHA</span>
 </div>

 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
 <div>
 <div style={{ fontSize: '0.7rem', color: '#86efac', textTransform: 'uppercase', tracking: '0.5px', fontWeight: '800' }}>MAGANDANG ARAW,</div>
 <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '2px 0 0 0' }}>
 Kuya Bert 
 </h2>
 </div>

 {/* Header Notification Bell & Exit Buttons */}
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 <button
 onClick={() => setSettingsData(prev => ({ ...prev, language: prev.language === 'Tagalog' ? 'English' : 'Tagalog' }))}
 style={{
 background: 'rgba(255,255,255,0.18)',
 color: '#ffffff',
 border: '1px solid rgba(255,255,255,0.25)',
 padding: '5px 9px',
 borderRadius: '12px',
 fontSize: '0.68rem',
 fontWeight: '800',
 cursor: 'pointer'
 }}
 >
 {settingsData.language === 'Tagalog' ? '🇵🇭 TL' : '🇺🇸 EN'}
 </button>
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
 Tuesday, July 21 · Antipolo - Rizal
 </div>

 {/* Weather Cards Grid */}
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
 <div style={{ background: 'rgba(255,255,255,0.12)', padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)' }}>
 <div style={{ fontSize: '0.65rem', color: '#86efac', textTransform: 'uppercase', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
 <CloudSun size={12} /> TEMPERATURE
 </div>
 <div style={{ fontSize: '1.25rem', fontWeight: '800', margin: '2px 0' }}>28 °C</div>
 <div style={{ fontSize: '0.68rem', color: '#a7f3d0' }}>Maaraw · Light Breeze</div>
 </div>
 <div style={{ background: 'rgba(255,255,255,0.12)', padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)' }}>
 <div style={{ fontSize: '0.65rem', color: '#86efac', textTransform: 'uppercase', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
 <Droplets size={12} /> RAINFALL
 </div>
 <div style={{ fontSize: '1.25rem', fontWeight: '800', margin: '2px 0' }}>2.3 mm</div>
 <div style={{ fontSize: '0.68rem', color: '#a7f3d0' }}>Low Chance of Rain</div>
 </div>
 </div>
 </div>

 {/* PROMINENT LIVE FARMER FIELD DIRECTIVE BANNER */}
      {latestPushAnnouncement && (
        <div 
          onClick={() => {
            setSelectedAnnouncement(latestPushAnnouncement);
            setShowNotificationModal(true);
          }}
          style={{
            margin: '14px 18px 0 18px',
            background: latestPushAnnouncement.targetAudience === 'farmers' ? '#ecfdf5' : '#fffbeb',
            border: latestPushAnnouncement.targetAudience === 'farmers' ? '1.5px solid #86efac' : '1.5px solid #fde68a',
            borderRadius: '14px',
            padding: '12px 14px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a', display: 'inline-block', boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.25)' }} />
              <span style={{ fontSize: '0.68rem', fontWeight: '800', color: latestPushAnnouncement.targetAudience === 'farmers' ? '#166534' : '#b45309', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {latestPushAnnouncement.targetAudience === 'farmers' ? '🌾 Farmer Activity Directive' : '📢 Cooperative Push Directive'}
              </span>
            </div>
            <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#64748b' }}>
              {latestPushAnnouncement.date || 'Today'}
            </span>
          </div>
          <strong style={{ fontSize: '0.84rem', color: '#0f172a', display: 'block', marginBottom: '2px', lineHeight: 1.3 }}>
            {latestPushAnnouncement.title}
          </strong>
          <p style={{ fontSize: '0.76rem', color: '#475569', margin: '0 0 6px 0', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {latestPushAnnouncement.content}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem' }}>
            <span style={{ color: '#64748b', fontWeight: '600' }}>By {latestPushAnnouncement.author || 'Super Admin'}</span>
            <span style={{ color: '#16a34a', fontWeight: '800' }}>Tap to view full details →</span>
          </div>
        </div>
      )}

      {/* Dashboard Options */}
 <div style={{ padding: '18px' }}>
 <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#111827', marginBottom: '14px' }}>
 What would you like to do?
 </h3>

 {/* 4 Big Touch Tiles Grid (Matching Wireframe Image 100%) */}
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
 onClick={() => setActiveTab('tasks')}
 style={{
 background: '#3b2d22', color: '#ffffff', borderRadius: '16px', padding: '16px 14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '120px'
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
 <div style={{ fontWeight: '800', fontSize: '0.85rem', lineHeight: 1.2 }}>SMART RF RECOMMENDATION</div>
 </div>
 </div>

 
					
					{/* ADVISER CASE: Assigned Crops & Quick Daily Field Task */}
					<div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '14px', marginTop: '12px' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
							<span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#111827' }}>MY PLANTED CROPS</span>
							<span style={{ fontSize: '0.68rem', color: '#15803d', fontWeight: '700' }}>3 Crops Registered</span>
						</div>
						<div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
							<div style={{ flex: 1, background: '#f5f3ff', border: '1.5px solid #c084fc', padding: '8px 10px', borderRadius: '10px', textAlign: 'center' }}>
								<span style={{ fontSize: '1.1rem' }}>🍆</span>
								<div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#6b21a8' }}>Eggplant</div>
								<div style={{ fontSize: '0.62rem', color: '#7e22ce' }}>Plot 1 (Aug 1)</div>
							</div>
							<div style={{ flex: 1, background: '#f0fdf4', border: '1.5px solid #86efac', padding: '8px 10px', borderRadius: '10px', textAlign: 'center' }}>
								<span style={{ fontSize: '1.1rem' }}>🌱</span>
								<div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#166534' }}>Sitaw</div>
								<div style={{ fontSize: '0.62rem', color: '#15803d' }}>Plot 2 (Jul 10)</div>
							</div>
							<div style={{ flex: 1, background: '#ecfdf5', border: '1.5px solid #6ee7b7', padding: '8px 10px', borderRadius: '10px', textAlign: 'center' }}>
								<span style={{ fontSize: '1.1rem' }}>🌿</span>
								<div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#065f46' }}>Okra</div>
								<div style={{ fontSize: '0.62rem', color: '#047857' }}>Plot 3 (Jun 20)</div>
							</div>
						</div>

						{/* Daily Activity Logging Shortcut: Aug 2 - Watering Plot 1 & 2 */}
						<div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<div>
								<div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0f172a' }}>Today's Assigned Task</div>
								<div style={{ fontSize: '0.68rem', color: '#64748b' }}>Aug 2 · Watering Plot 1 & Plot 2 (10L)</div>
							</div>
							<button 
								onClick={() => {
									setSelectedPlot('Plot 1 (Plot P-001)');
									setActivity('Watering');
									setInputAmount(10);
									setActiveTab('log');
								}}
								style={{
									background: '#11592c', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '800', cursor: 'pointer'
								}}
							>
								Log Task Now →
							</button>
						</div>
					</div>


{/* ADVISER RECOMMENDATION: Eggplant Lifecycle & Actual Yield vs Prediction Card */}
					<div style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #86efac', padding: '16px', marginTop: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								<span style={{ fontSize: '1.4rem' }}>🍆</span>
								<div>
									<h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#111827', margin: 0 }}>
										Eggplant · Mistisa F1 (Plot P-021)
									</h4>
									<span style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: '700' }}>
										Planted: Sep 17, 2024 (Day 1)
									</span>
								</div>
							</div>
							<span style={{ fontSize: '0.68rem', background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '12px', fontWeight: '800' }}>
								Stage 4: Harvesting
							</span>
						</div>

						{/* 4-Stage Stepper: Seedling -> Vegetative -> Fruiting -> Harvesting */}
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '12px 0 14px 0' }}>
							{[
								{ name: 'Germination', days: 'Planted Aug 1' },
								{ name: 'Vegetative', days: 'Predict Sept 1' },
								{ name: 'Flowering', days: 'Predict Oct 15' },
								{ name: 'Fruiting & Harvest', days: 'Predict Dec 20' }
							].map((stg, sIdx) => (
								<div key={stg.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
									<div style={{
										width: '24px', height: '24px', borderRadius: '50%',
										background: '#15803d', color: '#ffffff',
										fontSize: '0.65rem', fontWeight: '800',
										display: 'flex', alignItems: 'center', justifyContent: 'center'
									}}>
										✓
									</div>
									<span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#15803d', marginTop: '4px' }}>
										{stg.name}
									</span>
									<span style={{ fontSize: '0.58rem', color: '#64748b' }}>
										{stg.days}
									</span>
								</div>
							))}
						</div>

						{/* Actual Yield vs Prediction Comparison Card */}
						<div style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '12px' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
								<span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase' }}>
									Actual Yield vs Prediction
								</span>
								<span style={{ fontSize: '0.68rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '8px', fontWeight: '800' }}>
									94.0% Model Accuracy
								</span>
							</div>

							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
								<div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #86efac' }}>
									<div style={{ fontSize: '0.65rem', color: '#64748b' }}>Predicted Target</div>
									<div style={{ fontSize: '1rem', fontWeight: '900', color: '#15803d' }}>420 kg</div>
									<div style={{ fontSize: '0.65rem', color: '#15803d', fontWeight: '700' }}>Target: Dec 20, 2024</div>
								</div>
								<div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #fdba74' }}>
									<div style={{ fontSize: '0.65rem', color: '#64748b' }}>Actual Harvest Input</div>
									<div style={{ fontSize: '1rem', fontWeight: '900', color: '#ea580c' }}>395 kg</div>
									<div style={{ fontSize: '0.65rem', color: '#ea580c', fontWeight: '700' }}>Logged: Jan 15, 2025</div>
								</div>
							</div>

							<div style={{ fontSize: '0.7rem', color: '#1e293b', background: '#ffffff', padding: '6px 10px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', border: '1px solid #e2e8f0' }}>
								<span>Harvest Variance: <strong>-25 kg (-5.9%)</strong></span>
								<span style={{ color: '#15803d', fontWeight: '800' }}>Passed Organic Standard</span>
							</div>
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

 {/* ----- LOG TAB (MATCHING IMAGES 2 & 3) ----- */}
 {activeTab === 'log' && (
 <div>
 {/* Top Sub Header Banner */}
 <div style={{ background: '#0c3619', color: '#ffffff', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
 <button
 onClick={() => setActiveTab('home')}
 style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
 >
 <ArrowLeft size={16} />
 </button>
 <div>
 <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>Log Activity</h3>
 <span style={{ fontSize: '0.72rem', color: '#86efac', fontWeight: '600' }}>Punan ang form sa ibaba</span>
 </div>
 </div>

 <div style={{ padding: '16px' }}>
 {/* Top Category Toggle Pill (Crops vs Livestock) */}
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#e2eae0', padding: '3px', borderRadius: '14px', marginBottom: '16px' }}>
 <button
 onClick={() => setLogType('crops')}
 style={{
 padding: '10px', borderRadius: '11px', fontWeight: '800', fontSize: '0.82rem', border: 'none', cursor: 'pointer',
 background: logType === 'crops' ? '#0c3619' : 'transparent',
 color: logType === 'crops' ? '#ffffff' : '#4b5563',
 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
 }}
 >
 <Sprout size={15} /> CROPS
 </button>
 <button
 onClick={() => setLogType('livestock')}
 style={{
 padding: '10px', borderRadius: '11px', fontWeight: '800', fontSize: '0.82rem', border: 'none', cursor: 'pointer',
 background: logType === 'livestock' ? '#0c3619' : 'transparent',
 color: logType === 'livestock' ? '#ffffff' : '#4b5563',
 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
 }}
 >
 <Beef size={15} /> LIVESTOCK
 </button>
 </div>

 <form onSubmit={handleLogSubmit}>
 {/* 1. Select Crop Activity Grid */}
 <div style={{ marginBottom: '16px' }}>
 <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0c3619', display: 'block', marginBottom: '8px' }}>
 1. Select Crop Activity
 </label>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
 padding: '14px 10px', borderRadius: '14px',
 background: isSel ? '#0c3619' : '#ffffff',
 color: isSel ? '#ffffff' : '#1e293b',
 border: isSel ? '2px solid #0c3619' : '1px solid #cbd5e1',
 fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer',
 display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
 boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
 }}
 >
 <Icon size={22} color={isSel ? '#ffffff' : '#0c3619'} />
 {act.name}
 </button>
 );
 })}
 </div>
 </div>

 {/* 2. Select Plot Number */}
 <div style={{ marginBottom: '16px' }}>
 <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0c3619', display: 'block', marginBottom: '8px' }}>
 2. Select Plot Number
 </label>
 <select
 value={selectedPlot}
 onChange={(e) => setSelectedPlot(e.target.value)}
 style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', border: '1px solid #cbd5e1', background: '#dcfce7', color: '#15803d', fontSize: '0.9rem', fontWeight: '800', outline: 'none' }}
 >
 <option value="Plot P-007">Plot P-007 (Tomato Diamante)</option>
 <option value="Plot P-021">Plot P-021 (Eggplant Mistisa)</option>
 <option value="Plot P-034">Plot P-034 (Okra Smooth Green)</option>
 <option value="Plot P-055">Plot P-055 (Squash Suprema)</option>
 </select>
 </div>

 {/* 3. Input Amount (Liters) */}
 <div style={{ marginBottom: '16px' }}>
 <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0c3619', display: 'block', marginBottom: '8px' }}>
 3. Input Amount (Liters)
 </label>
 <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #cbd5e1', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
 <button
 type="button"
 onClick={() => setInputAmount(Math.max(1, inputAmount - 1))}
 style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#3b2d22', color: '#fff', fontWeight: '800', fontSize: '1.4rem', border: 'none', cursor: 'pointer' }}
 >
 -
 </button>
 <div style={{ textAlign: 'center' }}>
 <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0f172a' }}>{inputAmount}</span>
 <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', display: 'block' }}> Liters</span>
 </div>
 <button
 type="button"
 onClick={() => setInputAmount(inputAmount + 1)}
 style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#0c3619', color: '#fff', fontWeight: '800', fontSize: '1.4rem', border: 'none', cursor: 'pointer' }}
 >
 +
 </button>
 </div>

 {/* 4 Quick addition pills */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
 {[5, 10, 25, 50].map(addVal => (
 <button
 key={addVal}
 type="button"
 onClick={() => setInputAmount(inputAmount + addVal)}
 style={{ padding: '8px', borderRadius: '12px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#1e293b', fontWeight: '800', fontSize: '0.82rem', cursor: 'pointer' }}
 >
 +{addVal}
 </button>
 ))}
 </div>
 </div>

 {/* 4. Take a Photo (Required) */}
 <div style={{ marginBottom: '16px' }}>
 <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0c3619', display: 'block', marginBottom: '8px' }}>
 4. Take a Photo <span style={{ color: '#dc2626' }}>(Required)</span>
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
 border: '2px dashed #16a34a', borderRadius: '16px', padding: '20px 16px', background: photoAttached ? '#f0fdf4' : '#ffffff', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease'
 }}
 >
 {photoPreviewUrl ? (
 <div>
 <img
 src={photoPreviewUrl}
 alt="Uploaded proof"
 style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '10px' }}
 />
 <div style={{ fontWeight: '800', fontSize: '0.85rem', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
 <CheckCircle2 size={16} /> PHOTO READY (Click to change)
 </div>
 </div>
 ) : (
 <div>
 <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: '#0c3619', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
 <Camera size={26} />
 </div>
 <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#0c3619', marginBottom: '4px' }}>
 TAKE PHOTO PROOF
 </div>
 <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
 Para mapatunayan ang inyong aktibidad sa Farm Staff
 </div>
 </div>
 )}
 </div>
 </div>

 {/* 5. Note (Optional) */}
 <div style={{ marginBottom: '20px' }}>
 <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0c3619', display: 'block', marginBottom: '8px' }}>
 5. Note (Optional)
 </label>
 <textarea
 value={logNote}
 onChange={(e) => setLogNote(e.target.value)}
 placeholder="Halimbawa: ginawa kaninang umaga, malakas ang ulan kagabi.."
 rows={3}
 style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', color: '#0f172a' }}
 />
 </div>

 <button
 type="submit"
 style={{
 width: '100%', padding: '16px', borderRadius: '16px', background: '#15803d', color: '#ffffff', fontWeight: '900', fontSize: '0.95rem', border: 'none', marginBottom: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
 }}
 >
 <UploadCloud size={18} /> SUBMIT LOG FOR VALIDATION
 </button>
 </form>
 </div>
 </div>
 )}

 {/* ----- RF TAB ----- */}
 {activeTab === 'ai' && (
 <div>
 <div style={{ background: '#059669', color: '#ffffff', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
 <button onClick={() => setActiveTab('home')} style={{ color: '#fff', background: 'none', border: 'none' }}><ArrowLeft size={18} /></button>
 <div>
 <h3 style={{ fontSize: '0.95rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
 <Sparkles size={15} color="#86efac" /> Random Forest Recommendations
 </h3>
 <span style={{ fontSize: '0.7rem', color: '#a7f3d0' }}>Smart na payo para sa inyong sakahan</span>
 </div>
 </div>

 <div style={{ padding: '16px' }}>
 {/* Live Telemetry Sensor Status Banner */}
 <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '12px', padding: '10px 14px', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 <Droplets size={18} color="#059669" />
 <div>
 <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#047857', textTransform: 'uppercase' }}> LIVE FIELD SENSORS</div>
 <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#064e3b' }}>
 Moisture: {soilMoisture}% · Temp: {temperature}°C
 </div>
 </div>
 </div>
 <span style={{ background: '#10b981', color: '#fff', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', fontWeight: '900' }}>
 REALTIME LIVE
 </span>
 </div>

 {/* Condition Selector Card */}
 <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '16px', marginBottom: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
 <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>
 Sabihin sa amin ang kondisyon:
 </h4>

 <div style={{ marginBottom: '10px' }}>
 <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#374151', display: 'block', marginBottom: '4px' }}>Current crop season</label>
 <select value={season} onChange={(e) => setSeason(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #059669', background: '#ffffff', fontSize: '0.85rem', fontWeight: '700', color: '#111827' }}>
 <option value="Tag-init (Dry)">Tag-init (Dry Season)</option>
 <option value="Tag-ulan (Wet)">Tag-ulan (Wet Season)</option>
 </select>
 </div>

 <div style={{ marginBottom: '10px' }}>
 <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#374151', display: 'block', marginBottom: '4px' }}>Farm block location</label>
 <select value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #059669', background: '#ffffff', fontSize: '0.85rem', fontWeight: '700', color: '#111827' }}>
 <option value="Block A · Cupang">Block A · Cupang (Plot P-007)</option>
 <option value="Block B · Antipolo">Block B · Antipolo (Plot P-021)</option>
 </select>
 </div>

 <div style={{ marginBottom: '10px' }}>
 <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#374151', display: 'block', marginBottom: '4px' }}>Soil Type</label>
 <select value={soil} onChange={(e) => setSoil(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #059669', background: '#ffffff', fontSize: '0.85rem', fontWeight: '700', color: '#111827' }}>
 <option value="Loam · moist">Loam · Moist</option>
 <option value="Clay Loam">Clay Loam</option>
 <option value="Sandy Loam">Sandy Loam</option>
 <option value="Clay · dry">Clay · Dry</option>
 </select>
 </div>

 {/* Soil Moisture Stepper */}
 <div style={{ marginBottom: '16px' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
 <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#374151' }}>Soil Moisture Level</label>
 <span style={{ fontSize: '0.82rem', fontWeight: '900', color: '#059669' }}>{soilMoisture}%</span>
 </div>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 <button
 type="button"
 onClick={() => setSoilMoisture(prev => Math.max(10, prev - 5))}
 style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 12px', fontWeight: '900', color: '#334155', cursor: 'pointer' }}
 >
 - 5%
 </button>
 <div style={{ flex: 1, height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
 <div style={{ width: `${soilMoisture}%`, height: '100%', background: '#059669' }} />
 </div>
 <button
 type="button"
 onClick={() => setSoilMoisture(prev => Math.min(100, prev + 5))}
 style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 12px', fontWeight: '900', color: '#334155', cursor: 'pointer' }}
 >
 + 5%
 </button>
 </div>
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
 <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: '600' }}>RF Crop Predictor</span>
 </div>

 <div style={{ fontSize: '0.68rem', color: '#6b7280', fontWeight: '800', textTransform: 'uppercase' }}>RECOMMENDED CROP VARIETY</div>
 <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0c3619', margin: '4px 0 10px 0' }}>{aiResult.crop}</h2>

 {/* Plant / Livestock Growth Stage & Prediction Box (Teacher's requirement) */}
 <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '12px', margin: '10px 0 14px 0' }}>
 <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#166534', textTransform: 'uppercase', marginBottom: '2px' }}> CURRENT PLANT GROWTH STAGE</div>
 <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0c3619', marginBottom: '6px' }}>
 {aiResult.currentStage || 'Flowering & Fruit Setting (Stage 3 of 5)'}
 </div>

 <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
 <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#d97706' }}> PREDICTED NEXT STAGE:</span>
 <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#1e293b' }}>
 {aiResult.nextStagePrediction || 'Fruit Maturation & Ripening'} ({aiResult.daysToNextStage || '12 days'})
 </span>
 </div>
 </div>

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

 {/* ORGANIC FERTILIZER & DOSAGE PREDICTION BOX (Teacher's Requirement) */}
 <div style={{ background: '#ecfdf5', border: '1.5px solid #059669', borderRadius: '12px', padding: '12px', marginBottom: '12px' }}>
 <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#047857', textTransform: 'uppercase', marginBottom: '4px' }}> PREDICTED ORGANIC FERTILIZER & DOSAGE</div>
 <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#064e3b', marginBottom: '2px' }}>
 {aiResult.fertilizerRec || 'Vermicompost + Neem Cake Organic Blend'}
 </div>
 <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#047857', marginBottom: '4px' }}>
 Optimal Dosage: {aiResult.fertilizerDosage || '2.5 kg per bed (Apply every 14 days)'}
 </div>
 <div style={{ fontSize: '0.7rem', color: '#065f46', fontWeight: '600' }}>
 {aiResult.fertilizerBoost || '+15% yield boost at Stage 3 Flowering'}
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

 <button
 onClick={handleApplyRFRecommendation}
 style={{
 width: '100%',
 backgroundColor: '#059669',
 color: '#ffffff',
 border: 'none',
 borderRadius: '10px',
 padding: '12px',
 fontWeight: '800',
 fontSize: '0.82rem',
 cursor: 'pointer',
 marginTop: '12px',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: '6px'
 }}
 >
 🚀 {t('Apply Recommendation to Field Plot', 'Ilapat ang Rekomendasyon sa Sakahan')}
 </button>
 </div>
 </div>
 </div>
 )}

 {/* ----- TASKS TAB ----- */}
 {activeTab === 'tasks' && (
 <div>
 <div style={{ background: '#d97706', color: '#ffffff', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
 <button onClick={() => setActiveTab('home')} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}><ArrowLeft size={18} /></button>
 <div>
 <h3 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0 }}>📋 {t("Smart Task Prioritization", "Matalinong Pag-aayos ng Gawain")}</h3>
 <span style={{ fontSize: '0.68rem', color: '#fef3c7' }}>{t("Organized by urgency & telemetry", "Inayos para sa inyong sakahan")}</span>
 </div>
 </div>
 <button
 onClick={() => setShowAddTaskModal(true)}
 style={{ background: '#0c3619', color: '#ffffff', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
 >
 ➕ {t('Add Task', 'Magdagdag')}
 </button>
 </div>

 <div style={{ padding: '14px' }}>
 {/* Filter Pills */}
 <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
 {[
 { key: 'ALL', label: t('ALL', 'LAHAT') },
 { key: 'URGENT', label: t('URGENT', 'APURADO') },
 { key: 'OVERDUE', label: t('OVERDUE', 'LIPAS NA') },
 { key: 'DONE', label: t('DONE', 'TAPOS NA') }
 ].map(f => (
 <button
 key={f.key}
 onClick={() => setTaskFilter(f.key)}
 style={{
 padding: '4px 8px',
 borderRadius: '6px',
 border: '1px solid #cbd5e1',
 background: taskFilter === f.key ? '#d97706' : '#f1f5f9',
 color: taskFilter === f.key ? '#ffffff' : '#475569',
 fontSize: '0.68rem',
 fontWeight: '800',
 cursor: 'pointer'
 }}
 >
 {f.label}
 </button>
 ))}
 </div>

 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
 {tasks
 .filter(t => {
 if (taskFilter === 'URGENT') return t.status === 'URGENT' || t.urgency === 'URGENT';
 if (taskFilter === 'OVERDUE') return t.status === 'OVERDUE' || t.urgency === 'OVERDUE';
 if (taskFilter === 'DONE') return completedTasks[t.id];
 return true;
 })
 .map(t => {
 const isDone = completedTasks[t.id];
 return (
 <div
 key={t.id}
 onClick={() => toggleTaskCompleted(t.id)}
 style={{
 background: isDone ? '#f0fdf4' : '#ffffff',
 borderRadius: '12px',
 border: isDone ? '1.5px solid #86efac' : `1.5px solid ${t.border}`,
 padding: '12px 14px',
 cursor: 'pointer',
 boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
 }}
 >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.68rem', color: isDone ? '#16a34a' : (t.status === 'OVERDUE' ? '#dc2626' : t.border), fontWeight: '800' }}>
                      {isDone 
                        ? `✅ ${t('Completed at', 'Natapos noong')} ${taskCompletedTimes[t.id] || t.completedAt || 'Today · 06:14 AM'}`
                        : (t.status === 'OVERDUE' 
                          ? `🔴 ${t('Overdue:', 'Lipas na:')} ${t.dueDate || 'Yesterday'} · ${t.dueTime || '04:00 PM'}`
                          : `⏰ ${t('Due:', 'Nakatakda:')} ${t.dueDate || 'Today'} · ${t.dueTime || '08:00 AM'}`)}
                    </span>
                    <span style={{ background: isDone ? '#dcfce7' : t.badgeBg, color: isDone ? '#15803d' : t.badgeColor, fontSize: '0.65rem', padding: '2px 8px', borderRadius: '10px', fontWeight: '900' }}>
                      {isDone ? (isTl ? 'TAPOS NA ✓' : 'COMPLETED ✓') : (isTl && t.status === 'OVERDUE' ? 'LIPAS NA' : (isTl && t.status === 'URGENT' ? 'APURADO' : t.status))}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: isDone ? '#15803d' : '#111827', margin: '0 0 2px 0', textDecoration: isDone ? 'line-through' : 'none' }}>
                    {isDone ? '✅ ' : '⬜ '}{t.title}
                  </h4>
                  <p style={{ fontSize: '0.72rem', color: '#6b7280', margin: '0 0 6px 0' }}>{t.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#64748b', paddingTop: '4px', borderTop: '1px solid #f1f5f9' }}>
                    <span>📍 {t.plot}</span>
                    <span style={{ color: isDone ? '#16a34a' : '#d97706', fontWeight: '700' }}>
                      {isDone ? '✓ Verified in cloud' : '● Tap to toggle'}
                    </span>
                  </div>
                </div>
              );
            })}
 </div>

 {/* PGS ORGANIC CERTIFICATION CARD WITH CHECKLIST ITEM ALERT (Image 3) */}
 <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px solid #16a34a', padding: '14px', marginTop: '12px' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
 <ShieldCheck size={18} color="#16a34a" />
 <div>
 <div style={{ fontSize: '0.62rem', fontWeight: '800', color: '#16a34a', textTransform: 'uppercase' }}>PGS ORGANIC CERTIFICATION</div>
 <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0c3619' }}>Certified · 94% complete</div>
 </div>
 </div>
 <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>Active</span>
 </div>

 <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', margin: '8px 0' }}>
 <div style={{ width: '94%', height: '100%', background: '#16a34a' }} />
 </div>

 <div style={{ background: '#fffbeb', border: '1.5px solid #fcd34d', borderRadius: '10px', padding: '10px', marginTop: '6px' }}>
 <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#b45309', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
 <AlertTriangle size={14} /> 1 CHECKLIST ITEM TO FIX
 </div>
 <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#78350f', marginBottom: '4px' }}>
 Submit photo of compost batch #14 (1 day overdue)
 </div>
 <button
 onClick={() => setActiveTab('log')}
 style={{ background: '#fef3c7', color: '#b45309', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '0.65rem', fontWeight: '800', cursor: 'pointer' }}
 >
 Tip: Open Log Activity attach photo submit to cloud
 </button>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* ----- PROFILE TAB & SETTINGS SCREEN (MATCHING ALL USER SCREENSHOTS) ----- */}
 {activeTab === 'profile' && (
 <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#edf2ee' }}>
 {profileSubView === 'profile' ? (
 /* ================= VIEW A: MY PROFILE SCREEN ================= */
 <>
 {/* Top Dark Green Header Bar */}
 <div style={{
 background: '#0c3619', color: '#ffffff', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0
 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
 <button
 onClick={() => setActiveTab('home')}
 style={{
 width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.16)', color: '#ffffff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
 }}
 >
 <ArrowLeft size={18} />
 </button>
 <div>
 <h2 style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0, color: '#ffffff', lineHeight: 1.1 }}>
 My Profile
 </h2>
 <span style={{ fontSize: '0.72rem', color: '#a7f3d0', fontWeight: '600' }}>
 Impormasyon at membership
 </span>
 </div>
 </div>

 <button
 onClick={() => setProfileSubView('settings')}
 title="Open Settings"
 style={{
 width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)', color: '#ffffff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
 }}
 >
 <Settings size={20} />
 </button>
 </div>

 {/* Scrollable Content Container */}
 <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
 
 {/* CARD 1: FARMER MAIN BADGE CARD */}
 <div style={{ background: '#ffffff', borderRadius: '18px', padding: '16px 18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '16px' }}>
 <div style={{
 width: '62px', height: '62px', borderRadius: '50%', background: '#dce3db', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.7rem', fontWeight: '900', flexShrink: 0
 }}>
 {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'M'}
 </div>
 <div style={{ flex: 1 }}>
 <h3 style={{ fontSize: '1.18rem', fontWeight: '900', color: '#0f172a', margin: '0 0 2px 0', lineHeight: 1.2 }}>
 {profileData.name}
 </h3>
 <div style={{ fontSize: '0.76rem', color: '#475569', fontWeight: '700', marginBottom: '6px' }}>
 {profileData.subtitle}
 </div>
 <span style={{ background: '#15803d', color: '#ffffff', fontSize: '0.68rem', fontWeight: '900', padding: '4px 12px', borderRadius: '14px', display: 'inline-block' }}>
 {profileData.pgsBadge}
 </span>
 </div>
 </div>

 {/* CARD 2: CONTACT */}
 <div style={{ background: '#ffffff', borderRadius: '18px', padding: '16px 18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
 <div style={{ fontSize: '0.78rem', fontWeight: '900', color: '#334155', letterSpacing: '0.6px', marginBottom: '14px', textTransform: 'uppercase' }}>
 CONTACT
 </div>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
 <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#847e73', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <Phone size={20} color="#ffffff" />
 </div>
 <div>
 <div style={{ fontSize: '0.64rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.3px' }}>MOBILE</div>
 <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a', marginTop: '1px' }}>{profileData.mobile}</div>
 </div>
 </div>

 <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
 <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#847e73', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <Mail size={20} color="#ffffff" />
 </div>
 <div>
 <div style={{ fontSize: '0.64rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.3px' }}>EMAIL</div>
 <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a', marginTop: '1px' }}>{profileData.email}</div>
 </div>
 </div>

 <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
 <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#847e73', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <CreditCard size={20} color="#ffffff" />
 </div>
 <div>
 <div style={{ fontSize: '0.64rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.3px' }}>MEMBER ID</div>
 <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a', marginTop: '1px' }}>{profileData.memberId}</div>
 </div>
 </div>
 </div>
 </div>

 {/* CARD 3: FARM LOCATION */}
 <div style={{ background: '#ffffff', borderRadius: '18px', padding: '16px 18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
 <div style={{ fontSize: '0.78rem', fontWeight: '900', color: '#334155', letterSpacing: '0.6px', marginBottom: '14px', textTransform: 'uppercase' }}>
 FARM LOCATION
 </div>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
 <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#847e73', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <MapPin size={20} color="#ffffff" />
 </div>
 <div>
 <div style={{ fontSize: '0.64rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.3px' }}>BARANGAY</div>
 <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a', marginTop: '1px' }}>{profileData.barangay}</div>
 </div>
 </div>

 <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
 <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#847e73', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <Compass size={20} color="#ffffff" />
 </div>
 <div>
 <div style={{ fontSize: '0.64rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.3px' }}>COORDINATES</div>
 <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a', marginTop: '1px' }}>{profileData.coordinates}</div>
 </div>
 </div>

 <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
 <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#847e73', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <Sprout size={20} color="#ffffff" />
 </div>
 <div>
 <div style={{ fontSize: '0.64rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.3px' }}>TOTAL AREA</div>
 <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a', marginTop: '1px' }}>{profileData.totalArea}</div>
 </div>
 </div>
 </div>
 </div>

 {/* CARD 4: COOPERATIVE */}
 <div style={{ background: '#ffffff', borderRadius: '18px', padding: '16px 18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
 <div style={{ fontSize: '0.78rem', fontWeight: '900', color: '#334155', letterSpacing: '0.6px', marginBottom: '14px', textTransform: 'uppercase' }}>
 COOPERATIVE
 </div>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
 <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#847e73', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <Users size={20} color="#ffffff" />
 </div>
 <div>
 <div style={{ fontSize: '0.64rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.3px' }}>COOP</div>
 <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a', marginTop: '1px' }}>{profileData.coop}</div>
 </div>
 </div>

 <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
 <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#847e73', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <ShieldCheck size={20} color="#ffffff" />
 </div>
 <div>
 <div style={{ fontSize: '0.64rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.3px' }}>STANDING</div>
 <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a', marginTop: '1px' }}>{profileData.standing}</div>
 </div>
 </div>

 <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
 <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#847e73', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <Calendar size={20} color="#ffffff" />
 </div>
 <div>
 <div style={{ fontSize: '0.64rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.3px' }}>DUES PAID UNTIL</div>
 <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a', marginTop: '1px' }}>{profileData.duesPaidUntil}</div>
 </div>
 </div>
 </div>
 </div>

 {/* CARD 5: ASSIGNED PLOTS */}
 <div style={{ background: '#ffffff', borderRadius: '18px', padding: '16px 18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
 <div style={{ fontSize: '0.78rem', fontWeight: '900', color: '#334155', letterSpacing: '0.6px', marginBottom: '14px', textTransform: 'uppercase' }}>
 ASSIGNED PLOTS
 </div>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
 {profileData.assignedPlots.map((plot) => (
 <div
 key={plot.id}
 style={{
 background: '#beb7ab', borderRadius: '14px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
 <span style={{ background: '#98a092', color: '#064e3b', fontWeight: '900', fontSize: '0.72rem', padding: '4px 10px', borderRadius: '8px', flexShrink: 0 }}>
 {plot.id}
 </span>
 <div>
 <div style={{ fontWeight: '900', fontSize: '0.95rem', color: '#0f172a' }}>{plot.crop}</div>
 <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: '700' }}>{plot.area}</div>
 </div>
 </div>
 <span style={{ border: '1px solid rgba(0,0,0,0.18)', background: 'rgba(255,255,255,0.25)', color: '#0f172a', borderRadius: '20px', padding: '4px 14px', fontSize: '0.72rem', fontWeight: '900' }}>
 {plot.status}
 </span>
 </div>
 ))}
 </div>
 </div>

 {/* CARD 6: LIVESTOCK */}
 <div style={{ background: '#ffffff', borderRadius: '18px', padding: '16px 18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
 <div style={{ fontSize: '0.78rem', fontWeight: '900', color: '#334155', letterSpacing: '0.6px', marginBottom: '14px', textTransform: 'uppercase' }}>
 LIVESTOCK
 </div>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
 {profileData.livestock.map((item) => (
 <div
 key={item.id}
 style={{
 background: '#beb7ab', borderRadius: '14px', padding: '12px 14px', display: 'flex', alignItems: 'center'
 }}
 >
 <span style={{ fontWeight: '900', fontSize: '0.78rem', color: '#0f172a', marginRight: '16px', minWidth: '55px' }}>
 {item.id}
 </span>
 <div>
 <div style={{ fontWeight: '900', fontSize: '0.95rem', color: '#0f172a' }}>{item.title}</div>
 <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: '700' }}>{item.count}</div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* QUICK ACTION BUTTONS */}
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
 <button
 onClick={() => setProfileSubView('settings')}
 style={{
 padding: '12px', borderRadius: '12px', background: '#ffffff', border: '1.5px solid #0c3619', color: '#0c3619', fontWeight: '900', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
 }}
 >
 <Settings size={16} /> App Settings
 </button>

 <button
 onClick={() => { setTempProfile(profileData); setShowProfileSettingsModal(true); }}
 style={{
 padding: '12px', borderRadius: '12px', background: '#0c3619', border: 'none', color: '#ffffff', fontWeight: '900', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
 }}
 >
 <User size={16} /> Edit Info
 </button>
 </div>

 </div>
 </>
 ) : (
 /* ================= VIEW B: SETTINGS SCREEN (MATCHING USER SCREENSHOTS) ================= */
 <>
 {/* Top Dark Green Header Bar for Settings */}
 <div style={{
 background: '#0c3619', color: '#ffffff', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0
 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
 <button
 onClick={() => setProfileSubView('profile')}
 style={{
 width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.16)', color: '#ffffff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
 }}
 >
 <ArrowLeft size={18} />
 </button>
 <div>
 <h2 style={{ fontSize: '1.25rem', fontWeight: '900', margin: 0, color: '#ffffff', lineHeight: 1.1 }}>
 Settings
 </h2>
 <span style={{ fontSize: '0.72rem', color: '#a7f3d0', fontWeight: '600' }}>
 Mga kagustuhan sa app
 </span>
 </div>
 </div>
 </div>

 {/* Scrollable Settings Content Container */}
 <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
 
 {/* SETTINGS CARD 1: NOTIFICATIONS */}
 <div style={{ background: '#ffffff', borderRadius: '18px', padding: '16px 18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
 <div style={{ fontSize: '0.78rem', fontWeight: '900', color: '#334155', letterSpacing: '0.6px', marginBottom: '14px', textTransform: 'uppercase' }}>
 NOTIFICATIONS
 </div>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
 {/* Push notifications */}
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
 <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#847e73', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <Bell size={20} color="#ffffff" />
 </div>
 <div>
 <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a' }}>Push notifications</div>
 <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>Task, weather and alerts</div>
 </div>
 </div>
 {/* Toggle Switch */}
 <div
 onClick={() => setSettingsData(prev => ({ ...prev, pushNotifications: !prev.pushNotifications }))}
 style={{
 width: '46px', height: '26px', borderRadius: '13px',
 background: settingsData.pushNotifications ? '#0c3619' : '#e2e8f0',
 padding: '2px', cursor: 'pointer', display: 'flex', alignItems: 'center',
 justifyContent: settingsData.pushNotifications ? 'flex-end' : 'flex-start',
 transition: 'all 0.2s ease'
 }}
 >
 <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
 </div>
 </div>

 <div style={{ height: '1px', background: '#f1f5f9' }} />

 {/* SMS reminders */}
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
 <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#847e73', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <Phone size={20} color="#ffffff" />
 </div>
 <div>
 <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a' }}>SMS reminders</div>
 <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>Kapag walang internet</div>
 </div>
 </div>
 {/* Toggle Switch */}
 <div
 onClick={() => setSettingsData(prev => ({ ...prev, smsReminders: !prev.smsReminders }))}
 style={{
 width: '46px', height: '26px', borderRadius: '13px',
 background: settingsData.smsReminders ? '#0c3619' : '#e2e8f0',
 padding: '2px', cursor: 'pointer', display: 'flex', alignItems: 'center',
 justifyContent: settingsData.smsReminders ? 'flex-end' : 'flex-start',
 transition: 'all 0.2s ease'
 }}
 >
 <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
 </div>
 </div>
 </div>
 </div>

 {/* SETTINGS CARD 2: PREFERENCES */}
 <div style={{ background: '#ffffff', borderRadius: '18px', padding: '16px 18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
 <div style={{ fontSize: '0.78rem', fontWeight: '900', color: '#334155', letterSpacing: '0.6px', marginBottom: '14px', textTransform: 'uppercase' }}>
 PREFERENCES
 </div>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
 {/* Language */}
 <div
 onClick={() => setSettingsData(prev => ({ ...prev, language: prev.language === 'Tagalog' ? 'English' : 'Tagalog' }))}
 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
 <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#847e73', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <Globe size={20} color="#ffffff" />
 </div>
 <div>
 <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a' }}>Language</div>
 <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>Tap to change</div>
 </div>
 </div>
 <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
 <span style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0c3619' }}>{settingsData.language}</span>
 <ChevronRight size={18} color="#64748b" />
 </div>
 </div>

 <div style={{ height: '1px', background: '#f1f5f9' }} />

 {/* Dark mode */}
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
 <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#847e73', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <Moon size={20} color="#ffffff" />
 </div>
 <div>
 <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a' }}>Dark mode</div>
 <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>Mas madaling basahin sa gabi</div>
 </div>
 </div>
 {/* Toggle Switch */}
 <div
 onClick={() => setSettingsData(prev => ({ ...prev, darkMode: !prev.darkMode }))}
 style={{
 width: '46px', height: '26px', borderRadius: '13px',
 background: settingsData.darkMode ? '#0c3619' : '#e2e8f0',
 padding: '2px', cursor: 'pointer', display: 'flex', alignItems: 'center',
 justifyContent: settingsData.darkMode ? 'flex-end' : 'flex-start',
 transition: 'all 0.2s ease'
 }}
 >
 <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
 </div>
 </div>

 <div style={{ height: '1px', background: '#f1f5f9' }} />

 {/* Offline mode */}
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
 <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#847e73', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <Wifi size={20} color="#ffffff" />
 </div>
 <div>
 <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a' }}>Offline mode</div>
 <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>I-save ang logs kapag walang signal</div>
 </div>
 </div>
 {/* Toggle Switch */}
 <div
 onClick={() => setSettingsData(prev => ({ ...prev, offlineMode: !prev.offlineMode }))}
 style={{
 width: '46px', height: '26px', borderRadius: '13px',
 background: settingsData.offlineMode ? '#0c3619' : '#e2e8f0',
 padding: '2px', cursor: 'pointer', display: 'flex', alignItems: 'center',
 justifyContent: settingsData.offlineMode ? 'flex-end' : 'flex-start',
 transition: 'all 0.2s ease'
 }}
 >
 <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
 </div>
 </div>
 </div>
 </div>

 {/* SETTINGS CARD 3: ACCOUNT & SECURITY */}
 <div style={{ background: '#ffffff', borderRadius: '18px', padding: '16px 18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
 <div style={{ fontSize: '0.78rem', fontWeight: '900', color: '#334155', letterSpacing: '0.6px', marginBottom: '14px', textTransform: 'uppercase' }}>
 ACCOUNT & SECURITY
 </div>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
 {/* Change password */}
 <div
 onClick={() => setActiveSettingsDialog('password')}
 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
 <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#847e73', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <Lock size={20} color="#ffffff" />
 </div>
 <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a' }}>Change password</div>
 </div>
 <ChevronRight size={18} color="#64748b" />
 </div>

 <div style={{ height: '1px', background: '#f1f5f9' }} />

 {/* Privacy & data */}
 <div
 onClick={() => setActiveSettingsDialog('privacy')}
 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
 <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#847e73', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <ShieldCheck size={20} color="#ffffff" />
 </div>
 <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a' }}>Privacy & data</div>
 </div>
 <ChevronRight size={18} color="#64748b" />
 </div>
 </div>
 </div>

 {/* SETTINGS CARD 4: SUPPORT */}
 <div style={{ background: '#ffffff', borderRadius: '18px', padding: '16px 18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
 <div style={{ fontSize: '0.78rem', fontWeight: '900', color: '#334155', letterSpacing: '0.6px', marginBottom: '14px', textTransform: 'uppercase' }}>
 SUPPORT
 </div>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
 {/* Help center */}
 <div
 onClick={() => setActiveSettingsDialog('help')}
 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
 <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#847e73', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <HelpCircle size={20} color="#ffffff" />
 </div>
 <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a' }}>Help center</div>
 </div>
 <ChevronRight size={18} color="#64748b" />
 </div>

 <div style={{ height: '1px', background: '#f1f5f9' }} />

 {/* About MARIKHA */}
 <div
 onClick={() => setActiveSettingsDialog('about')}
 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
 <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#847e73', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
 <Info size={20} color="#ffffff" />
 </div>
 <div>
 <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0f172a' }}>About MARIKHA</div>
 <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>v1.0.0</div>
 </div>
 </div>
 <ChevronRight size={18} color="#64748b" />
 </div>
 </div>
 </div>

 {/* RED LOGOUT PILL BUTTON (EXACTLY MATCHING SCREENSHOT 2) */}
 <button
 onClick={() => { setMobileAuth(false); setMobileScreen('login'); }}
 style={{
 width: '100%', padding: '14px', borderRadius: '16px', background: '#dc2626', border: 'none', color: '#ffffff', fontWeight: '900', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)'
 }}
 >
 <LogOut size={18} color="#ffffff" /> Log out
 </button>

 </div>
 </>
 )}
 </div>
 )}

 </div>

 {/* Bottom 5-Tab Nav Bar (Matching Wireframe Image) */}
 <div style={{
 height: '54px', background: '#ffffff', borderTop: '1px solid #e5e7eb', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', alignItems: 'center', textAlign: 'center', fontSize: '0.65rem', fontWeight: '800', flexShrink: 0
 }}>
 <div onClick={() => setActiveTab('home')} style={{ color: activeTab === 'home' ? '#0c3619' : '#9ca3af', cursor: 'pointer' }}>
 <Home size={16} style={{ margin: '0 auto 2px' }} /> {t('HOME', 'TAHANAN')}
 </div>
 <div onClick={() => setActiveTab('log')} style={{ color: activeTab === 'log' ? '#0c3619' : '#9ca3af', cursor: 'pointer' }}>
 <ClipboardList size={16} style={{ margin: '0 auto 2px' }} /> {t('LOG', 'TALAAN')}
 </div>
 <div onClick={() => setActiveTab('tasks')} style={{ color: activeTab === 'tasks' ? '#3b2d22' : '#9ca3af', cursor: 'pointer' }}>
 <Calendar size={16} style={{ margin: '0 auto 2px' }} /> {t('TASKS', 'GAWAIN')}
 </div>
 <div onClick={() => setActiveTab('ai')} style={{ color: activeTab === 'ai' ? '#059669' : '#9ca3af', cursor: 'pointer' }}>
 <Sparkles size={16} style={{ margin: '0 auto 2px' }} /> {t('RF', 'REKO')}
 </div>
 <div onClick={() => setActiveTab('profile')} style={{ color: activeTab === 'profile' ? '#0c3619' : '#9ca3af', cursor: 'pointer' }}>
 <User size={16} style={{ margin: '0 auto 2px' }} /> {t('PROFILE', 'PROFILE')}
 </div>
 </div>

 {/* Real-Time Announcement Push Modal (High Priority zIndex 800) */}
      {showNotificationModal && latestPushAnnouncement && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 800
        }}>
          <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', width: '100%', maxWidth: '330px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', animation: 'slideIn 0.2s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: '#dcfce7', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={16} color="#11592c" />
                </div>
                <div>
                  <span style={{ fontWeight: '800', fontSize: '0.86rem', color: '#111827', display: 'block', lineHeight: 1.1 }}>
                    Cooperative Directive
                  </span>
                  <span style={{ fontSize: '0.67rem', fontWeight: '800', color: latestPushAnnouncement.targetAudience === 'farmers' ? '#15803d' : '#0369a1' }}>
                    {latestPushAnnouncement.targetAudience === 'farmers' ? '🌾 For: Registered Farmers' : '🌐 Cooperative-Wide Directive'}
                  </span>
                </div>
              </div>
              <button onClick={() => setShowNotificationModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ background: latestPushAnnouncement.targetAudience === 'farmers' ? '#f0fdf4' : '#fffbeb', border: latestPushAnnouncement.targetAudience === 'farmers' ? '1.5px solid #86efac' : '1.5px solid #fcd34d', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: latestPushAnnouncement.targetAudience === 'farmers' ? '#14532d' : '#78350f', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                {latestPushAnnouncement.title || 'Farmer Field Activity Directive'}
              </h4>
              <p style={{ fontSize: '0.84rem', color: latestPushAnnouncement.targetAudience === 'farmers' ? '#166534' : '#92400e', lineHeight: 1.45, margin: 0, fontWeight: '600' }}>
                "{latestPushAnnouncement.content}"
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#6b7280', marginBottom: '16px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px' }}>
              <span>Dispatched by: <strong style={{ color: '#0f172a' }}>{latestPushAnnouncement.author || 'Super Admin'}</strong></span>
              <span>{latestPushAnnouncement.date || 'Today'}</span>
            </div>

            <button
              onClick={() => {
                if (latestPushAnnouncement && latestPushAnnouncement.id) {
                  try { localStorage.setItem('marikha_mobile_ack_notice_id', String(latestPushAnnouncement.id)); } catch (e) {}
                }
                setShowNotificationModal(false);
              }}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#11592c', color: '#ffffff', fontWeight: '800', fontSize: '0.86rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 10px rgba(17,89,44,0.3)' }}
            >
              ✓ Acknowledge Directive
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


 {/* Create Smart Task Modal with Template Chips */}
 {showAddTaskModal && (
 <div style={{
 position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
 background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 780
 }}>
 <div style={{ background: '#ffffff', borderRadius: '20px', padding: '18px', width: '100%', maxWidth: '340px', maxHeight: '560px', display: 'flex', flexDirection: 'column' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
 <Calendar size={18} color="#d97706" />
 </div>
 <div>
 <h3 style={{ fontSize: '0.96rem', fontWeight: '900', color: '#111827', margin: 0 }}>
 {t('Create Smart Task', 'Gumawa ng Gawain')}
 </h3>
 <span style={{ fontSize: '0.68rem', color: '#6b7280' }}>
 {t('Organized by plot & priority', 'Inayos ayon sa plot at prayoridad')}
 </span>
 </div>
 </div>
 <button 
 onClick={() => setShowAddTaskModal(false)}
 style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
 >
 <X size={16} />
 </button>
 </div>

 {/* Quick Preset Suggestion Chips */}
 <div style={{ marginBottom: '12px' }}>
 <label style={{ fontSize: '0.66rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
 {t('⚡ QUICK SUGGESTIONS (TAP TO AUTO-FILL):', '⚡ MABILIS NA SUHESTIYON (I-TAP PARA PUNUAN):')}
 </label>
 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
 {TASK_TEMPLATES.map((tmpl, idx) => (
 <button
 key={idx}
 type="button"
 onClick={() => {
 setNewTaskTitle(tmpl.title);
 setNewTaskPlot(tmpl.plot);
 setNewTaskUrgency(tmpl.urgency);
 setNewTaskCategory(tmpl.category);
 setNewTaskDesc(tmpl.desc);
                          if (tmpl.dueDate) setNewTaskDueDate(tmpl.dueDate);
                          if (tmpl.dueTime) setNewTaskDueTime(tmpl.dueTime);
 }}
 style={{
 background: newTaskTitle === tmpl.title ? '#dcfce7' : '#f8fafc',
 border: newTaskTitle === tmpl.title ? '1.5px solid #16a34a' : '1px solid #e2e8f0',
 borderRadius: '8px',
 padding: '4px 8px',
 fontSize: '0.68rem',
 fontWeight: '700',
 color: newTaskTitle === tmpl.title ? '#15803d' : '#334155',
 cursor: 'pointer',
 textAlign: 'left'
 }}
 >
 {tmpl.title}
 </button>
 ))}
 </div>
 </div>

 <form onSubmit={handleCreateNewTask} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
 <div>
 <label style={{ fontSize: '0.66rem', fontWeight: '800', color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
 {t('Task Title *', 'Pamagat ng Gawain *')}
 </label>
 <input
 type="text"
 required
 placeholder={t('e.g. Morning Drip Irrigation', 'hal. Pang-umagang Pagpapatubig')}
 value={newTaskTitle}
 onChange={(e) => setNewTaskTitle(e.target.value)}
 style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.82rem', fontWeight: '700' }}
 />
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
 <div>
 <label style={{ fontSize: '0.66rem', fontWeight: '800', color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
 {t('Target Plot', 'Plot')}
 </label>
 <select
 value={newTaskPlot}
 onChange={(e) => setNewTaskPlot(e.target.value)}
 style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.78rem', fontWeight: '700' }}
 >
 <option value="Plot P-007">Plot P-007 (Tomato)</option>
 <option value="Plot P-021">Plot P-021 (Eggplant)</option>
 <option value="Plot P-034">Plot P-034 (Okra)</option>
 <option value="Barn Shed 2">Barn Shed 2 (Goats)</option>
 </select>
 </div>

 <div>
 <label style={{ fontSize: '0.66rem', fontWeight: '800', color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
 {t('Priority Urgency', 'Prayoridad')}
 </label>
 <select
 value={newTaskUrgency}
 onChange={(e) => setNewTaskUrgency(e.target.value)}
 style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.78rem', fontWeight: '700' }}
 >
 <option value="URGENT">{t('URGENT (Apurado)', 'APURADO')}</option>
 <option value="OVERDUE">{t('OVERDUE (Lipas Na)', 'LIPAS NA')}</option>
 <option value="NORMAL">{t('NORMAL (Karaniwan)', 'KARANIWAN')}</option>
 </select>
 </div>
 </div>

 <div>
 <label style={{ fontSize: '0.66rem', fontWeight: '800', color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
 {t('Activity Category', 'Kategorya')}
 </label>
 <select
 value={newTaskCategory}
 onChange={(e) => setNewTaskCategory(e.target.value)}
 style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.78rem', fontWeight: '700' }}
 >
 <option value="Irrigation">💧 Irrigation (Pagpapatubig)</option>
 <option value="Crop Care">🌿 Crop Care & Weeding (Pag-aalaga)</option>
 <option value="Pest Control">🧪 Pest & Disease Control (Peste)</option>
 <option value="Fertilizer">🌱 Organic Fertilization (Pataba)</option>
 <option value="Livestock">🐐 Livestock Care (Pangangalaga ng Hayop)</option>
 <option value="Harvest">🍅 Harvest Operations (Pag-ani)</option>
 </select>
 </div>

                {/* Real-time Due Date & Time Selectors */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.66rem', fontWeight: '800', color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                      📅 {t('Due Date', 'Araw ng Gawain')}
                    </label>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      {['Today', 'Tomorrow', 'Next Week'].map(d => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setNewTaskDueDate(d)}
                          style={{
                            padding: '3px 6px',
                            fontSize: '0.64rem',
                            fontWeight: '800',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: newTaskDueDate === d ? '#d97706' : '#f8fafc',
                            color: newTaskDueDate === d ? '#ffffff' : '#475569',
                            cursor: 'pointer'
                          }}
                        >
                          {d === 'Today' ? t('Today', 'Ngayon') : d === 'Tomorrow' ? t('Tomorrow', 'Bukas') : t('Next Week', 'Susunod')}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.74rem', fontWeight: '700' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.66rem', fontWeight: '800', color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                      ⏰ {t('Due Time', 'Oras ng Gawain')}
                    </label>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      {['06:00 AM', '08:00 AM', '02:00 PM', '05:30 PM'].map(tm => (
                        <button
                          key={tm}
                          type="button"
                          onClick={() => setNewTaskDueTime(tm)}
                          style={{
                            padding: '3px 4px',
                            fontSize: '0.6rem',
                            fontWeight: '800',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: newTaskDueTime === tm ? '#d97706' : '#f8fafc',
                            color: newTaskDueTime === tm ? '#ffffff' : '#475569',
                            cursor: 'pointer'
                          }}
                        >
                          {tm.replace(':00', '').replace(' ', '')}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={newTaskDueTime}
                      onChange={(e) => setNewTaskDueTime(e.target.value)}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.74rem', fontWeight: '700' }}
                    />
                  </div>
                </div>

 <div>
 <label style={{ fontSize: '0.66rem', fontWeight: '800', color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
 {t('Instructions / Notes', 'Mga Tagubilin / Paalala')}
 </label>
 <textarea
 rows={2}
 placeholder={t('Specific dosage, timing, or guidance...', 'Tiyak na sukat, oras, o gabay...')}
 value={newTaskDesc}
 onChange={(e) => setNewTaskDesc(e.target.value)}
 style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.78rem', fontWeight: '600', resize: 'none' }}
 />
 </div>

 <div style={{ marginTop: '6px', display: 'flex', gap: '8px' }}>
 <button
 type="button"
 onClick={() => setShowAddTaskModal(false)}
 style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', fontWeight: '800', fontSize: '0.78rem', cursor: 'pointer' }}
 >
 {t('Cancel', 'Kanselahin')}
 </button>
 <button
 type="submit"
 style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#0c3619', color: '#ffffff', fontWeight: '800', fontSize: '0.78rem', border: 'none', cursor: 'pointer' }}
 >
 ✓ {t('Save & Create Task', 'I-save ang Gawain')}
 </button>
 </div>
 </form>
 </div>
 </div>
 )}

 {/* Comprehensive Settings & Profile Dialog Modal */}
 {activeSettingsDialog && (
 <div style={{
 position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
 background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 790
 }}>
 <div style={{ background: '#ffffff', borderRadius: '20px', padding: '18px', width: '100%', maxWidth: '340px', maxHeight: '540px', display: 'flex', flexDirection: 'column' }}>
 {/* Header */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
 <h3 style={{ fontSize: '0.96rem', fontWeight: '900', color: '#111827', margin: 0 }}>
 {activeSettingsDialog === 'password' && (isTl ? '🔒 Baguhin ang PIN / Password' : '🔒 Change PIN / Password')}
 {activeSettingsDialog === 'privacy' && (isTl ? '🛡️ Privacy at Lokal na Datos' : '🛡️ Privacy & Local Data Cache')}
 {activeSettingsDialog === 'help' && (isTl ? '❓ Tulong at Extension Desk' : '❓ Cooperative Help & Support')}
 {activeSettingsDialog === 'about' && (isTl ? 'ℹ️ Tungkol sa MARIKHA' : 'ℹ️ About MARIKHA Mobile')}
 {activeSettingsDialog === 'logout' && (isTl ? '↪ Kumpirmahin ang Pag-log out' : '↪ Confirm Sign Out')}
 {activeSettingsDialog === 'contact' && (isTl ? '📞 Impormasyon sa Kontak' : '📞 Member Contact Details')}
 {activeSettingsDialog === 'farm' && (isTl ? '📍 Lokasyon ng Bukid at GPS' : '📍 Farm Location & GPS')}
 {activeSettingsDialog === 'coop' && (isTl ? '👥 Sertipikasyon ng Kooperatiba' : '👥 Cooperative Certificate')}
 {activeSettingsDialog === 'plot' && (isTl ? '🌱 Detalye ng Pananim sa Plot' : '🌱 Plot Agronomy Details')}
 {activeSettingsDialog === 'livestock' && (isTl ? '🐐 Talaan ng mga Hayop' : '🐐 Livestock Herd Ledger')}
 </h3>
 <button 
 onClick={() => { setActiveSettingsDialog(null); setPinSuccessAlert(false); setCacheClearSuccess(false); }}
 style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
 >
 <X size={16} />
 </button>
 </div>

 <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
 {/* PASSWORD */}
 {activeSettingsDialog === 'password' && (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
 <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0 }}>
 {isTl ? 'Magtakda ng bagong security PIN para sa mabilis na pag-sign in.' : 'Set a new security PIN for fast biometric farm login.'}
 </p>
 {pinSuccessAlert && (
 <div style={{ background: '#dcfce7', padding: '8px 12px', borderRadius: '8px', border: '1px solid #86efac', color: '#15803d', fontWeight: '800', fontSize: '0.75rem' }}>
 ✓ {isTl ? 'Matagumpay na na-update ang PIN!' : 'Security PIN updated successfully!'}
 </div>
 )}
 <div>
 <label style={{ fontSize: '0.66rem', fontWeight: '800', color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
 {isTl ? 'Kasalukuyang PIN' : 'Current PIN'}
 </label>
 <input 
 type="password" 
 value={pinCurrent} 
 onChange={(e) => setPinCurrent(e.target.value)} 
 placeholder="••••"
 style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.82rem' }}
 />
 </div>
 <div>
 <label style={{ fontSize: '0.66rem', fontWeight: '800', color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
 {isTl ? 'Bagong PIN' : 'New Security PIN'}
 </label>
 <input 
 type="password" 
 value={pinNew} 
 onChange={(e) => setPinNew(e.target.value)} 
 placeholder="••••"
 style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.82rem' }}
 />
 </div>
 <button 
 onClick={() => {
 setPinSuccessAlert(true);
 setTimeout(() => {
 setPinSuccessAlert(false);
 setActiveSettingsDialog(null);
 setPinCurrent('');
 setPinNew('');
 }, 1200);
 }}
 style={{ padding: '10px', borderRadius: '10px', background: '#0c3619', color: '#fff', border: 'none', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer', marginTop: '6px' }}
 >
 {isTl ? 'I-save ang Bagong PIN →' : 'Save New Security PIN →'}
 </button>
 </div>
 )}

 {/* PRIVACY */}
 {activeSettingsDialog === 'privacy' && (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
 <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
 <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#166534' }}>🛡️ End-to-End Encrypted Sync</div>
 <div style={{ fontSize: '0.72rem', color: '#15803d', marginTop: '4px', lineHeight: 1.4 }}>
 {isTl 
 ? 'Ang lahat ng litrato, GPS coordinates, at logs ay ligtas na naka-encrypt sa lokal na imbakan bago ipadala sa Farm Staff at Super Admin.'
 : 'All farm photos, telemetry, and activity logs are encrypted locally before syncing to Farm Staff & Super Admin portals.'}
 </div>
 </div>
 <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
 <div style={{ fontSize: '0.66rem', fontWeight: '800', color: '#64748b' }}>LOCAL STORAGE CACHE</div>
 <div style={{ fontSize: '1rem', fontWeight: '900', color: '#0f172a', marginTop: '2px' }}>2.4 MB Cached</div>
 <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '2px' }}>
 14 activity logs · 6 planted crop records · 3 livestock tags
 </div>
 </div>
 {cacheClearSuccess && (
 <div style={{ background: '#dcfce7', padding: '8px', borderRadius: '8px', color: '#15803d', fontWeight: '800', fontSize: '0.75rem' }}>
 ✓ {isTl ? 'Nalinis ang lokal na cache at na-sync muli!' : 'Local cache refreshed and re-synced!'}
 </div>
 )}
 <button 
 onClick={() => {
 setCacheClearSuccess(true);
 setTimeout(() => setCacheClearSuccess(false), 2000);
 }}
 style={{ padding: '10px', borderRadius: '10px', background: '#059669', color: '#fff', border: 'none', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer' }}
 >
 {isTl ? 'Linisin ang Cache at I-sync Muli 🔄' : 'Clear Cache & Re-Sync 🔄'}
 </button>
 </div>
 )}

 {/* HELP */}
 {activeSettingsDialog === 'help' && (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
 <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
 <div style={{ fontSize: '0.86rem', fontWeight: '900', color: '#1e40af' }}>📞 Agronomist Hotline</div>
 <div style={{ fontSize: '0.74rem', color: '#1d4ed8', marginTop: '2px' }}>Likasan Organic Farmers Cooperative Support</div>
 <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>+63 2 8888 7777</div>
 </div>
 <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
 <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>🌾 Farm Staff Agronomist Desk</div>
 <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Liza Cruz · Assigned Field Agronomist</div>
 <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: '700', marginTop: '4px' }}>● Active on Mobile Gateway</div>
 </div>
 <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
 <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>📋 FAQ: Machine Learning Yields</div>
 <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '4px', lineHeight: 1.4 }}>
 {isTl
 ? 'Gumagamit ang Random Forest algorithm ng makasaysayang datos ng lupa, ulan, at pataba para kalkulahin ang ani at tamang petsa ng pag-aani.'
 : 'The Random Forest model combines live soil moisture, rainfall history, and organic fertilization dosages to forecast crop yields with 94%+ accuracy.'}
 </div>
 </div>
 </div>
 )}

 {/* ABOUT */}
 {activeSettingsDialog === 'about' && (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
 <div style={{ width: '56px', height: '56px', borderRadius: '28px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
 🌱
 </div>
 <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0c3619' }}>MARIKHA</div>
 <div style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: '700' }}>Organic Farming Cooperative Portal</div>
 <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Farmer Mobile Edition · v1.0.0 (Build 2026.09)</div>
 
 <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%', textAlign: 'left', marginTop: '6px' }}>
 <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>CORE MODULES & FRAMEWORK:</div>
 <div style={{ fontSize: '0.7rem', color: '#475569', lineHeight: 1.5 }}>
 • Random Forest v2.4 Multi-Class ML Classifier<br/>
 • PGS Organic Certification Compliance Matrix<br/>
 • Real-time Task Prioritization & Photo Validation<br/>
 • Native Goat Livestock & Medical Ledger<br/>
 • Cross-Platform WebSocket Cloud Synchronization
 </div>
 </div>
 </div>
 )}

 {/* LOGOUT */}
 {activeSettingsDialog === 'logout' && (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
 <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '12px', border: '1px solid #fca5a5' }}>
 <div style={{ fontSize: '0.86rem', fontWeight: '900', color: '#991b1b' }}>
 {isTl ? 'Nais mo bang mag-log out?' : 'Are you sure you want to sign out?'}
 </div>
 <div style={{ fontSize: '0.74rem', color: '#b91c1c', marginTop: '4px', lineHeight: 1.4 }}>
 {isTl
 ? 'Ang iyong mga nakabinbing tala at aktibidad ay ligtas na nakatago sa lokal na memorya at awtomatikong mai-sync sa muling pag-login.'
 : 'Your local records and offline draft logs are safely persisted on your device and will resume sync upon next sign-in.'}
 </div>
 </div>
 <div style={{ display: 'flex', gap: '8px' }}>
 <button 
 onClick={() => setActiveSettingsDialog(null)}
 style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer' }}
 >
 {isTl ? 'Kanselahin' : 'Cancel'}
 </button>
 <button 
 onClick={() => {
 setActiveSettingsDialog(null);
 setMobileAuth(false);
 setMobileScreen('login');
 }}
 style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#dc2626', color: '#fff', border: 'none', fontWeight: '900', fontSize: '0.8rem', cursor: 'pointer' }}
 >
 {isTl ? 'Oo, Mag-log out' : 'Yes, Sign Out'}
 </button>
 </div>
 </div>
 )}

 {/* CONTACT */}
 {activeSettingsDialog === 'contact' && (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
 <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
 <div style={{ fontSize: '0.64rem', fontWeight: '800', color: '#64748b' }}>REGISTERED MOBILE</div>
 <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>{profileData.mobile}</div>
 </div>
 <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
 <div style={{ fontSize: '0.64rem', fontWeight: '800', color: '#64748b' }}>OFFICIAL EMAIL</div>
 <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>{profileData.email}</div>
 </div>
 <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
 <div style={{ fontSize: '0.64rem', fontWeight: '800', color: '#64748b' }}>COOPERATIVE MEMBER ID</div>
 <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0c3619', marginTop: '2px' }}>{profileData.memberId}</div>
 </div>
 <button 
 onClick={() => {
 setActiveSettingsDialog(null);
 setTempProfile(profileData);
 setShowProfileSettingsModal(true);
 }}
 style={{ padding: '10px', borderRadius: '10px', background: '#0c3619', color: '#fff', border: 'none', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer', marginTop: '4px' }}
 >
 ✏️ {isTl ? 'Baguhin ang Impormasyon' : 'Edit Contact Info'}
 </button>
 </div>
 )}

 {/* FARM LOCATION */}
 {activeSettingsDialog === 'farm' && (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
 <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
 <div style={{ fontSize: '0.66rem', fontWeight: '800', color: '#166534' }}>FARM LOCATION & GPS TELEMETRY</div>
 <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0c3619', marginTop: '4px' }}>📍 {profileData.barangay}</div>
 <div style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: '700', marginTop: '4px' }}>🧭 Coordinates: {profileData.coordinates}</div>
 <div style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: '700', marginTop: '2px' }}>🌱 Total Assigned Area: {profileData.totalArea}</div>
 </div>
 <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
 <div style={{ fontSize: '0.76rem', fontWeight: '800', color: '#0f172a' }}>Soil Zone & Drainage</div>
 <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '2px' }}>Antipolo Lowland Valley · Volcanic Loam Layer · Slope &lt; 3%</div>
 </div>
 </div>
 )}

 {/* COOPERATIVE STANDING */}
 {activeSettingsDialog === 'coop' && (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
 <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '12px', border: '1px solid #86efac' }}>
 <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#0c3619' }}>Likasan Organic Farmers MPC</div>
 <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: '700', marginTop: '2px' }}>Cooperative Registration No. 9520-1002341</div>
 <div style={{ background: '#15803d', color: '#fff', fontSize: '0.65rem', fontWeight: '800', padding: '3px 8px', borderRadius: '8px', display: 'inline-block', marginTop: '6px' }}>
 PGS CERTIFIED ACTIVE
 </div>
 </div>
 <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
 <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a' }}>Standing: {profileData.standing}</div>
 <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Annual Dues: Paid until {profileData.duesPaidUntil}</div>
 </div>
 </div>
 )}

 {/* PLOT AGRONOMY */}
 {activeSettingsDialog === 'plot' && selectedPlotDetail && (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
 <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '12px', border: '1px solid #86efac' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0c3619' }}>{selectedPlotDetail.id}</span>
 <span style={{ background: '#15803d', color: '#fff', fontSize: '0.65rem', fontWeight: '800', padding: '2px 8px', borderRadius: '6px' }}>
 {selectedPlotDetail.status}
 </span>
 </div>
 <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#064e3b', marginTop: '4px' }}>{selectedPlotDetail.crop}</div>
 <div style={{ fontSize: '0.74rem', color: '#166534', fontWeight: '600' }}>Area: {selectedPlotDetail.area} · Drip Station 1</div>
 </div>
 <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
 <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a' }}>Agronomy & Soil Matrix</div>
 <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '4px', lineHeight: 1.4 }}>
 • Soil Type: Loam with 4.5% Organic Matter<br/>
 • Moisture Level: 65% (Optimal)<br/>
 • Nutrition: Vermicompost applied Aug 2026<br/>
 • Certification: Certified PGS Organic
 </div>
 </div>
 </div>
 )}

 {/* LIVESTOCK */}
 {activeSettingsDialog === 'livestock' && (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
 <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '12px', border: '1px solid #86efac' }}>
 <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#0c3619' }}>🐐 Native Goat Herd (GT-014)</div>
 <div style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: '700', marginTop: '2px' }}>Total Herd Size: 12 heads · Barn Shed 2</div>
 </div>
 <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
 <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0f172a' }}>Veterinary Status</div>
 <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '4px', lineHeight: 1.4 }}>
 • Deworming: Completed Oct 12, 2026<br/>
 • Daily Feed: 25kg Napier grass + organic mineral lick<br/>
 • Next Vet Checkup: Dec 01, 2026
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 )}

 {/* Interactive Profile Management & Settings Modal */}
 {showProfileSettingsModal && (
 <div style={{
 position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
 background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 750
 }}>
 <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', width: '100%', maxWidth: '330px', maxHeight: '540px', display: 'flex', flexDirection: 'column' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 <Settings size={20} color="#0c3619" />
 <div>
 <h3 style={{ fontSize: '0.98rem', fontWeight: '900', color: '#111827', margin: 0 }}>Profile & Settings</h3>
 <span style={{ fontSize: '0.68rem', color: '#6b7280' }}>Update static details & info</span>
 </div>
 </div>
 <button onClick={() => setShowProfileSettingsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
 <X size={18} />
 </button>
 </div>

 {profileSaveSuccess && (
 <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '8px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800', marginBottom: '10px', textAlign: 'center' }}>
 Profile details updated successfully!
 </div>
 )}

 <form onSubmit={handleSaveProfile} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
 <div>
 <label style={{ fontSize: '0.68rem', fontWeight: '800', color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Full Name</label>
 <input
 type="text"
 value={tempProfile.name}
 onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
 style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.82rem', fontWeight: '700' }}
 />
 </div>

 <div>
 <label style={{ fontSize: '0.68rem', fontWeight: '800', color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Mobile Number</label>
 <input
 type="text"
 value={tempProfile.mobile}
 onChange={(e) => setTempProfile({ ...tempProfile, mobile: e.target.value })}
 style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.82rem', fontWeight: '700' }}
 />
 </div>

 <div>
 <label style={{ fontSize: '0.68rem', fontWeight: '800', color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Email Address</label>
 <input
 type="email"
 value={tempProfile.email}
 onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
 style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.82rem', fontWeight: '700' }}
 />
 </div>

 <div>
 <label style={{ fontSize: '0.68rem', fontWeight: '800', color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Member ID</label>
 <input
 type="text"
 value={tempProfile.memberId}
 onChange={(e) => setTempProfile({ ...tempProfile, memberId: e.target.value })}
 style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.82rem', fontWeight: '700' }}
 />
 </div>

 <div>
 <label style={{ fontSize: '0.68rem', fontWeight: '800', color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Barangay & Location</label>
 <input
 type="text"
 value={tempProfile.barangay}
 onChange={(e) => setTempProfile({ ...tempProfile, barangay: e.target.value })}
 style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.82rem', fontWeight: '700' }}
 />
 </div>

 <div>
 <label style={{ fontSize: '0.68rem', fontWeight: '800', color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Coordinates</label>
 <input
 type="text"
 value={tempProfile.coordinates}
 onChange={(e) => setTempProfile({ ...tempProfile, coordinates: e.target.value })}
 style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.82rem', fontWeight: '700' }}
 />
 </div>

 <div>
 <label style={{ fontSize: '0.68rem', fontWeight: '800', color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Total Area</label>
 <input
 type="text"
 value={tempProfile.totalArea}
 onChange={(e) => setTempProfile({ ...tempProfile, totalArea: e.target.value })}
 style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.82rem', fontWeight: '700' }}
 />
 </div>

 <div>
 <label style={{ fontSize: '0.68rem', fontWeight: '800', color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Cooperative Name</label>
 <input
 type="text"
 value={tempProfile.coop}
 onChange={(e) => setTempProfile({ ...tempProfile, coop: e.target.value })}
 style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.82rem', fontWeight: '700' }}
 />
 </div>

 <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
 <button
 type="submit"
 style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#0c3619', color: '#ffffff', fontWeight: '800', fontSize: '0.82rem', border: 'none', cursor: 'pointer' }}
 >
 Save Profile Changes
 </button>

 <button
 type="button"
 onClick={() => { setShowProfileSettingsModal(false); setMobileAuth(false); setMobileScreen('login'); }}
 style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer' }}
 >
 Logout Account
 </button>
 </div>
 </form>
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
