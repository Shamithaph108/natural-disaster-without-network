// LocalStorage and IndexedDB utilities for offline data storage

// SOS Messages Storage
export const sosStorage = {
  getAll: () => {
    const stored = localStorage.getItem('sos_messages');
    return stored ? JSON.parse(stored) : [];
  },
  
  save: (message) => {
    const messages = sosStorage.getAll();
    const newMessage = {
      id: Date.now().toString(),
      ...message,
      timestamp: new Date().toISOString(),
    };
    messages.push(newMessage);
    localStorage.setItem('sos_messages', JSON.stringify(messages));
    return newMessage;
  },
  
  delete: (id) => {
    const messages = sosStorage.getAll();
    const filtered = messages.filter(msg => msg.id !== id);
    localStorage.setItem('sos_messages', JSON.stringify(filtered));
  },
  
  clear: () => {
    localStorage.removeItem('sos_messages');
  }
};

// Messages Storage (Simulated nearby users)
export const messagesStorage = {
  getAll: () => {
    const stored = localStorage.getItem('messages');
    return stored ? JSON.parse(stored) : [];
  },
  
  save: (message) => {
    const messages = messagesStorage.getAll();
    const newMessage = {
      id: Date.now().toString(),
      ...message,
      timestamp: new Date().toISOString(),
    };
    messages.push(newMessage);
    localStorage.setItem('messages', JSON.stringify(messages));
    return newMessage;
  },
  
  delete: (id) => {
    const messages = messagesStorage.getAll();
    const filtered = messages.filter(msg => msg.id !== id);
    localStorage.setItem('messages', JSON.stringify(filtered));
  },
  
  clear: () => {
    localStorage.removeItem('messages');
  }
};

// Disaster Alerts Storage
export const alertsStorage = {
  getAll: () => {
    const stored = localStorage.getItem('disaster_alerts');
    return stored ? JSON.parse(stored) : [];
  },
  
  save: (alert) => {
    const alerts = alertsStorage.getAll();
    const newAlert = {
      id: Date.now().toString(),
      ...alert,
      timestamp: new Date().toISOString(),
    };
    alerts.unshift(newAlert); // Add to beginning
    localStorage.setItem('disaster_alerts', JSON.stringify(alerts));
    return newAlert;
  },
  
  delete: (id) => {
    const alerts = alertsStorage.getAll();
    const filtered = alerts.filter(alert => alert.id !== id);
    localStorage.setItem('disaster_alerts', JSON.stringify(filtered));
  },
  
  clear: () => {
    localStorage.removeItem('disaster_alerts');
  }
};

// Location Storage
export const locationStorage = {
  get: () => {
    const stored = localStorage.getItem('user_location');
    return stored ? JSON.parse(stored) : null;
  },
  
  save: (location) => {
    const locationData = {
      ...location,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('user_location', JSON.stringify(locationData));
    return locationData;
  },
  
  clear: () => {
    localStorage.removeItem('user_location');
  }
};

// Simulated Nearby Users (for messaging)
export const simulatedUsers = [
  { id: '1', name: 'User A', distance: '0.5 km' },
  { id: '2', name: 'User B', distance: '1.2 km' },
  { id: '3', name: 'User C', distance: '2.8 km' },
  { id: '4', name: 'User D', distance: '3.5 km' },
];
