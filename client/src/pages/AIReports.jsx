import ThemeToggle from '../components/common/ThemeToggle';
import logoImg from '../assets/logo.png';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FileText, MapPin, Calendar, ArrowRight, Sparkles, LayoutDashboard, CloudSun, Map, Compass, Briefcase, Cloud, Settings, LogOut , Star} from 'lucide-react';
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

const AIReports = () => {

  const { user, logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await aiReportService.getReports();
      setReports(data.data || []);
    } catch (error) {
      console.error('Failed to fetch AI reports', error);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (dateString) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const daysDifference = Math.round((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference === 0) {
      return `Today — ${new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return rtf.format(daysDifference, 'day');
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

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-main flex items-center">
              <Sparkles className="text-primary-500 mr-2" size={24} />
              AI Report History
            </h1>
            <p className="text-sub mt-1">Your 6-hour periodic planning reports</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-surface p-6 rounded-2xl border border-default animate-pulse h-48">
                <div className="h-4 bg-surface-secondary rounded w-1/3 mb-4"></div>
                <div className="h-6 bg-surface-secondary rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-surface-secondary rounded w-full mb-2"></div>
                <div className="h-4 bg-surface-secondary rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-surface p-12 rounded-2xl border border-default text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-primary-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-main mb-2">No reports available yet</h3>
            <p className="text-sub max-w-md mx-auto">
              Your first periodic AI report will appear here automatically after the scheduler runs based on your upcoming plans and current weather conditions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map(report => (
              <div 
                key={report._id}
                onClick={() => navigate(`/ai-reports/${report._id}`)}
                className="bg-surface p-6 rounded-2xl border border-default hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-surface-secondary text-sub rounded-full">
                    {getRelativeTime(report.generatedAt)}
                  </span>
                  <div className="flex items-center text-dim text-sm font-medium">
                    <MapPin size={14} className="mr-1" />
                    <span className="truncate max-w-[120px]">{report.location?.name}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-main mb-2">
                  Planning Intelligence
                </h3>
                
                <p className="text-sm text-sub line-clamp-3 mb-6 flex-1">
                  {report.planningSummary}
                </p>
                
                <div className="mt-auto flex items-center justify-between text-sm font-medium text-primary-600 group-hover:text-primary-700 transition-colors">
                  <span>View Full Report</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIReports;



