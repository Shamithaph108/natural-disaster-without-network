// Predefined locations for offline use
export const predefinedLocations = [
  { name: 'New York', latitude: 40.7128, longitude: -74.0060 },
  { name: 'London', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Paris', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Sydney', latitude: -33.8688, longitude: 151.2093 },
  { name: 'Mumbai', latitude: 19.0760, longitude: 72.8777 },
  { name: 'Delhi', latitude: 28.7041, longitude: 77.1025 },
  { name: 'Bangalore', latitude: 12.9716, longitude: 77.5946 },
  { name: 'Chennai', latitude: 13.0827, longitude: 80.2707 },
  { name: 'Kolkata', latitude: 22.5726, longitude: 88.3639 },
  // Add more as needed
];

export function findLocationByName(name) {
  return predefinedLocations.find(loc => loc.name.toLowerCase() === name.toLowerCase());
}
