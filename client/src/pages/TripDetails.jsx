import ThemeToggle from '../components/common/ThemeToggle';
import logoImg from '../assets/logo.png';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  LogOut, CloudSun, Map, Compass, Briefcase, Sparkles, Cloud, LayoutDashboard, Loader2, ArrowLeft, RefreshCw, Trash2
, FileText, Settings} from 'lucide-react';
import tripService from '../services/tripService';
import TripAnalysis from '../components/trip/TripAnalysis';
import MapView from '../components/map/MapView';
import SmartItinerary from '../components/itinerary/SmartItinerary';
import BudgetTracker from '../components/trip/BudgetTracker';

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

const TripDetails = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingItinerary, setGeneratingItinerary] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || id === 'undefined') {
      navigate('/dashboard', { replace: true });
      return;
    }
    fetchTrip();
  }, [id, navigate]);

  const fetchTrip = async () => {
    setLoading(true);
    try {
      const data = await tripService.getTrip(id);
      setTrip(data);
    } catch (err) {
      setError('Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  const handleReanalyze = async () => {
    setAnalyzing(true);
    try {
      const data = await tripService.analyzeTrip(id);
      setTrip(data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to re-analyze trip. Please try again.';
      alert(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateItinerary = async () => {
    setGeneratingItinerary(true);
    try {
      const data = trip.itinerary && trip.itinerary.length > 0 
        ? await tripService.regenerateItinerary(id)
        : await tripService.generateItinerary(id);
      setTrip(data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to generate itinerary. Please try again.';
      alert(msg);
    } finally {
      setGeneratingItinerary(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this trip? This will permanently remove the saved trip and its AI analysis.')) {
      try {
        await tripService.deleteTrip(id);
        navigate('/my-trips');
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
          <div className="max-w-4xl mx-auto">
            
            <button 
              onClick={() => navigate('/my-trips')}
              className="flex items-center text-sm font-medium text-sub hover:text-main mb-6 transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to My Trips
            </button>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 size={32} className="animate-spin text-primary-500" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500 bg-red-50 p-6 rounded-2xl">{error}</div>
            ) : trip ? (
              <>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
                  <h1 className="text-3xl font-bold text-main tracking-tight">{trip.destination}</h1>
                  
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={handleReanalyze}
                      disabled={analyzing}
                      className="flex items-center text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-full transition-colors disabled:opacity-70"
                    >
                      {analyzing ? (
                        <Loader2 size={16} className="mr-2 animate-spin" />
                      ) : (
                        <RefreshCw size={16} className="mr-2" />
                      )}
                      Re-analyze
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="flex items-center text-sm font-medium text-red-600 bg-surface border border-red-200 hover:bg-red-50 px-4 py-2 rounded-full transition-colors"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </button>
                  </div>
                </div>

                {analyzing ? (
                  <div className="bg-surface rounded-3xl p-12 text-center shadow-sm border border-default">
                    <Loader2 size={32} className="animate-spin mx-auto text-primary-500 mb-4" />
                    <h3 className="text-lg font-bold text-main mb-2">Updating weather analysis...</h3>
                    <p className="text-sub">Fetching latest forecast and generating AI insights.</p>
                  </div>
                ) : (
                  <TripAnalysis trip={trip} />
                )}

                {/* Map & Itinerary Section */}
                <div className="mt-12 space-y-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <h2 className="text-2xl font-bold text-main">Smart Itinerary</h2>
                    <button 
                      onClick={handleGenerateItinerary}
                      disabled={generatingItinerary || analyzing}
                      className="flex items-center justify-center text-sm font-medium text-white bg-surface hover:bg-surface px-5 py-2.5 rounded-full transition-colors disabled:opacity-70"
                    >
                      {generatingItinerary ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} className="mr-2 text-yellow-400" />
                          {trip.itinerary && trip.itinerary.length > 0 ? 'Regenerate Itinerary' : 'Generate Smart Itinerary'}
                        </>
                      )}
                    </button>
                  </div>

                  {generatingItinerary ? (
                    <div className="bg-surface rounded-3xl p-12 text-center shadow-sm border border-default">
                      <Loader2 size={32} className="animate-spin mx-auto text-primary-500 mb-4" />
                      <h3 className="text-lg font-bold text-main mb-2">Building your smart itinerary...</h3>
                      <p className="text-sub">Scheduling activities based on the latest weather conditions.</p>
                    </div>
                  ) : (
                    <>
                      {/* Map */}
                      {(trip.itinerary && trip.itinerary.length > 0) && (
                        <div className="mb-8">
                          <h3 className="text-xl font-bold text-main mb-4 flex items-center">
                            Trip Map
                          </h3>
                          <MapView 
                            destination={trip.location} 
                            activities={trip.itinerary.flatMap(day => day.items)} 
                          />
                        </div>
                      )}
                      
                      {/* Itinerary */}
                      <SmartItinerary 
                        itinerary={trip.itinerary} 
                        tripId={trip._id}
                        onUpdateItinerary={(newItinerary) => setTrip({...trip, itinerary: newItinerary})}
                      />
                      
                      {/* Budget Tracker */}
                      <div className="mt-12">
                        <BudgetTracker tripId={trip._id} />
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : null}
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default TripDetails;
