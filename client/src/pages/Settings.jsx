import ThemeToggle from '../components/common/ThemeToggle';
import logoImg from '../assets/logo.png';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Save, Bell, User, MapPin, LayoutDashboard, CloudSun, Map, Compass, Briefcase, Sparkles, Cloud, FileText, Settings as SettingsIcon, LogOut, Star, Loader2, Trash2 } from 'lucide-react';
import userService from '../services/userService';
import reviewService from '../services/reviewService';
import StarRating from '../components/common/StarRating';

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

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  
  const [preferences, setPreferences] = useState({
    weatherAlerts: true,
    tripReminders: true,
    activityAlerts: true,
    workAlerts: true,
    aiReports: true
  });
  
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Review System State
  const [review, setReview] = useState({ rating: 0, text: '', category: 'overall' });
  const [existingReview, setExistingReview] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user && user.notificationPreferences) {
      setPreferences(user.notificationPreferences);
    }
  }, [user]);

  useEffect(() => {
    const fetchMyReview = async () => {
      try {
        const res = await reviewService.getMyReview();
        if (res.success && res.data) {
          setExistingReview(res.data);
          setReview({
            rating: res.data.rating,
            text: res.data.review,
            category: res.data.category
          });
        }
      } catch (error) {
        console.error('Failed to load review', error);
      } finally {
        setReviewLoading(false);
      }
    };
    if (user) fetchMyReview();
  }, [user]);

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await userService.updatePreferences({ notificationPreferences: preferences });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save preferences', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (review.rating === 0) {
      setReviewMessage({ text: 'Please select a rating', type: 'error' });
      return;
    }
    if (review.text.length < 10) {
      setReviewMessage({ text: 'Review must be at least 10 characters', type: 'error' });
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewMessage({ text: '', type: '' });
      let res;
      if (existingReview) {
        res = await reviewService.updateReview(existingReview._id, {
          rating: review.rating,
          review: review.text,
          category: review.category
        });
      } else {
        res = await reviewService.createReview({
          rating: review.rating,
          review: review.text,
          category: review.category
        });
      }

      if (res.success) {
        setExistingReview(res.data);
        setReviewMessage({ text: 'Thanks for sharing your experience! ⭐', type: 'success' });
        setTimeout(() => setReviewMessage({ text: '', type: '' }), 5000);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to submit review';
      setReviewMessage({ text: msg, type: 'error' });
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleReviewDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    
    try {
      setReviewSubmitting(true);
      const res = await reviewService.deleteReview(existingReview._id);
      if (res.success) {
        setExistingReview(null);
        setReview({ rating: 0, text: '', category: 'overall' });
        setReviewMessage({ text: 'Review deleted', type: 'success' });
        setTimeout(() => setReviewMessage({ text: '', type: '' }), 3000);
      }
    } catch (error) {
      setReviewMessage({ text: 'Failed to delete review', type: 'error' });
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <header className="bg-surface border-b border-default sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <img src={logoImg} alt="Weathora Logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold text-main tracking-tight">Weathora</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <span className="text-sm font-medium text-sub hidden sm:block">{user?.name}</span>
              <button onClick={handleLogout} className="flex items-center space-x-2 text-sub hover:text-main p-2 rounded-lg hover:bg-surface-hover">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
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
            <SidebarItem icon={Star} label="Reviews" onClick={() => navigate('/reviews')} active={false} />
            <SidebarItem icon={SettingsIcon} label="Settings" onClick={() => navigate('/settings')} active={true} />
          </nav>
        </aside>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 lg:py-10 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-main mb-8">Settings</h1>

            <div className="space-y-6">
              {/* Account Section */}
              <section className="bg-surface rounded-2xl border border-default overflow-hidden">
                <div className="p-6 border-b border-default bg-background">
                  <h2 className="text-lg font-bold text-main flex items-center">
                    <User size={20} className="mr-2 text-sub" />
                    Account
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-sub mb-1">Name</label>
                    <div className="text-main font-medium">{user?.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sub mb-1">Email</label>
                    <div className="text-main font-medium">{user?.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sub mb-1">Saved Location</label>
                    <div className="flex items-center text-main font-medium">
                      <MapPin size={16} className="text-primary-500 mr-1.5" />
                      {user?.location?.name || 'Not set'}
                    </div>
                  </div>
                </div>
              </section>

              {/* Appearance Section */}
              <section className="bg-surface rounded-2xl border border-default overflow-hidden">
                <div className="p-6 border-b border-default bg-background">
                  <h2 className="text-lg font-bold text-main flex items-center">
                    <CloudSun size={20} className="mr-2 text-sub" />
                    Appearance
                  </h2>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div className="pr-4">
                    <h3 className="font-semibold text-main">Theme</h3>
                    <p className="text-sm text-sub mt-0.5">Choose how Weathora looks across all pages.</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-background p-1.5 rounded-xl border border-default">
                    <ThemeToggle className="bg-surface shadow-sm border border-default" />
                  </div>
                </div>
              </section>

              {/* Notifications Section */}
              <section className="bg-surface rounded-2xl border border-default overflow-hidden">
                <div className="p-6 border-b border-default bg-background">
                  <h2 className="text-lg font-bold text-main flex items-center">
                    <Bell size={20} className="mr-2 text-sub" />
                    Notification Preferences
                  </h2>
                </div>
                <div className="p-0">
                  {[
                    { key: 'weatherAlerts', label: 'Weather Alerts', desc: 'Get notified about significant weather changes' },
                    { key: 'tripReminders', label: 'Trip Reminders', desc: 'Daily reminders for upcoming trips' },
                    { key: 'activityAlerts', label: 'Activity Alerts', desc: 'Weather updates for your outdoor plans' },
                    { key: 'workAlerts', label: 'Work Alerts', desc: 'Weather warnings affecting your work plans' },
                    { key: 'aiReports', label: 'Periodic AI Reports', desc: 'Receive a personalized 6-hour AI planning report' }
                  ].map((item, index) => (
                    <div key={item.key} className={`p-6 flex items-center justify-between ${index !== 4 ? 'border-b border-default' : ''}`}>
                      <div className="pr-4">
                        <h3 className="font-semibold text-main">{item.label}</h3>
                        <p className="text-sm text-sub mt-0.5">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => handleToggle(item.key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          preferences[item.key] ? 'bg-primary-500' : 'bg-surface-secondary'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-surface transition-transform ${
                            preferences[item.key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-background border-t border-default flex justify-end items-center">
                  {saved && <span className="text-emerald-500 text-sm font-medium mr-4">Preferences saved!</span>}
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-xl transition-colors font-medium flex items-center shadow-sm disabled:opacity-50"
                  >
                    <Save size={18} className="mr-2" />
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </section>

              {/* Rate Weathora Section */}
              <section className="bg-surface rounded-2xl border border-default overflow-hidden" id="rate-weathora">
                <div className="p-6 border-b border-default bg-gradient-to-r from-primary-50 to-background dark:from-primary-900/10">
                  <h2 className="text-lg font-bold text-main flex items-center">
                    <Star size={20} className="mr-2 text-primary-500 fill-primary-500" />
                    Rate Weathora
                  </h2>
                  <p className="text-sm text-sub mt-1">Share your experience and help us improve Weathora.</p>
                </div>
                
                <div className="p-6">
                  {reviewLoading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary-500" size={32} /></div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center justify-center p-4 bg-background rounded-xl border border-default text-center mb-6">
                        <p className="font-semibold text-main mb-3">How would you rate Weathora?</p>
                        <StarRating 
                          rating={review.rating} 
                          onChange={(val) => setReview(prev => ({ ...prev, rating: val }))} 
                          size={36} 
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-main mb-2">Tell us about your experience</label>
                        <textarea
                          value={review.text}
                          onChange={(e) => setReview(prev => ({ ...prev, text: e.target.value.slice(0, 500) }))}
                          placeholder="Share your experience with Weathora..."
                          rows="4"
                          className="w-full bg-background border border-default rounded-xl p-3 text-main focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                        ></textarea>
                        <div className="flex justify-end mt-1">
                          <span className={`text-xs ${review.text.length < 10 ? 'text-amber-500' : 'text-sub'}`}>
                            {review.text.length} / 500
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-main mb-2">What did you like?</label>
                        <select
                          value={review.category}
                          onChange={(e) => setReview(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full bg-background border border-default text-main rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block p-3"
                        >
                          <option value="overall">Overall Experience</option>
                          <option value="weather">Weather Information</option>
                          <option value="trip-planner">Trip Planner</option>
                          <option value="ai-assistant">AI Assistant</option>
                          <option value="work-planner">Work Planner</option>
                          <option value="outdoor-activity">Outdoor Activity</option>
                          <option value="ui">User Interface</option>
                        </select>
                      </div>

                      {reviewMessage.text && (
                        <div className={`p-3 rounded-lg text-sm font-medium ${
                          reviewMessage.type === 'success' 
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {reviewMessage.text}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-default">
                        {existingReview ? (
                          <button
                            onClick={handleReviewDelete}
                            disabled={reviewSubmitting}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition-colors flex items-center font-medium disabled:opacity-50"
                          >
                            <Trash2 size={18} className="mr-2" />
                            Delete Review
                          </button>
                        ) : <div></div>}
                        
                        <button
                          onClick={handleReviewSubmit}
                          disabled={reviewSubmitting}
                          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl transition-colors font-medium flex items-center shadow-sm disabled:opacity-50"
                        >
                          {reviewSubmitting ? (
                             <><Loader2 size={18} className="mr-2 animate-spin" /> Submitting...</>
                          ) : (
                             <><Star size={18} className="mr-2" /> {existingReview ? 'Update Review' : 'Submit Review'}</>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
