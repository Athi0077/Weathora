import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, CloudSun, Map, Compass, Menu, X, Briefcase, Sparkles, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';

const MobileNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isAuthenticated) return null;

  // Don't show on auth pages
  if (['/', '/login', '/signup'].includes(location.pathname)) return null;

  const navItems = [
    { icon: LayoutDashboard, label: 'Dash', path: '/dashboard' },
    { icon: CloudSun, label: 'Weather', path: '/current-weather' },
    { icon: Map, label: 'Plan', path: '/trip-planner' },
    { icon: Compass, label: 'Activity', path: '/outdoor-activity' },
  ];

  const menuItems = [
    { icon: Briefcase, label: 'My Trips', path: '/my-trips' },
    { icon: Sparkles, label: 'Work Planner', path: '/work-planner' },
    { icon: FileText, label: 'AI Reports', path: '/ai-reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = async () => {
    setIsMenuOpen(false);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleNavigate = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[90]" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="absolute bottom-20 right-4 bg-surface rounded-2xl p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-default min-w-[200px] animate-in slide-in-from-bottom-4 fade-in duration-200 origin-bottom-right"
            onClick={e => e.stopPropagation()}
          >
            <div className="space-y-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <button
                    key={index}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-main hover:bg-surface-hover font-medium'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-primary-600' : 'text-sub'} />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
              
              <div className="h-px bg-surface-secondary my-2"></div>
              
              <div className="w-full flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-main">Theme</span>
                <ThemeToggle />
              </div>

              <div className="h-px bg-surface-secondary my-2"></div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
              >
                <LogOut size={18} className="text-red-500" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navbar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-default z-[100] px-2 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          
          return (
            <button
              key={index}
              onClick={() => handleNavigate(item.path)}
              className={`flex flex-col items-center justify-center w-[20%] py-3 ${
                isActive ? 'text-primary-600' : 'text-sub hover:text-main'
              }`}
            >
              <Icon size={22} className={isActive ? 'fill-primary-50 text-primary-600' : ''} />
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </button>
          );
        })}
        
        {/* More Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex flex-col items-center justify-center w-[20%] py-3 ${
            isMenuOpen ? 'text-primary-600' : 'text-sub hover:text-main'
          }`}
        >
          <Menu size={22} className={isMenuOpen ? 'text-primary-600' : ''} />
          <span className="text-[10px] font-medium mt-1">Menu</span>
        </button>
      </div>
    </>
  );
};

export default MobileNavbar;

