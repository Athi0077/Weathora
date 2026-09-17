import React from 'react';
import { Plane, Users, Briefcase, Map, Umbrella, Mountain, Car, Building, Compass } from 'lucide-react';

const TRIP_TYPES = [
  { id: 'Vacation', icon: Plane, label: 'Vacation' },
  { id: 'Family Trip', icon: Users, label: 'Family Trip' },
  { id: 'Business Trip', icon: Briefcase, label: 'Business Trip' },
  { id: 'Adventure', icon: Map, label: 'Adventure' },
  { id: 'Beach', icon: Umbrella, label: 'Beach' },
  { id: 'Hiking', icon: Mountain, label: 'Hiking' },
  { id: 'Road Trip', icon: Car, label: 'Road Trip' },
  { id: 'City Tour', icon: Building, label: 'City Tour' },
  { id: 'Other', icon: Compass, label: 'Other' },
];

const TripTypeSelector = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {TRIP_TYPES.map((type) => {
        const Icon = type.icon;
        const isSelected = value === type.id;
        
        return (
          <button
            key={type.id}
            type="button"
            onClick={() => onChange(type.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
              isSelected 
                ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm ring-1 ring-primary-500' 
                : 'bg-surface border-default text-sub hover:bg-surface-hover hover:border-default'
            }`}
          >
            <Icon size={24} className={isSelected ? 'text-primary-600' : 'text-dim'} />
            <span className="text-xs font-medium mt-2 text-center">{type.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TripTypeSelector;

