import React, { useState, useEffect } from 'react';
import { HealthProvider, useHealth } from './store';
import { ViewState } from './types';
import { 
  Activity, 
  Utensils, 
  Moon, 
  MessageCircleHeart, 
  LayoutDashboard, 
  UserCircle,
  Stethoscope,
  BicepsFlexed
} from 'lucide-react';

// Sub-components
import DashboardView from './components/DashboardView';
import DietitianView from './components/DietitianView';
import PhysicalView from './components/PhysicalView';
import SleepView from './components/SleepView';
import CounselorView from './components/CounselorView';
import AuthView from './components/AuthView';
import OnboardingView from './components/OnboardingView';
import MedicalView from './components/MedicalView';
import ProfileView from './components/ProfileView';
import WellnessModeView from './components/WellnessModeView';

const NavigationItem: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-indian-orange text-white shadow-md font-semibold' 
        : 'text-indian-brown hover:bg-white/50 hover:text-indian-orange font-medium'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const MainContent: React.FC<{ view: ViewState; setCurrentView: (view: ViewState) => void }> = ({ view, setCurrentView }) => {
  switch (view) {
    case 'DASHBOARD': return <DashboardView />;
    case 'WELLNESS': return <WellnessModeView onNavigate={setCurrentView} />;
    case 'DIETITIAN': return <DietitianView />;
    case 'PHYSICAL': return <PhysicalView />;
    case 'SLEEP': return <SleepView />;
    case 'COUNSELOR': return <CounselorView />;
    case 'MEDICAL': return <MedicalView />;
    case 'PROFILE': return <ProfileView />;
    default: return <DashboardView />;
  }
};

const AppShell: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('MEDICAL');
  const { profile, isAuthenticated, onboardingComplete } = useHealth();

  if (!isAuthenticated) return <AuthView />;
  if (!onboardingComplete) return <OnboardingView />;

  return (
    <div className="flex h-screen w-full bg-indian-cream overflow-hidden flex-col md:flex-row">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden glass-panel border-b border-indian-brown/10 p-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center space-x-2 text-indian-green">
           <img src="/img/logo.jpeg" alt="MedSage Logo" className="w-8 h-8 rounded-full object-cover shadow-sm" />
           <div className="flex flex-col">
             <span className="font-bold text-lg leading-tight">MedSage</span>
             <span className="text-[10px] text-indian-orange font-semibold">भारत का स्वास्थ्य सहायक</span>
           </div>
        </div>
        <button onClick={() => setCurrentView('PROFILE')}>
           <div className="w-9 h-9 rounded-full bg-indian-cream flex items-center justify-center text-indian-green font-bold text-sm border border-indian-orange/30 shadow-sm">
              {profile.name[0]}
           </div>
        </button>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="w-64 glass-panel border-r border-indian-brown/10 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-indian-brown/10">
          <div className="flex items-center space-x-3 text-indian-green">
            <img src="/img/logo.jpeg" alt="MedSage Logo" className="w-10 h-10 rounded-full object-cover shadow-sm border border-white" />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight leading-tight">MedSage</span>
              <span className="text-xs text-indian-orange font-semibold">भारत का स्वास्थ्य सहायक</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavigationItem 
            active={currentView === 'DASHBOARD'} 
            onClick={() => setCurrentView('DASHBOARD')} 
            icon={<LayoutDashboard size={20} />} 
            label="Overview" 
          />
          <NavigationItem 
            active={['WELLNESS', 'DIETITIAN', 'PHYSICAL', 'SLEEP', 'COUNSELOR'].includes(currentView)} 
            onClick={() => setCurrentView('WELLNESS')} 
            icon={<Activity size={20} />} 
            label="Wellness Mode" 
          />
           <NavigationItem 
            active={currentView === 'MEDICAL'} 
            onClick={() => setCurrentView('MEDICAL')} 
            icon={<Stethoscope size={20} className={currentView === 'MEDICAL' ? "text-white" : "text-indian-green"} />} 
            label="Clinical Copilot" 
          />
        </nav>

        <div className="p-4 border-t border-indian-brown/10">
           <button 
             onClick={() => setCurrentView('PROFILE')}
             className="flex items-center space-x-3 text-indian-brown hover:text-indian-orange w-full p-2 rounded-lg hover:bg-white/50 transition-colors"
           >
             <div className="w-8 h-8 rounded-full bg-indian-cream border border-indian-orange/30 flex items-center justify-center text-indian-green font-bold uppercase shadow-sm">
               {profile.name[0]}
             </div>
             <div className="text-sm text-left">
               <p className="font-semibold text-indian-green">{profile.name}</p>
               <p className="text-xs text-indian-brown/70">View Profile</p>
             </div>
           </button>
        </div>
      </aside>

      {/* Mobile Nav (Bottom Fixed) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-indian-brown/10 flex justify-around p-3 z-50 pb-safe shadow-[0_-4px_10px_-1px_rgba(146,64,14,0.1)]">
        <button onClick={() => setCurrentView('DASHBOARD')} className={`p-2 rounded-full transition-colors ${currentView === 'DASHBOARD' ? 'text-white bg-indian-orange shadow-md' : 'text-indian-brown/70 hover:text-indian-orange'}`}><LayoutDashboard size={24} /></button>
        <button onClick={() => setCurrentView('WELLNESS')} className={`p-2 rounded-full transition-colors ${['WELLNESS', 'DIETITIAN', 'PHYSICAL', 'SLEEP', 'COUNSELOR'].includes(currentView) ? 'text-white bg-indian-orange shadow-md' : 'text-indian-brown/70 hover:text-indian-orange'}`}><Activity size={24} /></button>
        <button onClick={() => setCurrentView('MEDICAL')} className={`p-2 rounded-full transition-colors ${currentView === 'MEDICAL' ? 'text-white bg-indian-orange shadow-md' : 'text-indian-brown/70 hover:text-indian-orange'}`}><Stethoscope size={24} /></button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full pb-20 md:pb-0">
        <MainContent view={currentView} setCurrentView={setCurrentView} />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HealthProvider>
      <AppShell />
    </HealthProvider>
  );
};

export default App;
