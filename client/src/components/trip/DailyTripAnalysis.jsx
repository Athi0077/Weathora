import React from 'react';
import { Cloud, Sun, CloudRain, Wind, ThermometerSun, AlertCircle, CheckCircle2 } from 'lucide-react';

const DailyTripAnalysis = ({ dailyData }) => {
  if (!dailyData || dailyData.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {dailyData.map((day, index) => {
        // Parse date
        const dateObj = new Date(day.date);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        const shortDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        let rainColor = 'text-sub';
        if (day.rainRisk?.toLowerCase() === 'high') rainColor = 'text-red-500';
        else if (day.rainRisk?.toLowerCase() === 'medium') rainColor = 'text-yellow-500';

        let outdoorColor = 'text-green-500';
        if (day.outdoorSuitability?.toLowerCase() === 'poor') outdoorColor = 'text-red-500';
        else if (day.outdoorSuitability?.toLowerCase() === 'fair') outdoorColor = 'text-yellow-500';

        return (
          <div key={index} className="bg-surface rounded-2xl p-5 shadow-sm border border-default flex flex-col">
            <div className="border-b border-default pb-3 mb-3 flex justify-between items-start">
              <div>
                <p className="font-bold text-main">{dayName}</p>
                <p className="text-xs text-sub">{shortDate}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-main">{day.temperature?.max}°</p>
                <p className="text-xs text-sub">{day.temperature?.min}°</p>
              </div>
            </div>
            
            <div className="mb-4 flex-1">
              <p className="text-sm font-medium text-main capitalize mb-1">{day.weather}</p>
              
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-sub">Rain Risk</span>
                  <span className={`font-medium ${rainColor}`}>{day.rainRisk}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-sub">Outdoor Suitability</span>
                  <span className={`font-medium flex items-center ${outdoorColor}`}>
                    {day.outdoorSuitability === 'Good' ? <CheckCircle2 size={12} className="mr-1" /> : null}
                    {day.outdoorSuitability}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-xl p-3 mt-auto">
              <p className="text-xs text-sub leading-relaxed italic">"{day.recommendation}"</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DailyTripAnalysis;

