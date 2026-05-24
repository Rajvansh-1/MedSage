import React from 'react';
import { useHealth } from '../store';
import { ViewState } from '../types';
import { BicepsFlexed, Utensils, Moon, History, ActivityHeart, Smile } from 'lucide-react';

interface WellnessModeViewProps {
  onNavigate: (view: ViewState) => void;
}

const WellnessModeView: React.FC<WellnessModeViewProps> = ({ onNavigate }) => {
  const { profile } = useHealth();

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24 md:pb-8 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-indian-brown mb-2 flex items-center gap-3">
          Wellness Mode <Smile className="text-indian-green" size={32} />
        </h1>
        <p className="text-indian-brown/70 text-lg max-w-2xl">
          Namaste, {profile.name || 'Friend'}. This is your calm space for long-term health context collection and personalized wellness tracking.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        
        {/* Physical Activity */}
        <button 
          onClick={() => onNavigate('PHYSICAL')}
          className="group relative overflow-hidden glass-card p-6 md:p-8 rounded-3xl text-left border border-indian-brown/10 hover:border-indian-orange/30 transition-all duration-300 hover:-translate-y-1 shadow-lg-lg"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
            <BicepsFlexed size={120} />
          </div>
          <div className="bg-indian-orange/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-indian-orange">
            <BicepsFlexed size={28} />
          </div>
          <h2 className="text-2xl font-bold text-indian-brown mb-2">Physical Activity</h2>
          <p className="text-indian-brown/70 font-medium">
            Track your workouts, log exercises, and consult your personal AI trainer to build strength and stamina.
          </p>
        </button>

        {/* Nutrition Habits */}
        <button 
          onClick={() => onNavigate('DIETITIAN')}
          className="group relative overflow-hidden glass-card p-6 md:p-8 rounded-3xl text-left border border-indian-brown/10 hover:border-indian-green/30 transition-all duration-300 hover:-translate-y-1 shadow-lg-lg"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
            <Utensils size={120} />
          </div>
          <div className="bg-indian-green/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-indian-green">
            <Utensils size={28} />
          </div>
          <h2 className="text-2xl font-bold text-indian-brown mb-2">Nutrition Habits</h2>
          <p className="text-indian-brown/70 font-medium">
            Log your meals, count macros, and get culturally tailored dietary advice from your AI Dietitian.
          </p>
        </button>

        {/* Sleep Specialist */}
        <button 
          onClick={() => onNavigate('SLEEP')}
          className="group relative overflow-hidden glass-card p-6 md:p-8 rounded-3xl text-left border border-indian-brown/10 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 shadow-lg-lg"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
            <Moon size={120} />
          </div>
          <div className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
            <Moon size={28} />
          </div>
          <h2 className="text-2xl font-bold text-indian-brown mb-2">Sleep Specialist</h2>
          <p className="text-indian-brown/70 font-medium">
            Monitor sleep quality, analyze dreams, and improve your circadian rhythm with personalized insights.
          </p>
        </button>

        {/* Past Reports / Counselor */}
        <button 
          onClick={() => onNavigate('COUNSELOR')}
          className="group relative overflow-hidden glass-card p-6 md:p-8 rounded-3xl text-left border border-indian-brown/10 hover:border-rose-500/30 transition-all duration-300 hover:-translate-y-1 shadow-lg-lg"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
            <History size={120} />
          </div>
          <div className="bg-rose-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-rose-500">
            <History size={28} />
          </div>
          <h2 className="text-2xl font-bold text-indian-brown mb-2">Past Reports & Wellbeing</h2>
          <p className="text-indian-brown/70 font-medium">
            Review your historical data, mental wellbeing logs, and past AI-generated clinical insights.
          </p>
        </button>

      </div>
    </div>
  );
};

export default WellnessModeView;
