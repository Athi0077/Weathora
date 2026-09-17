import React from 'react';
import { ShieldAlert } from 'lucide-react';

const WeatherRisks = ({ risks }) => {
  return (
    <div className="bg-surface rounded-3xl p-6 shadow-sm border border-default">
      <h3 className="text-sm font-bold text-main uppercase tracking-wider mb-4 flex items-center">
        <ShieldAlert size={16} className="mr-2 text-red-500" />
        Weather Risks
      </h3>
      {(!risks || risks.length === 0) ? (
        <p className="text-sm text-sub italic bg-background p-4 rounded-xl">
          No significant weather risks detected from the available forecast.
        </p>
      ) : (
        <ul className="space-y-3">
          {risks.map((risk, index) => (
            <li key={index} className="flex items-start text-sm text-main bg-red-50/50 p-3 rounded-xl border border-red-100">
              <span className="text-red-500 mr-2 mt-0.5 flex-shrink-0">⚠</span>
              <span>{risk}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WeatherRisks;

