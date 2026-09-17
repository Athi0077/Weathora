import React from 'react';
import { MapPin, Calendar, Star, Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

const TripCard = ({ trip, onDelete }) => {
  const score = trip.aiAnalysis?.overallScore;
  let scoreColor = 'text-dim';
  if (score >= 75) scoreColor = 'text-green-500';
  else if (score >= 50) scoreColor = 'text-yellow-500';
  else if (score < 50) scoreColor = 'text-red-500';

  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-700',
    ongoing: 'bg-green-100 text-green-700',
    completed: 'bg-surface-secondary text-main',
    cancelled: 'bg-red-100 text-red-700'
  };

  return (
    <div className="bg-surface rounded-2xl border border-default shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start space-x-2">
            <MapPin size={18} className="text-primary-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-main text-lg leading-tight">{trip.destination}</h3>
              <p className="text-xs text-sub mt-0.5">{trip.location?.country}</p>
            </div>
          </div>
          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full tracking-wider ${statusColors[trip.status]}`}>
            {trip.status}
          </span>
        </div>

        <div className="space-y-2 mb-6 flex-1">
          <div className="flex items-center text-sm text-sub">
            <Calendar size={14} className="mr-2 text-dim" />
            {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
          <div className="flex items-center text-sm text-sub">
            <Star size={14} className="mr-2 text-dim" />
            {trip.tripType}
          </div>
        </div>

        <div className="bg-background rounded-xl p-3 flex justify-between items-center mt-auto border border-default">
          <span className="text-xs font-semibold text-sub uppercase tracking-wider">AI Suitability</span>
          <span className={`font-bold text-lg ${scoreColor}`}>
            {score !== undefined ? `${score}/100` : 'N/A'}
          </span>
        </div>
      </div>
      
      <div className="border-t border-default grid grid-cols-2 divide-x divide-slate-100 bg-background">
        <Link 
          to={`/trip/${trip._id}`}
          className="py-3 text-center text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-colors"
        >
          View Trip
        </Link>
        <button 
          onClick={(e) => { e.preventDefault(); onDelete(trip._id); }}
          className="py-3 flex items-center justify-center text-sm font-semibold text-sub hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={16} className="mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default TripCard;

