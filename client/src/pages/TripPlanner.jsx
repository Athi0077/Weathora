import ThemeToggle from '../components/common/ThemeToggle';
import logoImg from '../assets/logo.png';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LogOut, CloudSun, Map, Compass, Briefcase, Sparkles, Cloud, LayoutDashboard, CalendarDays
, FileText, Settings} from 'lucide-react';
import TripForm from '../components/trip/TripForm';
import TripAnalysis from '../components/trip/TripAnalysis';
import tripService from '../services/tripService';

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

const LoadingAnalysis = () => (
  <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-primary-100 rounded-full animate-ping opacity-75"></div>
      <div className="relative bg-primary-500 text-white p-6 rounded-full shadow-xl">
        <Sparkles size={48} className="animate-pulse" />
      </div>
    </div>
    
    <h3 className="text-2xl font-bold text-main mb-2">Analyzing your trip...</h3>
    
    <div className="space-y-3 mt-6 text-sub font-medium">
      <p className="flex items-center space-x-2 animate-pulse">
        <CloudSun size={18} /> <span>Checking weather conditions</span>
      </p>
      <p className="flex items-center space-x-2 animate-pulse" style={{ animationDelay: '500ms' }}>
        <CalendarDays size={18} /> <span>Comparing your trip dates</span>
      </p>
      <p className="flex items-center space-x-2 animate-pulse" style={{ animationDelay: '1000ms' }}>
        <Sparkles size={18} /> <span>AI is evaluating your plans</span>
      </p>
    </div>
  </div>
);

const TripPlanner = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analyzedTrip, setAnalyzedTrip] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleCreateTrip = async (formData) => {
    setLoading(true);
    setError(null);
    setAnalyzedTrip(null);
    
    try {
      // 1. Create Trip
      const newTrip = await tripService.createTrip({
        ...formData,
        destination: formData.location.name
      });
      
      // 2. Request AI Analysis
      const analyzed = await tripService.analyzeTrip(newTrip._id);
      
      setAnalyzedTrip(analyzed);
    } catch (err) {
      setError(err.response?.data?.message || 'AI analysis is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
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
              <span className="text-sm font-medium text-sub hidden sm:block">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-sub hover:text-main transition-colors p-2 rounded-lg hover:bg-surface-hover"
              >
                <LogOut size={20} />
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
            <SidebarItem icon={LayoutDashboard} label="Dashboard" onClick={() => navigate('/dashboard')} active={false} />
            <SidebarItem icon={CloudSun} label="Current Weather" onClick={() => navigate('/current-weather')} active={false} />
            <SidebarItem icon={Map} label="Trip Planner" onClick={() => navigate('/trip-planner')} active={false} />
            <SidebarItem icon={Briefcase} label="My Trips" onClick={() => navigate('/my-trips')} active={false} />
            <SidebarItem icon={Compass} label="Outdoor Activity" onClick={() => navigate('/outdoor-activity')} active={false} />
            <SidebarItem icon={Sparkles} label="Work Planner" onClick={() => navigate('/work-planner')} active={false} />
            <SidebarItem icon={FileText} label="AI Reports" onClick={() => navigate('/ai-reports')} active={false} />
            <SidebarItem icon={Settings} label="Settings" onClick={() => navigate('/settings')} active={false} />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 lg:py-10 overflow-y-auto">
          
          <div className="max-w-4xl mx-auto">
            {error && (
              <div className="bg-red-50 text-red-600 p-6 rounded-2xl mb-8 border border-red-100 flex flex-col items-center justify-center text-center">
                <p className="font-bold text-lg mb-2">{error}</p>
                <div className="flex space-x-4 mt-4">
                  <button onClick={() => setError(null)} className="px-6 py-2 bg-surface rounded-full font-medium border border-red-200 hover:bg-red-50 transition-colors">
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {!analyzedTrip && !loading && !error && (
              <div className="mb-10">
                <h1 className="text-3xl font-bold text-main tracking-tight">Plan your next trip</h1>
                <p className="text-sub mt-2 text-lg max-w-2xl">
                  Check the weather before you go and let AI build a smarter, safer plan based on the forecast.
                </p>
                
                <div className="mt-8">
                  <TripForm onSubmit={handleCreateTrip} loading={loading} />
                </div>
              </div>
            )}

            {loading && <LoadingAnalysis />}

            {analyzedTrip && !loading && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    Trip Saved
                  </span>
                  <div className="flex space-x-3">
                    <Link to="/my-trips" className="text-sm font-medium text-sub bg-surface border border-default hover:bg-surface-hover px-4 py-2 rounded-full transition-colors">
                      View My Trips
                    </Link>
                    <button onClick={() => setAnalyzedTrip(null)} className="text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-full transition-colors">
                      Plan Another
                    </button>
                  </div>
                </div>
                <TripAnalysis trip={analyzedTrip} />
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default TripPlanner;



