import ThemeToggle from '../components/common/ThemeToggle';
import logoImg from '../assets/logo.png';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2, CloudLightning, Map, Settings, FileText, LayoutDashboard, CloudSun, Compass, Briefcase, Sparkles, Cloud, LogOut , Star} from 'lucide-react';
import notificationService from '../services/notificationService';


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

const Notifications = () => {

  const { user, logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data.data || []);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (error) {
      console.error('Failed to delete notification', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await handleMarkAsRead(notification._id);
    }
    
    // Navigate based on type
    switch (notification.type) {
      case 'weather_alert':
        navigate('/current-weather');
        break;
      case 'trip_reminder':
        if (notification.data?.tripId) {
          navigate(`/trip/${notification.data.tripId}`);
        } else {
          navigate('/my-trips');
        }
        break;
      case 'ai_report':
        if (notification.data?.reportId) {
          navigate(`/ai-reports/${notification.data.reportId}`);
        } else {
          navigate('/ai-reports');
        }
        break;
      case 'activity_alert':
        navigate('/outdoor-activity');
        break;
      case 'work_alert':
        navigate('/work-planner');
        break;
      default:
        break;
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'weather_alert':
      case 'weather_change':
        return <CloudLightning className="text-orange-500" size={24} />;
      case 'trip_reminder':
        return <Map className="text-blue-500" size={24} />;
      case 'ai_report':
        return <FileText className="text-indigo-500" size={24} />;
      default:
        return <Bell className="text-sub" size={24} />;
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

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-main">Notifications</h1>
            <p className="text-sub">Stay updated on your plans and weather</p>
          </div>
          {notifications.some(n => !n.isRead) && (
            <button 
              onClick={handleMarkAllRead}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-4 py-2 rounded-lg transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-surface p-4 rounded-xl border border-default animate-pulse flex items-start space-x-4">
                <div className="w-12 h-12 bg-surface-secondary rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-secondary rounded w-1/4"></div>
                  <div className="h-3 bg-surface-secondary rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-surface p-12 rounded-2xl border border-default text-center">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="text-dim" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-main mb-2">You're all caught up</h3>
            <p className="text-sub">No new notifications right now.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map(notification => (
              <div 
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-surface p-4 sm:p-5 rounded-xl border transition-all cursor-pointer flex items-start space-x-4 ${
                  !notification.isRead ? 'border-primary-200 shadow-sm bg-primary-50/10' : 'border-default hover:border-default'
                }`}
              >
                <div className={`p-3 rounded-full shrink-0 ${!notification.isRead ? 'bg-surface shadow-sm' : 'bg-background'}`}>
                  {getIconForType(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-base font-semibold truncate pr-4 ${!notification.isRead ? 'text-main' : 'text-main'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-dim whitespace-nowrap">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed mb-3 ${!notification.isRead ? 'text-main font-medium' : 'text-sub'}`}>
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center space-x-3 mt-2">
                    {!notification.isRead && (
                      <button 
                        onClick={(e) => handleMarkAsRead(notification._id, e)}
                        className="flex items-center space-x-1.5 text-xs font-medium text-sub hover:text-primary-600 transition-colors"
                      >
                        <Check size={14} />
                        <span>Mark as read</span>
                      </button>
                    )}
                    <button 
                      onClick={(e) => handleDelete(notification._id, e)}
                      className="flex items-center space-x-1.5 text-xs font-medium text-dim hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
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

export default Notifications;



