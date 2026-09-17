import React from 'react';
import { CloudRain, Thermometer, Wind, AlertCircle, RefreshCw } from 'lucide-react';

const WeatherInsightCard = ({ weather, loading, error, onRetry }) => {
  if (loading) {
    return (
      <div className="glass-card p-6 h-full border-default animate-pulse">
        <div className="h-6 bg-surface-secondary rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="h-16 bg-surface-secondary rounded-xl"></div>
          <div className="h-16 bg-surface-secondary rounded-xl"></div>
          <div className="h-16 bg-surface-secondary rounded-xl"></div>
        </div>
        <div className="h-4 bg-surface-secondary rounded w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 h-full flex flex-col items-center justify-center text-center border-default">
        <AlertCircle size={32} className="text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-main mb-2">Weather Insight</h3>
        <p className="text-sub mb-6 text-sm">Unable to load weather data.</p>
        <button 
          onClick={onRetry}
          className="inline-flex items-center space-x-2 bg-surface-secondary hover:bg-surface-hover text-main px-4 py-2 rounded-full font-medium transition-colors text-sm"
        >
          <RefreshCw size={16} />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  // Fallback if no weather data is somehow passed but not an error
  if (!weather) {
    return null; 
  }

  return (
    <div className="glass-card p-6 h-full flex flex-col border-default">
      <h3 className="text-lg font-semibold text-main mb-6 flex items-center">
        <span className="mr-2">🌦️</span> Weather Insight
      </h3>
      
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-background rounded-xl p-3 text-center border border-default">
          <CloudRain size={18} className="text-blue-500 mx-auto mb-2" />
          <p className="text-xs text-sub mb-1">Rain Chance</p>
          <p className="font-semibold text-main">{weather.rainChance || 0}%</p>
        </div>
        <div className="bg-background rounded-xl p-3 text-center border border-default">
          <Thermometer size={18} className="text-orange-500 mx-auto mb-2" />
          <p className="text-xs text-sub mb-1">Temperature</p>
          <p className="font-semibold text-main">{weather.temperature}°C</p>
        </div>
        <div className="bg-background rounded-xl p-3 text-center border border-default">
          <Wind size={18} className="text-teal-500 mx-auto mb-2" />
          <p className="text-xs text-sub mb-1">Wind</p>
          <p className="font-semibold text-main">{weather.windSpeed} km/h</p>
        </div>
      </div>
      
      <div className="mt-auto bg-primary-50 rounded-xl p-4 border border-primary-100">
        <p className="text-sm text-primary-900 font-medium leading-relaxed">
          "{weather.insight}"
        </p>
      </div>
    </div>
  );
};

export default WeatherInsightCard;

