import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Map, Compass, Briefcase } from 'lucide-react';

const PlanItem = ({ icon: Icon, title, date, type }) => (
  <div className="flex items-center justify-between py-4 border-b border-default last:border-0 hover:bg-surface-hover transition-colors px-2 -mx-2 rounded-lg">
    <div className="flex items-center space-x-3">
      <div className="text-dim bg-surface-secondary p-2 rounded-lg">
        <Icon size={18} />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-main">{title}</h4>
        <div className="flex items-center text-xs text-sub mt-0.5 space-x-2">
          <span className="flex items-center"><Calendar size={12} className="mr-1" /> {date}</span>
        </div>
      </div>
    </div>
    <span className="text-xs font-medium px-2 py-1 bg-surface-secondary text-sub rounded-full">
      {type}
    </span>
  </div>
);

const UpcomingPlansList = ({ plans, loading }) => {
  if (loading) {
    return (
      <div className="glass-card p-6 h-full border-default">
        <div className="h-6 bg-surface-secondary rounded w-1/3 mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="w-9 h-9 bg-surface-secondary rounded-lg"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-surface-secondary rounded w-1/2"></div>
                <div className="h-3 bg-surface-secondary rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 h-full flex flex-col border-default">
      <h3 className="text-lg font-semibold text-main mb-4">Upcoming Plans</h3>
      
      <div className="flex-1">
        {!plans || plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-sub mb-3">
              <Calendar size={24} />
            </div>
            <p className="text-sm font-medium text-main">No upcoming plans</p>
            <p className="text-xs text-sub mt-1">Start planning your next activity.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {plans.map((plan, index) => {
              let Icon = Map;
              if (plan.type === 'Outdoor') Icon = Compass;
              if (plan.type === 'Work') Icon = Briefcase;
              
              return (
                <PlanItem 
                  key={index}
                  icon={Icon}
                  title={plan.title}
                  date={plan.date}
                  type={plan.type}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-default">
        <Link 
          to="/planner" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm group transition-colors"
        >
          <span>View All Plans</span>
          <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default UpcomingPlansList;

