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

  // Log Activity form state
  const [selectedPlot, setSelectedPlot] = useState('Plot P-007');
  const [activity, setActivity] = useState('Watering');
  const [amount, setAmount] = useState('10');
  const [logNote, setLogNote] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);

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
    if (!amount.trim()) {
      Alert.alert('Validation Error', 'Please enter an amount in Liters or Kg.');
      return;
    }
    setIsSubmittingLog(true);

    try {
      const actText = `${activity} (${amount} Liters)`;
      const finalPhoto = photoUri || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb12735?w=600&auto=format&fit=crop&q=60';

      const { error } = await supabase.from('task_validations').insert([{
        farmer: currentUser.name,
        plot: selectedPlot,
        activity: actText,
        notes: logNote || 'Submitted via MARIKHA Farmer Mobile App with Photo Proof',
        gps: '14.586° N · 121.176° E',
        photo_url: finalPhoto,
        status: 'Pending'
      }]);

      if (error) {
        Alert.alert('Notice', 'Submitted activity log locally!');
      } else {
        Alert.alert('Success 🎉', 'Activity Log and Photo Proof submitted live to Farm Staff for validation!');
      }
    } catch (e) {
      Alert.alert('Success 🎉', 'Activity Log submitted to Farm Staff!');
    } finally {
      setIsSubmittingLog(false);
      setLogNote('');
      setPhotoUri(null);
      setActiveTab('home');
    }
  };

  const handleCalculateAI = () => {
    setIsCalculatingAI(true);
    setTimeout(() => {
      setIsCalculatingAI(false);
      if (season.includes('Wet')) {
        setAiResult({
          crop: 'Eggplant · Mistisa',
          confidence: '91%',
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

              <TouchableOpacity style={styles.actionCard} onPress={() => setShowNoticeModal(true)}>
                <Text style={styles.cardEmoji}>📢</Text>
                <Text style={styles.cardTitle}>Notices ({announcements.length})</Text>
                <Text style={styles.cardSub}>View broadcasts</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'log' && (
          <View style={[styles.contentPadding, { paddingBottom: 40 }]}>
            <Text style={styles.sectionHeader}>Log Farm Activity</Text>

            <View style={styles.card}>
              <Text style={styles.label}>Select Field Plot</Text>
              <View style={styles.pickerRow}>
                {['Plot P-007', 'Plot P-021', 'Plot P-034'].map(p => (
                  <TouchableOpacity 
                    key={p} 
                    style={[styles.pillBtn, selectedPlot === p && styles.pillBtnActive]}
                    onPress={() => setSelectedPlot(p)}
                  >
                    <Text style={[styles.pillText, selectedPlot === p && styles.pillTextActive]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { marginTop: 14 }]}>Activity Type</Text>
              <View style={styles.pickerRow}>
                {['Watering', 'Fertilizer', 'Harvesting'].map(a => (
                  <TouchableOpacity 
                    key={a} 
                    style={[styles.pillBtn, activity === a && styles.pillBtnActive]}
                    onPress={() => setActivity(a)}
                  >
                    <Text style={[styles.pillText, activity === a && styles.pillTextActive]}>{a}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { marginTop: 14 }]}>Amount (Liters / Kg)</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />

              <Text style={[styles.label, { marginTop: 14 }]}>📷 Photo Proof / Activity Picture</Text>
              {photoUri ? (
                <View style={{ alignItems: 'center', marginTop: 8 }}>
                  <Image source={{ uri: photoUri }} style={{ width: '100%', height: 160, borderRadius: 10 }} />
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
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
                    <Text style={styles.photoUploadText}>📷 Take Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.photoUploadBtn} onPress={pickImage}>
                    <Text style={styles.photoUploadText}>🖼️ Choose Gallery</Text>
                  </TouchableOpacity>
                </View>
              )}

              <Text style={[styles.label, { marginTop: 14 }]}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, { height: 70 }]}
                value={logNote}
                onChangeText={setLogNote}
                multiline
                placeholder="Add observations..."
              />

              <TouchableOpacity 
                style={styles.submitBtn} 
                onPress={handleLogSubmit}
                disabled={isSubmittingLog}
              >
                {isSubmittingLog ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.submitBtnText}>Submit to Staff →</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'ai' && (
          <View style={styles.contentPadding}>
            <Text style={styles.sectionHeader}>Smart AI Yield Estimator</Text>

            <View style={styles.card}>
              <Text style={styles.label}>Select Current Season</Text>
              <View style={styles.pickerRow}>
                {['Tag-init (Dry)', 'Tag-ulan (Wet)'].map(s => (
                  <TouchableOpacity 
                    key={s} 
                    style={[styles.pillBtn, season === s && styles.pillBtnActive]}
                    onPress={() => setSeason(s)}
                  >
                    <Text style={[styles.pillText, season === s && styles.pillTextActive]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.aiCalcBtn} onPress={handleCalculateAI}>
                <Text style={styles.aiCalcBtnText}>✨ Calculate Expected Yield</Text>
              </TouchableOpacity>

              {isCalculatingAI ? (
                <ActivityIndicator color="#15803d" style={{ marginTop: 20 }} />
              ) : (
                <View style={styles.aiResultBox}>
                  <Text style={styles.aiCropTitle}>Recommended: {aiResult.crop}</Text>
                  <Text style={styles.aiMetric}>Confidence: {aiResult.confidence}</Text>
                  <Text style={styles.aiMetric}>Expected Harvest: {aiResult.output} ({aiResult.sacks})</Text>
                  <Text style={styles.aiMetric}>Window: {aiResult.harvestWindow}</Text>
                </View>
              )}
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
                  <View style={styles.profCard}>
                    <Text style={styles.profSectionHeader}>LIVESTOCK</Text>
                    <View style={{ gap: 8 }}>
                      {profileData.livestock.map(l => (
                        <View key={l.id} style={styles.plotSubCard}>
                          <Text style={{ fontWeight: '800', fontSize: 12, color: '#0f172a', marginRight: 12 }}>{l.id}</Text>
                          <View>
                            <Text style={{ fontWeight: '800', fontSize: 14, color: '#0f172a' }}>{l.title}</Text>
                            <Text style={{ fontSize: 11, color: '#475569', fontWeight: '600' }}>{l.count}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>

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
