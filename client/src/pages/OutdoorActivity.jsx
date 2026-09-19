import ThemeToggle from '../components/common/ThemeToggle';
import logoImg from '../assets/logo.png';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Compass, Cloud, LogOut, LayoutDashboard, CloudSun, Map, Briefcase, Sparkles, MapPin, Loader2, Info , FileText, Settings, Star} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import activityService from '../services/activityService';

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

const activitiesList = [
  'Walking', 'Running', 'Cycling', 'Hiking', 'Photography', 
  'Picnic', 'Beach', 'Camping', 'Sports', 'Gardening', 'Sightseeing', 'Other'
];

const OutdoorActivity = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { location } = useWeather();
  
  const [formData, setFormData] = useState({
    activity: 'Walking',
    date: new Date().toISOString().split('T')[0],
    preferredTime: 'Morning'
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!location) {
      setError('Please select a valid location first (from Dashboard).');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await activityService.analyzeActivity({
        location: {
          name: location.name,
          state: location.state,
          country: location.country,
          latitude: location.latitude || location.lat,
          longitude: location.longitude || location.lon
        },
        ...formData
      });
      setResult(data.aiAnalysis);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Analysis failed');
    } finally {
      setLoading(false);
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
            <SidebarItem icon={Settings} label="Settings" onClick={() => navigate('/settings')} active={false} />
          </nav>
        </aside>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 lg:py-10 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-main tracking-tight">Outdoor Activity Planner</h1>
              <p className="text-sub mt-2">Plan your outdoor activities around the safest and most comfortable weather windows.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-default h-fit">
                <form onSubmit={handleAnalyze} className="space-y-6">
                  
                  <div>
                    <label className="block text-sm font-bold text-main mb-2">Location</label>
                    <div className="w-full bg-background border border-default rounded-xl px-4 py-3 text-main flex items-center">
                      <MapPin size={18} className="text-dim mr-2" />
                      {location ? location.name : 'No location selected (Go to Dashboard)'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-main mb-2">Activity</label>
                    <select 
                      name="activity" 
                      value={formData.activity} 
                      onChange={handleChange}
                      className="w-full bg-background border border-default rounded-xl px-4 py-3 text-main focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                      {activitiesList.map(act => (
                        <option key={act} value={act}>{act}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-main mb-2">Date</label>
                      <input 
                        type="date" 
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full bg-background border border-default rounded-xl px-4 py-3 text-main focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-main mb-2">Preferred Time</label>
                      <select 
                        name="preferredTime" 
                        value={formData.preferredTime}
                        onChange={handleChange}
                        className="w-full bg-background border border-default rounded-xl px-4 py-3 text-main focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      >
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                        <option value="Anytime">Anytime</option>
                      </select>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading || !location}
                    className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
                  >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Check Conditions'}
                  </button>
                </form>
              </div>

              {/* Result */}
              <div>
                {result ? (
                  <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-primary-100 animate-in fade-in slide-in-from-bottom-4 space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-primary-600 uppercase tracking-wider mb-2 flex items-center">
                        <Sparkles size={16} className="mr-1.5" /> AI Recommendation
                      </h3>
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`text-xl font-bold ${
                          result.suitability?.toLowerCase().includes('suitable') ? 'text-emerald-500' :
                          result.suitability?.toLowerCase().includes('moderate') ? 'text-amber-500' : 'text-rose-500'
                        }`}>
                          {result.suitability}
                        </span>
                      </div>
                      
                      <div className="bg-background rounded-xl p-4 border border-default mb-6">
                        <p className="text-main">{result.weatherSummary}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <p className="text-xs font-bold text-dim uppercase tracking-wider mb-1">Recommended Time</p>
                          <p className="font-semibold text-main">{result.bestTime}</p>
                        </div>
                        {result.alternativeTime && (
                          <div>
                            <p className="text-xs font-bold text-dim uppercase tracking-wider mb-1">Alternative</p>
                            <p className="font-semibold text-sub">{result.alternativeTime}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {result.weatherRisks?.length > 0 && (
                      <div className="border-t border-default pt-6">
                        <h4 className="font-bold text-main mb-3 flex items-center gap-2">
                          <Info size={16} className="text-amber-500" /> Weather Risks
                        </h4>
                        <ul className="space-y-2">
                          {result.weatherRisks.map((risk, idx) => (
                            <li key={idx} className="text-sm text-sub flex items-start">
                              <span className="text-amber-500 mr-2 mt-0.5">•</span>{risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.tips?.length > 0 && (
                      <div className="border-t border-default pt-6">
                        <h4 className="font-bold text-main mb-3">Preparation Tips</h4>
                        <ul className="space-y-2">
                          {result.tips.map((tip, idx) => (
                            <li key={idx} className="text-sm text-sub flex items-start">
                              <span className="text-primary-500 mr-2 mt-0.5">✓</span>{tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-surface-secondary/50 rounded-3xl border border-dashed border-default min-h-[300px]">
                    <Compass className="w-12 h-12 text-sub mb-4" />
                    <h3 className="text-sub font-medium">Check the weather before heading outdoors.</h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OutdoorActivity;



