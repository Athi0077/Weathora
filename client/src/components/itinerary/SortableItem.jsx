import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, MapPin, Info, CloudRain, Sun, Cloud, AlertCircle, Building, TreePine, GripVertical } from 'lucide-react';

const getWeatherIcon = (suitability) => {
  switch (suitability?.toLowerCase()) {
    case 'good':
    case 'suitable':
      return <Sun className="w-4 h-4 text-emerald-500" />;
    case 'moderate':
    case 'fair':
      return <Cloud className="w-4 h-4 text-amber-500" />;
    case 'poor':
      return <CloudRain className="w-4 h-4 text-rose-500" />;
    default:
      return <Info className="w-4 h-4 text-dim" />;
  }
};

const getSuitabilityColor = (suitability) => {
  switch (suitability?.toLowerCase()) {
    case 'good':
    case 'suitable':
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'moderate':
    case 'fair':
      return 'bg-amber-50 text-amber-700 border-amber-100';
    case 'poor':
      return 'bg-rose-50 text-rose-700 border-rose-100';
    default:
      return 'bg-background text-sub border-default';
  }
};

const SortableItem = ({ item, isDragOverlay = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragOverlay ? 50 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Timeline Node - only show if not drag overlay */}
      {!isDragOverlay && (
        <div className="absolute -left-[31px] lg:-left-[39px] top-1 w-4 h-4 rounded-full border-2 border-primary-500 bg-surface" />
      )}
      
      <div className={`bg-surface rounded-xl p-4 lg:p-5 border transition-all flex items-start gap-3
        ${isDragOverlay ? 'shadow-xl border-primary-400 rotate-2' : 'shadow-sm border-default hover:border-primary-200'}
      `}>
        {/* Drag Handle */}
        <button 
          className="mt-1 p-1 text-sub hover:text-sub cursor-grab active:cursor-grabbing focus:outline-none"
          {...attributes} 
          {...listeners}
          aria-label="Drag handle"
        >
          <GripVertical size={20} />
        </button>

        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
            <div>
              <h4 className="font-bold text-main text-lg leading-tight">{item.title}</h4>
              <div className="flex items-center text-sm font-semibold text-primary-600 mt-1">
                <Clock className="w-4 h-4 mr-1" />
                {item.time} {item.duration && `· ${item.duration} min`}
              </div>
            </div>
            <div className={`px-2.5 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 w-fit ${getSuitabilityColor(item.weatherSuitability)}`}>
              {getWeatherIcon(item.weatherSuitability)}
              <span>Weather: {item.weatherSuitability}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sub text-sm mb-4 leading-relaxed">
            {item.description}
          </p>

          {/* Meta tags */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center text-xs font-semibold text-sub bg-surface-secondary px-2.5 py-1 rounded">
              {item.indoorOutdoor?.toLowerCase() === 'indoor' ? (
                <Building className="w-3.5 h-3.5 mr-1.5" />
              ) : (
                <TreePine className="w-3.5 h-3.5 mr-1.5" />
              )}
              {item.indoorOutdoor || 'Activity'}
            </span>
            <span className="text-xs font-semibold text-sub bg-surface-secondary px-2.5 py-1 rounded uppercase tracking-wider">
              {item.type}
            </span>
            {(item.latitude && item.longitude) && (
              <span className="flex items-center text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded">
                <MapPin className="w-3.5 h-3.5 mr-1" /> On Map
              </span>
            )}
          </div>

          {/* Weather Reason / Alternative */}
          {item.reason && (
            <div className="mt-4 p-3 bg-background rounded-lg flex gap-2 items-start border border-default">
              <Info className="w-4 h-4 text-dim mt-0.5 shrink-0" />
              <p className="text-sm text-sub">{item.reason}</p>
            </div>
          )}
          
          {(item.weatherSuitability?.toLowerCase() === 'poor' && item.indoorOutdoor?.toLowerCase() === 'outdoor') && (
            <div className="mt-3 p-3 bg-amber-50 rounded-lg flex gap-2 items-start border border-amber-100">
              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-800">Consider an indoor alternative or checking the forecast closer to the time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SortableItem;

