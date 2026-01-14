# Natural Disaster Without Network

An offline-first Next.js application for emergency disaster management that works completely without internet or mobile network connectivity.

## 🎯 Overview

This app is designed to function entirely offline, making it perfect for disaster scenarios where network connectivity may be unavailable. All data is stored locally using browser storage technologies, and the app uses Service Workers to cache all resources.

## ✨ Features

### 🆘 SOS Emergency Messages
### 💬 Offline Messaging
### ⚠️ Disaster Alerts
### 📍 Location & Map 
## 🛠️ Tech Stack

- **Next.js 16** (App Router) - React framework
- **JavaScript** - No TypeScript dependencies
- **Tailwind CSS** - Styling
- **Service Workers** - Offline caching
- **LocalStorage** - Data persistence
- **IndexedDB** - Ready for future expansion

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd natural-disaster-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## 📱 How Offline Functionality Works

### Service Worker
- **Location**: `public/sw.js`
- Caches all pages and assets on first visit
- Serves cached content when offline
- Automatically registered on app load

### Data Storage
- **LocalStorage**: Used for all data persistence
  - SOS Messages: `sos_messages`
  - Messages: `messages`
  - Disaster Alerts: `disaster_alerts`
  - User Location: `user_location`

### Offline-First Architecture
1. **No External APIs**: The app doesn't depend on any external services
2. **Local Storage**: All data is stored in the browser
3. **Service Worker Caching**: All pages and assets are cached
4. **Simulated Communication**: Messages simulate nearby users locally

## 🧪 Testing Offline Mode

### Chrome DevTools Method:
1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Select **Offline** from the throttling dropdown
4. Refresh the page - the app should still work!

### Browser Settings:
1. Turn off Wi-Fi and mobile data
2. The app will continue to function
3. All features remain accessible

## 📂 Project Structure

```
natural-disaster-app/
├── app/
│   ├── api/              # API routes (offline)
│   │   ├── sos/
│   │   ├── messages/
│   │   └── alerts/
│   ├── sos/              # SOS Emergency page
│   ├── messages/         # Messages page
│   ├── alerts/           # Disaster Alerts page
│   ├── location/         # Location & Map page
│   ├── layout.js         # Root layout
│   ├── page.js           # Dashboard/home page
│   └── globals.css       # Global styles
├── lib/
│   ├── storage.js        # LocalStorage utilities
│   └── serviceWorker.js  # Service Worker registration
├── public/
│   ├── sw.js             # Service Worker script
│   └── manifest.json     # PWA manifest
└── README.md
```




## 📝 Usage Examples

### Creating an SOS Message:
1. Navigate to "SOS Emergency"
2. Click "Create SOS Message"
3. Fill in the form
4. Click "Send SOS"
5. Message is saved locally and persists after refresh

### Sending a Message:
1. Navigate to "Offline Messages"
2. Click "Send Message"
3. Select a simulated user
4. Type your message
5. Message is saved locally

### Creating an Alert:
1. Navigate to "Disaster Alerts"
2. Click "Create Alert"
3. Select disaster type and fill details
4. Alert is saved and displayed

## 🔒 Privacy & Security

- All data stays on your device
- No data is sent to external servers
- No tracking or analytics
- Completely private and secure

## 🚧 Limitations & Future Enhancements

### Current Limitations:
- Simulated messaging (not real peer-to-peer)
- Text-based map (no real map tiles)
- No real-time synchronization

### Potential Enhancements:
- IndexedDB for larger data storage
- WebRTC for real peer-to-peer messaging
- Offline map tiles caching
- Export/import data functionality
- Multiple language support



---

**Remember**: This app works completely offline. Turn off your internet and try it! 🌐➡️📴
