import React, { useState, useEffect } from 'react';
import { Star, MessageSquareQuote, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import reviewService from '../../services/reviewService';

const DashboardReviewWidget = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviewsData = async () => {
      try {
        const [summaryData, reviewsData] = await Promise.all([
          reviewService.getReviewSummary().catch(() => null),
          reviewService.getReviews(1, 3, 'highest').catch(() => null)
        ]);

        if (summaryData?.success) {
          setSummary(summaryData.data);
        }
        if (reviewsData?.success && reviewsData.data.length > 0) {
          // Pick a random review from top 3 highest rated
          const randomReview = reviewsData.data[Math.floor(Math.random() * reviewsData.data.length)];
          setReviews([randomReview]);
        }
      } catch (error) {
        console.error('Failed to load review widget data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsData();
  }, []);

  if (loading) {
    return (
      <div className="bg-surface border border-default rounded-2xl p-6 h-full animate-pulse">
        <div className="h-5 w-40 bg-surface-secondary rounded mb-4"></div>
        <div className="h-10 w-24 bg-surface-secondary rounded mb-4"></div>
        <div className="h-4 w-full bg-surface-secondary rounded mb-2"></div>
        <div className="h-4 w-2/3 bg-surface-secondary rounded"></div>
      </div>
    );
  }

  // If there are no reviews at all
  if (!summary || summary.totalReviews === 0) {
    return null;
  }

  const review = reviews[0];

  return (
    <div className="bg-gradient-to-br from-primary-50 to-surface dark:from-primary-900/10 dark:to-surface border border-primary-100 dark:border-primary-900/30 rounded-2xl p-6 h-full flex flex-col relative overflow-hidden group">
      
      {/* Decorative Icon */}
      <div className="absolute -top-4 -right-4 text-primary-100/50 dark:text-primary-900/10 transform rotate-12 transition-transform group-hover:rotate-6">
        <MessageSquareQuote size={120} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-main">Community Love</h3>
          <div className="flex items-center bg-white dark:bg-surface border border-default px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
            <Star size={12} className="fill-amber-400 text-amber-400 mr-1" />
            {summary.averageRating.toFixed(1)} <span className="text-sub font-normal ml-1">({summary.totalReviews})</span>
          </div>
        </div>

        {review ? (
          <div className="flex-1 flex flex-col justify-center mb-6">
            <p className="text-main font-medium italic text-sm md:text-base leading-relaxed line-clamp-4 relative">
              <span className="text-primary-300 dark:text-primary-700 text-2xl absolute -top-2 -left-2 leading-none">"</span>
              <span className="pl-3">{review.review}</span>
              <span className="text-primary-300 dark:text-primary-700 text-2xl leading-none absolute -bottom-3 ml-1">"</span>
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-xs font-bold text-primary-700 dark:text-primary-400">
                {review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-xs font-medium text-sub">— {review.user?.name || 'Anonymous'}</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sub text-sm text-center">Join our community and share your thoughts!</p>
          </div>
        )}

        <button 
          onClick={() => navigate('/reviews')}
          className="mt-auto flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors w-max"
        >
          View All Reviews <ArrowRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default DashboardReviewWidget;
