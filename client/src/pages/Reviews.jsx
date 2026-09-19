import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, LayoutDashboard, CloudSun, Map, Compass, Briefcase, Sparkles, FileText, Settings as SettingsIcon, Loader2, Filter } from 'lucide-react';
import logoImg from '../assets/logo.png';
import ThemeToggle from '../components/common/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import reviewService from '../services/reviewService';
import ReviewSummaryCard from '../components/reviews/ReviewSummaryCard';
import ReviewCard from '../components/reviews/ReviewCard';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-left ${
      active 
        ? 'bg-primary-50 text-primary-600 font-medium' 
        : 'text-sub hover:bg-surface-hover hover:text-main'
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const Reviews = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [summary, setSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('recent'); // recent, highest, lowest

  const fetchSummary = async () => {
    try {
      const res = await reviewService.getReviewSummary();
      if (res.success) {
        setSummary(res.data);
      }
    } catch (error) {
      console.error('Failed to load summary', error);
    }
  };

  const fetchReviews = async (pageNum, sort, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const res = await reviewService.getReviews(pageNum, 6, sort);
      
      if (res.success) {
        if (append) {
          setReviews(prev => [...prev, ...res.data]);
        } else {
          setReviews(res.data);
        }
        setTotalPages(res.totalPages);
        setPage(res.currentPage);
      }
    } catch (error) {
      console.error('Failed to load reviews', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchReviews(1, sortBy);
  }, [sortBy]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      fetchReviews(page + 1, sortBy, true);
    }
  };

  const handleWriteReview = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/settings'); // Or wherever the review form is located
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col relative">
      {/* Header */}
      <header className="bg-surface border-b border-default sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <img src={logoImg} alt="Weathora Logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold text-main tracking-tight">Weathora</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
                 <span className="text-sm font-medium text-sub hidden sm:block">
                   {user.name}
                 </span>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Log in
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0 border-r border-default py-8 pr-6 pl-4 lg:pl-8 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
                    <nav className="space-y-1">
            <div className="px-4 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Menu
            </div>
            <SidebarItem icon={LayoutDashboard} label="Dashboard" onClick={() => navigate('/dashboard')} active={false} />
            <SidebarItem icon={CloudSun} label="Current Weather" onClick={() => navigate('/current-weather')} active={false} />
            <SidebarItem icon={Map} label="Trip Planner" onClick={() => navigate('/trip-planner')} active={false} />
            <SidebarItem icon={Briefcase} label="My Trips" onClick={() => navigate('/my-trips')} active={false} />
            <SidebarItem icon={Compass} label="Outdoor Activity" onClick={() => navigate('/outdoor-activity')} active={false} />
            <SidebarItem icon={Sparkles} label="Work Planner" onClick={() => navigate('/work-planner')} active={false} />
            <SidebarItem icon={FileText} label="AI Reports" onClick={() => navigate('/ai-reports')} active={false} />
            <SidebarItem icon={Star} label="Reviews" onClick={() => navigate('/reviews')} active={true} />
            <SidebarItem icon={SettingsIcon} label="Settings" onClick={() => navigate('/settings')} active={false} />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 lg:py-10 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-main tracking-tight">User Reviews</h1>
                <p className="text-sub mt-2 text-lg">See what the Weathora community says.</p>
              </div>
              <button 
                onClick={handleWriteReview}
                className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm whitespace-nowrap"
              >
                Write a Review
              </button>
            </div>

            <div className="mb-10">
              <ReviewSummaryCard summary={summary} loading={loading && !summary} />
            </div>

            {summary && summary.totalReviews > 0 && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-main">Recent Experiences</h2>
                  <div className="flex items-center space-x-2">
                    <Filter size={16} className="text-sub" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-surface border border-default text-main text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="highest">Highest Rated</option>
                      <option value="lowest">Lowest Rated</option>
                    </select>
                  </div>
                </div>

                {loading && page === 1 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="bg-surface rounded-2xl border border-default p-6 h-48 animate-pulse flex flex-col justify-between">
                         <div className="flex space-x-3 items-center">
                            <div className="w-10 h-10 bg-surface-secondary rounded-full"></div>
                            <div className="w-32 h-4 bg-surface-secondary rounded"></div>
                         </div>
                         <div className="space-y-2">
                            <div className="h-3 bg-surface-secondary rounded w-full"></div>
                            <div className="h-3 bg-surface-secondary rounded w-4/5"></div>
                         </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map(review => (
                      <ReviewCard key={review._id} review={review} />
                    ))}
                  </div>
                )}

                {!loading && reviews.length === 0 && (
                  <div className="text-center py-12 text-sub">
                    No reviews found for this filter.
                  </div>
                )}

                {page < totalPages && (
                  <div className="mt-10 flex justify-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="flex items-center bg-surface border border-default hover:bg-surface-hover text-main px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm disabled:opacity-50"
                    >
                      {loadingMore && <Loader2 size={16} className="mr-2 animate-spin" />}
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default Reviews;
