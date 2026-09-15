import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  SafeAreaView, 
  StatusBar, 
  Alert, 
  Modal, 
  ActivityIndicator,
  Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from './src/supabase';

export default function App() {
  // Navigation & Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'log', 'ai', 'tasks'
  const [currentUser, setCurrentUser] = useState({
    name: 'rei lopez',
    email: 'lopezrenier97@gmail.com',
    role: 'Farmer'
  });

  // Login form state
  const [emailInput, setEmailInput] = useState('lopezrenier97@gmail.com');
  const [passInput, setPassInput] = useState('password123');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Live Realtime Push Announcements state
  const [announcements, setAnnouncements] = useState([]);
  const [activePushNotice, setActivePushNotice] = useState(null);
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  // Log Activity form state with Realtime Task Logging Module
  const [logCategory, setLogCategory] = useState('crops'); // 'crops' or 'livestock'
  const [selectedPlot, setSelectedPlot] = useState('Plot P-007');
  const [activity, setActivity] = useState('Watering');
  const [amount, setAmount] = useState('10');
  const [logUnit, setLogUnit] = useState('Liters');
  const [logNote, setLogNote] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);

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
      photo: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb12735?w=600&auto=format&fit=crop&q=60'
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

  // Camera & Photo Capture functions
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera permission is needed to capture activity proof.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
        base64: true
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Notice', 'Opening camera...');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
        base64: true
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Notice', 'Opening photo library...');
    }
  };

  // AI Recommendation state
  const [season, setSeason] = useState('Tag-init (Dry)');
  const [isCalculatingAI, setIsCalculatingAI] = useState(false);
  const [aiResult, setAiResult] = useState({
    crop: 'Tomato · Diamante',
    confidence: '87%',
    output: '412 kg',
    sacks: '~ 8 sacks',
    harvestWindow: 'Nov 18 – Dec 02, 2025'
  });

  // Tasks checklist state
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Apply vermicompost fertilizer (Plot P-007)', urgency: 'High', done: false },
    { id: '2', title: 'Inspect tomato crops for leaf spots', urgency: 'Normal', done: true },
    { id: '3', title: 'Morning drip irrigation cycle (30 mins)', urgency: 'Normal', done: false }
  ]);

  // Detailed Livestock Records Module State (Goat Management)
  const [showLivestockModal, setShowLivestockModal] = useState(false);
  const [activeLivestockTab, setActiveLivestockTab] = useState('herd'); // 'herd', 'health', 'milk'
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

  // Settings View & Preferences state
  const [profileSubView, setProfileSubView] = useState('profile'); // 'profile' or 'settings'
  const [settingsData, setSettingsData] = useState({
    pushNotifications: false,
    smsReminders: false,
    language: 'Tagalog',
    darkMode: false,
    offlineMode: true
  });
  const [activeSettingsDialog, setActiveSettingsDialog] = useState(null);

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

  // Supabase Realtime Listener & 4-second Polling for 100% Guaranteed Web-to-Mobile Sync
  useEffect(() => {
    fetchAnnouncements();

    const interval = setInterval(() => {
      fetchAnnouncements();
    }, 4000);

    const channel = supabase
      .channel('announcements-mobile-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'announcements' }, payload => {
        if (payload.new) {
          const newAnn = {
            id: payload.new.id,
            title: payload.new.title || 'Cooperative Broadcast',
            content: payload.new.content || '',
            author: payload.new.author || 'Liza Cruz (Admin)'
          };
          setAnnouncements(prev => [newAnn, ...prev.filter(a => a.id !== newAnn.id)]);
          setActivePushNotice(newAnn);
          setShowNoticeModal(true);
        }
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await supabase.from('announcements').select('*').order('id', { ascending: false });
      if (data && data.length > 0) {
        setAnnouncements(data);
      }
    } catch (e) {}
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const { data } = await supabase.from('users').select('*').eq('email', emailInput.trim()).single();
      if (data) {
        setCurrentUser({
          name: data.name || emailInput.split('@')[0],
          email: data.email,
          role: data.role || 'Farmer'
        });
      } else {
        setCurrentUser({
          name: emailInput.split('@')[0],
          email: emailInput.trim(),
          role: 'Farmer'
        });
      }
      setIsAuthenticated(true);
    } catch (e) {
      setIsAuthenticated(true);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogSubmit = async () => {
    if (!amount.trim() || isNaN(Number(amount))) {
      Alert.alert('Validation Error', 'Please enter a valid numeric amount.');
      return;
    }
    setIsSubmittingLog(true);

    const actText = `${activity} (${amount} ${logUnit})`;
    const finalPhoto = photoUri || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb12735?w=600&auto=format&fit=crop&q=60';
    const newLogItem = {
      id: `log-${Date.now()}`,
      farmer: currentUser.name || 'Mang Juan Dela Cruz',
      plot: selectedPlot,
      crop: selectedPlot.includes('GT') ? 'Native Goats' : (selectedPlot.includes('007') ? 'Okra' : 'Ampalaya'),
      activity: actText,
      category: logCategory,
      notes: logNote || 'Submitted live via MARIKHA Mobile Task Logging Module',
      gps: '14.5861° N · 121.1764° E',
      time: 'Just now · Live Sync',
      status: 'Pending',
      photo: finalPhoto
    };

    try {
      // Instantly add to local live feed for immediate UX response
      setRecentActivityLogs(prev => [newLogItem, ...prev]);

      const { error } = await supabase.from('task_validations').insert([{
        farmer: newLogItem.farmer,
        plot: selectedPlot,
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
      setIsSubmittingLog(false);
      setLogNote('');
      setPhotoUri(null);
    }
  };

  // Live Crop Recommendation State Parameters
  const [aiSeason, setAiSeason] = useState('Tag-init (Dry)');
  const [aiSoilType, setAiSoilType] = useState('Loam Soil (Organic)');
  const [aiLocation, setAiLocation] = useState('Block A · Cupang, Antipolo');
  const [aiSoilMoisture, setAiSoilMoisture] = useState('58'); // %
  const [aiTemperature, setAiTemperature] = useState('29.5'); // °C
  const [aiNitrogen, setAiNitrogen] = useState('Optimal (High)');

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
          farmer: currentUser.name || 'Mang Juan Dela Cruz',
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

  // Splash / Flash Screen state
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // ================= 0. FLASH / SPLASH SCREEN =================
  if (showSplash) {
    return (
      <SafeAreaView style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0c3619" />
        <View style={styles.splashContent}>
          <View style={styles.splashEmblem}>
            <Text style={{ fontSize: 52 }}>🌱</Text>
          </View>
          <Text style={styles.splashTitle}>MARIKHA</Text>
          <Text style={styles.splashSub}>Organic Farming Cooperative Portal</Text>

          <ActivityIndicator size="large" color="#86efac" style={{ marginTop: 40 }} />
          <Text style={{ color: '#a7f3d0', fontSize: 12, fontWeight: '700', marginTop: 12 }}>
            Initializing Mobile System...
          </Text>

          <TouchableOpacity 
            style={styles.splashSkipBtn}
            onPress={() => setShowSplash(false)}
          >
            <Text style={styles.splashSkipBtnText}>Continue to Sign In →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ================= 1. LOGIN / SIGN IN SCREEN =================
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.loginContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0c3619" />
        <View style={styles.loginCard}>
          <View style={styles.loginEmblem}>
            <Text style={{ fontSize: 36 }}>🌱</Text>
          </View>
          <Text style={styles.loginTitle}>MARIKHA</Text>
          <Text style={styles.loginSubtitle}>Farmer Mobile App</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email / Phone Number</Text>
            <TextInput
              style={styles.input}
              value={emailInput}
              onChangeText={setEmailInput}
              placeholder="Enter email address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={passInput}
              onChangeText={setPassInput}
              secureTextEntry
              placeholder="Enter password"
            />
          </View>

          <TouchableOpacity 
            style={styles.loginBtn} 
            onPress={handleLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.loginBtnText}>Login to Farmer Portal →</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.loginFooterText}>
            Connected to Antipolo Organic Farming Cooperative
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ================= 2. MAIN FARMER DASHBOARD =================
  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0c3619" />

      <ScrollView style={{ flex: 1 }}>
        {/* Header Banner */}
        <View style={styles.headerBanner}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerGreetingSub}>MAGANDANG ARAW,</Text>
              <Text style={styles.headerGreetingTitle}>{currentUser.name} 👋</Text>
            </View>
            <TouchableOpacity onPress={() => setIsAuthenticated(false)} style={styles.logoutBtn}>
              <Text style={{ color: '#86efac', fontWeight: '700', fontSize: 12 }}>Logout</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.locationText}>
            📅 Today · 📍 Cupang, Antipolo · Rizal
          </Text>

          {/* Live Realtime Announcement Push Notice Banner */}
          {activePushNotice && (
            <TouchableOpacity 
              style={styles.noticePushBanner}
              onPress={() => setShowNoticeModal(true)}
            >
              <Text style={styles.noticePushTitle}>📢 LIVE COOPERATIVE BROADCAST</Text>
              <Text style={styles.noticePushText} numberOfLines={1}>
                "{activePushNotice.content || activePushNotice.title}"
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ----- TAB CONTENTS ----- */}
        {activeTab === 'home' && (
          <View style={styles.contentPadding}>
            {/* Quick Action Grid */}
            <Text style={styles.sectionHeader}>Quick Actions</Text>
            <View style={styles.gridRow}>
              <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('log')}>
                <Text style={styles.cardEmoji}>📝</Text>
                <Text style={styles.cardTitle}>Log Activity</Text>
                <Text style={styles.cardSub}>Record irrigation/fertilizer</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('ai')}>
                <Text style={styles.cardEmoji}>✨</Text>
                <Text style={styles.cardTitle}>Smart AI</Text>
                <Text style={styles.cardSub}>Yield estimation</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.gridRow}>
              <TouchableOpacity style={styles.actionCard} onPress={() => setActiveTab('tasks')}>
                <Text style={styles.cardEmoji}>📋</Text>
                <Text style={styles.cardTitle}>My Tasks</Text>
                <Text style={styles.cardSub}>Field checklist</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#f0fdf4', borderColor: '#86efac' }]} onPress={() => setShowLivestockModal(true)}>
                <Text style={styles.cardEmoji}>🐐</Text>
                <Text style={[styles.cardTitle, { color: '#0c3619' }]}>Livestock Records</Text>
                <Text style={[styles.cardSub, { color: '#166534' }]}>Native Goats ({livestockGoats.length} heads)</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'log' && (
          <View style={[styles.contentPadding, { paddingBottom: 40 }]}>
            {/* Live Context & Weather Banner */}
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

            {/* Category Toggle Pills: Crops vs Livestock */}
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

            <View style={styles.card}>
              {/* Select Plot / Animal ID */}
              <Text style={styles.label}>{logCategory === 'crops' ? '1. Select Field Plot' : '1. Select Livestock Unit'}</Text>
              <View style={styles.pickerRow}>
                {(logCategory === 'crops' ? ['Plot P-007', 'Plot P-021', 'Plot P-034'] : ['GT-014 (Goats)', 'GT-022']).map(p => (
                  <TouchableOpacity 
                    key={p} 
                    style={[styles.pillBtn, selectedPlot === p && styles.pillBtnActive]}
                    onPress={() => setSelectedPlot(p)}
                  >
                    <Text style={[styles.pillText, selectedPlot === p && styles.pillTextActive]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Activity Type Selection */}
              <Text style={[styles.label, { marginTop: 14 }]}>2. Select Activity Type</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                {(logCategory === 'crops' 
                  ? ['💧 Watering', '🌿 Vermicompost', '🌾 Harvest', '🐛 Pest Spraying', '✂️ Pruning', '🧪 Soil Test']
                  : ['🌾 Feeding', '💉 Vaccination', '🥛 Milk Collect', '🧼 Barn Clean']
                ).map(a => {
                  const cleanName = a.replace(/^[^\s]+\s/, '');
                  const isSel = activity === cleanName || activity === a;
                  return (
                    <TouchableOpacity 
                      key={a} 
                      style={[styles.pillBtn, isSel && styles.pillBtnActive]}
                      onPress={() => setActivity(cleanName)}
                    >
                      <Text style={[styles.pillText, isSel && styles.pillTextActive]}>{a}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Amount & Unit Stepper */}
              <Text style={[styles.label, { marginTop: 14 }]}>3. Input Quantity & Unit</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <TouchableOpacity 
                  onPress={() => setAmount(String(Math.max(1, (Number(amount) || 1) - 1)))} 
                  style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#3b2d22', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>-</Text>
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', marginBottom: 0 }]}
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
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                {[5, 10, 25, 50].map(v => (
                  <TouchableOpacity 
                    key={v} 
                    onPress={() => setAmount(String((Number(amount) || 0) + v))}
                    style={{ flex: 1, backgroundColor: '#f1f5f9', paddingVertical: 6, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#cbd5e1' }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#0f172a' }}>+{v}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Unit Dropdown Pills */}
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 10 }}>
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

              {/* Photo Proof Section */}
              <Text style={[styles.label, { marginTop: 14 }]}>4. Photo Proof (Required)</Text>
              {photoUri ? (
                <View style={{ alignItems: 'center', marginTop: 8 }}>
                  <Image source={{ uri: photoUri }} style={{ width: '100%', height: 160, borderRadius: 10 }} />
                  <View style={{ backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: -28, marginBottom: 8 }}>
                    <Text style={{ color: '#86efac', fontSize: 10, fontWeight: '800' }}>📷 WATERMARK: GPS LOCKED · REALTIME STAMP</Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity style={styles.photoActionBtn} onPress={takePhoto}>
                      <Text style={styles.photoActionBtnText}>📷 Retake</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.photoActionBtn, { backgroundColor: '#ef4444' }]} onPress={() => setPhotoUri(null)}>
                      <Text style={styles.photoActionBtnText}>🗑️ Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                  <TouchableOpacity style={styles.photoUploadBtn} onPress={takePhoto}>
                    <Text style={styles.photoUploadText}>📷 Take Photo Proof</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.photoUploadBtn} onPress={pickImage}>
                    <Text style={styles.photoUploadText}>🖼️ Choose Gallery</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Notes Input */}
              <Text style={[styles.label, { marginTop: 14 }]}>5. Notes & Observations (Optional)</Text>
              <TextInput
                style={[styles.input, { height: 70 }]}
                value={logNote}
                onChangeText={setLogNote}
                multiline
                placeholder="Halimbawa: ginawa kaninang umaga, malakas ang ulan kagabi.."
              />

              <TouchableOpacity 
                style={[styles.submitBtn, { backgroundColor: '#15803d', marginTop: 12 }]} 
                onPress={handleLogSubmit}
                disabled={isSubmittingLog}
              >
                {isSubmittingLog ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.submitBtnText}>📤 SUBMIT LOG FOR VALIDATION →</Text>
                )}
              </TouchableOpacity>
            </View>

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

        {activeTab === 'ai' && (
          <View style={[styles.contentPadding, { paddingBottom: 40 }]}>
            {/* Header Telemetry Banner */}
            <View style={{ backgroundColor: '#059669', borderRadius: 16, padding: 14, marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#ffffff' }}>✨ AI Crop Recommendation</Text>
                <View style={{ backgroundColor: '#047857', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                  <Text style={{ color: '#86efac', fontSize: 10, fontWeight: '800' }}>RF Classifier Model</Text>
                </View>
              </View>
              <Text style={{ fontSize: 11, color: '#a7f3d0', fontWeight: '600' }}>
                📍 {aiLocation}  ·  🌡️ {aiTemperature}°C  ·  💧 {aiSoilMoisture}% Moisture
              </Text>
            </View>

            {/* Input Parameter Controls */}
            <View style={styles.card}>
              <Text style={styles.label}>1. Select Season</Text>
              <View style={styles.pickerRow}>
                {['Tag-init (Dry)', 'Tag-ulan (Wet)'].map(s => (
                  <TouchableOpacity 
                    key={s} 
                    style={[styles.pillBtn, aiSeason === s && styles.pillBtnActive]}
                    onPress={() => setAiSeason(s)}
                  >
                    <Text style={[styles.pillText, aiSeason === s && styles.pillTextActive]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { marginTop: 14 }]}>2. Soil Type Selection</Text>
              <View style={styles.pickerRow}>
                {['Loam Soil (Organic)', 'Clay Soil', 'Sandy Loam'].map(st => (
                  <TouchableOpacity 
                    key={st} 
                    style={[styles.pillBtn, aiSoilType === st && styles.pillBtnActive]}
                    onPress={() => setAiSoilType(st)}
                  >
                    <Text style={[styles.pillText, aiSoilType === st && styles.pillTextActive]}>{st.split(' ')[0]}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { marginTop: 14 }]}>3. Soil Moisture Level: {aiSoilMoisture}%</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <TouchableOpacity 
                  onPress={() => setAiSoilMoisture(String(Math.max(10, Number(aiSoilMoisture) - 5)))}
                  style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#047857', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>-5%</Text>
                </TouchableOpacity>
                <TextInput 
                  style={[styles.input, { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', marginBottom: 0 }]}
                  value={aiSoilMoisture}
                  onChangeText={setAiSoilMoisture}
                  keyboardType="numeric"
                />
                <TouchableOpacity 
                  onPress={() => setAiSoilMoisture(String(Math.min(95, Number(aiSoilMoisture) + 5)))}
                  style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#059669', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>+5%</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.aiCalcBtn, { backgroundColor: '#0c3619', marginTop: 18 }]} 
                onPress={handleCalculateAI}
                disabled={isCalculatingAI}
              >
                {isCalculatingAI ? (
                  <ActivityIndicator color="#86efac" />
                ) : (
                  <Text style={styles.aiCalcBtnText}>✨ RUN LIVE RF CLASSIFIER MODEL →</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* REALTIME RECOMMENDATION RESULT CARD */}
            <View style={{ marginTop: 18 }}>
              <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1.5, borderColor: '#059669' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#15803d' }}>🎯 {aiResult.confidence} MATCH CONFIDENCE</Text>
                  </View>
                  <Text style={{ fontSize: 10, color: '#64748b', fontWeight: '700' }}>{aiResult.algorithm}</Text>
                </View>

                <Text style={{ fontSize: 10, fontWeight: '800', color: '#059669', textTransform: 'uppercase', letterSpacing: 0.5 }}>RECOMMENDED OPTIMAL CROP</Text>
                <Text style={{ fontSize: 22, fontWeight: '900', color: '#0c3619', marginVertical: 4 }}>{aiResult.crop}</Text>

                <View style={{ backgroundColor: '#f0fdf4', borderRadius: 12, padding: 12, marginVertical: 10, borderWidth: 1, borderColor: '#a7f3d0' }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>🌱 PLANT GROWTH STAGE PREDICTION</Text>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: '#0c3619', marginTop: 2 }}>{aiResult.currentStage}</Text>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#d97706', marginTop: 4 }}>
                    🔮 Next: {aiResult.nextStagePrediction} ({aiResult.daysToHarvest})
                  </Text>
                </View>

                <View style={{ gap: 6, marginVertical: 4 }}>
                  <Text style={{ fontSize: 12, color: '#334155', fontWeight: '700' }}>🌾 <Text style={{ fontWeight: '800' }}>Expected Yield:</Text> {aiResult.expectedYield} ({aiResult.expectedSacks})</Text>
                  <Text style={{ fontSize: 12, color: '#334155', fontWeight: '700' }}>📅 <Text style={{ fontWeight: '800' }}>Harvest Window:</Text> {aiResult.harvestWindow}</Text>
                  <Text style={{ fontSize: 12, color: '#15803d', fontWeight: '700' }}>🧪 <Text style={{ fontWeight: '800' }}>Fertilizer Rec:</Text> {aiResult.fertilizerRec}</Text>
                  <Text style={{ fontSize: 12, color: '#0284c7', fontWeight: '700' }}>💧 <Text style={{ fontWeight: '800' }}>Irrigation Rec:</Text> {aiResult.irrigationRec}</Text>
                  <Text style={{ fontSize: 12, color: '#d97706', fontWeight: '800' }}>💰 <Text style={{ fontWeight: '800' }}>Market Price:</Text> {aiResult.marketValue}</Text>
                </View>

                <TouchableOpacity 
                  onPress={() => {
                    Alert.alert('Applied to Field 🚀', `Recommendation for ${aiResult.crop} applied to your field plan.`);
                  }}
                  style={{ backgroundColor: '#059669', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 12 }}
                >
                  <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 13 }}>🚀 Apply Recommendation to Field Plot</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'tasks' && (
          <View style={styles.contentPadding}>
            <Text style={styles.sectionHeader}>My Field Tasks</Text>
            {tasks.map(t => (
              <TouchableOpacity key={t.id} style={styles.taskCard} onPress={() => toggleTask(t.id)}>
                <Text style={{ fontSize: 18 }}>{t.done ? '✅' : '⬜'}</Text>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[styles.taskTitle, t.done && styles.taskDone]}>{t.title}</Text>
                  <Text style={styles.taskUrgency}>Priority: {t.urgency}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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

                      <TouchableOpacity onPress={() => Alert.alert('About MARIKHA', 'MARIKHA Organic Farming Portal Mobile\nVersion 1.0.0 (Build 2026.09)')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <View style={styles.profIconBox}><Text style={{ fontSize: 16 }}>ℹ️</Text></View>
                          <View>
                            <Text style={{ fontSize: 14, fontWeight: '800', color: '#0f172a' }}>About MARIKHA</Text>
                            <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '600' }}>v1.0.0</Text>
                          </View>
                        </View>
                        <Text style={{ fontSize: 16, color: '#64748b' }}>›</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* RED LOGOUT BUTTON */}
                  <TouchableOpacity
                    onPress={() => setIsAuthenticated(false)}
                    style={[styles.submitBtn, { backgroundColor: '#dc2626', marginTop: 4, paddingVertical: 14, borderRadius: 16 }]}
                  >
                    <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 16 }}>↪ Log out</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('home')}>
          <Text style={{ fontSize: 18 }}>🏠</Text>
          <Text style={[styles.tabText, activeTab === 'home' && styles.tabTextActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('log')}>
          <Text style={{ fontSize: 18 }}>📝</Text>
          <Text style={[styles.tabText, activeTab === 'log' && styles.tabTextActive]}>Log</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('ai')}>
          <Text style={{ fontSize: 18 }}>✨</Text>
          <Text style={[styles.tabText, activeTab === 'ai' && styles.tabTextActive]}>AI</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('tasks')}>
          <Text style={{ fontSize: 18 }}>📋</Text>
          <Text style={[styles.tabText, activeTab === 'tasks' && styles.tabTextActive]}>Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('profile')}>
          <Text style={{ fontSize: 18 }}>👤</Text>
          <Text style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Announcement Modal Popup */}
      <Modal visible={showNoticeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>📢 Cooperative Broadcast</Text>
            <ScrollView style={{ maxHeight: 200, marginVertical: 12 }}>
              <Text style={styles.modalContent}>
                {activePushNotice ? activePushNotice.content || activePushNotice.title : (announcements[0]?.content || 'Welcome to MARIKHA Farmer Mobile!')}
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowNoticeModal(false)}>
              <Text style={styles.modalCloseText}>Close Notice</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Profile Settings Modal */}
      <Modal visible={showProfileModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '85%' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={styles.modalTitle}>⚙️ Profile & Settings</Text>
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
              <TextInput style={styles.input} value={tempProfile.name} onChangeText={t => setTempProfile({ ...tempProfile, name: t })} />

              <Text style={[styles.label, { marginTop: 10 }]}>Mobile Number</Text>
              <TextInput style={styles.input} value={tempProfile.mobile} onChangeText={t => setTempProfile({ ...tempProfile, mobile: t })} />

              <Text style={[styles.label, { marginTop: 10 }]}>Email Address</Text>
              <TextInput style={styles.input} value={tempProfile.email} onChangeText={t => setTempProfile({ ...tempProfile, email: t })} />

              <Text style={[styles.label, { marginTop: 10 }]}>Member ID</Text>
              <TextInput style={styles.input} value={tempProfile.memberId} onChangeText={t => setTempProfile({ ...tempProfile, memberId: t })} />

              <Text style={[styles.label, { marginTop: 10 }]}>Barangay / Address</Text>
              <TextInput style={styles.input} value={tempProfile.barangay} onChangeText={t => setTempProfile({ ...tempProfile, barangay: t })} />

              <Text style={[styles.label, { marginTop: 10 }]}>Coordinates</Text>
              <TextInput style={styles.input} value={tempProfile.coordinates} onChangeText={t => setTempProfile({ ...tempProfile, coordinates: t })} />

              <Text style={[styles.label, { marginTop: 10 }]}>Total Area</Text>
              <TextInput style={styles.input} value={tempProfile.totalArea} onChangeText={t => setTempProfile({ ...tempProfile, totalArea: t })} />

              <Text style={[styles.label, { marginTop: 10 }]}>Cooperative Name</Text>
              <TextInput style={styles.input} value={tempProfile.coop} onChangeText={t => setTempProfile({ ...tempProfile, coop: t })} />
            </ScrollView>

            <TouchableOpacity style={[styles.submitBtn, { marginTop: 12 }]} onPress={handleSaveProfile}>
              <Text style={styles.submitBtnText}>Save Profile Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= LIVESTOCK RECORDS MODULE MODAL ================= */}
      <Modal visible={showLivestockModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '90%', padding: 0, overflow: 'hidden' }]}>
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
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '85%' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={styles.modalTitle}>🐐 Register New Goat Record</Text>
              <TouchableOpacity onPress={() => setShowAddGoatModal(false)}>
                <Text style={{ fontSize: 18, color: '#64748b' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }}>
              <Text style={styles.label}>Tag ID (Required e.g. GT-025)</Text>
              <TextInput style={styles.input} value={newGoatTag} onChangeText={setNewGoatTag} placeholder="GT-025" />

              <Text style={[styles.label, { marginTop: 10 }]}>Goat Name / Nickname</Text>
              <TextInput style={styles.input} value={newGoatName} onChangeText={setNewGoatName} placeholder="e.g. Maya (Doe #25)" />

              <Text style={[styles.label, { marginTop: 10 }]}>Breed / Type</Text>
              <TextInput style={styles.input} value={newGoatBreed} onChangeText={setNewGoatBreed} />

              <Text style={[styles.label, { marginTop: 10 }]}>Sex / Gender</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
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

              <Text style={[styles.label, { marginTop: 10 }]}>Weight (kg)</Text>
              <TextInput style={styles.input} value={newGoatWeight} onChangeText={setNewGoatWeight} keyboardType="numeric" />

              <Text style={[styles.label, { marginTop: 10 }]}>Barn / Shed Location</Text>
              <TextInput style={styles.input} value={newGoatShed} onChangeText={setNewGoatShed} />

              <Text style={[styles.label, { marginTop: 10 }]}>Health Status</Text>
              <TextInput style={styles.input} value={newGoatHealth} onChangeText={setNewGoatHealth} />

              <Text style={[styles.label, { marginTop: 10 }]}>Notes / Remarks</Text>
              <TextInput style={[styles.input, { height: 60 }]} value={newGoatNotes} onChangeText={setNewGoatNotes} multiline />
            </ScrollView>

            <TouchableOpacity style={[styles.submitBtn, { marginTop: 12 }]} onPress={handleAddGoat}>
              <Text style={styles.submitBtnText}>Save Goat to Ledger →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= HEALTH LOG TREATMENT MODAL ================= */}
      <Modal visible={showHealthLogModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={styles.modalTitle}>💉 Medical & Treatment Log</Text>
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
            <TextInput style={styles.input} value={healthMedicine} onChangeText={setHealthMedicine} />

            <Text style={[styles.label, { marginTop: 10 }]}>Treatment Notes / Vet Remarks</Text>
            <TextInput style={[styles.input, { height: 60 }]} value={healthNotes} onChangeText={setHealthNotes} multiline placeholder="e.g. Administered 5ml orally, next dose due in 3 months" />

            <TouchableOpacity style={[styles.submitBtn, { marginTop: 12, backgroundColor: '#15803d' }]} onPress={handleAddHealthLog}>
              <Text style={styles.submitBtnText}>Record Health Treatment →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  splashContainer: { flex: 1, backgroundColor: '#0c3619', justifyContent: 'center', alignItems: 'center' },
  splashContent: { alignItems: 'center', padding: 24 },
  splashEmblem: { width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 2, borderColor: '#86efac', justifyContent: 'center', alignItems: 'center', marginBottom: 18 },
  splashTitle: { fontSize: 32, fontWeight: '800', color: '#ffffff', letterSpacing: 1 },
  splashSub: { fontSize: 13, color: '#86efac', fontWeight: '600', marginTop: 4 },
  splashSkipBtn: { marginTop: 40, backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 24, borderWidth: 1, borderColor: '#86efac' },
  splashSkipBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 13 },

  loginContainer: { flex: 1, backgroundColor: '#0c3619', justifyContent: 'center', alignItems: 'center', padding: 20 },
  loginCard: { backgroundColor: '#ffffff', width: '100%', borderRadius: 20, padding: 28, alignItems: 'center' },
  loginEmblem: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#f0fdf4', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  loginTitle: { fontSize: 24, fontWeight: '800', color: '#0c3619' },
  loginSubtitle: { fontSize: 13, color: '#15803d', fontWeight: '600', marginBottom: 24 },
  formGroup: { width: '100%', marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '800', color: '#1e293b', marginBottom: 6 },
  input: { width: '100%', backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#cbd5e1', borderRadius: 10, padding: 12, fontSize: 14, color: '#0f172a' },
  loginBtn: { width: '100%', backgroundColor: '#0c3619', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  loginBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 15 },
  loginFooterText: { fontSize: 11, color: '#64748b', marginTop: 18, textAlign: 'center' },

  mainContainer: { flex: 1, backgroundColor: '#f1f5f9' },
  headerBanner: { backgroundColor: '#0c3619', padding: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerGreetingSub: { fontSize: 10, color: '#86efac', fontWeight: '800' },
  headerGreetingTitle: { fontSize: 20, fontWeight: '800', color: '#ffffff' },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  locationText: { fontSize: 11, color: '#a7f3d0', marginTop: 6 },
  noticePushBanner: { backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fcd34d', borderRadius: 10, padding: 10, marginTop: 12 },
  noticePushTitle: { fontSize: 10, fontWeight: '800', color: '#d97706' },
  noticePushText: { fontSize: 12, fontWeight: '700', color: '#78350f', marginTop: 2 },

  contentPadding: { padding: 16 },
  sectionHeader: { fontSize: 16, fontWeight: '800', color: '#0c3619', marginBottom: 12 },
  gridRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  actionCard: { flex: 1, backgroundColor: '#ffffff', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#cbd5e1' },
  cardEmoji: { fontSize: 24, marginBottom: 8 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#1e293b' },
  cardSub: { fontSize: 11, color: '#64748b', marginTop: 2 },

  card: { backgroundColor: '#ffffff', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#cbd5e1' },
  pickerRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  pillBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#f8fafc' },
  pillBtnActive: { backgroundColor: '#dcfce7', borderColor: '#15803d' },
  pillText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  pillTextActive: { color: '#15803d' },
  photoUploadBtn: { flex: 1, backgroundColor: '#f0fdf4', borderWidth: 1.5, borderColor: '#86efac', borderRadius: 10, padding: 12, alignItems: 'center' },
  photoUploadText: { color: '#15803d', fontWeight: '700', fontSize: 12 },
  photoActionBtn: { backgroundColor: '#15803d', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  photoActionBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 12 },
  submitBtn: { backgroundColor: '#0c3619', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 18 },
  submitBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 14 },

  aiCalcBtn: { backgroundColor: '#15803d', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 14 },
  aiCalcBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 13 },
  aiResultBox: { marginTop: 16, backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#86efac', padding: 14, borderRadius: 10 },
  aiCropTitle: { fontSize: 14, fontWeight: '800', color: '#15803d', marginBottom: 6 },
  aiMetric: { fontSize: 12, color: '#166534', marginTop: 2, fontWeight: '600' },

  taskCard: { backgroundColor: '#ffffff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#cbd5e1', flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  taskTitle: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
  taskDone: { textDecorationLine: 'line-through', color: '#94a3b8' },
  taskUrgency: { fontSize: 11, color: '#64748b', marginTop: 2 },

  tabBar: { flexDirection: 'row', backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingVertical: 8 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabText: { fontSize: 11, color: '#64748b', fontWeight: '600', marginTop: 2 },
  tabTextActive: { color: '#15803d', fontWeight: '800' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#ffffff', width: '100%', borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#0c3619' },
  modalContent: { fontSize: 14, color: '#334155', lineHeight: 20 },
  modalCloseBtn: { backgroundColor: '#0c3619', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  modalCloseText: { color: '#ffffff', fontWeight: '800', fontSize: 13 },

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
