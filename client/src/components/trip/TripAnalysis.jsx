import React from 'react';
import { ShieldAlert, Sun, CloudRain, Star, MapPin } from 'lucide-react';
import DailyTripAnalysis from './DailyTripAnalysis';
import PackingSuggestions from './PackingSuggestions';
import WeatherRisks from './WeatherRisks';

const ScoreRing = ({ score }) => {
  const normalizedScore = Math.min(100, Math.max(0, score));
  const circleRadius = 40;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let colorClass = 'text-green-500';
  if (normalizedScore < 50) colorClass = 'text-red-500';
  else if (normalizedScore < 75) colorClass = 'text-yellow-500';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle
          className="text-slate-100"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={circleRadius}
          cx="48"
          cy="48"
        />
        <circle
          className={colorClass}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={circleRadius}
          cx="48"
          cy="48"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-main">{normalizedScore}</span>
      </div>
    </div>
  );
};

const TripAnalysis = ({ trip }) => {
  if (!trip || !trip.aiAnalysis) return null;
  const analysis = trip.aiAnalysis;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Info */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-default">
        <h2 className="text-2xl font-bold text-main mb-6">Your Trip Weather Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <MapPin className="text-primary-500 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-sub">Destination</p>
              <p className="font-semibold text-main">{trip.location?.name || trip.destination}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Sun className="text-primary-500 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-sub">Dates</p>
              <p className="font-semibold text-main">
                {new Date(trip.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} – {new Date(trip.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Star className="text-primary-500 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-sub">Trip Type</p>
              <p className="font-semibold text-main">{trip.tripType}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Score & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm border border-default">
          <p className="text-sub font-medium mb-4 uppercase tracking-wider text-sm">AI Weather Suitability</p>
          <ScoreRing score={analysis.overallScore} />
          <h3 className="text-2xl font-bold text-main mt-4 mb-1">{analysis.suitability}</h3>
        </div>
        <div className="md:col-span-2 bg-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-default flex flex-col justify-center">
          <h3 className="text-sm font-bold text-dim uppercase tracking-wider mb-3">Weather Overview</h3>
          <p className="text-lg text-main font-medium leading-relaxed mb-4">{analysis.summary}</p>
          <p className="text-sub">{analysis.weatherOverview}</p>
        </div>
      </div>

      {/* Daily Analysis */}
      <div>
        <h3 className="text-xl font-bold text-main mb-4 flex items-center">
          Day-by-Day Analysis
        </h3>
        <DailyTripAnalysis dailyData={analysis.dailyAnalysis} />
      </div>

      {/* Recommendations & Warnings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommended */}
        <div className="bg-surface rounded-3xl p-6 shadow-sm border border-default">
          <h3 className="text-sm font-bold text-primary-600 uppercase tracking-wider mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-primary-500 mr-2"></span>
            Recommended for your trip
          </h3>
          <ul className="space-y-3">
            {analysis.recommendedActivities?.map((act, i) => (
              <li key={i} className="flex items-start text-main">
                <span className="text-green-500 mr-2 font-bold">✓</span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Avoid */}
        <div className="bg-surface rounded-3xl p-6 shadow-sm border border-default">
          <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
            Consider Avoiding
          </h3>
          <ul className="space-y-3">
            {analysis.avoidActivities?.map((act, i) => (
              <li key={i} className="flex items-start text-main">
                <span className="text-red-400 mr-2 font-bold">•</span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Risks, Packing, Backup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WeatherRisks risks={analysis.risks} />
        <PackingSuggestions items={analysis.packingSuggestions} />
        
        <div className="bg-surface rounded-3xl p-6 shadow-sm border border-default">
          <h3 className="text-sm font-bold text-main uppercase tracking-wider mb-4">Backup Plan</h3>
          <div className="bg-background rounded-2xl p-4 border border-default">
            <p className="text-main text-sm leading-relaxed">{analysis.backupPlan}</p>
          </div>
          <h3 className="text-sm font-bold text-main uppercase tracking-wider mt-6 mb-4">Travel Advice</h3>
          <div className="bg-primary-50 rounded-2xl p-4 border border-primary-100">
            <p className="text-primary-800 text-sm leading-relaxed">{analysis.travelAdvice}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TripAnalysis;

