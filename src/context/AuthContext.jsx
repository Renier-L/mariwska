import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialUsers, initialCrops, initialLivestock, initialAnnouncements, initialValidations, initialMLClassifications, initialSchedules } from '../data/mockData';
import { INITIAL_RBAC_CATEGORIES } from '../data/rbacData';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

// Browser-level BroadcastChannel for 0-latency instant cross-window sync!
const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
 ? new BroadcastChannel('marikha_realtime_broadcast')
 : null;

export const AuthProvider = ({ children }) => {
 // Restore currentRole from localStorage upon page reload/refresh so you stay logged in at your exact location!
 const [currentRole, setCurrentRoleState] = useState(() => {
 try {
 const savedRole = localStorage.getItem('marikha_current_role');
 return savedRole || 'login';
 } catch (e) {
 return 'login';
 }
 });

 const [selectedSeason, setSelectedSeasonState] = useState(() => {
 try {
 return localStorage.getItem('marikha_selected_season') || '2026 Active Season';
 } catch (e) {
 return '2026 Active Season';
 }
 });

 const setSelectedSeason = (season) => {
 setSelectedSeasonState(season);
 try {
 localStorage.setItem('marikha_selected_season', season);
 } catch (e) {}
 };

	const [currentUser, setCurrentUser] = useState(() => {
		try {
			const savedUser = localStorage.getItem('marikha_current_user');
			if (savedUser) {
				const parsed = JSON.parse(savedUser);
				if (parsed && (parsed.name || parsed.email)) return parsed;
			}
			const savedRole = localStorage.getItem('marikha_current_role');
			const savedUsers = localStorage.getItem('marikha_registered_users');
			const userPool = (savedUsers && JSON.parse(savedUsers)) || initialUsers;
			if (savedRole === 'admin') {
				return userPool.find(u => u.role === 'Admin') || userPool[1] || initialUsers[1];
			} else if (savedRole === 'farm_staff') {
				return userPool.find(u => u.role === 'Farm Staff') || userPool[2] || initialUsers[2];
			} else if (savedRole === 'mobile_app') {
				return userPool.find(u => u.role === 'Farmer') || userPool[4] || initialUsers[4];
			}
			return userPool.find(u => u.role === 'Executive' || u.role === 'Super Admin') || userPool[0] || initialUsers[0];
		} catch (e) {
			return initialUsers[0];
		}
	});
 const [tenantInfo] = useState({
 name: 'Antipolo Organic Farming Cooperative',
 id: 'ANT-ORG-001',
 status: 'Cloud sync · Live (Supabase Realtime)'
 });

 // Persist Users in LocalStorage & Supabase so created accounts NEVER vanish on refresh or login!
 const [users, setUsers] = useState(() => {
 try {
 const saved = localStorage.getItem('marikha_registered_users');
 if (saved) {
 const parsed = JSON.parse(saved);
 if (Array.isArray(parsed) && parsed.length > 0) return parsed;
 }
 } catch (e) {}
 return initialUsers;
 });

 const [crops, setCrops] = useState(() => {
		const enrich = (item, idx) => {
			if (!item) return item;
			const farmers = ['Renier Lopez', 'Mang Juan Dela Cruz', 'Elena Velasco'];
			const farmer = item.farmer || farmers[idx % farmers.length];
			const cropType = item.cropType || (String(item.variety || '').includes('Tomato') ? 'Tomato' : String(item.variety || '').includes('Eggplant') ? 'Eggplant' : String(item.variety || '').includes('Okra') ? 'Okra' : 'Squash');
			const variety = item.variety || (cropType + ' Standard');
			const plot = item.plot ? (String(item.plot).startsWith('Plot') ? item.plot : ('Plot ' + item.plot)) : ('Plot P-00' + (idx + 1));
			const plantingDate = item.plantingDate || (idx % 2 === 0 ? '2026-06-15' : '2026-07-01');
			const cultivatedArea = item.cultivatedArea || (350 + (idx * 50));
			const plannedPlantingCount = item.plannedPlantingCount || (400 + (idx * 50));
			const actualPlantedCount = item.actualPlantedCount || (plannedPlantingCount - (idx * 10 + 5));
			const stage = item.growthStage || 'Vegetative';
			const predictedYield = item.predictedYield || (item.yield && !isNaN(parseInt(item.yield)) ? parseInt(item.yield) + 15 : 350);
			const actualYield = item.actualYield !== undefined ? item.actualYield : (item.yield && !isNaN(parseInt(item.yield)) ? parseInt(item.yield) : 0);

			return {
				...item,
				farmer,
				farmerId: item.farmerId || (farmer === 'Renier Lopez' ? '4' : farmer === 'Mang Juan Dela Cruz' ? '5' : '3'),
				cropType,
				variety,
				plot,
				plantingDate,
				cultivatedArea,
				areaUnit: item.areaUnit || 'sq.m',
				plannedPlantingCount,
				actualPlantedCount,
				growthStage: stage,
				confirmedGrowthStage: item.confirmedGrowthStage || stage,
				cropStatus: (stage === 'Harvest' || stage === 'Harvesting') ? 'Harvest Ready' : (item.cropStatus || 'Active'),
				predictedYield,
				actualYield,
				yield: item.yield || ((actualYield > 0 ? actualYield : predictedYield) + ' kg')
			};
		};

		try {
			const saved = localStorage.getItem('marikha_crops_list');
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.length > 0) {
					return parsed.map((c, i) => enrich(c, i));
				}
			}
		} catch (e) {}
		return initialCrops.map((c, i) => enrich(c, i));
	});

 const [livestock, setLivestock] = useState(() => {
 try {
 const saved = localStorage.getItem('marikha_livestock_list');
 if (saved) {
 const parsed = JSON.parse(saved);
 if (Array.isArray(parsed) && parsed.length > 0) {
 return parsed.map(item => {
 if (!item) return item;
 const grpStr = String(item.group || item.animalType || '');
 if (!grpStr.toLowerCase().includes('goat')) {
 return {
 ...item,
 groupCode: item.groupCode && item.groupCode.startsWith('GT-') ? item.groupCode : `GT-014`,
 group: `Native Goat Herd GT-014 (34 Goats)`,
 animalType: 'Native Goats',
 forage: 'Organic Napier Grass'
 };
 }
 return item;
 });
 }
 }
 } catch (e) {}
 return initialLivestock;
 });

 const [schedules, setSchedules] = useState(() => {
 try {
 const saved = localStorage.getItem('marikha_schedules_list');
 if (saved) {
 const parsed = JSON.parse(saved);
 if (Array.isArray(parsed) && parsed.length > 0) return parsed;
 }
 } catch (e) {}
 return initialSchedules;
 });

 const [announcements, setAnnouncements] = useState(() => {
 try {
 const saved = localStorage.getItem('marikha_announcements_list');
 if (saved) {
 const parsed = JSON.parse(saved);
 if (Array.isArray(parsed)) return parsed;
 }
 } catch (e) {}
 return initialAnnouncements;
 });

 const [validations, setValidations] = useState(() => {
 try {
 const saved = localStorage.getItem('marikha_validations_list');
 if (saved) {
 const parsed = JSON.parse(saved);
 if (Array.isArray(parsed)) return parsed;
 }
 } catch (e) {}
 return initialValidations;
 });
 const [mlClassifications, setMlClassifications] = useState(initialMLClassifications);
 
 // Unlimited Real-time Push Notification Popup state
 const [activePushNotice, setActivePushNotice] = useState(null);
 const [activePushValidation, setActivePushValidation] = useState(null);

 // Security Matrix State (Persisted & Synced Live)
 const [permissionsMatrix, setPermissionsMatrix] = useState(() => {
 try {
 const saved = localStorage.getItem('marikha_permissions_matrix');
 if (saved) {
 const parsed = JSON.parse(saved);
 delete parsed['PGS Auditor'];
 return parsed;
 }
 } catch (e) {}
 return {
 Executive: { readLogs: true, writeEntries: false, executeValidations: false, bypassAudits: false, accessML: true },
 Administrator: { readLogs: true, writeEntries: true, executeValidations: false, bypassAudits: true, accessML: true },
 'Farm Staff': { readLogs: true, writeEntries: true, executeValidations: true, bypassAudits: false, accessML: true },
 Farmer: { readLogs: false, writeEntries: true, executeValidations: false, bypassAudits: false, accessML: false }
 };
 });

  // Granular 10-Category RBAC Matrix State (Editable across Super Admin & Admin)
  const [rbacCategories, setRbacCategories] = useState(() => {
    try {
      const saved = localStorage.getItem("marikha_rbac_matrix_v3");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_RBAC_CATEGORIES;
  });

  const updateRbacCapability = (categoryId, capabilityId, roleKey, newAccessLevel) => {
    setRbacCategories(prev => {
      const next = prev.map(cat => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          capabilities: cat.capabilities.map(cap => {
            if (cap.id !== capabilityId) return cap;
            return {
              ...cap,
              [roleKey]: newAccessLevel
            };
          })
        };
      });
      try {
        localStorage.setItem("marikha_rbac_matrix_v3", JSON.stringify(next));
      } catch (e) {}
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: "RBAC_UPDATED_PUSH", payload: next });
      }
      return next;
    });
  };

  const resetRbacToDefault = () => {
    setRbacCategories(INITIAL_RBAC_CATEGORIES);
    try {
      localStorage.removeItem("marikha_rbac_matrix_v3");
    } catch (e) {}
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: "RBAC_UPDATED_PUSH", payload: INITIAL_RBAC_CATEGORIES });
    }
  };

 const setCurrentRole = (roleKey) => {
 setCurrentRoleState(roleKey);
 try {
 if (roleKey === 'login') {
 localStorage.removeItem('marikha_current_role');
 localStorage.removeItem('marikha_current_user');
 } else {
 localStorage.setItem('marikha_current_role', roleKey);
 }
 } catch (e) {}
 };

 const loginAsRole = (roleKey, targetUser = null) => {
 setCurrentRole(roleKey);
 let chosenUser = targetUser;
 if (!chosenUser) {
 if (roleKey === 'super_admin') {
 chosenUser = users.find(u => u.role === 'Executive' || u.role === 'Super Admin') || users[0] || initialUsers[0];
 } else if (roleKey === 'admin') {
 chosenUser = users.find(u => u.role === 'Admin') || users[1] || initialUsers[1];
 } else if (roleKey === 'farm_staff') {
 chosenUser = (users && users.find(u => u.role === 'Farm Staff')) || initialUsers[2];
 } else if (roleKey === 'mobile_app') {
 chosenUser = users.find(u => u.role === 'Farmer') || users[4] || initialUsers[4];
 } else {
 chosenUser = users[0] || initialUsers[0];
 }
 }
 setCurrentUser(chosenUser);
 try {
 localStorage.setItem('marikha_current_user', JSON.stringify(chosenUser));
 } catch (e) {}
 };

 // Cross-Window Instant Sync via BroadcastChannel & LocalStorage!
 useEffect(() => {
 const handleIncomingNotice = (newAnn) => {
 setAnnouncements(prev => [newAnn, ...prev.filter(a => a.id !== newAnn.id)]);
 setActivePushNotice(newAnn);
 };

 const handleIncomingValidation = (newVal) => {
 const rawUrl = newVal.photo_url || newVal.photoUrl;
 const validUrl = (typeof rawUrl === 'string' && rawUrl.trim().length > 10) 
 ? rawUrl 
 : 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80';

 const formatted = {
 id: String(newVal.id || Date.now()),
 farmer: newVal.farmer || 'Mang Juan Dela Cruz',
 plot: newVal.plot || 'Plot P-007',
 taskType: newVal.activity || newVal.taskType || 'Watering',
 activity: newVal.activity || newVal.taskType || 'Watering',
 timestamp: 'Just now',
 urgency: 'Normal',
 urgencyCls: 'pill-low',
 location: newVal.gps || newVal.location || '14.5995° N, 121.1794° E',
 gps: newVal.gps || newVal.location || '14.5995° N, 121.1794° E',
 farmerNote: newVal.notes || newVal.farmerNote || 'Submitted via Farmers Mobile App',
 notes: newVal.notes || newVal.farmerNote || 'Submitted via Farmers Mobile App',
 photoUrl: validUrl,
 photo_url: validUrl,
 photoAttached: true,
 status: newVal.status || 'Pending'
 };
 setValidations(prev => [formatted, ...prev.filter(v => String(v.id) !== String(formatted.id))]);
 setActivePushValidation(formatted);
 };

 const handleIncomingUser = (newUser) => {
 setUsers(prev => {
 const next = [newUser, ...prev.filter(u => u.id !== newUser.id)];
 try { localStorage.setItem('marikha_registered_users', JSON.stringify(next)); } catch (e) {}
 return next;
 });
 };

 const handleDeletedUser = (deletedId) => {
 setUsers(prev => {
 const next = prev.filter(u => u.id !== deletedId);
 try { localStorage.setItem('marikha_registered_users', JSON.stringify(next)); } catch (e) {}
 return next;
 });
 };

 const handleIncomingProfileUpdate = (updatedUser) => {
 if (!updatedUser) return;
 setCurrentUser(prev => {
 if (!prev) return updatedUser;
 if (String(prev.id) === String(updatedUser.id) || prev.email === updatedUser.email) {
 return { ...prev, ...updatedUser };
 }
 return prev;
 });
 setUsers(prev => prev.map(u => (String(u.id) === String(updatedUser.id) || u.email === updatedUser.email) ? { ...u, ...updatedUser } : u));
 };

 const handleIncomingStatusToggle = ({ id, status }) => {
 setUsers(prev => prev.map(u => (String(u.id) === String(id) || String(u.id).replace('USR-', '') === String(id).replace('USR-', '')) ? { ...u, status, isActive: status } : u));
 };

 if (broadcastChannel) {
 broadcastChannel.onmessage = (event) => {
 if (event.data && event.data.type === 'ANNOUNCEMENT_PUSH') {
 handleIncomingNotice(event.data.payload);
 } else if (event.data && event.data.type === 'FARMER_SUBMISSION_PUSH') {
 handleIncomingValidation(event.data.payload);
 } else if (event.data && event.data.type === 'USER_CREATED_PUSH') {
 handleIncomingUser(event.data.payload);
 } else if (event.data && event.data.type === 'PROFILE_UPDATED_PUSH') {
 handleIncomingProfileUpdate(event.data.payload);
 } else if (event.data && event.data.type === 'USER_STATUS_TOGGLED') {
 handleIncomingStatusToggle(event.data.payload);
 } else if (event.data && event.data.type === 'RBAC_UPDATED_PUSH') {
 setRbacCategories(event.data.payload);
 } else if (event.data && event.data.type === 'USER_DELETED_PUSH') {
 handleDeletedUser(event.data.payload);
 }
 };
 }

 const handleStorageEvent = (e) => {
 if (e.key === 'marikha_live_push' && e.newValue) {
 try {
 const parsed = JSON.parse(e.newValue);
 handleIncomingNotice(parsed);
 } catch (err) {}
 } else if (e.key === 'marikha_live_validation' && e.newValue) {
 try {
 const parsed = JSON.parse(e.newValue);
 handleIncomingValidation(parsed);
 } catch (err) {}
 } else if (e.key === 'marikha_live_user' && e.newValue) {
 try {
 const parsed = JSON.parse(e.newValue);
 handleIncomingUser(parsed);
 } catch (err) {}
 } else if (e.key === 'marikha_current_user' && e.newValue) {
 try {
 const parsed = JSON.parse(e.newValue);
 handleIncomingProfileUpdate(parsed);
 } catch (err) {}
 } else if (e.key === 'marikha_rbac_matrix_v3' && e.newValue) {
 try { setRbacCategories(JSON.parse(e.newValue)); } catch (err) {}
 } else if (e.key === 'marikha_deleted_user' && e.newValue) {
 try {
 const parsed = JSON.parse(e.newValue);
 handleDeletedUser(parsed.id);
 } catch (err) {}
 }
 };
 window.addEventListener('storage', handleStorageEvent);

 return () => {
 window.removeEventListener('storage', handleStorageEvent);
 };
 }, []);

 // Fetch initial announcements, users, and validations from Supabase Realtime!
 useEffect(() => {
 async function fetchSupabaseData() {
 try {
 const { data: userData } = await supabase.from('users').select('*');
 if (userData && userData.length > 0) {
 const formattedUsers = userData.map(u => ({
 id: String(u.id),
 name: u.name,
 role: u.role,
 email: u.email,
 phone: u.phone || '+63 917 555 0100',
 assignedPlot: u.assigned_plot || u.assignedPlot || (u.role === 'Executive' ? 'Administrative HQ' : u.role === 'Admin' ? 'Operations & Compliance Center' : u.role === 'Farm Staff' ? 'Sector B (Plot P-007)' : 'Plot P-007 (Tomato Diamante)'),
 rsbsaNo: u.rsbsa_no || u.rsbsaNo || (u.role === 'Farmer' ? 'RSBSA-03-1425-001' : 'RSBSA-03-1000-COOP'),
 certification: u.certification || (u.role === 'Farmer' ? 'PGS Certified Organic Farmer' : u.role === 'Farm Staff' ? 'PGS Level II Supervisor' : 'Certified Organic Auditor'),
 emergencyContact: u.emergency_contact || u.emergencyContact || 'Family Contact (+63 918 555 0100)',
 joinDate: u.join_date || u.joinDate || '2024-03-15',
 password: u.password || 'password123',
 status: u.status !== false,
 initials: u.name ? u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'
 }));
 setUsers(formattedUsers);
 try { localStorage.setItem('marikha_registered_users', JSON.stringify(formattedUsers)); } catch (e) {}
 } else {
 // Auto-direct seed core users into empty Supabase users table!
 for (const u of initialUsers) {
 await supabase.from('users').insert([{
 name: u.name,
 role: u.role,
 email: u.email,
 phone: u.phone || '+63 917 555 0100',
 password: u.password || 'password123',
 status: true
 }]);
 }
 }

 // 2. ANNOUNCEMENTS SYNC
 const { data: annData } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
 if (annData && annData.length > 0) {
 const formatted = annData.map(a => {
      const rawTitle = a.title || 'Cooperative Broadcast Notice';
      let targetAudience = 'all';
      let audienceLabel = 'All Cooperative Members';
      let cleanDisplayTitle = rawTitle;

      if (rawTitle.includes('[Target: Farmers Only') || rawTitle.toLowerCase().includes('farmers only')) {
        targetAudience = 'farmers';
        audienceLabel = 'Farmers Only (Mobile)';
      } else if (rawTitle.includes('[Target: Farm Staff') || rawTitle.toLowerCase().includes('farm staff')) {
        targetAudience = 'staff';
        audienceLabel = 'Farm Staff Operations';
      } else if (rawTitle.includes('[Target: Scheduling') || rawTitle.toLowerCase().includes('scheduling')) {
        targetAudience = 'scheduling';
        audienceLabel = 'Scheduling & Protocol';
      }

      if (rawTitle.startsWith('[Target:')) {
        const closeBracket = rawTitle.indexOf(']');
        if (closeBracket !== -1) {
          cleanDisplayTitle = rawTitle.substring(closeBracket + 1).trim();
        }
      }

      return {
        id: String(a.id),
        title: cleanDisplayTitle,
        rawTitle: rawTitle,
        content: a.content,
        author: a.author || 'Rosa Mendoza (Super Admin)',
        targetAudience,
        audienceLabel,
        instantPush: true,
        date: a.start_date || new Date(a.created_at || Date.now()).toISOString().split('T')[0],
        startDate: a.start_date || new Date(a.created_at || Date.now()).toISOString().split('T')[0],
        endDate: a.end_date || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        archived: a.is_archived || a.archived || false
      };
    });
    setAnnouncements(prev => {
 const merged = [...formatted];
 prev.forEach(p => {
 if (!merged.some(m => String(m.id) === String(p.id) || m.content === p.content)) {
 merged.push(p);
 }
 });
 return merged;
 });
 }

 // 3. TASK VALIDATIONS SYNC
 const { data: valData } = await supabase.from('task_validations').select('*').order('created_at', { ascending: false });
 if (valData && valData.length > 0) {
 const formattedVals = valData.map(v => ({
 id: String(v.id),
 farmer: v.farmer || 'Mang Juan Dela Cruz',
 plot: v.plot || 'Plot P-007',
 taskType: v.activity || 'Watering',
 activity: v.activity || 'Watering',
 createdAt: v.created_at || new Date().toISOString(),
 created_at: v.created_at || new Date().toISOString(),
 timestamp: (() => {
 if (!v.created_at) return 'Just now';
 const diffMs = Date.now() - new Date(v.created_at).getTime();
 if (diffMs < 3600000) return 'Just now';
 if (diffMs < 86400000) return 'Today';
 const daysAgo = Math.floor(diffMs / 86400000);
 return `${daysAgo}d ago`;
 })(),
 urgency: 'Normal',
 urgencyCls: 'pill-low',
 location: v.gps || 'Live Mobile GPS',
 gps: v.gps || 'Live Mobile GPS',
 farmerNote: v.notes || 'Submitted via Farmers Mobile App',
 notes: v.notes || 'Submitted via Farmers Mobile App',
 photoUrl: v.photo_url || null,
 photo_url: v.photo_url || null,
 photoAttached: true,
 status: v.status || 'Pending'
 }));
 setValidations(prev => {
 const merged = [...formattedVals];
 prev.forEach(p => {
 if (!merged.some(m => String(m.id) === String(p.id))) {
 merged.push(p);
 }
 });
 return merged;
 });
 }

 // 4. CROPS SYNC
 const { data: cropData } = await supabase.from('crops').select('*').order('created_at', { ascending: false });
 if (cropData && cropData.length > 0) {
 const formattedCrops = cropData.map(c => ({
 id: String(c.id),
 variety: c.variety,
 plot: c.plot,
 growthStage: c.growth_stage || c.growthStage || 'Vegetative',
 fertilizer: c.fertilizer || 'Organic Compost',
 irrigation: c.irrigation || 'Drip System',
 yield: c.yield || '350 kg'
 }));
 setCrops(formattedCrops);
 try { localStorage.setItem('marikha_crops_list', JSON.stringify(formattedCrops)); } catch (e) {}
 }

 // 5. LIVESTOCK SYNC
 const { data: liveData } = await supabase.from('livestock').select('*').order('created_at', { ascending: false });
 if (liveData && liveData.length > 0) {
 const formattedLive = liveData.map(l => ({
 id: String(l.id),
 group: l.group_name || l.group || 'Goat Herd GT-01',
 plot: l.plot,
 headCount: Number(l.head_count || l.headCount) || 25,
 vaccination: l.vaccination || '100% (Up to date)',
 healthStatus: l.health_status || l.healthStatus || 'Healthy',
 dailyGain: l.daily_gain || l.dailyGain || '+1.2 kg/wk'
 }));
 setLivestock(formattedLive);
 try { localStorage.setItem('marikha_livestock_list', JSON.stringify(formattedLive)); } catch (e) {}
 }

 // 6. SCHEDULES SYNC
 const { data: schedData } = await supabase.from('schedules').select('*').order('created_at', { ascending: false });
 if (schedData && schedData.length > 0) {
 const formattedScheds = schedData.map(s => ({
 id: String(s.id),
 title: s.title,
 category: s.category || 'planting',
 plot: s.plot || 'Plot P-021',
 date: s.date || '2026-09-20',
 time: s.time || '08:00 AM',
 protocol: s.protocol || 'Standard Organic Protocol',
 assignedTo: s.assigned_to || s.assignedTo || 'Renier Lopez (Farmer)',
 priority: s.priority || 'HIGH',
 status: s.status || 'Upcoming',
 countdown: s.countdown || 'Upcoming'
 }));
 setSchedules(prev => {
 const merged = [...formattedScheds];
 prev.forEach(p => {
 if (!merged.some(m => String(m.id) === String(p.id) || m.title === p.title)) {
 merged.push(p);
 }
 });
 try { localStorage.setItem('marikha_schedules_list', JSON.stringify(merged)); } catch (e) {}
 return merged;
 });
 }
 } catch (err) {
 console.log('Supabase table fallback', err);
 }
 }
 fetchSupabaseData();
 const interval = setInterval(() => {
 fetchSupabaseData();
 }, 2000);

 let announcementsChannel, validationsChannel, usersChannel, schedulesChannel;
 try {
 // Supabase Realtime Subscription for Broadcast Announcements
 announcementsChannel = supabase
 .channel('announcements_realtime_channel')
 .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'announcements' }, (payload) => {
 const newRecord = payload.new;
 const rawTitle = newRecord.title || 'Cooperative Broadcast Notice';
        let targetAudience = 'all';
        let audienceLabel = 'All Cooperative Members';
        let cleanDisplayTitle = rawTitle;

        if (rawTitle.includes('[Target: Farmers Only') || rawTitle.toLowerCase().includes('farmers only')) {
          targetAudience = 'farmers';
          audienceLabel = 'Farmers Only (Mobile)';
        } else if (rawTitle.includes('[Target: Farm Staff') || rawTitle.toLowerCase().includes('farm staff')) {
          targetAudience = 'staff';
          audienceLabel = 'Farm Staff Operations';
        } else if (rawTitle.includes('[Target: Scheduling') || rawTitle.toLowerCase().includes('scheduling')) {
          targetAudience = 'scheduling';
          audienceLabel = 'Scheduling & Protocol';
        }

        if (rawTitle.startsWith('[Target:')) {
          const closeBracket = rawTitle.indexOf(']');
          if (closeBracket !== -1) {
            cleanDisplayTitle = rawTitle.substring(closeBracket + 1).trim();
          }
        }

        const newAnn = {
          id: String(newRecord.id),
          title: cleanDisplayTitle,
          rawTitle: rawTitle,
          content: newRecord.content,
          author: newRecord.author || 'Rosa Mendoza (Super Admin)',
          targetAudience,
          audienceLabel,
          instantPush: true,
          date: new Date(newRecord.created_at || Date.now()).toISOString().split('T')[0],
          pushId: Math.random(),
          _autoOpenModal: true
        };
        setAnnouncements(prev => [newAnn, ...prev.filter(a => a.id !== newAnn.id)]);
 setActivePushNotice(newAnn);
 })
 .subscribe();

 // Supabase Realtime Subscription for Farmer Task Validations
 validationsChannel = supabase
 .channel('validations_realtime_channel')
 .on('postgres_changes', { event: '*', schema: 'public', table: 'task_validations' }, (payload) => {
 if (payload.new) {
 const newRecord = payload.new;
 const newEntry = {
 id: String(newRecord.id),
 farmer: newRecord.farmer || 'Mang Juan Dela Cruz',
 plot: newRecord.plot || 'Plot P-007',
 taskType: newRecord.activity || 'Watering',
 activity: newRecord.activity || 'Watering',
 timestamp: 'Just now',
 urgency: 'Normal',
 urgencyCls: 'pill-low',
 location: newRecord.gps || 'Live Mobile GPS',
 gps: newRecord.gps || 'Live Mobile GPS',
 farmerNote: newRecord.notes || 'Submitted via Farmers Mobile App',
 notes: newRecord.notes || 'Submitted via Farmers Mobile App',
 photoUrl: newRecord.photo_url || null,
 photoAttached: true,
 status: newRecord.status || 'Pending'
 };
 setValidations(prev => {
 const exists = prev.some(v => String(v.id) === String(newEntry.id));
 if (exists) {
 return prev.map(v => String(v.id) === String(newEntry.id) ? { ...v, ...newEntry } : v);
 }
 return [newEntry, ...prev];
 });
 }
 })
 .subscribe();

 // Supabase Realtime Subscription for Registered Users
 usersChannel = supabase
 .channel('users_realtime_channel')
 .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
 if (payload.new) {
 const u = payload.new;
 const userObj = {
 id: String(u.id),
 name: u.name,
 role: u.role,
 email: u.email,
 phone: u.phone || '+63 917 555 0100',
 password: u.password || 'password123',
 status: u.status !== false,
 initials: u.name ? u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'
 };
 setUsers(prev => [userObj, ...prev.filter(existing => existing.id !== userObj.id && existing.email !== userObj.email)]);
 }
 })
 .subscribe();

 // Supabase Realtime Subscription for Cooperative Schedules
 schedulesChannel = supabase
 .channel('schedules_realtime_channel')
 .on('postgres_changes', { event: '*', schema: 'public', table: 'schedules' }, (payload) => {
 if (payload.new) {
 const s = payload.new;
 const newSched = {
 id: String(s.id),
 title: s.title,
 category: s.category || 'planting',
 plot: s.plot || 'Plot P-021',
 date: s.date || '2026-09-20',
 time: s.time || '08:00 AM',
 protocol: s.protocol || 'Standard Organic Protocol',
 assignedTo: s.assigned_to || s.assignedTo || 'Renier Lopez (Farmer)',
 priority: s.priority || 'HIGH',
 status: s.status || 'Upcoming',
 countdown: s.countdown || 'Upcoming'
 };
 setSchedules(prev => {
 const exists = prev.some(item => String(item.id) === String(newSched.id));
 let updated;
 if (exists) {
 updated = prev.map(item => String(item.id) === String(newSched.id) ? { ...item, ...newSched } : item);
 } else {
 updated = [newSched, ...prev];
 }
 try { localStorage.setItem('marikha_schedules_list', JSON.stringify(updated)); } catch (e) {}
 return updated;
 });
 }
 })
 .subscribe();
 } catch (e) {
 console.warn('Realtime channel subscription fallback', e);
 }

 return () => {
 clearInterval(interval);
 try {
 if (announcementsChannel) supabase.removeChannel(announcementsChannel);
 if (validationsChannel) supabase.removeChannel(validationsChannel);
 if (usersChannel) supabase.removeChannel(usersChannel);
 if (schedulesChannel) supabase.removeChannel(schedulesChannel);
 } catch (e) {}
 };
 }, []);

 const toggleUserStatus = async (id) => {
 setUsers(prev => {
 const target = prev.find(u => String(u.id) === String(id) || String(u.id).replace('USR-', '') === String(id).replace('USR-', ''));
 if (!target) return prev;

 // Prevent deactivating own logged-in user account
 if (currentUser && (String(target.id) === String(currentUser.id) || target.email === currentUser.email)) {
 alert("Action Restricted: You cannot deactivate your own active session account.");
 return prev;
 }

 const currentActive = target.status === true || target.status === 'Active' || target.isActive === true;
 const nextActive = !currentActive;

 const next = prev.map(u => {
 if (String(u.id) === String(id) || String(u.id).replace('USR-', '') === String(id).replace('USR-', '')) {
 return {
 ...u,
 status: nextActive,
 isActive: nextActive
 };
 }
 return u;
 });

 try { localStorage.setItem('marikha_registered_users', JSON.stringify(next)); } catch (e) {}
 if (broadcastChannel) {
 broadcastChannel.postMessage({ type: 'USER_STATUS_TOGGLED', payload: { id, status: nextActive } });
 }
 return next;
 });

 try {
 const target = users.find(u => String(u.id) === String(id) || String(u.id).replace('USR-', '') === String(id).replace('USR-', ''));
 if (target) {
 const currentActive = target.status === true || target.status === 'Active' || target.isActive === true;
 await supabase.from('users').update({ status: !currentActive }).eq('email', target.email);
 }
 } catch (e) {
 console.log('Supabase user toggle error:', e);
 }
 };

 const addUser = async (newUser) => {
 const userObj = { 
 ...newUser, 
 id: String(Date.now()), 
 assignedPlot: newUser.assignedPlot || 'Plot P-007 (Tomato Diamante)',
 rsbsaNo: newUser.rsbsaNo || 'RSBSA-03-1425-001',
 certification: newUser.certification || 'PGS Certified Organic Farmer',
 emergencyContact: newUser.emergencyContact || 'Maria Lopez (+63 918 777 8888)',
 joinDate: newUser.joinDate || new Date().toISOString().split('T')[0],
 password: newUser.password ? String(newUser.password).trim() : 'password123',
 initials: newUser.name ? newUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'
 };
 
 setUsers(prev => {
 const next = [userObj, ...prev];
 try { localStorage.setItem('marikha_registered_users', JSON.stringify(next)); } catch (e) {}
 return next;
 });

 if (broadcastChannel) {
 broadcastChannel.postMessage({ type: 'USER_CREATED_PUSH', payload: userObj });
 }

 try {
 localStorage.setItem('marikha_live_user', JSON.stringify({ ...userObj, _t: Date.now() }));
 } catch (e) {}

 try {
 const payload = { 
 name: newUser.name, 
 role: newUser.role, 
 email: newUser.email, 
 phone: newUser.phone || '+63 917 555 0100',
 assigned_plot: newUser.assignedPlot || 'Plot P-007 (Tomato Diamante)',
 rsbsa_no: newUser.rsbsaNo || 'RSBSA-03-1425-001',
 certification: newUser.certification || 'PGS Certified Organic Farmer',
 emergency_contact: newUser.emergencyContact || 'Maria Lopez (+63 918 777 8888)',
 join_date: newUser.joinDate || new Date().toISOString().split('T')[0],
 password: newUser.password ? String(newUser.password).trim() : 'password123',
 status: newUser.status !== false
 };

 const { data, error } = await supabase.from('users').upsert(payload, { onConflict: 'email' }).select();

 if (error) {
 // Fallback retry with base columns if custom columns fail in Supabase schema
 const basicPayload = {
 name: newUser.name,
 role: newUser.role,
 email: newUser.email,
 phone: newUser.phone || '+63 917 555 0100',
 status: newUser.status !== false
 };
 await supabase.from('users').upsert(basicPayload, { onConflict: 'email' });
 } else if (data && data[0]) {
 console.log('Supabase Member Record Inserted Live:', data[0]);
 }
 } catch (e) {
 console.log('Supabase sync error:', e);
 }
 };

 const updateUser = async (userId, updatedData) => {
 setUsers(prev => {
 const next = prev.map(u => (String(u.id) === String(userId) || u.email === updatedData.email) ? { 
 ...u, 
 ...updatedData, 
 password: updatedData.password ? String(updatedData.password).trim() : u.password,
 initials: updatedData.name ? updatedData.name.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() : u.initials 
 } : u);
 try { localStorage.setItem('marikha_registered_users', JSON.stringify(next)); } catch (e) {}
 return next;
 });

 if (currentUser && (String(currentUser.id) === String(userId) || currentUser.email === updatedData.email)) {
 const newInitials = updatedData.name ? updatedData.name.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() : currentUser.initials;
 const updatedCurr = { ...currentUser, ...updatedData, initials: newInitials };
 setCurrentUser(updatedCurr);
 try { localStorage.setItem('marikha_current_user', JSON.stringify(updatedCurr)); } catch (e) {}
 }

 try {
 const payload = {
 name: updatedData.name,
 role: updatedData.role,
 email: updatedData.email,
 phone: updatedData.phone || '+63 917 555 0100',
 assigned_plot: updatedData.assignedPlot || 'Plot P-007 (Vegetable Sector)',
 rsbsa_no: updatedData.rsbsaNo || 'RSBSA-03-1425-001',
 certification: updatedData.certification || 'PGS Certified Organic Farmer',
 emergency_contact: updatedData.emergencyContact || 'Family Contact (+63 918 555 0100)',
 password: updatedData.password ? String(updatedData.password).trim() : 'password123'
 };

 const { data, error } = await supabase.from('users').upsert(payload, { onConflict: 'email' }).select();

 if (error) {
 // Fallback retry with basic columns
 const basicPayload = {
 name: updatedData.name,
 role: updatedData.role,
 email: updatedData.email,
 phone: updatedData.phone || '+63 917 555 0100'
 };
 await supabase.from('users').upsert(basicPayload, { onConflict: 'email' });
 } else {
 console.log('Supabase Member Record Updated Live:', data);
 }
 } catch (e) {
 console.log('Supabase update error:', e);
 }
 };

 const deleteUser = async (userId) => {
 const target = users.find(u => u.id === userId);
 if (target && (target.role === 'Executive' || target.role === 'Admin')) {
 alert(' Security Protection: System Core Administrator accounts (Super Admin & Admin) cannot be deleted.');
 return;
 }

 setUsers(prev => {
 const next = prev.filter(u => u.id !== userId);
 try { localStorage.setItem('marikha_registered_users', JSON.stringify(next)); } catch (e) {}
 return next;
 });

 if (broadcastChannel) {
 broadcastChannel.postMessage({ type: 'USER_DELETED_PUSH', payload: userId });
 }

 try {
 localStorage.setItem('marikha_deleted_user', JSON.stringify({ id: userId, _t: Date.now() }));
 } catch (e) {}

 if (target) {
 try {
 const { error } = await supabase.from('users').delete().eq('email', target.email);
 if (error) console.error('Supabase Delete User Error:', error);
 } catch (e) {
 console.log('Supabase delete error:', e);
 }
 }
 };

  // INSTANT MULTI-WINDOW REALTIME BROADCAST WITH TARGET AUDIENCE & SUPABASE SYNC
  const publishAnnouncement = async (title, content, instantPush, startDate, endDate, audience) => {
    let annTitle = '';
    let annContent = '';
    let push = true;
    let targetAudience = audience || 'all'; // 'all', 'farmers', 'staff', 'scheduling'
    let sDate = startDate || new Date().toISOString().split('T')[0];
    let eDate = endDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
    let author = currentUser?.name || 'Rosa Mendoza (Super Admin)';

    // Support object argument: publishAnnouncement({ title: '...', content: '...', targetAudience: '...' })
    if (typeof title === 'object' && title !== null) {
      annTitle = title.title || title.announcementTitle || title.name || '';
      annContent = title.content || title.announcementText || title.text || '';
      push = title.instantPush ?? title.pushToggle ?? true;
      targetAudience = title.targetAudience || title.target || title.audience || targetAudience;
      sDate = title.startDate || title.sDate || title.date || sDate;
      eDate = title.endDate || title.eDate || eDate;
      if (title.author) author = title.author;
    } else if (typeof title === 'string') {
      annTitle = title;
      annContent = content || '';
      push = instantPush ?? true;
    }

    // Smart fallback if only title or only content was typed
    if (!annTitle.trim() && annContent.trim()) {
      annTitle = targetAudience === 'farmers' ? 'Farmer Field Activity Directive' : targetAudience === 'scheduling' ? 'Cooperative Operations Schedule' : 'Cooperative Operational Directive';
    } else if (annTitle.trim() && !annContent.trim()) {
      annContent = annTitle.trim();
      annTitle = targetAudience === 'farmers' ? 'Farmer Field Activity Notice' : targetAudience === 'scheduling' ? 'Field Scheduling Notice' : 'Cooperative Broadcast Directive';
    }

    const cleanTitle = String(annTitle || 'Cooperative Broadcast Directive').trim();
    const cleanText = String(annContent || 'New operational notice broadcasted to cooperative members.').trim();

    const audienceLabel = 
      targetAudience === 'farmers' ? 'Farmers Only (Mobile)' :
      targetAudience === 'staff' ? 'Farm Staff Operations' :
      targetAudience === 'scheduling' ? 'Scheduling & Protocol' : 'All Cooperative Members';

    const newAnn = { 
      id: `ANN-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, 
      title: cleanTitle, 
      content: cleanText, 
      date: sDate, 
      startDate: sDate, 
      endDate: eDate, 
      archived: false, 
      author: author, 
      targetAudience, 
      audienceLabel, 
      instantPush: push !== false, 
      pushId: Date.now() + Math.random(), 
      _autoOpenModal: true 
    };

    setAnnouncements(prev => { 
      const next = [newAnn, ...prev.filter(a => a.id !== newAnn.id)]; 
      try { localStorage.setItem('marikha_announcements_list', JSON.stringify(next)); } catch (e) {} 
      return next; 
    });

    setActivePushNotice(newAnn);

    if (broadcastChannel) { 
      try { 
        broadcastChannel.postMessage({ type: 'ANNOUNCEMENT_PUSH', payload: newAnn }); 
      } catch (e) {} 
    }

    try { 
      localStorage.setItem('marikha_live_push', JSON.stringify({ ...newAnn, _t: Date.now() })); 
    } catch (e) {}

    // Live Supabase Cloud Sync
    try { 
      const formattedTitle = `[Target: ${audienceLabel}] ${cleanTitle}`; 
      const { data, error } = await supabase.from('announcements').insert([{ 
        title: formattedTitle, 
        content: cleanText, 
        author: author, 
        instant_push: push !== false 
      }]).select(); 

      if (error) { 
        console.warn('Supabase announcement insert notice:', error.message); 
      } else { 
        console.log('✓ Announcement Synced Live to Supabase:', data); 
      } 
    } catch (e) { 
      console.log('Supabase sync error:', e); 
    }

    return newAnn; 
  };

  const toggleArchiveAnnouncement = async (annId) => {
 let targetAnn = null;
 setAnnouncements(prev => {
 const next = prev.map(a => {
 if (String(a.id) === String(annId)) {
 targetAnn = { ...a, archived: !a.archived };
 return targetAnn;
 }
 return a;
 });
 try { localStorage.setItem('marikha_announcements_list', JSON.stringify(next)); } catch (e) {}
 return next;
 });

 if (broadcastChannel && targetAnn) {
 try {
 broadcastChannel.postMessage({ type: 'ANNOUNCEMENT_ARCHIVE_PUSH', payload: targetAnn });
 } catch (e) {}
 }

 if (targetAnn) {
 try {
 await supabase.from('announcements').update({ is_archived: targetAnn.archived }).eq('id', annId);
 } catch (e) {
 console.log('Supabase archive update error:', e);
 }
 }
 };

 const deleteAnnouncement = async (annId) => {
 setAnnouncements(prev => {
 const next = prev.filter(a => a.id !== annId);
 try { localStorage.setItem('marikha_announcements_list', JSON.stringify(next)); } catch (e) {}
 return next;
 });

 if (broadcastChannel) {
 broadcastChannel.postMessage({ type: 'ANNOUNCEMENT_DELETED_PUSH', payload: annId });
 }

 try {
 const { error } = await supabase.from('announcements').delete().eq('id', annId);
 if (error) console.error('Supabase Delete Error:', error);
 } catch (e) {
 console.log('Supabase delete error:', e);
 }
 };

 const dismissPushNotice = () => {
 setActivePushNotice(null);
 };

 const dismissPushValidation = () => {
 setActivePushValidation(null);
 };

 const handleValidationAction = async (id, action, notes) => {
    const isApproval = action === 'Validated' || action === 'approve' || action === 'Approved';
    const targetStatus = isApproval ? 'Validated' : 'Rejected';
    setValidations(prev => {
      const next = prev.map(v => String(v.id) === String(id) ? { ...v, status: targetStatus, staffNote: notes || v.staffNote || '', validatedAt: new Date().toISOString() } : v);
      try { localStorage.setItem('marikha_validations_list', JSON.stringify(next)); } catch (e) {}
      return next;
    });

 if (broadcastChannel) {
 broadcastChannel.postMessage({ type: 'VALIDATION_UPDATED_PUSH', payload: { id, status: targetStatus } });
 }

 try {
 await supabase.from('task_validations').update({ status: targetStatus }).eq('id', id);
 } catch (e) {
 console.log('Supabase validation update error:', e);
 }
 };

 const addFarmerSubmission = async (newSub) => {
 const farmerName = currentUser?.name || newSub.farmer || 'Rei Lopez';
 const newId = `VAL-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
 const actText = `${newSub.activity} (${newSub.amount || 10} Liters)`;
 const gpsVal = newSub.gps || newSub.location || '14.5860° N, 121.1760° E';
 const rawPhoto = newSub.photoUrl || newSub.photo_url;
 const validPhoto = (typeof rawPhoto === 'string' && rawPhoto.trim().length > 10 && !rawPhoto.includes('photo-1592417817098-8f3d6eb12735'))
 ? rawPhoto
 : 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80';

 const newEntry = {
 id: newId,
 farmer: farmerName,
 plot: newSub.plot || 'Plot P-007',
 taskType: actText,
 activity: actText,
 timestamp: 'Just now',
 urgency: 'Normal',
 urgencyCls: 'pill-low',
 location: gpsVal,
 gps: gpsVal,
 farmerNote: newSub.note || 'Submitted via Farmers Mobile App',
 notes: newSub.note || 'Submitted via Farmers Mobile App',
 photoUrl: validPhoto,
 photo_url: validPhoto,
 photoAttached: true,
 status: 'Pending'
 };
 
 setValidations(prev => {
 const next = [newEntry, ...prev];
 try { localStorage.setItem('marikha_validations_list', JSON.stringify(next)); } catch (e) {}
 return next;
 });

 setActivePushValidation(newEntry);

 if (broadcastChannel) {
 broadcastChannel.postMessage({ type: 'FARMER_SUBMISSION_PUSH', payload: newEntry });
 }

 try {
 localStorage.setItem('marikha_live_validation', JSON.stringify({ ...newEntry, _t: Date.now() }));
 } catch (e) {}

 try {
 await supabase.from('task_validations').insert([{ 
 farmer: farmerName, 
 plot: newEntry.plot, 
 activity: newEntry.activity, 
 notes: newEntry.notes, 
 gps: newEntry.gps,
 photo_url: newEntry.photoUrl,
 status: 'Pending'
 }]);
 } catch (e) {
 console.log('Supabase sync error:', e);
 }
 };

 const addCrop = async (newCrop) => {
		const planned = Number(newCrop.plannedPlantingCount) || 500;
		const actual = Number(newCrop.actualPlantedCount) || planned;
		const cropObj = {
			id: String(Date.now()),
			farmer: newCrop.farmer || 'Renier Lopez',
			farmerId: newCrop.farmerId || '4',
			cropType: newCrop.cropType || 'Tomato',
			variety: newCrop.variety || ((newCrop.cropType || 'Tomato') + ' (Standard)'),
			plot: newCrop.plot ? (String(newCrop.plot).startsWith('Plot') ? newCrop.plot : ('Plot ' + newCrop.plot)) : ('Plot P-' + Math.floor(100 + Math.random() * 900)),
			plantingDate: newCrop.plantingDate || new Date().toISOString().split('T')[0],
			cultivatedArea: Number(newCrop.cultivatedArea) || 500,
			areaUnit: newCrop.areaUnit || 'sq.m',
			plannedPlantingCount: planned,
			actualPlantedCount: actual,
			growthStage: newCrop.growthStage || 'Germination',
			confirmedGrowthStage: newCrop.confirmedGrowthStage || newCrop.growthStage || 'Germination',
			cropStatus: newCrop.cropStatus || 'Active',
			fertilizer: newCrop.fertilizer || 'Organic Compost - 10kg',
			irrigation: newCrop.irrigation || 'Drip System',
			predictedYield: Number(newCrop.predictedYield) || 0,
			actualYield: Number(newCrop.actualYield) || 0,
			yield: newCrop.yield || '—'
		};
		setCrops(prev => {
			const next = [cropObj, ...prev];
			try { localStorage.setItem('marikha_crops_list', JSON.stringify(next)); } catch (e) {}
			return next;
		});
		if (broadcastChannel) {
			broadcastChannel.postMessage({ type: 'CROP_ADDED', payload: cropObj });
		}

		try {
			await supabase.from('crops').insert([{
				variety: cropObj.variety,
				plot: cropObj.plot,
				growth_stage: cropObj.growthStage,
				fertilizer: cropObj.fertilizer,
				irrigation: cropObj.irrigation,
				yield: cropObj.yield,
				farmer_name: cropObj.farmer,
				planting_date: cropObj.plantingDate,
				cultivated_area: cropObj.cultivatedArea,
				planned_count: cropObj.plannedPlantingCount,
				actual_count: cropObj.actualPlantedCount
			}]);
		} catch (e) {
			console.log('Supabase crop insert error:', e);
		}
	};

 const updateCrop = async (cropId, updatedFields) => {
 setCrops(prev => {
 const next = prev.map(c => String(c.id) === String(cropId) ? { ...c, ...updatedFields } : c);
 try { localStorage.setItem('marikha_crops_list', JSON.stringify(next)); } catch (e) {}
 return next;
 });

 if (broadcastChannel) {
 broadcastChannel.postMessage({ type: 'CROP_UPDATED_PUSH', payload: { id: cropId, ...updatedFields } });
 }

 try {
 const payload = {
 variety: updatedFields.variety,
 plot: updatedFields.plot,
 growth_stage: updatedFields.growthStage,
 fertilizer: updatedFields.fertilizer,
 irrigation: updatedFields.irrigation,
 yield: updatedFields.yield
 };
 await supabase.from('crops').update(payload).eq('id', cropId);
 } catch (e) {
 console.log('Supabase crop update error:', e);
 }
 };

 const deleteCrop = async (cropId) => {
 setCrops(prev => {
 const next = prev.filter(c => String(c.id) !== String(cropId));
 try { localStorage.setItem('marikha_crops_list', JSON.stringify(next)); } catch (e) {}
 return next;
 });

 if (broadcastChannel) {
 broadcastChannel.postMessage({ type: 'CROP_DELETED_PUSH', payload: { id: cropId } });
 }

 try {
 await supabase.from('crops').delete().eq('id', cropId);
 } catch (e) {
 console.log('Supabase crop delete error:', e);
 }
 };


 const addLivestock = async (newItem) => {
 const itemObj = {
 id: String(Date.now()),
 groupCode: newItem.groupCode || `GL-${Math.floor(100 + Math.random() * 900)}`,
 group: newItem.group || newItem.animalType || 'Livestock Herd',
 animalType: newItem.animalType || newItem.group || 'Native Livestock',
 plot: newItem.plot || `P-${Math.floor(100 + Math.random() * 900)}`,
 headCount: Number(newItem.headCount) || 12,
 vaccination: newItem.vaccination || 'Deworming + Vit B (Completed)',
 forage: newItem.forage || 'Organic Napier Grass',
 healthStatus: newItem.healthStatus || 'Excellent',
 dailyGain: newItem.dailyGain || '+1.5 kg/wk',
 status: newItem.status || 'Compliant'
 };
 setLivestock(prev => {
 const next = [itemObj, ...prev];
 try { localStorage.setItem('marikha_livestock_list', JSON.stringify(next)); } catch (e) {}
 return next;
 });
 if (broadcastChannel) {
 broadcastChannel.postMessage({ type: 'LIVESTOCK_ADDED', payload: itemObj });
 }

 try {
 await supabase.from('livestock').insert([{
 group_name: itemObj.group,
 plot: itemObj.plot,
 head_count: itemObj.headCount,
 vaccination: itemObj.vaccination,
 health_status: itemObj.healthStatus,
 daily_gain: itemObj.dailyGain
 }]);
 } catch (e) {
 console.log('Supabase livestock insert error:', e);
 }
 };

 const updateLivestock = async (id, updatedFields) => {
 setLivestock(prev => {
 const next = prev.map(l => String(l.id) === String(id) ? { ...l, ...updatedFields } : l);
 try { localStorage.setItem('marikha_livestock_list', JSON.stringify(next)); } catch (e) {}
 return next;
 });

 if (broadcastChannel) {
 broadcastChannel.postMessage({ type: 'LIVESTOCK_UPDATED_PUSH', payload: { id, ...updatedFields } });
 }

 try {
 const payload = {
 group_name: updatedFields.group || updatedFields.animalType,
 plot: updatedFields.plot,
 head_count: updatedFields.headCount,
 vaccination: updatedFields.vaccination,
 health_status: updatedFields.healthStatus,
 daily_gain: updatedFields.dailyGain
 };
 await supabase.from('livestock').update(payload).eq('id', id);
 } catch (e) {
 console.log('Supabase livestock update error:', e);
 }
 };

 const deleteLivestock = async (id) => {
 setLivestock(prev => {
 const next = prev.filter(l => String(l.id) !== String(id));
 try { localStorage.setItem('marikha_livestock_list', JSON.stringify(next)); } catch (e) {}
 return next;
 });

 if (broadcastChannel) {
 broadcastChannel.postMessage({ type: 'LIVESTOCK_DELETED_PUSH', payload: { id } });
 }

 try {
 await supabase.from('livestock').delete().eq('id', id);
 } catch (e) {
 console.log('Supabase livestock delete error:', e);
 }
 };

 const addSchedule = async (newSched) => {
 const newId = `SCHED-${Date.now()}`;
 const schedEntry = {
 id: newId,
 title: newSched.title,
 category: newSched.category || 'planting',
 plot: newSched.plot || 'Plot P-021',
 date: newSched.date || '2026-09-20',
 time: newSched.time || '08:00 AM',
 protocol: newSched.protocol || 'Standard Organic Protocol',
 assignedTo: newSched.assignedTo || 'Renier Lopez (Farmer)',
 priority: newSched.priority || 'HIGH',
 status: 'Upcoming',
 countdown: 'Upcoming'
 };

 setSchedules(prev => {
 const next = [schedEntry, ...prev];
 try { localStorage.setItem('marikha_schedules_list', JSON.stringify(next)); } catch (e) {}
 return next;
 });

 if (broadcastChannel) {
 broadcastChannel.postMessage({ type: 'SCHEDULE_ADDED_PUSH', payload: schedEntry });
 }

 try {
 localStorage.setItem('marikha_live_schedule', JSON.stringify({ ...schedEntry, _t: Date.now() }));
 } catch (e) {}

 try {
 const { data, error } = await supabase.from('schedules').insert([{
 title: schedEntry.title,
 category: schedEntry.category,
 plot: schedEntry.plot,
 date: schedEntry.date,
 time: schedEntry.time,
 protocol: schedEntry.protocol,
 assigned_to: schedEntry.assignedTo,
 priority: schedEntry.priority,
 status: schedEntry.status
 }]).select();

 if (error) {
 console.error('Supabase Schedule Insert Error:', error);
 } else {
 console.log('Supabase Schedule Inserted Live:', data);
 }
 } catch (e) {
 console.log('Supabase schedule insert error:', e);
 }
 };

 const updateScheduleStatus = async (schedId, newStatus) => {
 setSchedules(prev => {
 const next = prev.map(s => String(s.id) === String(schedId) ? { ...s, status: newStatus } : s);
 try { localStorage.setItem('marikha_schedules_list', JSON.stringify(next)); } catch (e) {}
 return next;
 });

 if (broadcastChannel) {
 broadcastChannel.postMessage({ type: 'SCHEDULE_UPDATED_PUSH', payload: { id: schedId, status: newStatus } });
 }

 try {
 await supabase.from('schedules').update({ status: newStatus }).eq('id', schedId);
 } catch (e) {
 console.log('Supabase schedule update error:', e);
 }
 };

 const deleteSchedule = async (schedId) => {
 setSchedules(prev => {
 const next = prev.filter(s => String(s.id) !== String(schedId));
 try { localStorage.setItem('marikha_schedules_list', JSON.stringify(next)); } catch (e) {}
 return next;
 });

 if (broadcastChannel) {
 broadcastChannel.postMessage({ type: 'SCHEDULE_DELETED_PUSH', payload: { id: schedId } });
 }

 try {
 await supabase.from('schedules').delete().eq('id', schedId);
 } catch (e) {
 console.log('Supabase schedule delete error:', e);
 }
 };

 const updateProfile = async (updatedFields) => {
 if (!currentUser) return;
 const newInitials = updatedFields.name
 ? updatedFields.name.trim().split(/\s+/).map(n => n[0]).join('').substring(0, 2).toUpperCase()
 : (currentUser.initials || 'U');

 const updatedUser = {
 ...currentUser,
 ...updatedFields,
 initials: newInitials
 };

 setCurrentUser(updatedUser);
 try {
 localStorage.setItem('marikha_current_user', JSON.stringify(updatedUser));
 } catch (e) {}

 setUsers(prev => {
 const next = prev.map(u => (String(u.id) === String(currentUser.id) || u.email === currentUser.email) ? { ...u, ...updatedUser } : u);
 try { localStorage.setItem('marikha_registered_users', JSON.stringify(next)); } catch (e) {}
 return next;
 });

 if (broadcastChannel) {
 broadcastChannel.postMessage({ type: 'PROFILE_UPDATED_PUSH', payload: updatedUser });
 }

 try {
 const payload = {
 name: updatedUser.name,
 role: updatedUser.role,
 email: updatedUser.email,
 phone: updatedUser.phone || '+63 917 555 0100',
 password: updatedUser.password || 'password123'
 };
 await supabase.from('users').upsert(payload, { onConflict: 'email' });
 } catch (e) {
 console.log('Supabase profile update error:', e);
 }
 return updatedUser;
 };

 const togglePermission = (role, capability) => {
 setPermissionsMatrix(prev => {
 const next = {
 ...prev,
 [role]: {
 ...prev[role],
 [capability]: !prev[role]?.[capability]
 }
 };
 try { localStorage.setItem('marikha_permissions_matrix', JSON.stringify(next)); } catch (e) {}
 if (broadcastChannel) {
 broadcastChannel.postMessage({ type: 'PERMISSIONS_UPDATED_PUSH', payload: next });
 }
 return next;
 });
 };

 // Manual One-Click Supabase Seed & Sync Repair
 const syncSeedToSupabase = async () => {
 try {
 // 1. Sync Member Records & User Accounts
 for (const u of users) {
 try {
 await supabase.from('users').upsert({
 name: u.name,
 role: u.role,
 email: u.email,
 phone: u.phone || '+63 917 555 0100',
 assigned_plot: u.assignedPlot || 'Plot P-007 (Tomato Diamante)',
 rsbsa_no: u.rsbsaNo || 'RSBSA-03-1425-001',
 certification: u.certification || 'PGS Certified Organic Farmer',
 emergency_contact: u.emergencyContact || 'Maria Lopez (+63 918 777 8888)',
 join_date: u.joinDate || '2024-03-15',
 password: u.password || 'password123',
 status: u.status !== false
 }, { onConflict: 'email' });
 } catch (err) {
 // Fallback basic upsert
 await supabase.from('users').upsert({
 name: u.name,
 role: u.role,
 email: u.email,
 phone: u.phone || '+63 917 555 0100',
 status: u.status !== false
 }, { onConflict: 'email' });
 }
 }

 // 2. Sync Announcements
 for (const a of announcements) {
 await supabase.from('announcements').insert({
 title: a.title || 'Cooperative Broadcast Notice',
 content: a.content,
 author: a.author || 'Liza Cruz (Admin)',
 instant_push: true
 });
 }

 // 3. Sync Validations
 for (const v of validations) {
 await supabase.from('task_validations').insert({
 farmer: v.farmer,
 plot: v.plot,
 activity: v.taskType || 'Farm Task',
 notes: v.farmerNote || 'Submitted via App',
 gps: v.location || 'Antipolo Field Plot',
 photo_url: v.photoUrl || '',
 status: v.status || 'Pending'
 });
 }

 // 4. Sync Crops
 for (const c of crops) {
 await supabase.from('crops').insert({
 variety: c.variety,
 plot: c.plot,
 growth_stage: c.growthStage,
 fertilizer: c.fertilizer,
 irrigation: c.irrigation,
 yield: c.yield
 });
 }

 // 5. Sync Livestock
 for (const l of livestock) {
 await supabase.from('livestock').insert({
 group_name: l.group,
 plot: l.plot,
 head_count: l.headCount,
 vaccination: l.vaccination,
 health_status: l.healthStatus,
 daily_gain: l.dailyGain
 });
 }

 // 6. Sync Schedules
 for (const s of schedules) {
 await supabase.from('schedules').insert({
 title: s.title,
 category: s.category,
 plot: s.plot,
 date: s.date,
 time: s.time,
 protocol: s.protocol,
 assigned_to: s.assignedTo,
 priority: s.priority,
 status: s.status
 });
 }

 alert(' Successfully synced all User accounts, Announcements, Validations, Crops, Livestock, and Schedules live into Supabase Cloud Database!');
 } catch (e) {
 console.log('Supabase sync seed error:', e);
 alert(' Sync completed with notice: Make sure RLS is disabled in Supabase SQL Editor!');
 }
 };

 return (
 <AuthContext.Provider value={{
 currentUser,
 currentRole,
 selectedSeason,
 setSelectedSeason,
 tenantInfo,
 users,
 crops,
 livestock,
 schedules,
 setSchedules,
 addSchedule,
 updateScheduleStatus,
 deleteSchedule,
 announcements,
 validations,
 mlClassifications,
 permissionsMatrix,
    rbacCategories,
    updateRbacCapability,
    resetRbacToDefault,
 activePushNotice,
 activePushValidation,
 loginAsRole,
 toggleUserStatus,
 addUser,
 updateUser,
 deleteUser,
 publishAnnouncement,
 deleteAnnouncement,
 toggleArchiveAnnouncement,
 dismissPushNotice,
 dismissPushValidation,
 handleValidationAction,
 addFarmerSubmission,
 addCrop,
 updateCrop,
 deleteCrop,
 addLivestock,
 updateLivestock,
 deleteLivestock,

 togglePermission,
 setCurrentRole,
 syncSeedToSupabase
 }}>
 {children}
 </AuthContext.Provider>
 );
};

export const useAuth = () => useContext(AuthContext);
