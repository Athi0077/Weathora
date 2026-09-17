import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const destinationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LocationMarker = ({ position, name }) => {
  if (!position) return null;
  
  return (
    <Marker position={position} icon={destinationIcon}>
      <Popup className="font-sans">
        <div className="p-1">
          <h3 className="font-bold text-main text-sm mb-1 flex items-center">
            <span className="mr-1">📍</span> {name}
          </h3>
          <p className="text-xs text-sub">Your trip destination</p>
        </div>
      </Popup>
    </Marker>
  );
};

export default LocationMarker;

