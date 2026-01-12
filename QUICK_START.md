# Quick Start Guide

## 🚀 Running the App

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   - Navigate to http://localhost:3000
   - The service worker will automatically register

## 🧪 Testing Offline Mode

### Method 1: Chrome DevTools
1. Open the app in Chrome
2. Press F12 to open DevTools
3. Go to **Network** tab
4. Select **Offline** from the throttling dropdown
5. Refresh the page - app should still work!

### Method 2: Browser Settings
1. Turn off Wi-Fi and mobile data on your device
2. Refresh the page
3. All features should continue working

## ✅ What to Test

1. **SOS Messages**
   - Create a new SOS message
   - Refresh the page - message should persist
   - Turn offline - still works!

2. **Messages**
   - Send a message to a simulated user
   - Check that messages persist after refresh
   - Simulated incoming messages appear automatically

3. **Disaster Alerts**
   - Create an alert
   - Verify it appears in the list
   - Check persistence after refresh

4. **Location**
   - Click "Get Current Location"
   - Save a location name
   - Verify it persists

## 📱 Features Overview

- ✅ All data stored in LocalStorage
- ✅ Service Worker caches all pages
- ✅ Works completely offline
- ✅ No external API dependencies
- ✅ Modern, responsive UI

## 🔍 Verifying Service Worker

1. Open Chrome DevTools
2. Go to **Application** tab
3. Click **Service Workers** in the left sidebar
4. You should see `sw.js` registered and running
5. Check **Cache Storage** to see cached resources

Enjoy your offline-first disaster app! 🚨
