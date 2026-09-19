import ThemeToggle from '../components/common/ThemeToggle';
import logoImg from '../assets/logo.png';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, AlertTriangle, Lightbulb, Map, Compass, Briefcase, FileText, CloudSun, LayoutDashboard, Sparkles, Cloud, Settings, LogOut , Star} from 'lucide-react';
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

const AIReportDetails = () => {

  const { user, logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const fetchReportDetails = async () => {
    try {
      setLoading(true);
      const data = await aiReportService.getReportById(id);
      setReport(data);
    } catch (err) {
      console.error('Failed to fetch report', err);
      setError('Could not load report details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
        <AlertTriangle size={48} className="text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-main mb-2">Something went wrong</h2>
        <p className="text-sub mb-6">{error}</p>
        <button 
          onClick={() => navigate('/ai-reports')}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-xl transition-colors"
        >
          Back to Reports
        </button>
      </div>
    );
  }

  
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
        <button 
          onClick={() => navigate('/ai-reports')}
          className="flex items-center text-sub hover:text-primary-600 transition-colors mb-6 group"
        >
          <ArrowLeft size={16} className="mr-1.5 transform group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Reports</span>
        </button>

        <div className="bg-surface rounded-2xl shadow-sm border border-default overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-primary-500 opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-primary-200 mb-2 font-medium text-sm">
                  <FileText size={16} />
                  <span>AI-Generated Report</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Planning Intelligence</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-sub">
                  <span className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {report.location?.name || 'Unknown Location'}
                  </span>
                  <span className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    Generated: {new Date(report.generatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Weather & Planning Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                <h3 className="flex items-center text-blue-900 font-semibold mb-3">
                  <CloudSun size={18} className="mr-2 text-blue-600" />
                  Weather Summary
                </h3>
                <p className="text-main leading-relaxed text-sm">
                  {report.weatherSummary}
                </p>
                <div className="mt-4 text-xs font-medium text-dim">
                  Weather data source: OpenWeather
                </div>
              </div>
              
              <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100">
                <h3 className="flex items-center text-emerald-900 font-semibold mb-3">
                  <Lightbulb size={18} className="mr-2 text-emerald-600" />
                  Planning Summary
                </h3>
                <p className="text-main leading-relaxed text-sm">
                  {report.planningSummary}
                </p>
              </div>
            </div>

            {/* Alerts */}
            {report.alerts && report.alerts.length > 0 && (
              <section>
                <h3 className="text-lg font-bold text-main mb-4 flex items-center border-b pb-2">
                  <AlertTriangle size={20} className="text-red-500 mr-2" />
                  Important Alerts
                </h3>
                <div className="space-y-3">
                  {report.alerts.map((alert, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border flex items-start ${
                      alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                      alert.severity === 'medium' ? 'bg-orange-50 border-orange-200' : 'bg-yellow-50 border-yellow-200'
                    }`}>
                      <AlertTriangle size={20} className={`shrink-0 mr-3 ${
                        alert.severity === 'high' ? 'text-red-500' :
                        alert.severity === 'medium' ? 'text-orange-500' : 'text-yellow-500'
                      }`} />
                      <div>
                        <h4 className={`font-semibold mb-1 ${
                          alert.severity === 'high' ? 'text-red-900' :
                          alert.severity === 'medium' ? 'text-orange-900' : 'text-yellow-900'
                        }`}>{alert.title}</h4>
                        <p className={`text-sm ${
                          alert.severity === 'high' ? 'text-red-800' :
                          alert.severity === 'medium' ? 'text-orange-800' : 'text-yellow-800'
                        }`}>{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recommendations */}
            {report.recommendations && report.recommendations.length > 0 && (
              <section>
                <h3 className="text-lg font-bold text-main mb-4 flex items-center border-b pb-2">
                  <Lightbulb size={20} className="text-primary-500 mr-2" />
                  General Recommendations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {report.recommendations.map((rec, idx) => (
                    <div key={idx} className="bg-background p-4 rounded-xl border border-default">
                      <h4 className="font-semibold text-main mb-1">{rec.title}</h4>
                      <p className="text-sm text-sub">{rec.message}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Trip Insights */}
            {report.tripInsights && report.tripInsights.length > 0 && (
              <section>
                <h3 className="text-lg font-bold text-main mb-4 flex items-center border-b pb-2">
                  <Map size={20} className="text-blue-500 mr-2" />
                  Upcoming Trips
                </h3>
                <div className="space-y-4">
                  {report.tripInsights.map((insight, idx) => (
                    <div key={idx} className="flex items-start bg-surface p-4 rounded-xl border border-default shadow-sm">
                      <Map className="w-5 h-5 text-blue-500 mr-3 mt-0.5 shrink-0" />
                      <p className="text-main text-sm leading-relaxed">{insight.message}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Activity Insights */}
            {report.activityInsights && report.activityInsights.length > 0 && (
              <section>
                <h3 className="text-lg font-bold text-main mb-4 flex items-center border-b pb-2">
                  <Compass size={20} className="text-emerald-500 mr-2" />
                  Outdoor Activities
                </h3>
                <div className="space-y-4">
                  {report.activityInsights.map((insight, idx) => (
                    <div key={idx} className="flex items-start bg-surface p-4 rounded-xl border border-default shadow-sm">
                      <Compass className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 shrink-0" />
                      <p className="text-main text-sm leading-relaxed">{insight.message}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Work Insights */}
            {report.workInsights && report.workInsights.length > 0 && (
              <section>
                <h3 className="text-lg font-bold text-main mb-4 flex items-center border-b pb-2">
                  <Briefcase size={20} className="text-purple-500 mr-2" />
                  Work Plans
                </h3>
                <div className="space-y-4">
                  {report.workInsights.map((insight, idx) => (
                    <div key={idx} className="flex items-start bg-surface p-4 rounded-xl border border-default shadow-sm">
                      <Briefcase className="w-5 h-5 text-purple-500 mr-3 mt-0.5 shrink-0" />
                      <p className="text-main text-sm leading-relaxed">{insight.message}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIReportDetails;



