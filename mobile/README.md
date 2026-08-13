# 📱 Nexus Mobile App (React Native & Android Setup Guide)

Welcome to the **Nexus Mobile App** built with **React Native (Expo SDK 51)**. This guide is written specially for beginners to help you set up, test, run, and build the mobile app on Android step-by-step.

---

## 🌟 What is Built

The React Native mobile app brings full feature parity with the Nexus web platform:
- 🏠 **Home Landing Screen**: Hero banner, skills, mentors carousel, testimonials, and pricing card.
- 📊 **Dashboard Screen**: Active projects metric, resolved issues counter, weekly activity bar graph, and recent issues checklist.
- 🚀 **Projects Screen**: Project status filter tabs (All, Active, Completed), interactive progress bars, and "+ New Project" creation modal.
- 💬 **Community Chat Screen**: Multi-channel discussions (`#general`, `#design`, `#engineering`), message bubbles, and real-time message posting.
- 👤 **Profile Screen**: User profile card, role badges, stats summary, and account settings.
- 🔗 **Backend & Supabase Integration**: Realtime database connection to Supabase and API routes.

---

## 🚀 How to Run on Android (Step-by-Step for Beginners)

### Method 1: Run on Your Physical Android Phone (Fastest & Easiest ⭐)

1. **Install Expo Go on your Android Phone**:
   - Open **Google Play Store** on your mobile phone.
   - Search for **"Expo Go"** and install it.

2. **Start the Development Server on PC**:
   - Open Terminal / Command Prompt on your computer.
   - Navigate to the `mobile` folder:
     ```bash
     cd mobile
     ```
   - Install dependencies (first time only):
     ```bash
     npm install
     ```
   - Run the start command:
     ```bash
     npm start
     ```
   - A QR Code will appear in your computer terminal window.

3. **Scan and Open**:
   - Make sure your mobile phone and computer are connected to the **same Wi-Fi network**.
   - Open the **Expo Go** app on your phone, tap **"Scan QR Code"**, and scan the QR code from your computer terminal.
   - The app will build in ~10 seconds and launch on your phone screen with hot-reloading enabled!

---

### Method 2: Run on Android Studio Emulator (Windows PC)

1. **Install Android Studio** (if you don't have it):
   - Download & install [Android Studio](https://developer.android.com/studio).
   - Open Android Studio -> **Device Manager** -> Create a Virtual Device (e.g., Pixel 6 / Android 13 or 14).
   - Start the emulator.

2. **Launch App on Emulator**:
   - In your computer terminal inside `mobile/` folder, run:
     ```bash
     npm run android
     ```
   - Expo will automatically detect the running emulator and open the app.

---

### Method 3: Build an Installable APK (`.apk`) File for Android

If you want to create a standalone `.apk` file that anyone can install on an Android phone without Expo Go:

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo Account**:
   ```bash
   npx eas login
   ```

3. **Build Android APK**:
   ```bash
   npx eas build --platform android --profile preview
   ```
   - Expo will compile your project in the cloud and provide a direct download link for the `.apk` file!

---

## 🛠️ Project Structure Overview

```
mobile/
├── App.js                   # Root application entry point with safe area & navigation
├── package.json             # React Native & Expo dependencies
├── README.md                # Android setup instructions
└── src/
    ├── components/          # Reusable UI components
    │   ├── GlassCard.js     # Dark glassmorphism card primitive
    │   ├── ProjectCard.js   # Project card with progress bar
    │   ├── IssueItem.js     # Interactive checklist item
    │   └── CustomButton.js  # Touchable button with active states & loader
    ├── lib/
    │   ├── supabase.js      # Supabase client with AsyncStorage session
    │   └── api.js           # API endpoints & data helpers
    ├── navigation/
    │   └── AppNavigator.js  # Bottom tab navigator with custom icons
    ├── screens/
    │   ├── HomeScreen.js    # Landing page & features
    │   ├── DashboardScreen.js # Workspace analytics & activity
    │   ├── ProjectsScreen.js# Project management & modal
    │   ├── ChatScreen.js    # Community discussions & chat
    │   └── ProfileScreen.js # User account & stats
    └── theme.js             # Zinc dark color palette, font sizes, shadows & radius tokens
```