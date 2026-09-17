import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LocationMarker from './LocationMarker';
import ActivityMarker from './ActivityMarker';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to dynamically update map bounds
const MapBounds = ({ destination, activities }) => {
  const map = useMap();

  useEffect(() => {
    if (!destination) return;

    const bounds = L.latLngBounds([
      [destination.latitude, destination.longitude]
    ]);

    let hasValidActivities = false;
    if (activities && activities.length > 0) {
      activities.forEach(act => {
        if (act.latitude && act.longitude) {
          bounds.extend([act.latitude, act.longitude]);
          hasValidActivities = true;
        }
      });
    }

    if (hasValidActivities) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView([destination.latitude, destination.longitude], 12);
    }
  }, [destination, activities, map]);

  return null;
};

const MapView = ({ destination, activities = [] }) => {
  if (!destination || !destination.latitude || !destination.longitude) {
    return (
      <div className="w-full h-[320px] lg:h-[400px] bg-surface-secondary rounded-2xl flex items-center justify-center text-sub border border-default">
        Map could not be loaded. Valid location required.
      </div>
    );
  }

  const position = [destination.latitude, destination.longitude];

  return (
    <div className="w-full h-[320px] lg:h-[400px] rounded-2xl overflow-hidden shadow-sm border border-default relative z-0">
      <MapContainer 
        center={position} 
        zoom={12} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Destination Marker */}
        <LocationMarker position={position} name={destination.name} />

        {/* Activity Markers */}
        {activities.map((act, index) => (
          <ActivityMarker 
            key={index} 
            position={act.latitude && act.longitude ? [act.latitude, act.longitude] : null} 
            activity={act} 
          />
        ))}

        <MapBounds destination={destination} activities={activities} />
      </MapContainer>
    </div>
  );
};

export default MapView;

