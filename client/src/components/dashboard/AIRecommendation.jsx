import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, AlertCircle, FileText } from 'lucide-react';

const AIRecommendation = ({ report, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-surface rounded-2xl p-6 sm:p-8 relative overflow-hidden animate-pulse">
        <div className="relative z-10 space-y-4">
          <div className="h-6 bg-surface-secondary rounded w-1/4"></div>
          <div className="space-y-2 max-w-2xl">
            <div className="h-4 bg-surface-secondary rounded w-full"></div>
            <div className="h-4 bg-surface-secondary rounded w-5/6"></div>
          </div>
          <div className="h-10 bg-surface-secondary rounded-full w-32 mt-6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center">
            <Sparkles className="text-primary-400 mr-2" size={24} />
            AI Recommendation
          </h3>
          <div className="flex items-start space-x-3 text-sub bg-surface/50 p-4 rounded-xl border border-default/50 max-w-2xl">
            <AlertCircle size={20} className="text-dim flex-shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">
              AI analysis is currently unavailable. We'll be able to provide intelligent weather and trip recommendations once the service is online.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl p-6 sm:p-8 relative overflow-hidden group">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-colors duration-700"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Sparkles className="text-primary-400 mr-2" size={24} />
            Latest AI Report
          </h3>
          {report && (
            <span className="text-xs font-semibold px-2.5 py-1 bg-surface text-sub rounded-full border border-default">
              {new Date(report.generatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
        
        {report ? (
          <>
            <p className="text-sub leading-relaxed max-w-3xl text-sm mb-6 flex-1 line-clamp-3">
              {report.planningSummary}
            </p>
            <div className="flex gap-3 mb-6">
              <div className="flex items-center text-xs font-medium text-dim bg-surface/50 px-3 py-1.5 rounded-lg">
                <AlertCircle size={14} className={`mr-1.5 ${report.alerts?.length ? 'text-red-400' : 'text-sub'}`} />
                {report.alerts?.length || 0} Alerts
              </div>
              <div className="flex items-center text-xs font-medium text-dim bg-surface/50 px-3 py-1.5 rounded-lg">
                <FileText size={14} className="mr-1.5 text-blue-400" />
                {report.recommendations?.length || 0} Insights
              </div>
            </div>
            
            <Link 
              to={`/ai-reports/${report._id}`}
              className="inline-flex items-center justify-center space-x-2 bg-surface text-main px-6 py-2.5 rounded-xl font-semibold hover:bg-surface-hover transition-colors shadow-sm w-full sm:w-auto mt-auto"
            >
              <span>View Full Report</span>
              <ArrowRight size={18} />
            </Link>
          </>
        ) : (
          <>
            <p className="text-sub leading-relaxed max-w-3xl text-lg mb-8 flex-1">
              Your first periodic AI report will appear here automatically based on your upcoming plans and current weather conditions.
            </p>
            <Link 
              to="/ai-reports" 
              className="inline-flex items-center justify-center space-x-2 bg-surface/10 text-white hover:bg-surface/20 border border-white/20 px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-sm w-full sm:w-auto mt-auto"
            >
              <span>View History</span>
              <ArrowRight size={18} />
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default AIRecommendation;


