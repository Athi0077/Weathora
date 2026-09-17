import ThemeToggle from '../components/common/ThemeToggle';
import logoImg from '../assets/logo.png';
import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Map, Sparkles } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="glass-card p-6 flex flex-col items-center text-center glass-card-hover">
    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-semibold text-main mb-2">{title}</h3>
    <p className="text-sub text-sm leading-relaxed">{description}</p>
  </div>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center space-x-2">
          <img src={logoImg} alt="Weathora Logo" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold text-main tracking-tight">Weathora</span>
        </div>
        <div className="flex items-center space-x-4">
              <ThemeToggle />
          <Link to="/login" className="text-sub hover:text-main font-medium transition-colors">Sign In</Link>
          <Link to="/signup" className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-sm hover:shadow">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center pt-16 pb-24">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-main tracking-tight mb-6 max-w-4xl">
          Plan smarter with the <span className="text-primary-500">weather.</span>
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-sub max-w-2xl mx-auto mb-10">
          Weathora helps you understand weather conditions before planning trips, outdoor activities, work, and events.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <Link to="/signup" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-medium transition-all shadow-md hover:shadow-lg w-full sm:w-auto">
            Get Started
          </Link>
          <Link to="/login" className="bg-surface hover:bg-surface-hover text-main border border-default px-8 py-3 rounded-full font-medium transition-all shadow-sm hover:shadow w-full sm:w-auto">
            Sign In
          </Link>
        </div>

        {/* Feature Previews */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
          <FeatureCard 
            icon={Cloud} 
            title="Weather Intelligence" 
            description="Understand current and forecast weather conditions with precision and clarity."
          />
          <FeatureCard 
            icon={Map} 
            title="Smart Planning" 
            description="Plan trips and outdoor activities based on optimal weather windows."
          />
          <FeatureCard 
            icon={Sparkles} 
            title="AI Recommendations" 
            description="Get intelligent recommendations based on weather and your specific plans."
          />
        </div>
      </main>
    </div>
  );
};

export default Home;



