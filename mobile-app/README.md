# MARIKHA Native Android / iOS Mobile Application

This repository contains the standalone React Native & Expo mobile application for **MARIKHA: Agricultural Management Information System**.

## Features
- **Live Supabase Synchronization**: Real-time push alerts & activity log syncing.
- **Native Android Camera & Image Picker**: Take photo proof directly on field plots.
- **AI Recommendation Engine**: Random Forest classifier suitability & yield prediction.
- **Offline & Low-Bandwidth Mode**: Retains entries locally and syncs to cloud.

## Quick Start (Run on Android Device / Emulator)

1. **Install Dependencies**:
   ```bash
   cd mobile-app
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npx expo start
   ```

3. **Run on Android Emulator or Physical Device**:
   - Press `a` in terminal to run on connected Android Emulator / Device.
   - Or scan the QR code using the **Expo Go** app on Android.

4. **Build Android APK Bundle**:
   ```bash
   npx eas build -p android --profile preview
   ```
