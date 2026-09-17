import ThemeToggle from '../components/common/ThemeToggle';
import logoImg from '../assets/logo.png';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, CloudSun, Map, Compass, Briefcase, Sparkles, Cloud, LayoutDashboard, MapPin, RefreshCw, Bell, FileText, Settings } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

import OverviewCards from '../components/dashboard/OverviewCards';
import NextTripCard from '../components/dashboard/NextTripCard';
import WeatherInsightCard from '../components/dashboard/WeatherInsightCard';
import UpcomingPlansList from '../components/dashboard/UpcomingPlansList';
import AIRecommendation from '../components/dashboard/AIRecommendation';
import RecentTripsList from '../components/dashboard/RecentTripsList';
import LocationSelector from '../components/location/LocationSelector';
import { getWeatherInsight } from '../utils/weatherUtils';
import tripService from '../services/tripService';
import activityService from '../services/activityService';
import notificationService from '../services/notificationService';
import aiReportService from '../services/aiReportService';

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

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { location, weatherData, loading, error, refreshWeather } = useWeather();
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [trips, setTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [outdoorPlans, setOutdoorPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestReport, setLatestReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(true);

  useEffect(() => {
    const fetchTripsAndPlans = async () => {
      try {
        const [tripsData, plansData, unreadData, reportsData] = await Promise.all([
          tripService.getTrips(),
          activityService.getActivities().catch(() => []),
          notificationService.getUnreadCount().catch(() => ({ count: 0 })),
          aiReportService.getReports(1, 1).catch(() => ({ data: [] }))
        ]);
        setTrips(tripsData);
        setOutdoorPlans(plansData || []);
        setUnreadCount(unreadData.count || 0);
        setLatestReport(reportsData.data && reportsData.data.length > 0 ? reportsData.data[0] : null);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setTripsLoading(false);
        setPlansLoading(false);
        setReportLoading(false);
      }
    };
    if (user) {
      fetchTripsAndPlans();
    }
  }, [user]);

  // Fallback states for AI recommendation
  const aiRec = null;
  const aiLoading = false;
  const aiError = true;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const nextTrip = trips && trips.length > 0 ? trips[0] : null;

  // Add insight generation
  const weatherWithInsight = weatherData?.current ? {
    ...weatherData.current,
    insight: getWeatherInsight(weatherData.current)
  } : null;

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col relative">
      {/* Header */}
      <header className="bg-surface border-b border-default sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <img src={logoImg} alt="Weathora Logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold text-main tracking-tight">Weathora</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button 
                onClick={() => navigate('/notifications')}
                className="relative p-2 text-sub hover:text-main transition-colors rounded-lg hover:bg-surface-hover"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <span className="text-sm font-medium text-sub hidden sm:block">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-sub hover:text-main transition-colors p-2 rounded-lg hover:bg-surface-hover"
                title="Logout"
              >
                <LogOut size={20} />
                <span className="sr-only">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Layout */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0 border-r border-default py-8 pr-6 pl-4 lg:pl-8 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="space-y-1">
            <div className="px-4 pb-2 text-xs font-semibold text-dim uppercase tracking-wider">
              Menu
            </div>
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={true} />
            <SidebarItem icon={CloudSun} label="Current Weather" onClick={() => navigate('/current-weather')} />
            <SidebarItem icon={Map} label="Trip Planner" onClick={() => navigate('/trip-planner')} />
            <SidebarItem icon={Briefcase} label="My Trips" onClick={() => navigate('/my-trips')} />
            <SidebarItem icon={Compass} label="Outdoor Activity" onClick={() => navigate('/outdoor-activity')} />
            <SidebarItem icon={Sparkles} label="Work Planner" onClick={() => navigate('/work-planner')} />
            <SidebarItem icon={FileText} label="AI Reports" onClick={() => navigate('/ai-reports')} />
            <SidebarItem icon={Settings} label="Settings" onClick={() => navigate('/settings')} />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 lg:py-10 overflow-y-auto relative">
          
          {!location || showLocationSelector ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-full relative">
                {location && (
                  <button 
                    onClick={() => setShowLocationSelector(false)}
                    className="absolute -top-12 right-0 text-sm font-medium text-sub hover:text-main"
                  >
                    Cancel
                  </button>
                )}
                <LocationSelector onLocationSelected={() => setShowLocationSelector(false)} />
              </div>
            </div>
          ) : (
            <>
              {/* Location Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-10 gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-main tracking-tight">
                    Welcome back, {user?.name}!
                  </h1>
                  <p className="text-sub mt-2 text-lg">
                    {weatherData && !error 
                      ? "Plan smarter with today's weather." 
                      : "What are you planning today?"}
                  </p>
                </div>
                
                <div className="flex items-center justify-center bg-surface border border-default rounded-full px-4 py-2 shadow-sm shrink-0 self-center sm:self-auto">
                  <MapPin size={16} className="text-primary-500 mr-2 shrink-0" />
                  <span className="text-sm font-medium text-main mr-3 truncate max-w-[150px]">
                    {location.name}
                  </span>
                  <button 
                    onClick={() => setShowLocationSelector(true)}
                    className="text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full transition-colors mr-2"
                  >
                    Change
                  </button>
                  <div className="w-px h-4 bg-surface-secondary mx-1"></div>
                  <button 
                    onClick={refreshWeather}
                    disabled={loading}
                    className="text-dim hover:text-sub p-1.5 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                  </button>
                </div>
              </div>

              <div className="space-y-6 sm:space-y-8 max-w-6xl">
                {/* Overview Cards */}
                <OverviewCards 
                  weather={weatherData?.current} 
                  weatherLoading={loading} 
                  weatherError={error} 
                  trips={trips}
                  nextTrip={nextTrip}
                  tripsLoading={tripsLoading}
                  outdoorPlans={outdoorPlans}
                  plansLoading={plansLoading}
                />

                {/* Next Trip & Weather Insight */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-3">
                    <NextTripCard trip={nextTrip} loading={tripsLoading} />
                  </div>
                  <div className="lg:col-span-2">
                    <WeatherInsightCard 
                      weather={weatherWithInsight} 
                      loading={loading} 
                      error={error} 
                      onRetry={refreshWeather} 
                    />
                  </div>
                </div>

                {/* Upcoming Plans & AI Recommendation */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <UpcomingPlansList plans={outdoorPlans} loading={plansLoading} />
                  </div>
                  <div className="flex flex-col h-full">
                    <AIRecommendation 
                      report={latestReport} 
                      loading={reportLoading} 
                      error={false} 
                    />
                  </div>
                </div>

                {/* Recent Trips */}
                <div>
                  <RecentTripsList trips={trips} loading={tripsLoading} />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;



