import React from 'react';
import { Briefcase } from 'lucide-react';

const PackingSuggestions = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-surface rounded-3xl p-6 shadow-sm border border-default">
      <h3 className="text-sm font-bold text-main uppercase tracking-wider mb-4 flex items-center">
        <Briefcase size={16} className="mr-2 text-primary-500" />
        What to Pack
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item, index) => (
          <div key={index} className="bg-background border border-default rounded-lg p-2.5 flex items-center">
            <span className="text-dim mr-2 text-xs">•</span>
            <span className="text-sm font-medium text-main leading-tight">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackingSuggestions;

