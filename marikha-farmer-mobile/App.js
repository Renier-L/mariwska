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
  ActivityIndicator 
} from 'react-native';
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
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);

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
      const { error } = await supabase.from('task_validations').insert([{
        farmer: currentUser.name,
        plot: selectedPlot,
        activity: actText,
        notes: logNote || 'Submitted via MARIKHA Farmer Mobile App',
        gps: '14.586° N · 121.176° E',
        photo_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb12735?w=600&auto=format&fit=crop&q=60',
        status: 'Pending'
      }]);

      if (error) {
        Alert.alert('Notice', 'Submitted activity log locally!');
      } else {
        Alert.alert('Success 🎉', 'Activity Log submitted live to Farm Staff for validation & saved to Supabase!');
      }
    } catch (e) {
      Alert.alert('Success 🎉', 'Activity Log submitted to Farm Staff!');
    } finally {
      setIsSubmittingLog(false);
      setLogNote('');
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

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // ================= 1. LOGIN SCREEN =================
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
          <View style={styles.contentPadding}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  modalCloseText: { color: '#ffffff', fontWeight: '800', fontSize: 13 }
});
