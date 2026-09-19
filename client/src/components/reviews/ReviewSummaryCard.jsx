import React from 'react';
import { Star } from 'lucide-react';
import StarRating from '../common/StarRating';

const ReviewSummaryCard = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="bg-surface rounded-2xl border border-default p-6 md:p-8 shadow-sm animate-pulse">
        <div className="h-6 bg-surface-secondary rounded w-1/3 mb-6"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center w-full md:w-1/3 space-y-3">
            <div className="h-12 w-24 bg-surface-secondary rounded"></div>
            <div className="h-4 w-32 bg-surface-secondary rounded"></div>
          </div>
          <div className="w-full md:w-2/3 space-y-3">
            {[5, 4, 3, 2, 1].map(i => (
              <div key={i} className="h-4 bg-surface-secondary rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!summary || summary.totalReviews === 0) {
    return (
      <div className="bg-surface rounded-2xl border border-default p-8 shadow-sm text-center">
        <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="text-sub" size={32} />
        </div>
        <h3 className="text-xl font-bold text-main mb-2">No Reviews Yet</h3>
        <p className="text-sub max-w-md mx-auto">
          Be the first to review Weathora! Your feedback helps us improve the experience for everyone.
        </p>
      </div>
    );
  }

  const { averageRating, totalReviews, distribution } = summary;

  return (
    <div className="bg-surface rounded-2xl border border-default p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        
        {/* Average Section */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/3 text-center">
          <h3 className="text-5xl font-black text-main mb-2">
            {averageRating.toFixed(1)}
          </h3>
          <div className="mb-2 flex justify-center">
             <StarRating rating={Math.round(averageRating)} readonly size={20} />
          </div>
          <p className="text-sub font-medium">
            Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Distribution Section */}
        <div className="w-full md:w-2/3 space-y-3">
          {[5, 4, 3, 2, 1].map((stars) => {
            const percentage = distribution[stars] || 0;
            return (
              <div key={stars} className="flex items-center text-sm">
                <div className="w-16 flex items-center text-main font-medium shrink-0">
                  {stars} <Star className="fill-amber-400 text-amber-400 ml-1" size={14} />
                </div>
                <div className="flex-1 mx-3 h-2.5 bg-surface-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-10 text-right text-sub shrink-0 font-medium">
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReviewSummaryCard;
