import React, { useState } from 'react';
import { useHealth } from '../store';
import { ArrowRight, Check, Dna } from 'lucide-react';

const OnboardingView: React.FC = () => {
  const { completeOnboarding } = useHealth();
  const [step, setStep] = useState(1);
  
  const [data, setData] = useState({
    name: '',
    age: 30,
    gender: '' as 'Male' | 'Female' | 'Non-binary' | 'Other',
    goals: [] as string[],
    medicalHistory: '',
    geneticRisks: '',
    concerns: [] as string[],
  });

  const availableGoals = ["Lose Weight", "Build Muscle", "Sleep Better", "Reduce Stress", "Improve Endurance"];
  
  const toggleGoal = (goal: string) => {
    setData(prev => ({
        ...prev, 
        goals: prev.goals.includes(goal) 
            ? prev.goals.filter(g => g !== goal) 
            : [...prev.goals, goal]
    }));
  };

  const nextStep = () => setStep(s => s + 1);
  const finish = () => completeOnboarding(data);

  return (
    <div className="min-h-screen bg-indian-cream/30 flex flex-col items-center justify-center p-4">
       <div className="w-full max-w-lg glass-card p-6 md:p-8 rounded-3xl shadow-lg-lg border border-indian-brown/10">
          <div className="mb-6 flex justify-between items-center">
             <span className="text-indian-green font-bold uppercase tracking-widest text-xs">Step {step} of 2</span>
             <div className="flex gap-1">
                {[1, 2].map(i => (
                    <div key={i} className={`h-1 w-8 rounded-full ${step >= i ? 'bg-indian-cream/500' : 'bg-slate-200'}`} />
                ))}
             </div>
          </div>

          {step === 1 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-8 animate-slide-up">
                <h2 className="text-2xl font-bold text-indian-brown">Let's get to know you.</h2>
                <div>
                   <label className="block text-sm font-medium text-indian-brown/90 mb-1">First Name</label>
                   <input 
                     type="text" 
                     className="w-full border border-indian-brown/20 rounded-xl p-3 focus:ring-2 focus:ring-indian-orange outline-none"
                     placeholder="Your name"
                     value={data.name}
                     onChange={e => setData({...data, name: e.target.value})}
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-indian-brown/90 mb-1">Age</label>
                    <input 
                      type="number" 
                      className="w-full border border-indian-brown/20 rounded-xl p-3 focus:ring-2 focus:ring-indian-orange outline-none"
                      value={data.age}
                      onChange={e => setData({...data, age: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-indian-brown/90 mb-1">Gender</label>
                    <select
                      className="w-full border border-indian-brown/20 rounded-xl p-3 focus:ring-2 focus:ring-indian-orange outline-none glass-card"
                      value={data.gender}
                      onChange={e => setData({...data, gender: e.target.value as any})}
                    >
                      <option value="" disabled>Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <button onClick={nextStep} disabled={!data.name || !data.gender} className="w-full bg-indian-orange hover:bg-indian-brown text-white py-3 rounded-xl font-bold mt-4 disabled:opacity-50">Continue</button>
             </div>
          )}

          {step === 2 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-8 animate-slide-up">
                <h2 className="text-2xl font-bold text-indian-brown">What are your goals?</h2>
                <div className="space-y-2">
                    {availableGoals.map(g => (
                        <button 
                          key={g}
                          onClick={() => toggleGoal(g)}
                          className={`w-full p-3 rounded-xl text-left flex justify-between items-center border transition-all ${
                             data.goals.includes(g) 
                                ? 'border-indian-green bg-indian-cream/50 text-indian-brown font-bold' 
                                : 'border-indian-brown/20 hover:border-teal-300'
                          }`}
                        >
                            {g}
                            {data.goals.includes(g) && <Check size={18} />}
                        </button>
                    ))}
                </div>
                <button onClick={finish} className="w-full bg-indian-orange hover:bg-indian-brown text-white py-3 rounded-xl font-bold mt-4 flex items-center justify-center gap-2">
                    Get Started <ArrowRight size={18} />
                </button>
             </div>
          )}
       </div>
    </div>
  );
};

export default OnboardingView;
