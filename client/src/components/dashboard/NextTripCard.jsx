import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, CloudRain, Thermometer, Wind } from 'lucide-react';

const NextTripCard = ({ trip, loading }) => {
  if (loading) {
    return (
      <div className="glass-card p-6 h-full border-default animate-pulse">
        <div className="h-6 bg-surface-secondary rounded w-1/3 mb-6"></div>
        <div className="space-y-3">
          <div className="h-4 bg-surface-secondary rounded w-1/2"></div>
          <div className="h-4 bg-surface-secondary rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="glass-card p-6 h-full flex flex-col items-center justify-center text-center border-default">
        <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center text-dim mb-4">
          <MapPin size={32} />
        </div>
        <h3 className="text-lg font-semibold text-main mb-2">No upcoming trips</h3>
        <p className="text-sub mb-6 text-sm max-w-[200px]">
          Plan your next trip with Weathora.
        </p>
        <Link 
          to="/planner" 
          className="inline-flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-full font-medium transition-colors text-sm shadow-sm"
        >
          <span>Plan a Trip</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 h-full flex flex-col border-default">
      <div className="flex items-center justify-between mb-6 border-b border-default pb-4">
        <h3 className="text-lg font-semibold text-main">Next Trip</h3>
        <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
          {trip.daysLeft} days left
        </span>
      </div>
      
      <div className="flex-1">
        <div className="flex items-start space-x-3 mb-6">
          <div className="mt-1 text-primary-500">
            <MapPin size={24} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-main">{trip.destination}</h4>
            <p className="text-sub mt-1">{trip.date}</p>
          </div>
        </div>
        
        {trip.weather ? (
          <div className="bg-background rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Thermometer size={18} className="text-dim" />
                <span className="font-medium text-main">{trip.weather.temp}°C</span>
              </div>
              <div className="flex items-center space-x-2">
                <CloudRain size={18} className="text-blue-400" />
                <span className="font-medium text-main">Rain {trip.weather.rainChance}%</span>
              </div>
            </div>
            <p className="text-sm text-sub mt-3">{trip.weather.insight}</p>
          </div>
        ) : (
          <div className="bg-background rounded-xl p-4 mb-6 text-sm text-sub text-center italic">
            Weather forecast will be available closer to your trip.
          </div>
        )}
      </div>

      <div className="mt-auto">
        <Link 
          to={`/trip/${trip._id}`} 
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm group transition-colors"
        >
          <span>View Trip</span>
          <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default NextTripCard;

