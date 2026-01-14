'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

// Custom icon for location marker using inline SVG vector
const locationIcon = L.divIcon({
  html: `<svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#FF0000"/>
</svg>`,
  className: 'custom-div-icon',
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const MapComponent = ({ position, locationName }) => {
  const [map, setMap] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    if (map && position) {
      map.setView(position, 13);
    }
  }, [map, position]);

  if (!isOnline) {
    return (
      <div style={{ height: '400px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ccc' }}>
        <div style={{ textAlign: 'center' }}>
          <div dangerouslySetInnerHTML={{ __html: locationIcon.options.html }} style={{ margin: '0 auto 10px' }} />
          <p>Map unavailable offline</p>
          <p>Latitude: {position ? position[0] : 'N/A'}</p>
          <p>Longitude: {position ? position[1] : 'N/A'}</p>
          <p>{locationName || 'Your Location'}</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={position || [51.505, -0.09]}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
      whenReady={() => setMap(map)}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {position && (
        <Marker position={position} icon={locationIcon}>
          <Popup>
            {locationName || 'Your Location'}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;
