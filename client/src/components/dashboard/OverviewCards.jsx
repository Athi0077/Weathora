import React from 'react';
import { CloudSun, Map, Compass, Briefcase } from 'lucide-react';

const OverviewCard = ({ icon: Icon, title, value, subtitle, loading, error }) => {
  return (
    <div className="glass-card p-4 sm:p-6 flex flex-col h-full glass-card-hover border-default">
      <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4 text-sub">
        <Icon size={20} className="text-primary-500 shrink-0" />
        <h3 className="text-xs sm:text-sm font-medium leading-tight">{title}</h3>
      </div>
      
      {loading ? (
        <div className="animate-pulse space-y-2 mt-auto">
          <div className="h-8 bg-surface-secondary rounded w-1/2"></div>
          <div className="h-4 bg-surface-secondary rounded w-3/4"></div>
        </div>
      ) : error ? (
        <div className="mt-auto">
          <p className="text-sm text-red-500">Unable to load</p>
        </div>
      ) : (
        <div className="mt-auto">
          <p className="text-xl sm:text-2xl font-bold text-main truncate">{value}</p>
          <p className="text-[10px] sm:text-sm text-sub mt-1 truncate">{subtitle}</p>
        </div>
      )}
    </div>
  );
};

const OverviewCards = ({ weather, weatherLoading, weatherError, trips, nextTrip, tripsLoading, outdoorPlans, plansLoading }) => {
  const totalTrips = trips ? trips.length : 0;
  const totalOutdoorPlans = outdoorPlans ? outdoorPlans.length : 0;
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
      <OverviewCard 
        icon={CloudSun} 
        title="Current Weather" 
        loading={weatherLoading}
        error={weatherError}
        value={weather ? `${weather.temperature}°C` : '--'}
        subtitle={weather ? weather.condition : 'No data'}
      />
      
      <OverviewCard 
        icon={Map} 
        title="Total Trips" 
        loading={tripsLoading}
        value={totalTrips > 0 ? totalTrips : '0'}
        subtitle={totalTrips > 0 ? "Planned Trips" : "No trips yet"}
      />
      
      <OverviewCard 
        icon={Map} 
        title="Next Trip" 
        loading={tripsLoading}
        value={nextTrip ? nextTrip.destination : 'None'}
        subtitle={nextTrip ? nextTrip.date : 'Plan your next trip'}
      />
      
      <OverviewCard 
        icon={Compass} 
        title="Outdoor Plans" 
        loading={plansLoading}
        value={totalOutdoorPlans > 0 ? totalOutdoorPlans : '0'}
        subtitle={totalOutdoorPlans > 0 ? `${totalOutdoorPlans} upcoming` : 'No upcoming plans'}
      />
    </div>
  );
};

export default OverviewCards;

