import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, CheckCircle2 } from 'lucide-react';

const RecentTripItem = ({ destination, date, status }) => (
  <div className="flex items-center justify-between py-4 border-b border-default last:border-0 hover:bg-surface-hover transition-colors px-4 -mx-4 rounded-lg">
    <div className="flex items-center space-x-4">
      <div className="text-primary-500 bg-primary-50 p-2.5 rounded-xl">
        <MapPin size={20} />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-main">{destination}</h4>
        <p className="text-xs text-sub mt-1">{date}</p>
      </div>
    </div>
    
    <div className="flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 bg-green-50 text-green-700 rounded-full">
      <CheckCircle2 size={14} />
      <span>{status}</span>
    </div>
  </div>
);

const RecentTripsList = ({ trips, loading }) => {
  if (loading) {
    return (
      <div className="glass-card p-6 border-default animate-pulse">
        <div className="h-6 bg-surface-secondary rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-surface-secondary rounded-xl"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-surface-secondary rounded w-1/3"></div>
                <div className="h-3 bg-surface-secondary rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const pastTrips = trips ? trips.filter(t => t.status === 'completed' || t.status === 'Completed').slice(0, 5) : [];

  return (
    <div className="glass-card p-6 border-default">
      <h3 className="text-lg font-semibold text-main mb-4">Recent Trips</h3>
      
      {!pastTrips || pastTrips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center bg-background rounded-xl border border-dashed border-default">
          <p className="text-sm font-medium text-main">No completed trips yet</p>
          <p className="text-xs text-sub mt-1">Your past trips will appear here.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {pastTrips.map((trip, index) => {
            const dateStr = `${new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
            return (
              <RecentTripItem 
                key={index}
                destination={trip.destination}
                date={dateStr}
                status={trip.status}
              />
            );
          })}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-default flex justify-end">
        <Link 
          to="/my-trips" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm group transition-colors"
        >
          <span>View All Trips</span>
          <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default RecentTripsList;

