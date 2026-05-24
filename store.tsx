import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppState, FoodEntry, ExerciseEntry, SleepEntry, ChatMessage, UserProfile, DailySummary } from './types';
import { synthesizeDailyReport } from './geminiService';
import { supabase } from './supabaseClient';

interface HealthContextType extends AppState {
  login: () => void;
  completeOnboarding: (profileData: Partial<UserProfile>) => Promise<void>;
  addFood: (food: FoodEntry) => Promise<void>;
  addExercise: (exercise: ExerciseEntry) => Promise<void>;
  setSleep: (sleep: SleepEntry) => Promise<void>;
  addChatMessage: (msg: ChatMessage) => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  setEmotion: (emotion: string) => void;
  triggerSynthesis: () => Promise<void>;
  resetDay: () => Promise<void>;
}

const defaultProfile: UserProfile = {
  name: "",
  age: 25,
  gender: "",
  goals: [],
  medicalHistory: "None",
  geneticRisks: "",
  concerns: [],
  height: undefined,
  weight: undefined
};

const defaultState: AppState = {
  isAuthenticated: false,
  onboardingComplete: false,
  daysActive: 1,
  profile: defaultProfile,
  foodLog: [],
  exerciseLog: [],
  sleepLog: null,
  chatHistory: [],
  currentEmotion: null,
  dailyConsensus: null,
  history: [],
  isSynthesizing: false,
};

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(defaultState);
  const [userId, setUserId] = useState<string | null>(null);

  // Initialize Anonymous User ID
  useEffect(() => {
    let storedId = localStorage.getItem('medsage_user_id');
    if (!storedId) {
      storedId = crypto.randomUUID();
      localStorage.setItem('medsage_user_id', storedId);
    }
    setUserId(storedId);
  }, []);

  // Hydrate state from Supabase
  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      // Load Profile
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileData) {
        setState(prev => ({
          ...prev,
          profile: {
            name: profileData.name,
            age: profileData.age,
            gender: profileData.gender,
            goals: profileData.goals,
            medicalHistory: profileData.medical_history,
            geneticRisks: profileData.genetic_risks,
            concerns: profileData.concerns,
            height: profileData.height,
            weight: profileData.weight
          },
          onboardingComplete: true
        }));
      }

      // Load Today's Food
      const today = new Date();
      today.setHours(0,0,0,0);
      
      const { data: foodData } = await supabase
        .from('food_logs')
        .select('*')
        .eq('profile_id', userId)
        .gte('created_at', today.toISOString());
      
      // Load Today's Exercise
      const { data: exerciseData } = await supabase
        .from('exercise_logs')
        .select('*')
        .eq('profile_id', userId)
        .gte('created_at', today.toISOString());

      // Load Today's Sleep
      const { data: sleepData } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('profile_id', userId)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      // Load History
      const { data: historyData } = await supabase
        .from('daily_summaries')
        .select('*')
        .eq('profile_id', userId)
        .order('created_at', { ascending: false });

      setState(prev => ({
        ...prev,
        foodLog: foodData ? foodData.map(f => ({
          id: f.id,
          name: f.name,
          calories: f.calories,
          protein: f.protein,
          carbs: f.carbs,
          fats: f.fats,
          timestamp: new Date(f.timestamp || f.created_at),
          notes: f.notes
        })) : [],
        exerciseLog: exerciseData ? exerciseData.map(e => ({
          id: e.id,
          type: e.type,
          durationMinutes: e.duration_minutes,
          intensity: e.intensity,
          caloriesBurned: e.calories_burned,
          timestamp: new Date(e.timestamp || e.created_at),
          notes: e.notes
        })) : [],
        sleepLog: sleepData && sleepData[0] ? {
          date: sleepData[0].date,
          bedTime: sleepData[0].bed_time,
          wakeTime: sleepData[0].wake_time,
          durationHours: sleepData[0].duration_hours,
          quality: sleepData[0].quality,
          dreamDescription: sleepData[0].dream_description,
          dreamAnalysis: sleepData[0].dream_analysis
        } : null,
        history: historyData ? historyData.map(h => ({
          date: h.date,
          consensus: h.consensus,
          caloriesIn: h.calories_in,
          caloriesBurned: h.calories_burned,
          mood: h.mood,
          details: h.details,
          foodLog: h.food_log,
          exerciseLog: h.exercise_log,
          sleepLog: h.sleep_log
        })) : [],
        daysActive: historyData ? historyData.length + 1 : 1
      }));
    };

    loadData();
  }, [userId]);

  const login = () => {
    setState(prev => ({ ...prev, isAuthenticated: true }));
  };

  const completeOnboarding = async (profileData: Partial<UserProfile>) => {
    if (!userId) return;
    
    const newProfile = { ...state.profile, ...profileData };
    
    // Upsert into Supabase
    await supabase.from('profiles').upsert({
      id: userId,
      name: newProfile.name,
      age: newProfile.age,
      gender: newProfile.gender,
      goals: newProfile.goals,
      medical_history: newProfile.medicalHistory,
      genetic_risks: newProfile.geneticRisks,
      concerns: newProfile.concerns,
      height: newProfile.height,
      weight: newProfile.weight
    });

    setState(prev => ({
      ...prev,
      profile: newProfile,
      onboardingComplete: true
    }));
  };

  const addFood = async (food: FoodEntry) => {
    if (userId) {
      await supabase.from('food_logs').insert({
        profile_id: userId,
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fats: food.fats,
        timestamp: food.timestamp.toISOString(),
        notes: food.notes
      });
    }
    setState(prev => ({ ...prev, foodLog: [...prev.foodLog, food] }));
  };

  const addExercise = async (exercise: ExerciseEntry) => {
    if (userId) {
      await supabase.from('exercise_logs').insert({
        profile_id: userId,
        type: exercise.type,
        duration_minutes: exercise.durationMinutes,
        intensity: exercise.intensity,
        calories_burned: exercise.caloriesBurned,
        timestamp: exercise.timestamp.toISOString(),
        notes: exercise.notes
      });
    }
    setState(prev => ({ ...prev, exerciseLog: [...prev.exerciseLog, exercise] }));
  };

  const setSleep = async (sleep: SleepEntry) => {
    if (userId) {
      await supabase.from('sleep_logs').insert({
        profile_id: userId,
        date: sleep.date,
        bed_time: sleep.bedTime,
        wake_time: sleep.wakeTime,
        duration_hours: sleep.durationHours,
        quality: sleep.quality,
        dream_description: sleep.dreamDescription,
        dream_analysis: sleep.dreamAnalysis
      });
    }
    setState(prev => ({ ...prev, sleepLog: sleep }));
  };

  const addChatMessage = (msg: ChatMessage) => {
    setState(prev => ({ ...prev, chatHistory: [...prev.chatHistory, msg] }));
  };

  const updateProfile = async (profileUpdate: Partial<UserProfile>) => {
    if (!userId) return;
    const updated = { ...state.profile, ...profileUpdate };
    
    await supabase.from('profiles').update({
      name: updated.name,
      age: updated.age,
      gender: updated.gender,
      goals: updated.goals,
      medical_history: updated.medicalHistory,
      genetic_risks: updated.geneticRisks,
      concerns: updated.concerns,
      height: updated.height,
      weight: updated.weight
    }).eq('id', userId);

    setState(prev => ({ ...prev, profile: updated }));
  };

  const setEmotion = (emotion: string) => {
    setState(prev => ({ ...prev, currentEmotion: emotion }));
  };

  const triggerSynthesis = async () => {
    setState(prev => ({ ...prev, isSynthesizing: true }));
    const consensus = await synthesizeDailyReport(state);
    setState(prev => ({ ...prev, dailyConsensus: consensus, isSynthesizing: false }));
  };

  const resetDay = async () => {
    if (!userId) return;

    const hasData = state.dailyConsensus || state.foodLog.length > 0 || state.exerciseLog.length > 0 || state.sleepLog;
    
    if (hasData) {
      const foodNames = state.foodLog.map(f => f.name).join(', ') || 'None';
      const exerciseTypes = state.exerciseLog.map(e => e.type).join(', ') || 'None';
      const sleepInfo = state.sleepLog ? `${state.sleepLog.durationHours}h (${state.sleepLog.quality})` : 'None';
      const medHistoryLen = state.profile.medicalHistory.length;
      
      const details = `[Diet: ${foodNames}] [Activity: ${exerciseTypes}] [Sleep: ${sleepInfo}] [Medical Context Len: ${medHistoryLen}]`;
      const dateStr = new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      
      const summaryObj = {
        date: dateStr,
        consensus: state.dailyConsensus || "No meeting minutes generated for this day.",
        caloriesIn: state.foodLog.reduce((a, b) => a + b.calories, 0),
        caloriesBurned: state.exerciseLog.reduce((a, b) => a + b.caloriesBurned, 0),
        mood: state.currentEmotion,
        details: details,
        foodLog: [...state.foodLog],
        exerciseLog: [...state.exerciseLog],
        sleepLog: state.sleepLog ? { ...state.sleepLog } : null
      };

      await supabase.from('daily_summaries').insert({
        profile_id: userId,
        date: summaryObj.date,
        consensus: summaryObj.consensus,
        calories_in: summaryObj.caloriesIn,
        calories_burned: summaryObj.caloriesBurned,
        mood: summaryObj.mood,
        details: summaryObj.details,
        food_log: summaryObj.foodLog,
        exercise_log: summaryObj.exerciseLog,
        sleep_log: summaryObj.sleepLog
      });

      setState(prev => ({
        ...prev,
        daysActive: prev.daysActive + 1,
        foodLog: [],
        exerciseLog: [],
        sleepLog: null,
        chatHistory: [], 
        currentEmotion: null,
        dailyConsensus: null,
        history: [summaryObj, ...(prev.history || [])],
        isSynthesizing: false
      }));
    }
  };

  return (
    <HealthContext.Provider value={{
      ...state,
      login,
      completeOnboarding,
      addFood,
      addExercise,
      setSleep,
      addChatMessage,
      updateProfile,
      setEmotion,
      triggerSynthesis,
      resetDay
    }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) throw new Error("useHealth must be used within a HealthProvider");
  return context;
};
