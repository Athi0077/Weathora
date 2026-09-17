import ThemeToggle from '../components/common/ThemeToggle';
import logoImg from '../assets/logo.png';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, CloudSun, Map, Compass, Briefcase, Sparkles, Cloud, LayoutDashboard, Loader2 
, FileText, Settings} from 'lucide-react';
import tripService from '../services/tripService';
import TripCard from '../components/trip/TripCard';

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

const MyTrips = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const data = await tripService.getTrips();
      setTrips(data);
    } catch (err) {
      setError('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this trip? This will permanently remove the saved trip and its AI analysis.')) {
      try {
        await tripService.deleteTrip(id);
        setTrips(trips.filter(t => t._id !== id));
      } catch (err) {
        alert('Failed to delete trip');
      }
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
              <button onClick={handleLogout} className="flex items-center space-x-2 text-sub hover:text-main p-2 rounded-lg hover:bg-surface-hover">
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
          <div className="max-w-5xl mx-auto">
            
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-main tracking-tight">My Trips</h1>
              <button 
                onClick={() => navigate('/trip-planner')}
                className="text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 px-5 py-2.5 rounded-full transition-colors"
              >
                Plan New Trip
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 size={32} className="animate-spin text-primary-500" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500 bg-red-50 p-6 rounded-2xl">{error}</div>
            ) : trips.length === 0 ? (
              <div className="bg-surface rounded-3xl p-12 text-center border border-default">
                <Map size={48} className="mx-auto text-sub mb-4" />
                <h3 className="text-xl font-bold text-main mb-2">No trips yet</h3>
                <p className="text-sub mb-6">Plan your first smart trip with AI weather analysis.</p>
                <button 
                  onClick={() => navigate('/trip-planner')}
                  className="text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 px-6 py-2.5 rounded-full transition-colors"
                >
                  Go to Trip Planner
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map(trip => (
                  <TripCard key={trip._id} trip={trip} onDelete={handleDelete} />
                ))}
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyTrips;



