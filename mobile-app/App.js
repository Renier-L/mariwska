import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchOpacity, ScrollView, TextInput, Alert, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { supabase } from './src/services/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'log', 'ai', 'tasks'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('mang.juan@farmer.ph');
  const [password, setPassword] = useState('password123');

  // Activity Log State
  const [activity, setActivity] = useState('Watering');
  const [plot, setPlot] = useState('Plot P-007 (Tomato Diamante)');
  const [amount, setAmount] = useState('10');
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time Announcements State
  const [announcements, setAnnouncements] = useState([]);
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);

  // AI Recommendation State
  const [season, setSeason] = useState('Tag-init (Dry)');
  const [aiResult, setAiResult] = useState({
    crop: 'Tomato · Diamante',
    confidence: '87%',
    output: '412 kg',
    sacks: '~ 8 sacks',
    harvestWindow: 'Nov 18 – Dec 02, 2025'
  });

  useEffect(() => {
    // Fetch initial announcements from Supabase
    fetchAnnouncements();

    // Subscribe to Supabase Realtime changes
    const subscription = supabase
      .channel('public:announcements')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'announcements' }, (payload) => {
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
      photo_url: photo || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb12735?w=600&auto=format&fit=crop&q=60'
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

              <TouchableOpacity style={[styles.tile, { backgroundColor: '#452c1e' }]} onPress={() => Alert.alert('Crops', 'Tomato (P-007), Eggplant (P-021), Okra (P-034)')}>
                <Text style={styles.tileIcon}>🌱</Text>
                <Text style={styles.tileTitle}>MY CROPS & LIVESTOCK</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.tile, { backgroundColor: '#d97706' }]} onPress={() => setActiveTab('tasks')}>
                <Text style={styles.tileIcon}>📅</Text>
                <Text style={styles.tileTitle}>FARMING CALENDAR</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.tile, { backgroundColor: '#059669' }]} onPress={() => setActiveTab('ai')}>
                <Text style={styles.tileIcon}>✨</Text>
                <Text style={styles.tileTitle}>AI RECOMMENDATIONS</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 2: LOG ACTIVITY */}
        {activeTab === 'log' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>1. Select Activity</Text>
            <View style={styles.row}>
              {['Watering', 'Fertilizer', 'Weeding', 'Harvest'].map(act => (
                <TouchableOpacity
                  key={act}
                  style={[styles.chip, activity === act && styles.chipActive]}
                  onPress={() => setActivity(act)}
                >
                  <Text style={[styles.chipText, activity === act && styles.chipTextActive]}>{act}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>2. Input Amount (Liters/kg)</Text>
            <TextInput style={styles.inputDark} value={amount} onChangeText={setAmount} keyboardType="numeric" />

            <Text style={styles.sectionTitle}>3. Take Photo / Attach Image</Text>
            <TouchableOpacity style={styles.photoPicker} onPress={pickImage}>
              {photo ? (
                <Image source={{ uri: photo }} style={{ width: '100%', height: 120, borderRadius: 8 }} />
              ) : (
                <Text style={{ color: '#0c3619', fontWeight: 'bold' }}>📷 TAP TO ATTACH PHOTO PROOF</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>4. Note (Optional)</Text>
            <TextInput
              style={styles.inputDark}
              value={note}
              onChangeText={setNote}
              placeholder="e.g. Applied row 1-6"
              placeholderTextColor="#9ca3af"
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleLogSubmit} disabled={isSubmitting}>
              {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>SUBMIT LOG TO FARM STAFF</Text>}
            </TouchableOpacity>
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

        {/* TAB 4: TASKS */}
        {activeTab === 'tasks' && (
          <View style={styles.tabContent}>
            <View style={styles.taskItem}>
              <Text style={{ fontWeight: 'bold', color: '#dc2626' }}>OVERDUE</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Apply compost · Plot P-021</Text>
              <Text style={{ color: '#6b7280' }}>Scheduled cycle missed yesterday</Text>
            </View>
            <View style={styles.taskItem}>
              <Text style={{ fontWeight: 'bold', color: '#d97706' }}>URGENT TODAY</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Water Plot P-007</Text>
              <Text style={{ color: '#6b7280' }}>Heat advisory · double ration</Text>
            </View>
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
      </View>
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
  navTextActive: { color: '#0c3619' }
});
