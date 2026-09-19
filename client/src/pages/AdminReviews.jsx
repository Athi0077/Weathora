import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Trash2, LayoutDashboard, Settings as SettingsIcon, LogOut, ArrowLeft, Loader2 , Star} from 'lucide-react';
import logoImg from '../assets/logo.png';
import ThemeToggle from '../components/common/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import reviewService from '../services/reviewService';
import StarRating from '../components/common/StarRating';

const SidebarItem = ({ icon: Icon, label, active, onClick, danger }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-left ${
      active 
        ? 'bg-primary-50 text-primary-600 font-medium' 
        : danger 
          ? 'text-red-500 hover:bg-red-50 hover:text-red-600'
          : 'text-sub hover:bg-surface-hover hover:text-main'
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const AdminReviews = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // id of review being acted on

  // Redirect if not admin
  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewService.getAdminReviews();
      if (res.success) {
        setReviews(res.data);
        setStats(res.stats);
      }
    } catch (error) {
      console.error('Failed to load admin reviews', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setActionLoading(id);
      const newStatus = currentStatus === 'published' ? 'hidden' : 'published';
      const res = await reviewService.updateReviewStatus(id, newStatus);
      
      if (res.success) {
        // Update local state
        setReviews(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));
        // Update stats superficially
        setStats(prev => ({
          ...prev,
          published: newStatus === 'published' ? prev.published + 1 : prev.published - 1,
          hidden: newStatus === 'hidden' ? prev.hidden + 1 : prev.hidden - 1
        }));
      }
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update review status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return;
    
    try {
      setActionLoading(id);
      const res = await reviewService.deleteReview(id);
      
      if (res.success) {
        setReviews(prev => prev.filter(r => r._id !== id));
        fetchReviews(); // Refetch to update stats accurately
      }
    } catch (error) {
      console.error('Failed to delete review', error);
      alert('Failed to delete review');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (!user || !user.isAdmin) return null;

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col relative">
      <header className="bg-surface border-b border-default sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <img src={logoImg} alt="Weathora Logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold text-main tracking-tight">Weathora Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <span className="text-sm font-medium text-sub hidden sm:block">{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <aside className="hidden md:block w-64 flex-shrink-0 border-r border-default py-8 pr-6 pl-4 lg:pl-8 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
                    <nav className="space-y-1">
            <div className="px-4 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Admin Menu
            </div>
            <SidebarItem icon={Shield} label="Review Management" active={true} />
            <div className="my-4 border-t border-default pt-4"></div>
            <SidebarItem icon={ArrowLeft} label="Back to App" onClick={() => navigate('/dashboard')} active={false} />
            <SidebarItem icon={LogOut} label="Log out" onClick={handleLogout} active={false} danger />
          </nav>
        </aside>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 lg:py-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            
            <h1 className="text-2xl sm:text-3xl font-bold text-main tracking-tight mb-8">Review Management</h1>

            {/* Stats Overview */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-surface border border-default p-6 rounded-2xl shadow-sm">
                  <div className="text-sm font-medium text-sub mb-1">Total Reviews</div>
                  <div className="text-3xl font-bold text-main">{stats.total}</div>
                </div>
                <div className="bg-surface border border-default p-6 rounded-2xl shadow-sm">
                  <div className="text-sm font-medium text-sub mb-1">Published</div>
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.published}</div>
                </div>
                <div className="bg-surface border border-default p-6 rounded-2xl shadow-sm">
                  <div className="text-sm font-medium text-sub mb-1">Hidden</div>
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.hidden}</div>
                </div>
              </div>
            )}

            {/* Reviews Table */}
            <div className="bg-surface border border-default rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-default">
                <h2 className="text-lg font-bold text-main">All User Reviews</h2>
              </div>
              
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-12 flex justify-center">
                    <Loader2 className="animate-spin text-primary-500" size={32} />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="p-12 text-center text-sub">No reviews found in the system.</div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-secondary text-sub text-sm border-b border-default">
                        <th className="py-4 px-6 font-semibold">User</th>
                        <th className="py-4 px-6 font-semibold">Rating</th>
                        <th className="py-4 px-6 font-semibold">Category</th>
                        <th className="py-4 px-6 font-semibold">Review</th>
                        <th className="py-4 px-6 font-semibold">Date</th>
                        <th className="py-4 px-6 font-semibold">Status</th>
                        <th className="py-4 px-6 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-default">
                      {reviews.map((review) => (
                        <tr key={review._id} className="hover:bg-surface-hover/50 transition-colors">
                          <td className="py-4 px-6 font-medium text-main">
                            {review.user?.name || 'Unknown'}
                            <div className="text-xs text-sub font-normal">{review.user?.email}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex">
                              <StarRating rating={review.rating} readonly size={14} />
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sub">
                            {review.category}
                          </td>
                          <td className="py-4 px-6 text-main max-w-xs truncate" title={review.review}>
                            {review.review}
                          </td>
                          <td className="py-4 px-6 text-sub whitespace-nowrap">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              review.status === 'published' 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                              {review.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleToggleStatus(review._id, review.status)}
                              disabled={actionLoading === review._id}
                              className="text-sub hover:text-main p-1.5 rounded transition-colors mr-2 disabled:opacity-50"
                              title={review.status === 'published' ? 'Hide Review' : 'Publish Review'}
                            >
                              {review.status === 'published' ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            <button
                              onClick={() => handleDelete(review._id)}
                              disabled={actionLoading === review._id}
                              className="text-red-400 hover:text-red-600 p-1.5 rounded transition-colors disabled:opacity-50"
                              title="Delete Review"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminReviews;
