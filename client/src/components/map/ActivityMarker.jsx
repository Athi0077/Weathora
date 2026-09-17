import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const activityIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ActivityMarker = ({ position, activity }) => {
  if (!position) return null;
  
  return (
    <Marker position={position} icon={activityIcon}>
      <Popup className="font-sans">
        <div className="p-1 min-w-[150px]">
          <h3 className="font-bold text-main text-sm mb-1">{activity.title}</h3>
          <p className="text-xs text-sub mb-1">{activity.description}</p>
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-default">
            <span className="text-[10px] uppercase font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">{activity.type}</span>
            <span className="text-xs font-medium text-sub">{activity.time}</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default ActivityMarker;

