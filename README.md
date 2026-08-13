# 🌐 BuildVerse — Developer Operating System & Mobile App

**BuildVerse** is a modern, high-performance Developer Operating System featuring a React Native mobile application and Node.js + MongoDB backend infrastructure.

---

## ✨ Features

- 🌓 **Dynamic Light & Dark Theme Mode**: High-contrast, glassmorphic UI with full theme toggle.
- 📦 **Full Project CRUD & To-Do Tracker**:
  - Create, read, update, complete (`Complete Project ✓`), and delete (`Delete Project Permanently`) projects.
  - Task priority management (`HIGH`, `MEDIUM`, `LOW`) with real-time status toggling.
- 👥 **Team Member Invitations & Auto Group Chat**:
  - Multi-select team member invitation system with `Accept Invite ✓` workflow.
  - Automatic creation of dedicated project team group chats (`<Project Name> Team`).
- 💬 **WhatsApp-Style Community Hub & Trending Forum**:
  - Direct messaging, team channels, and community topic discussion forums (`+ New Topic`).
- 🎓 **PDF Certificate Diploma Generator**:
  - View and download official BuildVerse completion certificates in PDF format.
- 🐙 **GitHub OAuth Auth & Live Repos Sync**:
  - Interactive GitHub login with live repository reflection (`Lumina Engine`, `Synapse CLI`, etc.).

---

## 🚀 Quick Start with Docker (Backend & DB)

To run the complete backend API and MongoDB database on any PC using Docker:

### 1. Run Docker Compose
```bash
docker-compose up --build
```
This automatically starts:
- **MongoDB**: Listening on `localhost:27017`
- **BuildVerse API Server**: Listening on `localhost:5000`

---

## 📱 Running the Mobile App

### 1. Navigate to Mobile Directory
```bash
cd mobile
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Expo Dev Server
```bash
npm start
```
- Press **`a`** to open in Android Emulator / Device via Expo Go.
- Press **`w`** to open in Web Browser.

---

## 📁 Repository Structure

```
├── backend/                  # Node.js + Express API & MongoDB Models
│   ├── src/
│   │   ├── config/           # Database & Environment configuration
│   │   ├── controllers/      # API Controllers
│   │   ├── models/           # Mongoose Data Models
│   │   └── routes/           # REST Route Definitions
│   └── Dockerfile            # Container build recipe
├── mobile/                   # React Native (Expo SDK 51) Mobile App
│   ├── src/
│   │   ├── components/       # UI Components & GlassCard
│   │   ├── lib/              # API Client & Helpers
│   │   ├── navigation/       # React Navigation setup
│   │   ├── screens/          # App Screens & Modals
│   │   └── theme/            # Light & Dark Theme Tokens
├── docker-compose.yml        # Docker Multi-Container Orchestration
└── README.md                 # Project Documentation
```

---

## 🔒 License
Private / Proprietary — BuildVerse Platform.
