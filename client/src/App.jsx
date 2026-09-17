import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CurrentWeather from './pages/CurrentWeather';
import TripPlanner from './pages/TripPlanner';
import MyTrips from './pages/MyTrips';
import TripDetails from './pages/TripDetails';
import OutdoorActivity from './pages/OutdoorActivity';
import WorkPlanner from './pages/WorkPlanner';
import Notifications from './pages/Notifications';
import AIReports from './pages/AIReports';
import AIReportDetails from './pages/AIReportDetails';
import Settings from './pages/Settings';
import MobileNavbar from './components/layout/MobileNavbar';
import WeatherAnimation from './components/dashboard/WeatherAnimation';
import FloatingAIAssistant from './components/dashboard/FloatingAIAssistant';
import { Loader2 } from 'lucide-react';

const AuthRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const GlobalWeather = () => {
  const { isAuthenticated } = useAuth();
  const { weatherData } = useWeather();
  
  if (!isAuthenticated) return null;
  
  return (
    <>
      <WeatherAnimation weather={weatherData?.current} />
      <FloatingAIAssistant />
    </>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route 
        path="/login" 
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <AuthRoute>
            <Signup />
          </AuthRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/current-weather" 
        element={
          <ProtectedRoute>
            <CurrentWeather />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/trip-planner" 
        element={
          <ProtectedRoute>
            <TripPlanner />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-trips" 
        element={
          <ProtectedRoute>
            <MyTrips />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/trip/:id" 
        element={
          <ProtectedRoute>
            <TripDetails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/outdoor-activity" 
        element={
          <ProtectedRoute>
            <OutdoorActivity />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/work-planner" 
        element={
          <ProtectedRoute>
            <WorkPlanner />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/notifications" 
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ai-reports" 
        element={
          <ProtectedRoute>
            <AIReports />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ai-reports/:id" 
        element={
          <ProtectedRoute>
            <AIReportDetails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WeatherProvider>
          <Router>
            <GlobalWeather />
            <AppRoutes />
            <MobileNavbar />
          </Router>
        </WeatherProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

