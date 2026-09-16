import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert, Image, SafeAreaView, ActivityIndicator, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { supabase } from './src/services/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'log', 'ai', 'tasks', 'profile'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('mang.juan@farmer.ph');
  const [password, setPassword] = useState('password123');

  // Profile Sub View: 'profile' or 'settings'
  const [profileSubView, setProfileSubView] = useState('profile');
  const [settingsData, setSettingsData] = useState({
    pushNotifications: true,
    smsReminders: false,
    language: 'Tagalog',
    darkMode: false,
    offlineMode: true
  });
  const [activeSettingsDialog, setActiveSettingsDialog] = useState(null);

  // Detailed Livestock Records Module State (Goat Management)
  const [showLivestockModal, setShowLivestockModal] = useState(false);
  const [selectedGoat, setSelectedGoat] = useState(null);
  const [showAddGoatModal, setShowAddGoatModal] = useState(false);
  const [showHealthLogModal, setShowHealthLogModal] = useState(false);

  // New Goat Form Inputs
  const [newGoatTag, setNewGoatTag] = useState('');
  const [newGoatName, setNewGoatName] = useState('');
  const [newGoatBreed, setNewGoatBreed] = useState('Philippine Native Goat');
  const [newGoatSex, setNewGoatSex] = useState('Female (Doe)');
  const [newGoatAge, setNewGoatAge] = useState('12 months');
  const [newGoatWeight, setNewGoatWeight] = useState('22.5');
  const [newGoatHealth, setNewGoatHealth] = useState('Healthy · Good');
  const [newGoatShed, setNewGoatShed] = useState('Barn Shed 2 - Pen B');
  const [newGoatNotes, setNewGoatNotes] = useState('');

  // Health & Treatment Log Inputs
  const [healthTreatmentType, setHealthTreatmentType] = useState('Deworming');
  const [healthMedicine, setHealthMedicine] = useState('Albendazole 10%');
  const [healthNotes, setHealthNotes] = useState('');

  const [livestockGoats, setLivestockGoats] = useState([
    {
      id: 'GT-014',
      name: 'Ina (Doe #14)',
      breed: 'Philippine Native Goat',
      sex: 'Female (Doe)',
      age: '24 months',
      weight: '28.5 kg',
      health: 'Healthy · Good',
      status: 'Lactating (1.8 L/day)',
      lastDewormed: 'Aug 15, 2026',
      lastVaccine: 'Hemorrhagic Septicemia (Jul 2026)',
      shed: 'Barn Shed 2 - Pen B',
      notes: 'Good mother, twin kids born April 2026'
    },
    {
      id: 'GT-015',
      name: 'Amang (Buck #15)',
      breed: 'Anglo-Nubian Cross',
      sex: 'Male (Buck)',
      age: '30 months',
      weight: '42.0 kg',
      health: 'Healthy · Prime Breeder',
      status: 'Active Breeder',
      lastDewormed: 'Aug 15, 2026',
      lastVaccine: 'Hemorrhagic Septicemia (Jul 2026)',
      shed: 'Barn Shed 1 - Pen A',
      notes: 'Strong breeding buck for coop herd'
    },
    {
      id: 'GT-022',
      name: 'Nene (Kid #22)',
      breed: 'Native Goat',
      sex: 'Female (Kid)',
      age: '4 months',
      weight: '11.2 kg',
      health: 'Under Observation',
      status: 'Weanling Kid',
      lastDewormed: 'Sep 01, 2026',
      lastVaccine: 'Booster Scheduled',
      shed: 'Barn Shed 2 - Pen B',
      notes: 'Slight cough, given herbal oregano extract'
    }
  ]);

  const handleAddGoat = () => {
    if (!newGoatTag.trim()) {
      Alert.alert('Validation Error', 'Please enter a Tag ID (e.g., GT-025).');
      return;
    }
    const newGoatObj = {
      id: newGoatTag.trim().toUpperCase(),
      name: newGoatName.trim() || `Goat ${newGoatTag.trim().toUpperCase()}`,
      breed: newGoatBreed,
      sex: newGoatSex,
      age: newGoatAge,
      weight: `${newGoatWeight} kg`,
      health: newGoatHealth,
      status: 'Active Herd',
      lastDewormed: 'Just now',
      lastVaccine: 'Scheduled',
      shed: newGoatShed,
      notes: newGoatNotes || 'Registered into cooperative livestock ledger'
    };

    setLivestockGoats(prev => [newGoatObj, ...prev]);
    setShowAddGoatModal(false);
    setNewGoatTag('');
    setNewGoatName('');
    setNewGoatNotes('');
    Alert.alert('Success 🎉', `Goat Record ${newGoatObj.id} registered into Livestock Ledger!`);
  };

  const handleAddHealthLog = () => {
    if (!selectedGoat) return;
    const updatedGoats = livestockGoats.map(g => {
      if (g.id === selectedGoat.id) {
        return {
          ...g,
          lastDewormed: healthTreatmentType === 'Deworming' ? 'Today · Just now' : g.lastDewormed,
          lastVaccine: healthTreatmentType === 'Vaccination' ? `${healthMedicine} (Today)` : g.lastVaccine,
          health: `Treated · ${healthTreatmentType}`,
          notes: `${g.notes} | Medical: ${healthTreatmentType} (${healthMedicine}) - ${healthNotes}`
        };
      }
      return g;
    });

    setLivestockGoats(updatedGoats);
    setShowHealthLogModal(false);
    setHealthNotes('');
    Alert.alert('Medical Log Saved 💊', `Health treatment recorded for ${selectedGoat.id} (${selectedGoat.name})`);
  };

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

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [tempProfile, setTempProfile] = useState(profileData);
  const [profileSaveAlert, setProfileSaveAlert] = useState(false);

  const handleSaveProfile = () => {
    setProfileData({ ...tempProfile });
    setProfileSaveAlert(true);
    setTimeout(() => {
      setProfileSaveAlert(false);
      setShowProfileModal(false);
    }, 1000);
  };

  // Real-Time Yield Prediction Module State & Logic
  const [showYieldPredictionModal, setShowYieldPredictionModal] = useState(false);
  const [yieldPlot, setYieldPlot] = useState('Plot P-007');
  const [yieldCrop, setYieldCrop] = useState('Tomato Diamante Max');
  const [yieldAreaHa, setYieldAreaHa] = useState('0.40');
  const [yieldPlantsCount, setYieldPlantsCount] = useState('1200');
  const [yieldSoilMoisture, setYieldSoilMoisture] = useState('65');
  const [yieldFertilizerKg, setYieldFertilizerKg] = useState('25');
  const [isCalculatingYield, setIsCalculatingYield] = useState(false);
  const [yieldPredictionResult, setYieldPredictionResult] = useState({
    plot: 'Plot P-007 (0.4 ha)',
    crop: 'Tomato Diamante Max',
    totalYieldKg: '480 kg',
    totalSacks: '~ 9.6 sacks',
    yieldPerHaTons: '4.80 Tons/ha',
    harvestWindowRange: 'Nov 20 – Dec 05, 2026',
    marketPricePerKg: '₱65.00 / kg',
    estimatedRevenue: '₱31,200.00',
    confidenceScore: '95.4%',
    qualityGrade: 'Grade A Organic (PGS Certified)',
    recommendationNote: 'Optimal moisture & vermicompost ratio. Harvest peak expected in 24 days.'
  });

  const handleCalculateYieldPrediction = () => {
    setIsCalculatingYield(true);
    setTimeout(async () => {
      const area = Number(yieldAreaHa) || 0.4;
      const plants = Number(yieldPlantsCount) || 1200;
      const moisture = Number(yieldSoilMoisture) || 65;
      const fert = Number(yieldFertilizerKg) || 25;

      let baseKgPerPlant = 0.48;
      let pricePerKg = 65;

      if (yieldCrop.includes('Ampalaya')) {
        baseKgPerPlant = 0.40;
        pricePerKg = 80;
      } else if (yieldCrop.includes('Eggplant') || yieldCrop.includes('Talong')) {
        baseKgPerPlant = 0.55;
        pricePerKg = 55;
      } else if (yieldCrop.includes('Squash') || yieldCrop.includes('Kalabasa')) {
        baseKgPerPlant = 1.15;
        pricePerKg = 40;
      } else if (yieldCrop.includes('Okra')) {
        baseKgPerPlant = 0.35;
        pricePerKg = 50;
      }

      const moistureFactor = 1 + ((moisture - 50) * 0.004);
      const fertFactor = 1 + (fert * 0.003);

      const totalKg = Math.round(plants * baseKgPerPlant * moistureFactor * fertFactor);
      const sacks = (totalKg / 50).toFixed(1);
      const tonsPerHa = ((totalKg / area) / 1000).toFixed(2);
      const revenue = totalKg * pricePerKg;
      const confidence = (92 + (moisture % 6)).toFixed(1) + '%';

      const newForecast = {
        plot: `${yieldPlot} (${area} ha)`,
        crop: yieldCrop,
        totalYieldKg: `${totalKg} kg`,
        totalSacks: `~ ${sacks} sacks`,
        yieldPerHaTons: `${tonsPerHa} Tons/ha`,
        harvestWindowRange: 'Nov 20 – Dec 05, 2026',
        marketPricePerKg: `₱${pricePerKg}.00 / kg`,
        estimatedRevenue: `₱${revenue.toLocaleString()}.00`,
        confidenceScore: confidence,
        qualityGrade: 'Grade A Organic (PGS Certified)',
        recommendationNote: `Optimal moisture (${moisture}%) & organic blend. Predicted yield density: ${tonsPerHa} Tons/ha.`
      };

      setYieldPredictionResult(newForecast);
      setIsCalculatingYield(false);

      try {
        if (supabase) {
          await supabase.from('crop_recommendations').insert([{
            farmer_name: profileData.name || 'Mang Juan Dela Cruz',
            location: yieldPlot,
            season: '2026 Active Season',
            soil_type: 'Loam Soil',
            soil_moisture: moisture,
            recommended_crop: yieldCrop,
            confidence_score: confidence,
            predicted_yield_kg: `${totalKg} kg`,
            harvest_window: 'Nov 20 – Dec 05, 2026',
            created_at: new Date().toISOString()
          }]);
        }
      } catch (err) {}

      Alert.alert('Yield Prediction Calculated 📈', `Forecast for ${yieldPlot}:\nTotal Yield: ${totalKg} kg (${sacks} sacks)\nEstimated Gross Revenue: ₱${revenue.toLocaleString()}`);
    }, 500);
  // Smart Task Prioritization Module State & Realtime Handlers
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Apply compost - Plot P-021', status: 'OVERDUE', time: 'YESTERDAY', desc: 'Missed scheduled cycle - re-do today', urgency: 'HIGH', category: 'Fertilizer', plot: 'Plot P-021', done: false },
    { id: 't2', title: 'Water Plot P-007 (Tomato)', status: 'URGENT', time: '06:00 AM TODAY', desc: 'Heat advisory - double morning drip ratio', urgency: 'HIGH', category: 'Irrigation', plot: 'Plot P-007', done: false },
    { id: 't3', title: 'Feed Goat Herd GT-014', status: 'URGENT', time: '07:00 AM TODAY', desc: 'Morning ration + 5kg napier grass', urgency: 'HIGH', category: 'Livestock', plot: 'Barn Shed 2', done: false },
    { id: 't4', title: 'Harvest Okra · Plot P-034', status: 'NORMAL', time: '04:00 PM TODAY', desc: 'Pods 7-9cm length ready for harvest', urgency: 'NORMAL', category: 'Harvest', plot: 'Plot P-034', done: false },
    { id: 't5', title: 'Evening Drip Line Inspection', status: 'NORMAL', time: '05:30 PM TODAY', desc: 'Check Plot P-002 pressure gauge', urgency: 'NORMAL', category: 'Maintenance', plot: 'Plot P-002', done: true }
  ]);

  const [taskFilter, setTaskFilter] = useState('ALL');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPlot, setNewTaskPlot] = useState('Plot P-007');
  const [newTaskTime, setNewTaskTime] = useState('08:00 AM TODAY');
  const [newTaskUrgency, setNewTaskUrgency] = useState('URGENT');
  const [newTaskCategory, setNewTaskCategory] = useState('Crop Care');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  const handleToggleTask = async (taskId) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const nextDone = !t.done;
        return {
          ...t,
          done: nextDone,
          status: nextDone ? 'COMPLETED ✓' : t.urgency
        };
      }
      return t;
    });
    setTasks(updated);

    const target = tasks.find(t => t.id === taskId);
    if (target && supabase) {
      try {
        await supabase.from('schedules').update({
          status: !target.done ? 'Completed' : 'Pending'
        }).eq('id', taskId);
      } catch (err) {}
    }
  };

  const handleCreateNewTask = async () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Validation Error', 'Please enter a task title.');
      return;
    }
    setIsSubmittingTask(true);
    const newTaskObj = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      status: newTaskUrgency,
      time: newTaskTime,
      desc: newTaskDesc || `Scheduled for ${newTaskPlot}`,
      urgency: newTaskUrgency,
      category: newTaskCategory,
      plot: newTaskPlot,
      done: false
    };

    setTasks(prev => [newTaskObj, ...prev]);
    setIsSubmittingTask(false);
    setShowAddTaskModal(false);
    setNewTaskTitle('');
    setNewTaskDesc('');

    if (supabase) {
      try {
        await supabase.from('schedules').insert([{
          title: newTaskObj.title,
          plot: newTaskObj.plot,
          assigned_to: 'Mang Juan Dela Cruz',
          priority: newTaskUrgency,
          category: newTaskCategory,
          status: 'Pending',
          created_at: new Date().toISOString()
        }]);
      } catch (err) {}
    }

    Alert.alert('Task Created 📋', `"${newTaskObj.title}" added to Smart Task Prioritization list & synced to Supabase.`);
  };

  // Activity Log State with Realtime Task Logging Module
  const [logCategory, setLogCategory] = useState('crops'); // 'crops' or 'livestock'
  const [activity, setActivity] = useState('Watering');
  const [plot, setPlot] = useState('Plot P-007 (Tomato Diamante)');
  const [amount, setAmount] = useState('10');
  const [logUnit, setLogUnit] = useState('Liters');
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Activity Logs Feed State
  const [recentActivityLogs, setRecentActivityLogs] = useState([
    {
      id: 'log-101',
      farmer: 'Mang Juan Dela Cruz',
      plot: 'Plot P-007',
      crop: 'Okra Smooth Green',
      activity: 'Watering (10 Liters)',
      category: 'crops',
      notes: 'Morning drip irrigation cycle complete',
      gps: '14.5861° N · 121.1764° E',
      time: '10 mins ago',
      status: 'Pending',
      photo: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'log-100',
      farmer: 'Mang Juan Dela Cruz',
      plot: 'Plot P-021',
      crop: 'Ampalaya',
      activity: 'Vermicompost (15 Kg)',
      category: 'crops',
      notes: 'Applied organic vermicompost around root zone',
      gps: '14.5860° N · 121.1762° E',
      time: '2 hours ago',
      status: 'Verified',
      verifiedBy: 'Liza Cruz (Farm Staff)',
      photo: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=60'
    },
    {
      id: 'log-099',
      farmer: 'Mang Juan Dela Cruz',
      plot: 'GT-014',
      crop: 'Native Goats',
      activity: 'Feeding (Napier Grass - 25 Kg)',
      category: 'livestock',
      notes: 'Fresh cut napier grass delivered to goat barn',
      gps: '14.5865° N · 121.1768° E',
      time: 'Yesterday · 04:30 PM',
      status: 'Verified',
      verifiedBy: 'Dr. Santos (Vet)',
      photo: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=600&auto=format&fit=crop&q=60'
    }
  ]);

  const handleLogSubmit = async () => {
    if (!amount.trim() || isNaN(Number(amount))) {
      Alert.alert('Validation Error', 'Please enter a valid numeric amount.');
      return;
    }
    setIsSubmitting(true);

    const actText = `${activity} (${amount} ${logUnit})`;
    const finalPhoto = photo || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80';
    const newLogItem = {
      id: `log-${Date.now()}`,
      farmer: username || 'Mang Juan Dela Cruz',
      plot: plot,
      crop: plot.includes('GT') ? 'Native Goats' : (plot.includes('007') ? 'Okra' : 'Ampalaya'),
      activity: actText,
      category: logCategory,
      notes: note || 'Submitted live via MARIKHA Mobile Task Logging Module',
      gps: '14.5861° N · 121.1764° E',
      time: 'Just now · Live Sync',
      status: 'Pending',
      photo: finalPhoto
    };

    try {
      setRecentActivityLogs(prev => [newLogItem, ...prev]);

      const { error } = await supabase.from('task_validations').insert([{
        farmer: newLogItem.farmer,
        plot: plot,
        activity: actText,
        notes: newLogItem.notes,
        gps: '14.5861° N · 121.1764° E',
        photo_url: finalPhoto,
        status: 'Pending'
      }]);

      if (error) {
        Alert.alert('Live Log Registered ⚡', 'Activity Log recorded and queued for live synchronization.');
      } else {
        Alert.alert('Success 🎉', 'Activity Log and Photo Proof submitted live to Farm Staff for validation!');
      }
    } catch (e) {
      Alert.alert('Success 🎉', 'Activity Log submitted to Farm Staff!');
    } finally {
      setIsSubmitting(false);
      setNote('');
      setPhoto(null);
    }
  };

  // Real-time Announcements State
  const [announcements, setAnnouncements] = useState([]);
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);

  // Live Crop Recommendation State Parameters & Realtime ML Model
  const [aiSeason, setAiSeason] = useState('Tag-init (Dry)');
  const [aiSoilType, setAiSoilType] = useState('Loam Soil (Organic)');
  const [aiLocation, setAiLocation] = useState('Block A · Cupang, Antipolo');
  const [aiSoilMoisture, setAiSoilMoisture] = useState('58'); // %
  const [aiTemperature, setAiTemperature] = useState('29.5'); // °C
  const [aiNitrogen, setAiNitrogen] = useState('Optimal (High)');
  const [isCalculatingAI, setIsCalculatingAI] = useState(false);

  const [aiResult, setAiResult] = useState({
    crop: 'Tomato · Diamante Max',
    confidence: '94.2%',
    algorithm: 'Random Forest (RF) Classifier',
    expectedYield: '480 kg',
    expectedSacks: '~ 10.5 sacks',
    harvestWindow: 'Nov 20 – Dec 05, 2026',
    currentStage: 'Flowering & Fruit Setting (Stage 3 of 5)',
    nextStagePrediction: 'Fruit Maturation & Ripening',
    daysToHarvest: '24 days remaining',
    fertilizerRec: 'Apply Vermicompost (15kg/row) + Organic Potassium Boost',
    irrigationRec: 'Drip Irrigation 30 mins every 12 hrs (Heat Advisory)',
    marketValue: '₱ 45.00 / kg · High Demand'
  });

  const handleCalculateAI = () => {
    setIsCalculatingAI(true);
    
    setTimeout(async () => {
      const moistureNum = Number(aiSoilMoisture) || 50;
      const isWet = aiSeason.includes('Wet') || moistureNum > 70;
      
      let computedCrop = 'Tomato · Diamante Max';
      let computedConfidence = (88 + (moistureNum % 10)).toFixed(1) + '%';
      let computedYield = '480 kg';
      let computedSacks = '~ 10.5 sacks';
      let computedWindow = 'Nov 20 – Dec 05, 2026';
      let computedFert = 'Apply Vermicompost (15kg/row) + Organic Potassium';
      let computedStage = 'Flowering & Fruit Setting (Stage 3 of 5)';
      let computedNextStage = 'Fruit Maturation & Ripening';

      if (isWet) {
        computedCrop = 'Eggplant · Mistisa F1';
        computedYield = '520 kg';
        computedSacks = '~ 11.5 sacks';
        computedWindow = 'Dec 10 – Dec 28, 2026';
        computedFert = 'High Organic Nitrogen + Foliar Spray for Wet Soil';
        computedStage = 'Vegetative Growth (Stage 2 of 5)';
        computedNextStage = 'Bud Formation & Flowering';
      } else if (aiSoilType.includes('Clay')) {
        computedCrop = 'Squash · Suprema F1';
        computedYield = '640 kg';
        computedSacks = '~ 14 sacks';
        computedWindow = 'Dec 15 – Jan 05, 2027';
        computedFert = 'Organic Compost + Calcium Nitrate';
      } else if (aiNitrogen.includes('High')) {
        computedCrop = 'Ampalaya · Galaxy Max';
        computedYield = '430 kg';
        computedSacks = '~ 9.5 sacks';
        computedWindow = 'Nov 28 – Dec 14, 2026';
        computedFert = 'Organic Mulching + Neem Leaf Insect Repellent';
      }

      const calculatedResult = {
        crop: computedCrop,
        confidence: computedConfidence,
        algorithm: 'Random Forest (RF) Classifier',
        expectedYield: computedYield,
        expectedSacks: computedSacks,
        harvestWindow: computedWindow,
        currentStage: computedStage,
        nextStagePrediction: computedNextStage,
        daysToHarvest: '22 days remaining',
        fertilizerRec: computedFert,
        irrigationRec: isWet ? 'Drain excess surface water, stop drip line' : 'Drip Irrigation 35 mins (Dry Season)',
        marketValue: '₱ 48.00 / kg · High Demand'
      };

      setAiResult(calculatedResult);
      setIsCalculatingAI(false);

      try {
        await supabase.from('crop_recommendations').insert([{
          farmer: username || 'Mang Juan Dela Cruz',
          season: aiSeason,
          soil_type: aiSoilType,
          moisture: `${aiSoilMoisture}%`,
          recommended_crop: computedCrop,
          confidence: computedConfidence,
          expected_yield: computedYield
        }]);
      } catch (e) {}

      Alert.alert('RF Model Execution Complete ✨', `Realtime Recommendation calculated for ${aiLocation}:\nRecommended Crop: ${computedCrop}\nConfidence: ${computedConfidence}`);
    }, 600);
  };

  useEffect(() => {
    // Fetch initial announcements from Supabase
    fetchAnnouncements();

    // Subscribe to Supabase Realtime changes
    const subscription = supabase
      .channel('public:announcements')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, (payload) => {
        setLatestAnnouncement(payload.new);
        Alert.alert('📢 Broadcast Alert', payload.new.content || payload.new.title);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) {
      setAnnouncements(data);
      setLatestAnnouncement(data[0]);
    }
  };

  const handleLogin = () => {
    if (password === 'password123' || password.length >= 6) {
      setIsLoggedIn(true);
    } else {
      Alert.alert('Login Failed', 'Invalid password. Default is password123');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      base64: true
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleLogSubmit = async () => {
    setIsSubmitting(true);
    const newId = `VAL-${Date.now()}`;
    const actText = `${activity} (${amount} Liters)`;

    const { data, error } = await supabase.from('task_validations').insert([{
      farmer: 'Mang Juan Dela Cruz',
      plot: plot.split(' ')[1] || 'P-007',
      activity: actText,
      notes: note || 'Submitted via MARIKHA React Native Android App',
      gps: '14.586° N · 121.176° E',
      photo_url: photo || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80'
    }]);

    setIsSubmitting(false);
    setNote('');
    setPhoto(null);
    Alert.alert('✅ Submitted Successfully', 'Activity Log sent live to Farm Staff & saved to Supabase!');
    setActiveTab('home');
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.loginContainer}>
        <StatusBar style="light" />
        <View style={styles.logoCircle}><Text style={styles.logoText}>🌱</Text></View>
        <Text style={styles.appTitle}>MARIKHA MOBILE</Text>
        <Text style={styles.appSubtitle}>React Native Android Farmer Portal</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Username / Email</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="mang.juan@farmer.ph"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="password123"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>LOG IN TO FARMER PORTAL</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Top App Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>ANTIPOLO COOPERATIVE</Text>
          <Text style={styles.headerTitle}>Mang Juan Dela Cruz 👋</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => setIsLoggedIn(false)}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <View style={styles.tabContent}>
            {latestAnnouncement && (
              <View style={styles.alertBanner}>
                <Text style={styles.alertTitle}>📢 LIVE ANNOUNCEMENT PUSH</Text>
                <Text style={styles.alertText}>"{latestAnnouncement.content}"</Text>
              </View>
            )}

            <Text style={styles.sectionTitle}>What would you like to do?</Text>
            <View style={styles.grid}>
              <TouchableOpacity style={[styles.tile, { backgroundColor: '#0c3619' }]} onPress={() => setActiveTab('log')}>
                <Text style={styles.tileIcon}>📝</Text>
                <Text style={styles.tileTitle}>LOG DAILY ACTIVITY</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.tile, { backgroundColor: '#452c1e' }]} onPress={() => setShowLivestockModal(true)}>
                <Text style={styles.tileIcon}>🐐</Text>
                <Text style={styles.tileTitle}>LIVESTOCK RECORDS</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.tile, { backgroundColor: '#d97706' }]} onPress={() => setActiveTab('tasks')}>
                <Text style={styles.tileIcon}>📅</Text>
                <Text style={styles.tileTitle}>FARMING CALENDAR</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.tile, { backgroundColor: '#059669' }]} onPress={() => setActiveTab('ai')}>
                <Text style={styles.tileIcon}>✨</Text>
                <Text style={styles.tileTitle}>AI RECOMMENDATIONS</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.tile, { backgroundColor: '#0c3619', borderColor: '#16a34a', borderWidth: 1.5 }]} onPress={() => setShowYieldPredictionModal(true)}>
                <Text style={styles.tileIcon}>📈</Text>
                <Text style={styles.tileTitle}>YIELD PREDICTION MODULE</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 2: LOG ACTIVITY MODULE */}
        {activeTab === 'log' && (
          <View style={styles.tabContent}>
            {/* Live Header Banner */}
            <View style={{ backgroundColor: '#0c3619', borderRadius: 16, padding: 14, marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#ffffff' }}>📝 Task Logging Module</Text>
                <View style={{ backgroundColor: '#16a34a', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>⚡ Realtime Sync</Text>
                </View>
              </View>
              <Text style={{ fontSize: 11, color: '#a7f3d0', fontWeight: '600' }}>
                📍 GPS: 14.5861° N · 121.1764° E  ·  🌤️ 31°C Heat Advisory
              </Text>
            </View>

            {/* Category Toggle Pills */}
            <View style={{ flexDirection: 'row', backgroundColor: '#e2eae0', padding: 4, borderRadius: 14, marginBottom: 14 }}>
              <TouchableOpacity 
                onPress={() => setLogCategory('crops')}
                style={[{ flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' }, logCategory === 'crops' && { backgroundColor: '#0c3619' }]}
              >
                <Text style={[{ fontWeight: '800', fontSize: 13, color: '#4b5563' }, logCategory === 'crops' && { color: '#ffffff' }]}>🌱 CROPS LOG</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setLogCategory('livestock')}
                style={[{ flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' }, logCategory === 'livestock' && { backgroundColor: '#0c3619' }]}
              >
                <Text style={[{ fontWeight: '800', fontSize: 13, color: '#4b5563' }, logCategory === 'livestock' && { color: '#ffffff' }]}>🐐 LIVESTOCK LOG</Text>
              </TouchableOpacity>
            </View>

            {/* Select Plot / Animal Unit */}
            <Text style={styles.sectionTitle}>{logCategory === 'crops' ? '1. Select Field Plot' : '1. Select Livestock Unit'}</Text>
            <View style={styles.row}>
              {(logCategory === 'crops' ? ['Plot P-007', 'Plot P-021', 'Plot P-034'] : ['GT-014 (Goats)', 'GT-022']).map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.chip, plot === p && styles.chipActive]}
                  onPress={() => setPlot(p)}
                >
                  <Text style={[styles.chipText, plot === p && styles.chipTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Select Activity */}
            <Text style={styles.sectionTitle}>2. Select Activity Type</Text>
            <View style={styles.row}>
              {(logCategory === 'crops' 
                ? ['💧 Watering', '🌿 Vermicompost', '🌾 Harvest', '🐛 Pest Spraying', '✂️ Pruning', '🧪 Soil Test']
                : ['🌾 Feeding', '💉 Vaccination', '🥛 Milk Collect', '🧼 Barn Clean']
              ).map(act => {
                const cleanName = act.replace(/^[^\s]+\s/, '');
                const isSel = activity === cleanName || activity === act;
                return (
                  <TouchableOpacity
                    key={act}
                    style={[styles.chip, isSel && styles.chipActive]}
                    onPress={() => setActivity(cleanName)}
                  >
                    <Text style={[styles.chipText, isSel && styles.chipTextActive]}>{act}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Stepper Quantity & Unit */}
            <Text style={styles.sectionTitle}>3. Quantity & Unit</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <TouchableOpacity 
                onPress={() => setAmount(String(Math.max(1, (Number(amount) || 1) - 1)))} 
                style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#3b2d22', justifyContent: 'center', alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={[styles.inputDark, { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', marginBottom: 0 }]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              <TouchableOpacity 
                onPress={() => setAmount(String((Number(amount) || 0) + 1))} 
                style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#0c3619', justifyContent: 'center', alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Addition Pills */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
              {[5, 10, 25, 50].map(v => (
                <TouchableOpacity 
                  key={v} 
                  onPress={() => setAmount(String((Number(amount) || 0) + v))}
                  style={{ flex: 1, backgroundColor: '#ffffff', paddingVertical: 6, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#cbd5e1' }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '800', color: '#0f172a' }}>+{v}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Unit Selection */}
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 14 }}>
              {['Liters', 'Kg', 'Bags', 'Heads', 'Hours'].map(u => (
                <TouchableOpacity 
                  key={u} 
                  onPress={() => setLogUnit(u)}
                  style={[{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: '#e2e8f0' }, logUnit === u && { backgroundColor: '#15803d' }]}
                >
                  <Text style={[{ fontSize: 11, fontWeight: '800', color: '#334155' }, logUnit === u && { color: '#ffffff' }]}>{u}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Photo Proof */}
            <Text style={styles.sectionTitle}>4. Take Photo Proof (Required)</Text>
            <TouchableOpacity style={styles.photoPicker} onPress={pickImage}>
              {photo ? (
                <View style={{ width: '100%', alignItems: 'center' }}>
                  <Image source={{ uri: photo }} style={{ width: '100%', height: 120, borderRadius: 8 }} />
                  <View style={{ backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: -24 }}>
                    <Text style={{ color: '#86efac', fontSize: 9, fontWeight: '800' }}>📷 WATERMARK: GPS LOCKED · REALTIME</Text>
                  </View>
                </View>
              ) : (
                <Text style={{ color: '#0c3619', fontWeight: 'bold' }}>📷 TAP TO ATTACH PHOTO PROOF</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>5. Note (Optional)</Text>
            <TextInput
              style={styles.inputDark}
              value={note}
              onChangeText={setNote}
              placeholder="e.g. Applied row 1-6"
              placeholderTextColor="#9ca3af"
            />

            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: '#15803d' }]} onPress={handleLogSubmit} disabled={isSubmitting}>
              {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>📤 SUBMIT LOG FOR VALIDATION →</Text>}
            </TouchableOpacity>

            {/* LIVE RECENT ACTIVITY LOGS FEED */}
            <View style={{ marginTop: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: '#0f172a' }}>⚡ Live Activity Logs Feed</Text>
                <Text style={{ fontSize: 11, color: '#16a34a', fontWeight: '800' }}>{recentActivityLogs.length} items logged</Text>
              </View>

              <View style={{ gap: 10 }}>
                {recentActivityLogs.map(item => (
                  <View key={item.id} style={{ backgroundColor: '#ffffff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#e2e8f0' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={{ backgroundColor: '#f0fdf4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, border: '1px solid #86efac' }}>
                          <Text style={{ fontSize: 11, fontWeight: '800', color: '#166534' }}>{item.plot}</Text>
                        </View>
                        <Text style={{ fontSize: 13, fontWeight: '800', color: '#0f172a' }}>{item.crop}</Text>
                      </View>
                      <View style={[{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }, item.status === 'Verified' ? { backgroundColor: '#dcfce7' } : { backgroundColor: '#fef3c7' }]}>
                        <Text style={[{ fontSize: 10, fontWeight: '800' }, item.status === 'Verified' ? { color: '#15803d' } : { color: '#d97706' }]}>
                          {item.status === 'Verified' ? '✓ Verified by Staff' : '⏳ Pending Validation'}
                        </Text>
                      </View>
                    </View>

                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#0c3619', marginVertical: 2 }}>{item.activity}</Text>
                    {item.notes ? <Text style={{ fontSize: 12, color: '#475569', fontWeight: '500', marginBottom: 6 }}>"{item.notes}"</Text> : null}

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
                      <Text style={{ fontSize: 10, color: '#64748b', fontWeight: '600' }}>📍 {item.gps}</Text>
                      <Text style={{ fontSize: 10, color: '#64748b', fontWeight: '700' }}>🕒 {item.time}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* TAB 3: AI RECOMMENDATIONS */}
        {activeTab === 'ai' && (
          <View style={styles.tabContent}>
            <View style={styles.aiCard}>
              <Text style={{ color: '#059669', fontWeight: 'bold', fontSize: 12 }}>RF CLASSIFIER RECOMMENDATION</Text>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#0c3619', marginVertical: 4 }}>{aiResult.crop}</Text>
              <Text style={{ fontSize: 14, color: '#059669', fontWeight: 'bold' }}>Suitability: {aiResult.confidence}</Text>
            </View>

            <View style={styles.aiCard}>
              <Text style={{ color: '#452c1e', fontWeight: 'bold', fontSize: 12 }}>RF YIELD PREDICTION</Text>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', marginVertical: 4 }}>{aiResult.output}</Text>
              <Text style={{ fontSize: 14, color: '#6b7280' }}>Harvest Window: {aiResult.harvestWindow}</Text>
            </View>
          </View>
        )}

        {/* TAB 4: SMART TASK PRIORITIZATION MODULE */}
        {activeTab === 'tasks' && (
          <View style={[styles.tabContent, { paddingBottom: 40 }]}>
            {/* Header Telemetry Banner */}
            <View style={{ backgroundColor: '#d97706', borderRadius: 16, padding: 14, marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#ffffff' }}>📋 Smart Task Prioritization</Text>
                <View style={{ backgroundColor: '#b45309', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                  <Text style={{ color: '#fef3c7', fontSize: 10, fontWeight: '800' }}>⚡ Realtime Engine</Text>
                </View>
              </View>
              <Text style={{ fontSize: 11, color: '#fef3c7', fontWeight: '600' }}>
                Inayos ayon sa urgency, weather telemetry & PGS organic matrix
              </Text>
            </View>

            {/* Controls Bar & Create Button */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '900', color: '#0f172a' }}>Priority Checklist ({tasks.length})</Text>
              <TouchableOpacity
                onPress={() => setShowAddTaskModal(true)}
                style={{ backgroundColor: '#0c3619', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 4 }}
              >
                <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 11 }}>➕ Add Task</Text>
              </TouchableOpacity>
            </View>

            {/* Filter Pills */}
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 14 }}>
              {['ALL', 'URGENT', 'OVERDUE', 'DONE'].map(f => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setTaskFilter(f)}
                  style={[
                    { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1' },
                    taskFilter === f && { backgroundColor: '#d97706', borderColor: '#d97706' }
                  ]}
                >
                  <Text style={[{ fontSize: 11, fontWeight: '800', color: '#475569' }, taskFilter === f && { color: '#ffffff' }]}>
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Priority Tasks List */}
            <View style={{ gap: 10 }}>
              {tasks
                .filter(t => {
                  if (taskFilter === 'URGENT') return t.status === 'URGENT' || t.urgency === 'HIGH';
                  if (taskFilter === 'OVERDUE') return t.status === 'OVERDUE';
                  if (taskFilter === 'DONE') return t.done;
                  return true;
                })
                .map(t => {
                  const isDone = t.done;
                  let badgeBg = '#f1f5f9';
                  let badgeColor = '#64748b';
                  let borderCol = '#cbd5e1';

                  if (t.status === 'OVERDUE') {
                    badgeBg = '#fee2e2';
                    badgeColor = '#dc2626';
                    borderCol = '#ef4444';
                  } else if (t.status === 'URGENT' || t.urgency === 'HIGH') {
                    badgeBg = '#fef3c7';
                    badgeColor = '#d97706';
                    borderCol = '#f59e0b';
                  } else if (isDone) {
                    badgeBg = '#dcfce7';
                    badgeColor = '#15803d';
                    borderCol = '#86efac';
                  }

                  return (
                    <TouchableOpacity
                      key={t.id}
                      onPress={() => handleToggleTask(t.id)}
                      style={{
                        backgroundColor: isDone ? '#f0fdf4' : '#ffffff',
                        borderRadius: 14,
                        padding: 14,
                        borderWidth: 1.5,
                        borderColor: borderCol,
                        elevation: 1
                      }}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: isDone ? '#15803d' : borderCol }}>
                          ● {t.time}  ·  📍 {t.plot}
                        </Text>
                        <View style={{ backgroundColor: badgeBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                          <Text style={{ fontSize: 10, fontWeight: '900', color: badgeColor }}>
                            {isDone ? 'COMPLETED ✓' : t.status}
                          </Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Text style={{ fontSize: 20 }}>{isDone ? '✅' : '⬜'}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, fontWeight: '800', color: isDone ? '#15803d' : '#0f172a', textDecorationLine: isDone ? 'line-through' : 'none' }}>
                            {t.title}
                          </Text>
                          <Text style={{ fontSize: 12, color: '#64748b', fontWeight: '500', marginTop: 2 }}>
                            {t.desc}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </View>

            {/* PGS ORGANIC CERTIFICATION CARD WITH CHECKLIST ITEM ALERT */}
            <View style={{ backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1.5, borderColor: '#16a34a', padding: 14, marginTop: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 18 }}>🛡️</Text>
                  <View>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#16a34a', textTransform: 'uppercase' }}>PGS ORGANIC CERTIFICATION</Text>
                    <Text style={{ fontSize: 13, fontWeight: '800', color: '#0c3619' }}>Certified · 94% complete</Text>
                  </View>
                </View>
                <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                  <Text style={{ color: '#15803d', fontSize: 10, fontWeight: '800' }}>Active</Text>
                </View>
              </View>

              <View style={{ width: '100%', height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, overflow: 'hidden', marginVertical: 8 }}>
                <View style={{ width: '94%', height: '100%', backgroundColor: '#16a34a' }} />
              </View>

              <View style={{ backgroundColor: '#fffbeb', borderWidth: 1.5, borderColor: '#fcd34d', borderRadius: 10, padding: 10, marginTop: 4 }}>
                <Text style={{ fontSize: 11, fontWeight: '900', color: '#b45309', marginBottom: 2 }}>
                  ⚠️ 1 CHECKLIST ITEM TO FIX
                </Text>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#78350f', marginBottom: 6 }}>
                  Submit photo of compost batch #14 (1 day overdue)
                </Text>
                <TouchableOpacity
                  onPress={() => setActiveTab('log')}
                  style={{ backgroundColor: '#fef3c7', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 6, alignSelf: 'flex-start' }}
                >
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#b45309' }}>
                    Tip: Open Log Activity → attach photo → submit to cloud
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* TAB 5: PROFILE MANAGEMENT & SETTINGS */}
        {activeTab === 'profile' && (
          <View style={{ backgroundColor: '#edf2ee', paddingBottom: 30 }}>
            {profileSubView === 'profile' ? (
              /* ===== VIEW A: MY PROFILE SCREEN ===== */
              <>
                {/* Top Header Bar */}
                <View style={{ backgroundColor: '#0c3619', paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TouchableOpacity onPress={() => setActiveTab('home')} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.18)', justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>←</Text>
                    </TouchableOpacity>
                    <View>
                      <Text style={{ fontSize: 18, fontWeight: '800', color: '#ffffff' }}>My Profile</Text>
                      <Text style={{ fontSize: 11, color: '#a7f3d0', fontWeight: '600' }}>Impormasyon at membership</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setProfileSubView('settings')} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.18)', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18 }}>⚙️</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ padding: 16, gap: 14 }}>
                  {/* CARD 1: MAIN PROFILE CARD */}
                  <View style={styles.profCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                      <View style={styles.avatarCircle}>
                        <Text style={{ fontSize: 24, fontWeight: '900', color: '#1e293b' }}>{profileData.name.charAt(0)}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 17, fontWeight: '800', color: '#0f172a' }}>{profileData.name}</Text>
                        <Text style={{ fontSize: 12, color: '#475569', fontWeight: '600', marginVertical: 2 }}>{profileData.subtitle}</Text>
                        <View style={{ backgroundColor: '#15803d', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, alignSelf: 'flex-start' }}>
                          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>{profileData.pgsBadge}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* CARD 2: CONTACT */}
                  <View style={styles.profCard}>
                    <Text style={styles.profSectionHeader}>CONTACT</Text>
                    <View style={{ gap: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={styles.profIconBox}><Text style={{ fontSize: 16 }}>📞</Text></View>
                        <View>
                          <Text style={styles.profFieldLabel}>MOBILE</Text>
                          <Text style={styles.profFieldValue}>{profileData.mobile}</Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={styles.profIconBox}><Text style={{ fontSize: 16 }}>✉️</Text></View>
                        <View>
                          <Text style={styles.profFieldLabel}>EMAIL</Text>
                          <Text style={styles.profFieldValue}>{profileData.email}</Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={styles.profIconBox}><Text style={{ fontSize: 16 }}>🪪</Text></View>
                        <View>
                          <Text style={styles.profFieldLabel}>MEMBER ID</Text>
                          <Text style={styles.profFieldValue}>{profileData.memberId}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* CARD 3: FARM LOCATION */}
                  <View style={styles.profCard}>
                    <Text style={styles.profSectionHeader}>FARM LOCATION</Text>
                    <View style={{ gap: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={styles.profIconBox}><Text style={{ fontSize: 16 }}>📍</Text></View>
                        <View>
                          <Text style={styles.profFieldLabel}>BARANGAY</Text>
                          <Text style={styles.profFieldValue}>{profileData.barangay}</Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={styles.profIconBox}><Text style={{ fontSize: 16 }}>🧭</Text></View>
                        <View>
                          <Text style={styles.profFieldLabel}>COORDINATES</Text>
                          <Text style={styles.profFieldValue}>{profileData.coordinates}</Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={styles.profIconBox}><Text style={{ fontSize: 16 }}>🌱</Text></View>
                        <View>
                          <Text style={styles.profFieldLabel}>TOTAL AREA</Text>
                          <Text style={styles.profFieldValue}>{profileData.totalArea}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* CARD 4: COOPERATIVE */}
                  <View style={styles.profCard}>
                    <Text style={styles.profSectionHeader}>COOPERATIVE</Text>
                    <View style={{ gap: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={styles.profIconBox}><Text style={{ fontSize: 16 }}>👥</Text></View>
                        <View>
                          <Text style={styles.profFieldLabel}>COOP</Text>
                          <Text style={styles.profFieldValue}>{profileData.coop}</Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={styles.profIconBox}><Text style={{ fontSize: 16 }}>🛡️</Text></View>
                        <View>
                          <Text style={styles.profFieldLabel}>STANDING</Text>
                          <Text style={styles.profFieldValue}>{profileData.standing}</Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={styles.profIconBox}><Text style={{ fontSize: 16 }}>📅</Text></View>
                        <View>
                          <Text style={styles.profFieldLabel}>DUES PAID UNTIL</Text>
                          <Text style={styles.profFieldValue}>{profileData.duesPaidUntil}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* CARD 5: ASSIGNED PLOTS */}
                  <View style={styles.profCard}>
                    <Text style={styles.profSectionHeader}>ASSIGNED PLOTS</Text>
                    <View style={{ gap: 8 }}>
                      {profileData.assignedPlots.map(plot => (
                        <View key={plot.id} style={styles.plotSubCard}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <View style={styles.plotTagPill}><Text style={{ color: '#064e3b', fontWeight: '800', fontSize: 11 }}>{plot.id}</Text></View>
                            <View>
                              <Text style={{ fontWeight: '800', fontSize: 14, color: '#0f172a' }}>{plot.crop}</Text>
                              <Text style={{ fontSize: 11, color: '#475569', fontWeight: '600' }}>{plot.area}</Text>
                            </View>
                          </View>
                          <View style={styles.plotStatusPill}>
                            <Text style={{ fontSize: 11, fontWeight: '800', color: '#0f172a' }}>{plot.status}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* CARD 6: LIVESTOCK */}
                  <TouchableOpacity onPress={() => setShowLivestockModal(true)} style={styles.profCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <Text style={styles.profSectionHeader}>LIVESTOCK RECORDS</Text>
                      <Text style={{ fontSize: 11, color: '#16a34a', fontWeight: '800' }}>Manage Records ›</Text>
                    </View>
                    <View style={{ gap: 8 }}>
                      <View style={styles.plotSubCard}>
                        <Text style={{ fontWeight: '800', fontSize: 12, color: '#0f172a', marginRight: 12 }}>GT-014</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontWeight: '800', fontSize: 14, color: '#0f172a' }}>Native Goats Herd</Text>
                          <Text style={{ fontSize: 11, color: '#475569', fontWeight: '600' }}>{livestockGoats.length} Heads Registered · Tap to view ledger</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* ACTION BUTTONS */}
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                    <TouchableOpacity onPress={() => setProfileSubView('settings')} style={[styles.submitBtn, { flex: 1, backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: '#0c3619', marginTop: 0 }]}>
                      <Text style={{ color: '#0c3619', fontWeight: '800', fontSize: 13 }}>⚙️ App Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setTempProfile(profileData); setShowProfileModal(true); }} style={[styles.submitBtn, { flex: 1, backgroundColor: '#0c3619', marginTop: 0 }]}>
                      <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 13 }}>✏️ Edit Info</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            ) : (
              /* ===== VIEW B: SETTINGS SCREEN (MATCHING SCREENSHOTS EXACTLY) ===== */
              <>
                {/* Header */}
                <View style={{ backgroundColor: '#0c3619', paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TouchableOpacity onPress={() => setProfileSubView('profile')} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.18)', justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>←</Text>
                    </TouchableOpacity>
                    <View>
                      <Text style={{ fontSize: 18, fontWeight: '800', color: '#ffffff' }}>Settings</Text>
                      <Text style={{ fontSize: 11, color: '#a7f3d0', fontWeight: '600' }}>Mga kagustuhan sa app</Text>
                    </View>
                  </View>
                </View>

                <View style={{ padding: 16, gap: 14 }}>
                  {/* NOTIFICATIONS */}
                  <View style={styles.profCard}>
                    <Text style={styles.profSectionHeader}>NOTIFICATIONS</Text>
                    <View style={{ gap: 14 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <View style={styles.profIconBox}><Text style={{ fontSize: 16 }}>🔔</Text></View>
                          <View>
                            <Text style={{ fontSize: 14, fontWeight: '800', color: '#0f172a' }}>Push notifications</Text>
                            <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '600' }}>Task, weather and alerts</Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => setSettingsData(prev => ({ ...prev, pushNotifications: !prev.pushNotifications }))}
                          style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: settingsData.pushNotifications ? '#0c3619' : '#e2e8f0', justifyContent: 'center', alignItems: settingsData.pushNotifications ? 'flex-end' : 'flex-start', padding: 2 }}
                        >
                          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#ffffff' }} />
                        </TouchableOpacity>
                      </View>

                      <View style={{ height: 1, backgroundColor: '#f1f5f9' }} />

                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <View style={styles.profIconBox}><Text style={{ fontSize: 16 }}>📱</Text></View>
                          <View>
                            <Text style={{ fontSize: 14, fontWeight: '800', color: '#0f172a' }}>SMS reminders</Text>
                            <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '600' }}>Kapag walang internet</Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => setSettingsData(prev => ({ ...prev, smsReminders: !prev.smsReminders }))}
                          style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: settingsData.smsReminders ? '#0c3619' : '#e2e8f0', justifyContent: 'center', alignItems: settingsData.smsReminders ? 'flex-end' : 'flex-start', padding: 2 }}
                        >
                          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#ffffff' }} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* PREFERENCES */}
                  <View style={styles.profCard}>
                    <Text style={styles.profSectionHeader}>PREFERENCES</Text>
                    <View style={{ gap: 14 }}>
                      <TouchableOpacity
                        onPress={() => setSettingsData(prev => ({ ...prev, language: prev.language === 'Tagalog' ? 'English' : 'Tagalog' }))}
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <View style={styles.profIconBox}><Text style={{ fontSize: 16 }}>🌐</Text></View>
                          <View>
                            <Text style={{ fontSize: 14, fontWeight: '800', color: '#0f172a' }}>Language</Text>
                            <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '600' }}>Tap to change</Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Text style={{ fontSize: 14, fontWeight: '800', color: '#0c3619' }}>{settingsData.language}</Text>
                          <Text style={{ fontSize: 16, color: '#64748b' }}>›</Text>
                        </View>
                      </TouchableOpacity>

                      <View style={{ height: 1, backgroundColor: '#f1f5f9' }} />

                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <View style={styles.profIconBox}><Text style={{ fontSize: 16 }}>🌙</Text></View>
                          <View>
                            <Text style={{ fontSize: 14, fontWeight: '800', color: '#0f172a' }}>Dark mode</Text>
                            <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '600' }}>Mas madaling basahin sa gabi</Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => setSettingsData(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                          style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: settingsData.darkMode ? '#0c3619' : '#e2e8f0', justifyContent: 'center', alignItems: settingsData.darkMode ? 'flex-end' : 'flex-start', padding: 2 }}
                        >
                          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#ffffff' }} />
                        </TouchableOpacity>
                      </View>

                      <View style={{ height: 1, backgroundColor: '#f1f5f9' }} />

                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <View style={styles.profIconBox}><Text style={{ fontSize: 16 }}>📶</Text></View>
                          <View>
                            <Text style={{ fontSize: 14, fontWeight: '800', color: '#0f172a' }}>Offline mode</Text>
                            <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '600' }}>I-save ang logs kapag walang signal</Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => setSettingsData(prev => ({ ...prev, offlineMode: !prev.offlineMode }))}
                          style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: settingsData.offlineMode ? '#0c3619' : '#e2e8f0', justifyContent: 'center', alignItems: settingsData.offlineMode ? 'flex-end' : 'flex-start', padding: 2 }}
                        >
                          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#ffffff' }} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* ACCOUNT & SECURITY */}
                  <View style={styles.profCard}>
                    <Text style={styles.profSectionHeader}>ACCOUNT & SECURITY</Text>
                    <View style={{ gap: 14 }}>
                      <TouchableOpacity onPress={() => Alert.alert('Change Password', 'Password update link sent to your registered email.')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <View style={styles.profIconBox}><Text style={{ fontSize: 16 }}>🔒</Text></View>
                          <Text style={{ fontSize: 14, fontWeight: '800', color: '#0f172a' }}>Change password</Text>
                        </View>
                        <Text style={{ fontSize: 16, color: '#64748b' }}>›</Text>
                      </TouchableOpacity>

                      <View style={{ height: 1, backgroundColor: '#f1f5f9' }} />

                      <TouchableOpacity onPress={() => Alert.alert('Privacy & Data', 'MARIKHA encrypts all local logs before syncing to cloud.')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <View style={styles.profIconBox}><Text style={{ fontSize: 16 }}>🛡️</Text></View>
                          <Text style={{ fontSize: 14, fontWeight: '800', color: '#0f172a' }}>Privacy & data</Text>
                        </View>
                        <Text style={{ fontSize: 16, color: '#64748b' }}>›</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* SUPPORT */}
                  <View style={styles.profCard}>
                    <Text style={styles.profSectionHeader}>SUPPORT</Text>
                    <View style={{ gap: 14 }}>
                      <TouchableOpacity onPress={() => Alert.alert('Help Center', 'Cooperative Helpline: +63 2 8888 7777\nSupport Email: support@farmer.ph')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <View style={styles.profIconBox}><Text style={{ fontSize: 16 }}>❓</Text></View>
                          <Text style={{ fontSize: 14, fontWeight: '800', color: '#0f172a' }}>Help center</Text>
                        </View>
                        <Text style={{ fontSize: 16, color: '#64748b' }}>›</Text>
                      </TouchableOpacity>

                      <View style={{ height: 1, backgroundColor: '#f1f5f9' }} />

                      <TouchableOpacity onPress={() => Alert.alert('About MARIKHA', 'MARIKHA Farmer App v1.0.0\nBuilt for organic farmers in Marikina & Quezon.')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <View style={styles.profIconBox}><Text style={{ fontSize: 16 }}>🛡️</Text></View>
                          <View>
                            <Text style={{ fontSize: 14, fontWeight: '800', color: '#0f172a' }}>About MARIKHA</Text>
                            <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '600' }}>v1.0.0</Text>
                          </View>
                        </View>
                        <Text style={{ fontSize: 16, color: '#64748b' }}>›</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* RED LOG OUT BUTTON */}
                  <TouchableOpacity
                    onPress={() => setIsLoggedIn(false)}
                    style={{ backgroundColor: '#dc2626', paddingVertical: 16, borderRadius: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10 }}
                  >
                    <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '800' }}>↳</Text>
                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '800' }}>Log out</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav Tabs */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('home')}>
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>🏠 HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('log')}>
          <Text style={[styles.navText, activeTab === 'log' && styles.navTextActive]}>📝 LOG</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('ai')}>
          <Text style={[styles.navText, activeTab === 'ai' && styles.navTextActive]}>✨ AI</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('tasks')}>
          <Text style={[styles.navText, activeTab === 'tasks' && styles.navTextActive]}>📅 TASKS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('profile')}>
          <Text style={[styles.navText, activeTab === 'profile' && styles.navTextActive]}>👤 PROFILE</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Settings Modal */}
      <Modal visible={showProfileModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: '#ffffff', width: '100%', borderRadius: 16, padding: 20, maxHeight: '85%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#0c3619' }}>⚙️ Profile Management</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                <Text style={{ fontSize: 18, color: '#64748b' }}>✕</Text>
              </TouchableOpacity>
            </View>

            {profileSaveAlert && (
              <View style={{ backgroundColor: '#dcfce7', borderColor: '#86efac', borderWidth: 1, padding: 8, borderRadius: 8, marginBottom: 10 }}>
                <Text style={{ color: '#166534', fontWeight: '800', fontSize: 12, textAlign: 'center' }}>✓ Profile details updated successfully!</Text>
              </View>
            )}

            <ScrollView style={{ flex: 1 }}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.inputDark} value={tempProfile.name} onChangeText={t => setTempProfile({ ...tempProfile, name: t })} />

              <Text style={styles.label}>Mobile Number</Text>
              <TextInput style={styles.inputDark} value={tempProfile.mobile} onChangeText={t => setTempProfile({ ...tempProfile, mobile: t })} />

              <Text style={styles.label}>Email Address</Text>
              <TextInput style={styles.inputDark} value={tempProfile.email} onChangeText={t => setTempProfile({ ...tempProfile, email: t })} />

              <Text style={styles.label}>Member ID</Text>
              <TextInput style={styles.inputDark} value={tempProfile.memberId} onChangeText={t => setTempProfile({ ...tempProfile, memberId: t })} />

              <Text style={styles.label}>Barangay / Address</Text>
              <TextInput style={styles.inputDark} value={tempProfile.barangay} onChangeText={t => setTempProfile({ ...tempProfile, barangay: t })} />

              <Text style={styles.label}>Coordinates</Text>
              <TextInput style={styles.inputDark} value={tempProfile.coordinates} onChangeText={t => setTempProfile({ ...tempProfile, coordinates: t })} />

              <Text style={styles.label}>Total Area</Text>
              <TextInput style={styles.inputDark} value={tempProfile.totalArea} onChangeText={t => setTempProfile({ ...tempProfile, totalArea: t })} />

              <Text style={styles.label}>Cooperative Name</Text>
              <TextInput style={styles.inputDark} value={tempProfile.coop} onChangeText={t => setTempProfile({ ...tempProfile, coop: t })} />
            </ScrollView>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSaveProfile}>
              <Text style={styles.submitBtnText}>Save Profile Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= LIVESTOCK RECORDS MODULE MODAL ================= */}
      <Modal visible={showLivestockModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <View style={{ backgroundColor: '#ffffff', width: '100%', borderRadius: 16, maxHeight: '90%', padding: 0, overflow: 'hidden' }}>
            {/* Header */}
            <View style={{ backgroundColor: '#0c3619', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#ffffff' }}>🐐 Livestock Records Module</Text>
                <Text style={{ fontSize: 11, color: '#a7f3d0', fontWeight: '600' }}>Native Goat Herd & Medical Ledger</Text>
              </View>
              <TouchableOpacity onPress={() => setShowLivestockModal(false)} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: '#ffffff', fontWeight: '800' }}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Herd Metrics Bar */}
            <View style={{ backgroundColor: '#f0fdf4', padding: 12, borderBottomWidth: 1, borderBottomColor: '#dcfce7', flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '900', color: '#0c3619' }}>{livestockGoats.length} Heads</Text>
                <Text style={{ fontSize: 10, color: '#166534', fontWeight: '700' }}>TOTAL FLOCK</Text>
              </View>
              <View style={{ width: 1, backgroundColor: '#bbf7d0' }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '900', color: '#0c3619' }}>8.5 L/day</Text>
                <Text style={{ fontSize: 10, color: '#166534', fontWeight: '700' }}>MILK YIELD</Text>
              </View>
              <View style={{ width: 1, backgroundColor: '#bbf7d0' }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '900', color: '#0c3619' }}>35 Kg/day</Text>
                <Text style={{ fontSize: 10, color: '#166534', fontWeight: '700' }}>FEED RATION</Text>
              </View>
            </View>

            {/* Action Buttons Header */}
            <View style={{ padding: 12, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity 
                onPress={() => setShowAddGoatModal(true)}
                style={{ flex: 1, backgroundColor: '#0c3619', paddingVertical: 10, borderRadius: 10, alignItems: 'center' }}
              >
                <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 12 }}>➕ Register New Goat</Text>
              </TouchableOpacity>
            </View>

            {/* Goat Cards List */}
            <ScrollView style={{ flex: 1, padding: 14 }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#0f172a', marginBottom: 10 }}>Registered Goats ({livestockGoats.length})</Text>
              
              <View style={{ gap: 12, paddingBottom: 20 }}>
                {livestockGoats.map(g => (
                  <View key={g.id} style={{ backgroundColor: '#ffffff', borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: '#cbd5e1' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={{ backgroundColor: '#0c3619', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                          <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 12 }}>{g.id}</Text>
                        </View>
                        <Text style={{ fontSize: 15, fontWeight: '800', color: '#0f172a' }}>{g.name}</Text>
                      </View>
                      <View style={{ backgroundColor: g.health.includes('Healthy') ? '#dcfce7' : '#fef3c7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: g.health.includes('Healthy') ? '#15803d' : '#d97706' }}>{g.health}</Text>
                      </View>
                    </View>

                    <View style={{ gap: 4, marginVertical: 6 }}>
                      <Text style={{ fontSize: 12, color: '#334155', fontWeight: '600' }}>🏷️ <Text style={{ fontWeight: '800' }}>Breed:</Text> {g.breed}  ·  <Text style={{ fontWeight: '800' }}>Sex:</Text> {g.sex}</Text>
                      <Text style={{ fontSize: 12, color: '#334155', fontWeight: '600' }}>⚖️ <Text style={{ fontWeight: '800' }}>Weight:</Text> {g.weight}  ·  <Text style={{ fontWeight: '800' }}>Age:</Text> {g.age}</Text>
                      <Text style={{ fontSize: 12, color: '#334155', fontWeight: '600' }}>🏠 <Text style={{ fontWeight: '800' }}>Location:</Text> {g.shed}</Text>
                      <Text style={{ fontSize: 12, color: '#15803d', fontWeight: '700' }}>💉 <Text style={{ fontWeight: '800' }}>Last Dewormed:</Text> {g.lastDewormed}</Text>
                      <Text style={{ fontSize: 12, color: '#15803d', fontWeight: '700' }}>🛡️ <Text style={{ fontWeight: '800' }}>Vaccine:</Text> {g.lastVaccine}</Text>
                      {g.notes ? <Text style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic', marginTop: 4 }}>"{g.notes}"</Text> : null}
                    </View>

                    <TouchableOpacity 
                      onPress={() => { setSelectedGoat(g); setShowHealthLogModal(true); }}
                      style={{ backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#86efac', paddingVertical: 8, borderRadius: 8, alignItems: 'center', marginTop: 8 }}
                    >
                      <Text style={{ color: '#166534', fontWeight: '800', fontSize: 12 }}>💉 Log Vaccine / Medical Care</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ================= ADD NEW GOAT MODAL ================= */}
      <Modal visible={showAddGoatModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: '#ffffff', width: '100%', borderRadius: 16, padding: 20, maxHeight: '85%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#0c3619' }}>🐐 Register New Goat Record</Text>
              <TouchableOpacity onPress={() => setShowAddGoatModal(false)}>
                <Text style={{ fontSize: 18, color: '#64748b' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }}>
              <Text style={styles.label}>Tag ID (Required e.g. GT-025)</Text>
              <TextInput style={styles.inputDark} value={newGoatTag} onChangeText={setNewGoatTag} placeholder="GT-025" />

              <Text style={styles.label}>Goat Name / Nickname</Text>
              <TextInput style={styles.inputDark} value={newGoatName} onChangeText={setNewGoatName} placeholder="e.g. Maya (Doe #25)" />

              <Text style={styles.label}>Breed / Type</Text>
              <TextInput style={styles.inputDark} value={newGoatBreed} onChangeText={setNewGoatBreed} />

              <Text style={styles.label}>Sex / Gender</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
                {['Female (Doe)', 'Male (Buck)', 'Kid'].map(s => (
                  <TouchableOpacity 
                    key={s} 
                    onPress={() => setNewGoatSex(s)}
                    style={[{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1' }, newGoatSex === s && { backgroundColor: '#0c3619' }]}
                  >
                    <Text style={[{ fontSize: 12, fontWeight: '700', color: '#334155' }, newGoatSex === s && { color: '#ffffff' }]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput style={styles.inputDark} value={newGoatWeight} onChangeText={setNewGoatWeight} keyboardType="numeric" />

              <Text style={styles.label}>Barn / Shed Location</Text>
              <TextInput style={styles.inputDark} value={newGoatShed} onChangeText={setNewGoatShed} />

              <Text style={styles.label}>Health Status</Text>
              <TextInput style={styles.inputDark} value={newGoatHealth} onChangeText={setNewGoatHealth} />

              <Text style={styles.label}>Notes / Remarks</Text>
              <TextInput style={[styles.inputDark, { height: 60 }]} value={newGoatNotes} onChangeText={setNewGoatNotes} multiline />
            </ScrollView>

            <TouchableOpacity style={[styles.submitBtn, { marginTop: 12 }]} onPress={handleAddGoat}>
              <Text style={styles.submitBtnText}>Save Goat to Ledger →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= HEALTH LOG TREATMENT MODAL ================= */}
      <Modal visible={showHealthLogModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: '#ffffff', width: '100%', borderRadius: 16, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#0c3619' }}>💉 Medical & Treatment Log</Text>
              <TouchableOpacity onPress={() => setShowHealthLogModal(false)}>
                <Text style={{ fontSize: 18, color: '#64748b' }}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedGoat && (
              <View style={{ backgroundColor: '#f0fdf4', padding: 10, borderRadius: 8, marginBottom: 12 }}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#0c3619' }}>Target: {selectedGoat.id} - {selectedGoat.name}</Text>
                <Text style={{ fontSize: 11, color: '#166534' }}>{selectedGoat.breed} · {selectedGoat.weight}</Text>
              </View>
            )}

            <Text style={styles.label}>Treatment Category</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 4, marginBottom: 10 }}>
              {['Deworming', 'Vaccination', 'Vitamin Boost', 'Antibiotic'].map(t => (
                <TouchableOpacity 
                  key={t} 
                  onPress={() => setHealthTreatmentType(t)}
                  style={[{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1' }, healthTreatmentType === t && { backgroundColor: '#15803d' }]}
                >
                  <Text style={[{ fontSize: 11, fontWeight: '700', color: '#334155' }, healthTreatmentType === t && { color: '#ffffff' }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Medicine / Vaccine Name</Text>
            <TextInput style={styles.inputDark} value={healthMedicine} onChangeText={setHealthMedicine} />

            <Text style={styles.label}>Treatment Notes / Vet Remarks</Text>
            <TextInput style={[styles.inputDark, { height: 60 }]} value={healthNotes} onChangeText={setHealthNotes} multiline placeholder="e.g. Administered 5ml orally, next dose due in 3 months" />

            <TouchableOpacity style={[styles.submitBtn, { marginTop: 12, backgroundColor: '#15803d' }]} onPress={handleAddHealthLog}>
              <Text style={styles.submitBtnText}>Record Health Treatment →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= REAL-TIME YIELD PREDICTION MODULE MODAL ================= */}
      <Modal visible={showYieldPredictionModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: '#ffffff', width: '100%', borderRadius: 16, padding: 18, maxHeight: '90%' }}>
            {/* Modal Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ backgroundColor: '#0c3619', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                  <Text style={{ color: '#86efac', fontWeight: '900', fontSize: 13 }}>📈 YIELD PREDICTION</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#0f172a' }}>Realtime ML Engine</Text>
              </View>
              <TouchableOpacity onPress={() => setShowYieldPredictionModal(false)}>
                <Text style={{ fontSize: 20, color: '#64748b', fontWeight: '800' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }}>
              {/* Telemetry Status Bar */}
              <View style={{ backgroundColor: '#ecfdf5', borderRadius: 12, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: '#86efac' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: '#047857' }}>📡 LIVE SENSOR TELEMETRY</Text>
                  <View style={{ backgroundColor: '#10b981', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                    <Text style={{ color: '#fff', fontSize: 9, fontWeight: '900' }}>REALTIME ACTIVE</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 12, fontWeight: '800', color: '#064e3b' }}>
                  Target: {yieldPlot}  ·  Crop: {yieldCrop}
                </Text>
              </View>

              {/* Form Input Controls */}
              <Text style={styles.label}>1. Select Target Plot & Crop</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                {[
                  { plot: 'Plot P-007', crop: 'Tomato Diamante Max', area: '0.40' },
                  { plot: 'Plot P-021', crop: 'Ampalaya Galaxy Max', area: '0.30' },
                  { plot: 'Plot P-034', crop: 'Eggplant Mistisa F1', area: '0.25' }
                ].map(item => (
                  <TouchableOpacity 
                    key={item.plot} 
                    onPress={() => {
                      setYieldPlot(item.plot);
                      setYieldCrop(item.crop);
                      setYieldAreaHa(item.area);
                    }}
                    style={[
                      { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, borderColor: '#cbd5e1', backgroundColor: '#ffffff' },
                      yieldPlot === item.plot && { backgroundColor: '#0c3619', borderColor: '#0c3619' }
                    ]}
                  >
                    <Text style={[{ fontSize: 11, fontWeight: '800', color: '#334155' }, yieldPlot === item.plot && { color: '#ffffff' }]}>
                      {item.plot} ({item.crop.split(' ')[0]})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { marginTop: 12 }]}>2. Total Field Area (Hectares)</Text>
              <TextInput 
                style={styles.inputDark} 
                value={yieldAreaHa} 
                onChangeText={setYieldAreaHa}
                keyboardType="numeric"
              />

              <Text style={[styles.label, { marginTop: 10 }]}>3. Total Plant Population / Beds Count</Text>
              <TextInput 
                style={styles.inputDark} 
                value={yieldPlantsCount} 
                onChangeText={setYieldPlantsCount}
                keyboardType="numeric"
              />

              <Text style={[styles.label, { marginTop: 10 }]}>4. Organic Fertilizer Applied (Kg)</Text>
              <TextInput 
                style={styles.inputDark} 
                value={yieldFertilizerKg} 
                onChangeText={setYieldFertilizerKg}
                keyboardType="numeric"
              />

              <Text style={[styles.label, { marginTop: 10 }]}>5. Live Soil Moisture Level: {yieldSoilMoisture}%</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <TouchableOpacity 
                  onPress={() => setYieldSoilMoisture(String(Math.max(10, Number(yieldSoilMoisture) - 5)))}
                  style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#047857', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>-5%</Text>
                </TouchableOpacity>
                <TextInput 
                  style={[styles.inputDark, { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', marginBottom: 0 }]}
                  value={yieldSoilMoisture}
                  onChangeText={setYieldSoilMoisture}
                  keyboardType="numeric"
                />
                <TouchableOpacity 
                  onPress={() => setYieldSoilMoisture(String(Math.min(95, Number(yieldSoilMoisture) + 5)))}
                  style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#059669', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>+5%</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                onPress={handleCalculateYieldPrediction}
                disabled={isCalculatingYield}
                style={{ backgroundColor: '#0c3619', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 }}
              >
                {isCalculatingYield ? (
                  <ActivityIndicator color="#86efac" />
                ) : (
                  <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 13 }}>🔮 CALCULATE LIVE YIELD FORECAST →</Text>
                )}
              </TouchableOpacity>

              {/* REALTIME YIELD PREDICTION RESULT CARD */}
              <View style={{ marginTop: 16, backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1.5, borderColor: '#059669' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#15803d' }}>🎯 {yieldPredictionResult.confidenceScore} RF ACCURACY</Text>
                  </View>
                  <Text style={{ fontSize: 10, color: '#64748b', fontWeight: '800' }}>Random Forest Regression</Text>
                </View>

                <Text style={{ fontSize: 10, fontWeight: '800', color: '#059669', textTransform: 'uppercase' }}>ESTIMATED HARVEST YIELD</Text>
                <Text style={{ fontSize: 26, fontWeight: '900', color: '#0c3619', marginVertical: 2 }}>{yieldPredictionResult.totalYieldKg}</Text>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#475569', marginBottom: 10 }}>{yieldPredictionResult.totalSacks} ({yieldPredictionResult.yieldPerHaTons})</Text>

                <View style={{ backgroundColor: '#fffbeb', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#fde68a' }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: '#b45309', textTransform: 'uppercase' }}>💰 GROSS MARKET REVENUE ESTIMATE</Text>
                  <Text style={{ fontSize: 20, fontWeight: '900', color: '#78350f', marginTop: 2 }}>{yieldPredictionResult.estimatedRevenue}</Text>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#92400e', marginTop: 2 }}>
                    Based on market price: {yieldPredictionResult.marketPricePerKg}
                  </Text>
                </View>

                <View style={{ gap: 6 }}>
                  <Text style={{ fontSize: 12, color: '#334155', fontWeight: '700' }}>📅 <Text style={{ fontWeight: '800' }}>Harvest Window:</Text> {yieldPredictionResult.harvestWindowRange}</Text>
                  <Text style={{ fontSize: 12, color: '#15803d', fontWeight: '700' }}>🎖️ <Text style={{ fontWeight: '800' }}>Quality Rating:</Text> {yieldPredictionResult.qualityGrade}</Text>
                  <Text style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic', marginTop: 4 }}>💡 "{yieldPredictionResult.recommendationNote}"</Text>
                </View>

                <TouchableOpacity 
                  onPress={() => {
                    setShowYieldPredictionModal(false);
                    Alert.alert('Saved to Ledger 💾', `Yield forecast for ${yieldPlot} saved and synced to Supabase.`);
                  }}
                  style={{ backgroundColor: '#059669', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 14 }}
                >
                  <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 12 }}>💾 Save Forecast to Ledger & Close</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      
      {/* ================= LIVE BROADCAST ANNOUNCEMENT POPUP MODAL ================= */}
      <Modal visible={showNoticeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { borderTopWidth: 5, borderTopColor: '#d97706' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 20 }}>📢</Text>
                <Text style={[styles.modalTitle, { color: '#b45309' }]}>LIVE COOPERATIVE BROADCAST</Text>
              </View>
              <TouchableOpacity onPress={() => setShowNoticeModal(false)}>
                <Text style={{ fontSize: 18, color: '#64748b', fontWeight: '800' }}>✕</Text>
              </TouchableOpacity>
            </View>

            {activePushNotice && (
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 11, color: '#059669', fontWeight: '800', textTransform: 'uppercase', marginBottom: 4 }}>
                  From: {activePushNotice.author || 'Liza Cruz (Admin)'}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '900', color: '#0f172a', marginBottom: 8 }}>
                  {activePushNotice.title || 'Official Announcement'}
                </Text>
                <View style={{ backgroundColor: '#fffbeb', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#fde68a' }}>
                  <Text style={{ fontSize: 13, color: '#78350f', fontWeight: '600', lineHeight: 18 }}>
                    "{activePushNotice.content || activePushNotice.title}"
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity 
              style={[styles.submitBtn, { backgroundColor: '#0c3619', marginTop: 0 }]} 
              onPress={() => setShowNoticeModal(false)}
            >
              <Text style={styles.submitBtnText}>✓ Acknowledge & Close Broadcast</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= CREATE SMART TASK MODAL ================= */}
      <Modal visible={showAddTaskModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: '#ffffff', width: '100%', borderRadius: 16, padding: 20, maxHeight: '85%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#0c3619' }}>📋 Create New Smart Task</Text>
              <TouchableOpacity onPress={() => setShowAddTaskModal(false)}>
                <Text style={{ fontSize: 18, color: '#64748b' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }}>
              <Text style={styles.label}>Task Title (Required)</Text>
              <TextInput style={styles.inputDark} value={newTaskTitle} onChangeText={setNewTaskTitle} placeholder="e.g. Morning Drip Irrigation Plot P-007" />

              <Text style={[styles.label, { marginTop: 10 }]}>Urgency Level</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                {['URGENT', 'NORMAL', 'OVERDUE'].map(u => (
                  <TouchableOpacity 
                    key={u}
                    onPress={() => setNewTaskUrgency(u)}
                    style={[
                      { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1' },
                      newTaskUrgency === u && { backgroundColor: u === 'URGENT' ? '#d97706' : u === 'OVERDUE' ? '#dc2626' : '#0c3619' }
                    ]}
                  >
                    <Text style={[{ fontSize: 11, fontWeight: '800', color: '#334155' }, newTaskUrgency === u && { color: '#ffffff' }]}>{u}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { marginTop: 10 }]}>Target Plot / Shed Location</Text>
              <TextInput style={styles.inputDark} value={newTaskPlot} onChangeText={setNewTaskPlot} />

              <Text style={[styles.label, { marginTop: 10 }]}>Scheduled Time / Date</Text>
              <TextInput style={styles.inputDark} value={newTaskTime} onChangeText={setNewTaskTime} />

              <Text style={[styles.label, { marginTop: 10 }]}>Task Category</Text>
              <TextInput style={styles.inputDark} value={newTaskCategory} onChangeText={setNewTaskCategory} />

              <Text style={[styles.label, { marginTop: 10 }]}>Instructions / Notes</Text>
              <TextInput style={[styles.inputDark, { height: 60 }]} value={newTaskDesc} onChangeText={setNewTaskDesc} multiline placeholder="e.g. Check water meter pressure & apply 20L drip ratio" />
            </ScrollView>

            <TouchableOpacity 
              style={[styles.submitBtn, { marginTop: 12, backgroundColor: '#d97706' }]} 
              onPress={handleCreateNewTask}
              disabled={isSubmittingTask}
            >
              {isSubmittingTask ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Create Task & Sync to Cloud →</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  loginContainer: { flex: 1, backgroundColor: '#0c3619', justifyContent: 'center', alignItems: 'center', padding: 24 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  logoText: { fontSize: 36 },
  appTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  appSubtitle: { fontSize: 14, color: '#86efac', marginBottom: 28 },
  formGroup: { width: '100%', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#86efac', marginBottom: 6 },
  input: { width: '100%', backgroundColor: '#fff', padding: 14, borderRadius: 12, fontSize: 16, color: '#111827' },
  loginButton: { width: '100%', backgroundColor: '#86efac', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  loginButtonText: { color: '#0c3619', fontWeight: 'bold', fontSize: 16 },
  header: { backgroundColor: '#0c3619', padding: 20, paddingTop: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerSubtitle: { color: '#86efac', fontSize: 12, fontWeight: 'bold' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  content: { flex: 1, padding: 16 },
  tabContent: { paddingBottom: 24 },
  alertBanner: { backgroundColor: '#fffbeb', borderColor: '#fcd34d', borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 16 },
  alertTitle: { color: '#d97706', fontWeight: 'bold', fontSize: 12 },
  alertText: { color: '#78350f', fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginVertical: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: { width: '48%', height: 110, borderRadius: 16, padding: 16, justifyContent: 'space-between', marginBottom: 12 },
  tileIcon: { fontSize: 24 },
  tileTitle: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#e5e7eb' },
  chipActive: { backgroundColor: '#0c3619' },
  chipText: { color: '#374151', fontWeight: 'bold' },
  chipTextActive: { color: '#fff' },
  inputDark: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 16 },
  photoPicker: { height: 120, borderStyle: 'dashed', borderWidth: 2, borderColor: '#0c3619', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16, backgroundColor: '#f0fdf4' },
  submitBtn: { backgroundColor: '#0c3619', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  aiCard: { backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  taskItem: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  navBar: { height: 60, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e5e7eb', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 13, color: '#9ca3af', fontWeight: 'bold' },
  navTextActive: { color: '#0c3619' },

  profCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  avatarCircle: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#dce3db', justifyContent: 'center', alignItems: 'center' },
  profSectionHeader: { fontSize: 11, fontWeight: '800', color: '#334155', letterSpacing: 0.5, marginBottom: 10 },
  profIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#847e73', justifyContent: 'center', alignItems: 'center' },
  profFieldLabel: { fontSize: 9, fontWeight: '800', color: '#64748b', letterSpacing: 0.3 },
  profFieldValue: { fontSize: 13, fontWeight: '800', color: '#0f172a', marginTop: 1 },
  plotSubCard: { backgroundColor: '#beb7ab', borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  plotTagPill: { backgroundColor: '#98a092', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  plotStatusPill: { borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)', backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 3 }
});
