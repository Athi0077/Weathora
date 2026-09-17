import React from 'react';

const ACTIVITIES = [
  'Sightseeing', 'Photography', 'Hiking', 'Beach', 'Camping', 
  'Cycling', 'Shopping', 'Food', 'Nature', 'Sports', 'Outdoor Events', 'Other'
];

const PREFERENCES = [
  'Prefer outdoor activities', 'Prefer indoor activities', 
  'Avoid rain', 'Avoid extreme heat', 'Prefer mornings', 
  'Prefer evenings', 'Family friendly', 'Budget friendly', 'Other'
];

const SelectorGroup = ({ title, options, selectedValues, onChange, customValue, onCustomChange }) => {
  const toggleSelection = (option) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter(v => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-main mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleSelection(option)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                isSelected 
                  ? 'bg-primary-50 text-primary-700 border-primary-300' 
                  : 'bg-surface text-sub border-default hover:border-default hover:bg-surface-hover'
              }`}
            >
              {isSelected && <span className="mr-1.5 opacity-70">✓</span>}
              {option}
            </button>
          );
        })}
      </div>
      {selectedValues.includes('Other') && (
        <div className="mt-4">
          <input
            type="text"
            placeholder={`Enter custom ${title.toLowerCase().includes('preferences') ? 'preferences' : 'activities'}...`}
            value={customValue || ''}
            onChange={(e) => onCustomChange && onCustomChange(e.target.value)}
            className="w-full bg-background border border-default rounded-xl px-4 py-3 text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
      )}
    </div>
  );
};

export const ActivitySelector = ({ value, onChange, customValue, onCustomChange }) => {
  return <SelectorGroup title="Activities" options={ACTIVITIES} selectedValues={value} onChange={onChange} customValue={customValue} onCustomChange={onCustomChange} />;
};

export const PreferenceSelector = ({ value, onChange, customValue, onCustomChange }) => {
  return <SelectorGroup title="Preferences (Optional)" options={PREFERENCES} selectedValues={value} onChange={onChange} customValue={customValue} onCustomChange={onCustomChange} />;
};

