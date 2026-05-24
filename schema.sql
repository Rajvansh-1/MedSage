-- Create Users/Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    goals JSONB DEFAULT '[]'::jsonb,
    medical_history TEXT,
    genetic_risks TEXT,
    concerns JSONB DEFAULT '[]'::jsonb,
    height NUMERIC,
    weight NUMERIC
);

-- Create Food Logs table
CREATE TABLE IF NOT EXISTS public.food_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    calories INTEGER NOT NULL,
    protein NUMERIC,
    carbs NUMERIC,
    fats NUMERIC,
    timestamp TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Create Exercise Logs table
CREATE TABLE IF NOT EXISTS public.exercise_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    type TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    intensity TEXT,
    calories_burned INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Create Sleep Logs table
CREATE TABLE IF NOT EXISTS public.sleep_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    date TEXT NOT NULL,
    bed_time TEXT,
    wake_time TEXT,
    duration_hours NUMERIC,
    quality TEXT,
    dream_description TEXT,
    dream_analysis TEXT
);

-- Create Daily Summaries table
CREATE TABLE IF NOT EXISTS public.daily_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    date TEXT NOT NULL,
    consensus TEXT,
    calories_in INTEGER,
    calories_burned INTEGER,
    mood TEXT,
    details TEXT,
    food_log JSONB DEFAULT '[]'::jsonb,
    exercise_log JSONB DEFAULT '[]'::jsonb,
    sleep_log JSONB
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_summaries ENABLE ROW LEVEL SECURITY;

-- Since we are not using Supabase Auth yet (anonymous access), we will allow public access for now 
-- to allow the application to function. In a real production app, we would use auth.uid()
CREATE POLICY "Enable read/write for all users" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable read/write for all users" ON public.food_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable read/write for all users" ON public.exercise_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable read/write for all users" ON public.sleep_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable read/write for all users" ON public.daily_summaries FOR ALL USING (true) WITH CHECK (true);
