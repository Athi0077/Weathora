import React from 'react';
import StarRating from '../common/StarRating';

const getCategoryLabel = (category) => {
  const labels = {
    'overall': 'Overall Experience',
    'weather': 'Weather Information',
    'trip-planner': 'Trip Planner',
    'ai-assistant': 'AI Assistant',
    'work-planner': 'Work Planner',
    'outdoor-activity': 'Outdoor Activity',
    'ui': 'User Interface'
  };
  return labels[category] || 'Overall Experience';
};

const getInitials = (name) => {
  if (!name) return 'U';
  return name.charAt(0).toUpperCase();
};

const ReviewCard = ({ review }) => {
  const date = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-surface rounded-2xl border border-default p-5 md:p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
            {getInitials(review.user?.name)}
          </div>
          <div>
            <h4 className="font-semibold text-main text-sm md:text-base">{review.user?.name || 'Anonymous User'}</h4>
            <div className="flex items-center space-x-2 mt-0.5">
              <StarRating rating={review.rating} readonly size={14} />
            </div>
          </div>
        </div>
        <span className="text-xs font-medium bg-surface-secondary text-sub px-2.5 py-1 rounded-full whitespace-nowrap">
          {getCategoryLabel(review.category)}
        </span>
      </div>
      
      <p className="text-sub text-sm md:text-base flex-1 mb-4 italic leading-relaxed">
        "{review.review}"
      </p>
      
      <div className="text-xs text-dim flex items-center justify-between mt-auto pt-4 border-t border-default">
        <span>{date}</span>
        {review.rating >= 4 && (
           <span className="text-emerald-600 dark:text-emerald-400 flex items-center">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
             Highly Rated
           </span>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
