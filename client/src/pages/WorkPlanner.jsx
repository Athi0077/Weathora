import ThemeToggle from '../components/common/ThemeToggle';
import logoImg from '../assets/logo.png';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { HardHat, Cloud, LogOut, LayoutDashboard, CloudSun, Map, Briefcase, Compass, Sparkles, MapPin, Loader2, AlertTriangle, Clock , FileText, Settings} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import workService from '../services/workService';

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

const workTypes = [
  'Construction', 'Agriculture', 'Outdoor Maintenance', 'Delivery', 
  'Field Inspection', 'Photography', 'Event Setup', 'Outdoor Installation', 
  'Road Work', 'Other'
];

const WorkPlanner = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { location } = useWeather();
  
  const [formData, setFormData] = useState({
    workType: 'Construction',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    workers: 1,
    notes: ''
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
      const data = await workService.analyzeWork({
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

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 lg:py-10 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-main tracking-tight">Work Planner</h1>
              <p className="text-sub mt-2">Plan your outdoor work around available weather conditions.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-default h-fit">
                <form onSubmit={handleAnalyze} className="space-y-6">
                  
                  <div>
                    <label className="block text-sm font-bold text-main mb-2">Location</label>
                    <div className="w-full bg-background border border-default rounded-xl px-4 py-3 text-main flex items-center">
                      <MapPin size={18} className="text-dim mr-2" />
                      {location ? location.name : 'No location selected'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-main mb-2">Work Type</label>
                    <select 
                      name="workType" 
                      value={formData.workType} 
                      onChange={handleChange}
                      className="w-full bg-background border border-default rounded-xl px-4 py-3 text-main focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                      {workTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <label className="block text-sm font-bold text-main mb-2">Workers</label>
                      <input 
                        type="number" 
                        name="workers"
                        min="1"
                        value={formData.workers}
                        onChange={handleChange}
                        className="w-full bg-background border border-default rounded-xl px-4 py-3 text-main focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-main mb-2">Start Time</label>
                      <select name="startTime" value={formData.startTime} onChange={handleChange} className="w-full bg-background border border-default rounded-xl px-4 py-3 text-main">
                        <option>06:00 AM</option><option>07:00 AM</option><option>08:00 AM</option><option>09:00 AM</option>
                        <option>10:00 AM</option><option>11:00 AM</option><option>12:00 PM</option><option>01:00 PM</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-main mb-2">End Time</label>
                      <select name="endTime" value={formData.endTime} onChange={handleChange} className="w-full bg-background border border-default rounded-xl px-4 py-3 text-main">
                        <option>12:00 PM</option><option>01:00 PM</option><option>02:00 PM</option><option>03:00 PM</option>
                        <option>04:00 PM</option><option>05:00 PM</option><option>06:00 PM</option><option>07:00 PM</option>
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
                    className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-surface hover:bg-surface focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 transition-colors"
                  >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Work Plan'}
                  </button>
                </form>
              </div>

              {/* Result */}
              <div>
                {result ? (
                  <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm border border-primary-100 animate-in fade-in slide-in-from-bottom-4 space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-primary-600 uppercase tracking-wider mb-3 flex items-center">
                        <Sparkles size={16} className="mr-1.5" /> AI Recommendation
                      </h3>
                      
                      <div className="bg-background rounded-xl p-4 border border-default mb-6">
                        <p className="text-main">{result.weatherSummary}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-emerald-500 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-dim uppercase tracking-wider mb-1">Recommended Window</p>
                            <p className="font-semibold text-main">{result.recommendedWindow}</p>
                          </div>
                        </div>
                        {result.backupWindow && (
                          <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-dim mt-0.5" />
                            <div>
                              <p className="text-xs font-bold text-dim uppercase tracking-wider mb-1">Backup Window</p>
                              <p className="font-semibold text-sub">{result.backupWindow}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {result.weatherConcerns?.length > 0 && (
                      <div className="border-t border-default pt-6">
                        <h4 className="font-bold text-main mb-3 flex items-center gap-2">
                          <AlertTriangle size={16} className="text-rose-500" /> Weather Concerns
                        </h4>
                        <ul className="space-y-2">
                          {result.weatherConcerns.map((concern, idx) => (
                            <li key={idx} className="text-sm text-sub flex items-start">
                              <span className="text-rose-500 mr-2 mt-0.5">•</span>{concern}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.practicalPreparation?.length > 0 && (
                      <div className="border-t border-default pt-6">
                        <h4 className="font-bold text-main mb-3">Practical Preparation</h4>
                        <ul className="space-y-2">
                          {result.practicalPreparation.map((prep, idx) => (
                            <li key={idx} className="text-sm text-sub flex items-start">
                              <span className="text-primary-500 mr-2 mt-0.5">✓</span>{prep}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-surface-secondary/50 rounded-3xl border border-dashed border-default min-h-[300px]">
                    <HardHat className="w-12 h-12 text-sub mb-4" />
                    <h3 className="text-sub font-medium">Plan your outdoor work around available weather conditions.</h3>
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

export default WorkPlanner;



