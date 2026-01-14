'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { locationStorage } from '../../lib/storage';
import { findLocationByName } from '../../lib/locations';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function LocationPage() {
  const [mapLocation, setMapLocation] = useState(null);
  const [displayLocation, setDisplayLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [isOnline, setIsOnline] = useState(true);

  const setLocation = (newLocation) => {
    setMapLocation(newLocation);
    setDisplayLocation(newLocation);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return; // Prevent SSR issues

    // Detect online/offline status
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Load saved location on mount
    const savedLocation = locationStorage.get();
    if (savedLocation) {
      setLocation(savedLocation);
      setLocationName(savedLocation.name || '');
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const geocodeLocation = async (name) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}`);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  };

  const getLocation = () => {
    if (isOnline && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            name: 'Current Location',
          };
          setMapLocation(newLocation);
          setDisplayLocation(newLocation);
          setLocationName('Current Location');
          locationStorage.save(newLocation);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      alert('Geolocation is not supported or you are offline.');
    }
  };

  const handleLocationNameChange = async (e) => {
    const name = e.target.value;
    setLocationName(name);
    if (name.trim()) {
      let geocodedLocation = null;
      if (isOnline) {
        geocodedLocation = await geocodeLocation(name);
      } else {
        geocodedLocation = findLocationByName(name);
      }
      if (geocodedLocation) {
        const newLocation = { ...geocodedLocation, name };
        setLocation(newLocation);
        locationStorage.save(newLocation);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Location</h1>
      <div className="mb-4">
        <label htmlFor="locationName" className="block text-sm font-medium mb-2">Location Name:</label>
        <input
          id="locationName"
          type="text"
          value={locationName}
          onChange={handleLocationNameChange}
          placeholder="Enter location name"
          className="border border-gray-300 px-3 py-2 rounded w-full"
        />
      </div>
      <button
        onClick={getLocation}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        disabled={!isOnline}
      >
        Get My Location
      </button>
      {displayLocation && (
        <div className="mb-4">
          <p>Latitude: {displayLocation.latitude}</p>
          <p>Longitude: {displayLocation.longitude}</p>
          <p>Name: {locationName}</p>
        </div>
      )}
      <MapComponent key={`${displayLocation?.latitude}-${displayLocation?.longitude}`} position={displayLocation ? [displayLocation.latitude, displayLocation.longitude] : null} locationName={locationName} />
    </div>
  );
}
