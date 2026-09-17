import React, { useState } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import DestinationSearch from './DestinationSearch';
import TripTypeSelector from './TripTypeSelector';
import { ActivitySelector, PreferenceSelector } from './ActivitySelector';

const TripForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    location: null,
    startDate: '',
    endDate: '',
    tripType: '',
    customTripType: '',
    travelers: 1,
    activities: [],
    customActivities: '',
    preferences: [],
    customPreferences: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.location) newErrors.location = 'Destination is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date cannot be before start date';
    }
    if (!formData.tripType) newErrors.tripType = 'Trip type is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const finalTripType = formData.tripType === 'Other' && formData.customTripType.trim() 
        ? formData.customTripType.trim() 
        : formData.tripType;
        
      let finalActivities = [...formData.activities];
      if (finalActivities.includes('Other') && formData.customActivities.trim()) {
        finalActivities = finalActivities.filter(a => a !== 'Other');
        finalActivities.push(formData.customActivities.trim());
      }
      
      let finalPreferences = [...formData.preferences];
      if (finalPreferences.includes('Other') && formData.customPreferences.trim()) {
        finalPreferences = finalPreferences.filter(p => p !== 'Other');
        finalPreferences.push(formData.customPreferences.trim());
      }
      
      onSubmit({
        ...formData,
        tripType: finalTripType,
        activities: finalActivities,
        preferences: finalPreferences
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-default">
      <div className="space-y-8">
        
        {/* Destination */}
        <div>
          <h2 className="text-lg font-bold text-main mb-4">Where are you going?</h2>
          <DestinationSearch 
            value={formData.location} 
            onChange={(loc) => setFormData({...formData, location: loc})} 
          />
          {errors.location && <p className="text-red-500 text-sm mt-2">{errors.location}</p>}
        </div>

        <div className="border-t border-default"></div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-main mb-2">Start Date</label>
            <input 
              type="date"
              value={formData.startDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              className="w-full bg-background border border-default rounded-xl px-4 py-3 text-main focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-main mb-2">End Date</label>
            <input 
              type="date"
              value={formData.endDate}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              className="w-full bg-background border border-default rounded-xl px-4 py-3 text-main focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
            {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
          </div>
        </div>

        <div className="border-t border-default"></div>

        {/* Trip Type */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-main">What kind of trip?</h2>
          </div>
          <TripTypeSelector 
            value={formData.tripType} 
            onChange={(type) => setFormData({...formData, tripType: type})} 
          />
          {formData.tripType === 'Other' && (
            <div className="mt-4">
               <input 
                 type="text" 
                 placeholder="Enter custom trip type..."
                 value={formData.customTripType || ''}
                 onChange={(e) => setFormData({...formData, customTripType: e.target.value})}
                 className="w-full bg-background border border-default rounded-xl px-4 py-3 text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
               />
            </div>
          )}
          {errors.tripType && <p className="text-red-500 text-sm mt-2">{errors.tripType}</p>}
        </div>

        {/* Travelers */}
        <div>
          <label className="block text-sm font-bold text-main mb-3">Number of travelers</label>
          <div className="flex items-center space-x-4">
            <button 
              type="button"
              onClick={() => setFormData({...formData, travelers: Math.max(1, formData.travelers - 1)})}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-secondary text-sub hover:bg-surface-hover"
            >−</button>
            <span className="text-xl font-bold w-8 text-center">{formData.travelers}</span>
            <button 
              type="button"
              onClick={() => setFormData({...formData, travelers: formData.travelers + 1})}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-secondary text-sub hover:bg-surface-hover"
            >+</button>
          </div>
        </div>

        <div className="border-t border-default"></div>

        {/* Activities & Preferences */}
        <div>
          <h2 className="text-lg font-bold text-main mb-4">Activities & Preferences</h2>
          <ActivitySelector 
            value={formData.activities} 
            onChange={(acts) => setFormData({...formData, activities: acts})} 
            customValue={formData.customActivities}
            onCustomChange={(val) => setFormData({...formData, customActivities: val})}
          />
          <PreferenceSelector 
            value={formData.preferences} 
            onChange={(prefs) => setFormData({...formData, preferences: prefs})} 
            customValue={formData.customPreferences}
            onCustomChange={(val) => setFormData({...formData, customPreferences: val})}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-bold text-main mb-2">Anything else AI should know?</label>
          <textarea 
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Example: Traveling with children and elderly parents."
            className="w-full bg-background border border-default rounded-xl px-4 py-3 text-main focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all h-24 resize-none"
          ></textarea>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-md shadow-primary-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                <span>Preparing Plan...</span>
              </>
            ) : (
              <>
                <span>Analyze My Trip</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>

      </div>
    </form>
  );
};

export default TripForm;

