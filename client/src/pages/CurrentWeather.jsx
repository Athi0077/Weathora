import ThemeToggle from '../components/common/ThemeToggle';
import logoImg from '../assets/logo.png';
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useWeather } from '../context/WeatherContext';
import { 
  LogOut, CloudSun, Map, Compass, Briefcase, Sparkles, Cloud, LayoutDashboard, 
  MapPin, RefreshCw, Droplets, Wind, Eye, Gauge, AlertCircle, Calendar
, FileText, Settings, Star} from 'lucide-react';
import { getWeatherIconUrl, groupForecastByDay } from '../utils/weatherUtils';
import LocationSelector from '../components/location/LocationSelector';

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

const CurrentWeather = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { location, weatherData, loading, error, refreshWeather } = useWeather();
  const [showLocationSelector, setShowLocationSelector] = React.useState(false);

  // When location changes, close location selector
  useEffect(() => {
    if (location) {
      setShowLocationSelector(false);
    }
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const current = weatherData?.current;
  const forecast = weatherData?.forecast;
  
  // Get today's upcoming 3-hour forecasts (up to 8 for next 24 hours)
  const todayForecast = forecast ? forecast.slice(0, 8) : [];
  const dailySummary = groupForecastByDay(forecast);

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

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 lg:py-10 overflow-y-auto">
          
          {!location || showLocationSelector ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-full relative max-w-md mx-auto">
                {location && (
                  <button 
                    onClick={() => setShowLocationSelector(false)}
                    className="absolute -top-12 right-0 text-sm font-medium text-sub hover:text-main"
                  >
                    Cancel
                  </button>
                )}
                <LocationSelector />
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              
              {/* Location & Status Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-surface p-4 sm:px-6 sm:py-4 rounded-2xl border border-default shadow-sm">
                <div>
                  <h1 className="text-2xl font-bold text-main flex items-center">
                    <MapPin className="text-primary-500 mr-2" size={24} />
                    {location.name}{location.state ? `, ${location.state}` : ''}
                  </h1>
                  <p className="text-sub text-sm mt-1 ml-8">Updated just now</p>
                </div>
                
                <div className="flex items-center space-x-3 ml-8 sm:ml-0">
                  <button 
                    onClick={() => setShowLocationSelector(true)}
                    className="text-sm font-medium text-sub bg-surface-secondary hover:bg-surface-hover px-4 py-2 rounded-full transition-colors"
                  >
                    Change Location
                  </button>
                  <button 
                    onClick={refreshWeather}
                    disabled={loading}
                    className="flex items-center space-x-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-full transition-colors disabled:opacity-70"
                  >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>
              </div>

              {loading && !current ? (
                <div className="animate-pulse space-y-6">
                  <div className="h-64 bg-surface-secondary rounded-3xl w-full"></div>
                  <div className="h-48 bg-surface-secondary rounded-2xl w-full"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-600 p-8 rounded-3xl flex flex-col items-center justify-center text-center border border-red-100">
                  <AlertCircle size={48} className="text-red-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Unable to load weather</h3>
                  <p className="max-w-md">{error}</p>
                  <button 
                    onClick={refreshWeather}
                    className="mt-6 bg-surface text-red-600 border border-red-200 px-6 py-2 rounded-full font-medium hover:bg-red-50 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : current && (
                <div className="space-y-6">
                  
                  {/* Hero Weather Card */}
                  <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg">
                    {/* Decorative background circles */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-surface opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-surface opacity-10 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-8">
                      <div className="text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start -ml-4 mb-2">
                          {current.icon && (
                            <img 
                              src={getWeatherIconUrl(current.icon)} 
                              alt={current.condition}
                              className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-md"
                            />
                          )}
                          <div className="text-6xl sm:text-8xl font-bold tracking-tighter">
                            {current.temperature}°
                          </div>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-semibold capitalize ml-2">{current.description}</h2>
                        <p className="text-primary-100 text-lg mt-1 ml-2">Feels like {current.feelsLike}°C</p>
                      </div>
                      
                      {/* Key metrics grid */}
                      <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full sm:w-auto mt-4 sm:mt-0 bg-surface/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
                        <div>
                          <p className="text-primary-100 text-sm flex items-center mb-1"><Droplets size={14} className="mr-1.5" /> Humidity</p>
                          <p className="text-xl font-semibold">{current.humidity}%</p>
                        </div>
                        <div>
                          <p className="text-primary-100 text-sm flex items-center mb-1"><Wind size={14} className="mr-1.5" /> Wind</p>
                          <p className="text-xl font-semibold">{current.windSpeed} m/s</p>
                        </div>
                        <div>
                          <p className="text-primary-100 text-sm flex items-center mb-1"><Gauge size={14} className="mr-1.5" /> Pressure</p>
                          <p className="text-xl font-semibold">{current.pressure} hPa</p>
                        </div>
                        <div>
                          <p className="text-primary-100 text-sm flex items-center mb-1"><Eye size={14} className="mr-1.5" /> Visibility</p>
                          <p className="text-xl font-semibold">{(current.visibility / 1000).toFixed(1)} km</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Forecast Sections */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Today's Hourly Forecast */}
                    <div className="lg:col-span-2 glass-card p-6 border-default">
                      <h3 className="text-lg font-bold text-main mb-4 flex items-center">
                        <CloudSun className="text-primary-500 mr-2" size={20} />
                        Today's Forecast
                      </h3>
                      
                      <div className="flex overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide space-x-3 sm:space-x-4">
                        {todayForecast.map((item, index) => {
                          const date = new Date(item.dateText);
                          const timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
                          
                          return (
                            <div key={index} className="flex-shrink-0 flex flex-col items-center bg-background border border-default rounded-2xl p-4 min-w-[80px]">
                              <p className="text-xs font-medium text-sub mb-2">{timeString}</p>
                              {item.icon && (
                                <img src={getWeatherIconUrl(item.icon)} alt={item.condition} className="w-12 h-12" />
                              )}
                              <p className="text-lg font-bold text-main mt-1">{item.temperature}°</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 5-Day Summary */}
                    <div className="glass-card p-6 border-default">
                      <h3 className="text-lg font-bold text-main mb-4 flex items-center">
                        <Calendar className="text-primary-500 mr-2" size={20} />
                        5-Day Forecast
                      </h3>
                      
                      <div className="space-y-4">
                        {dailySummary.map((day, index) => (
                          <div key={index} className="flex items-center justify-between border-b border-default pb-3 last:border-0 last:pb-0">
                            <span className="w-20 font-medium text-main">{day.dayName}</span>
                            <div className="flex items-center flex-1 justify-center">
                              {day.icon && (
                                <img src={getWeatherIconUrl(day.icon)} alt={day.condition} className="w-8 h-8 mr-2" />
                              )}
                              <span className="text-xs text-sub w-16 text-center">{day.rainChance > 0 ? `${day.rainChance}% 💧` : ''}</span>
                            </div>
                            <div className="w-24 text-right">
                              <span className="font-bold text-main">{day.maxTemp}°</span>
                              <span className="text-dim mx-1">/</span>
                              <span className="text-sub font-medium">{day.minTemp}°</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CurrentWeather;



