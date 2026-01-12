'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { locationStorage } from '../../lib/storage';
import { translations, languageNames } from '../../lib/translations';

// Fix for default markers in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function LocationPage() {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app_language') || 'en';
    }
    return 'en';
  });

  const t = translations[language] || translations.en;

  useEffect(() => {
    localStorage.setItem('app_language', language);
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadLocation();

    // If online and no saved location, try to get GPS once
    if (navigator.onLine && !location) {
      getCurrentLocation();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [language]);

  // Geocode location name when it changes
  useEffect(() => {
    if (locationName && locationName !== location?.name) {
      geocodeLocation(locationName);
    }
  }, [locationName]);

  const loadLocation = () => {
    const saved = locationStorage.get();
    if (saved) {
      setLocation(saved);
      setLocationName(saved.name || '');
      setLatInput(saved.latitude?.toString() || '');
      setLngInput(saved.longitude?.toString() || '');
    }
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationData = {
            latitude,
            longitude,
            name: locationName || `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
            timestamp: new Date().toISOString(),
            source: 'gps',
          };
          locationStorage.save(locationData);
          setLocation(locationData);
          setLatInput(latitude.toString());
          setLngInput(longitude.toString());
          setIsLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // If offline or GPS fails, use manual input if available
          if (latInput && lngInput) {
            saveManualLocation();
          } else if (!location) {
            // Create default location
            const defaultLocation = {
              latitude: 0,
              longitude: 0,
              name: locationName || t.currentLocation,
              timestamp: new Date().toISOString(),
              source: 'manual',
            };
            locationStorage.save(defaultLocation);
            setLocation(defaultLocation);
            setLatInput('0');
            setLngInput('0');
          }
          setIsLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setIsLoading(false);
    }
  };

  const saveLocationName = () => {
    if (location) {
      const updated = {
        ...location,
        name: locationName || location.name,
      };
      locationStorage.save(updated);
      setLocation(updated);
    }
  };

  const geocodeLocation = async (name) => {
    if (!name.trim() || !isOnline) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setLatInput(lat);
        setLngInput(lon);
        // Update location if it exists
        if (location) {
          const updated = {
            ...location,
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
            name: name,
          };
          locationStorage.save(updated);
          setLocation(updated);
        }
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const saveManualLocation = () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      alert('Please enter valid numbers for latitude and longitude.');
      return;
    }
    if (lat < -90 || lat > 90) {
      alert('Latitude must be between -90 and 90.');
      return;
    }
    if (lng < -180 || lng > 180) {
      alert('Longitude must be between -180 and 180.');
      return;
    }

    const data = {
      latitude: lat,
      longitude: lng,
      name: locationName || `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      timestamp: new Date().toISOString(),
      source: 'manual',
    };
    locationStorage.save(data);
    setLocation(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-xl">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-3xl font-bold hover:text-green-200 transition-colors">←</Link>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">📍 {t.location}</h1>
                <p className="text-sm text-green-100 mt-1">{t.locationDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                isOnline ? 'bg-green-500' : 'bg-yellow-500'
              }`}>
                {isOnline ? t.online : t.offlineMode}
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white text-green-700 text-base px-4 py-2 rounded-full border-2 border-green-300 font-semibold shadow-md"
                style={{ fontSize: '16px' }}
              >
                {Object.entries(languageNames).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Location Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border-2 border-green-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">{t.currentLocation}</h2>
          
          {location ? (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-900 font-bold mb-3 text-lg">
                  {t.locationName}
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="flex-1 p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black text-lg"
                    style={{ fontSize: '18px' }}
                    placeholder={t.locationName}
                  />
                  <button
                    onClick={saveLocationName}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all text-lg transform hover:scale-105"
                  >
                    {t.save}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-900 font-bold mb-3 text-lg">
                    {t.latitude}
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={latInput}
                    onChange={(e) => setLatInput(e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black text-lg font-semibold"
                    style={{ fontSize: '18px' }}
                    placeholder="-90 to 90"
                    min="-90"
                    max="90"
                  />
                  <p className="text-sm text-gray-600 mt-2">Range: -90 to 90</p>
                </div>
                <div>
                  <label className="block text-gray-900 font-bold mb-3 text-lg">
                    {t.longitude}
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={lngInput}
                    onChange={(e) => setLngInput(e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black text-lg font-semibold"
                    style={{ fontSize: '18px' }}
                    placeholder="-180 to 180"
                    min="-180"
                    max="180"
                  />
                  <p className="text-sm text-gray-600 mt-2">Range: -180 to 180</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">{t.lastUpdated}</p>
                <p className="text-gray-900 text-lg font-medium">
                  {new Date(location.timestamp).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Source: {location.source === 'gps' ? 'GPS' : 'Manual Entry'}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 text-lg font-medium">{t.currentLocation}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <button
            onClick={getCurrentLocation}
            disabled={isLoading || !isOnline}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all text-lg w-full md:w-auto transform hover:scale-105 disabled:transform-none"
          >
            {isLoading ? 'Getting Location...' : `📍 ${t.getLocation}`}
          </button>
          <button
            onClick={saveManualLocation}
            className="bg-white text-green-700 border-2 border-green-600 font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-green-50 transition-all text-lg w-full md:w-auto transform hover:scale-105"
          >
            💾 {t.saveManual}
          </button>
        </div>

        {/* Map Representation */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border-2 border-green-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">{t.mapView}</h2>

          {(location || (latInput && lngInput)) ? (
            <div className="relative rounded-xl overflow-hidden" style={{ height: '450px' }}>
              {isOnline && latInput && lngInput ? (
                <MapContainer
                  center={[parseFloat(latInput), parseFloat(lngInput)]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  key={`${latInput}-${lngInput}`} // Force re-render when coordinates change
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[parseFloat(latInput), parseFloat(lngInput)]}>
                    <Popup>
                      <div className="text-center">
                        <h3 className="font-bold">{locationName || location?.name || 'Current Location'}</h3>
                        <p>{t.latitude}: {parseFloat(latInput).toFixed(6)}</p>
                        <p>{t.longitude}: {parseFloat(lngInput).toFixed(6)}</p>
                        <p className="text-sm text-gray-600 mt-2">
                          {location ? new Date(location.timestamp).toLocaleString() : 'Real-time'}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-xl overflow-hidden border-4 border-blue-200" style={{ height: '450px' }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center bg-white/95 rounded-3xl p-10 shadow-2xl border-2 border-gray-200 max-w-md mx-4">
                      <div className="text-8xl mb-6 animate-bounce">🌍</div>
                      <h3 className="text-gray-900 font-bold text-3xl mb-4 leading-tight">
                        {locationName || location?.name || 'Current Location'}
                      </h3>
                      <div className="space-y-3 mb-6">
                        <div className="bg-blue-100 p-4 rounded-xl">
                          <p className="text-blue-800 font-semibold text-lg">
                            {t.latitude}: <span className="font-mono">{latInput ? parseFloat(latInput).toFixed(6) : (location ? location.latitude.toFixed(6) : 'N/A')}</span>
                          </p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-xl">
                          <p className="text-green-800 font-semibold text-lg">
                            {t.longitude}: <span className="font-mono">{lngInput ? parseFloat(lngInput).toFixed(6) : (location ? location.longitude.toFixed(6) : 'N/A')}</span>
                          </p>
                        </div>
                      </div>
                      <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-full shadow-lg">
                        <span className="text-2xl mr-2">📍</span>
                        <span className="font-bold text-lg">{t.currentLocation}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-4 font-medium">
                        {location ? new Date(location.timestamp).toLocaleString() : 'Real-time Location'}
                      </p>
                    </div>
                  </div>



                  {/* Enhanced grid lines for map effect */}
                  <svg className="absolute inset-0 w-full h-full opacity-20">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <g key={i}>
                        <line x1={0} y1={i * 22.5} x2="100%" y2={i * 22.5} stroke="#3B82F6" strokeWidth="0.5" />
                        <line x1={i * 5} y1={0} x2={i * 5} y2="100%" stroke="#10B981" strokeWidth="0.5" />
                      </g>
                    ))}
                  </svg>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-xl p-16 text-center">
              <div className="text-7xl mb-6">🗺️</div>
              <p className="text-gray-700 text-xl font-medium">{t.currentLocation}</p>
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-blue-100 border-l-4 border-blue-600 p-6 rounded-xl">
          <p className="text-blue-900 text-base font-semibold leading-relaxed">
            <strong>{t.offlineMode}:</strong> {t.mapView} {t.offlineInfo.split('.')[0]}. {t.locationDesc}
          </p>
        </div>
      </main>
    </div>
  );
}
