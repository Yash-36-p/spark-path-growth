
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  personality_type TEXT CHECK (personality_type IN ('adventurous', 'introspective', 'social', 'creative', 'analytical')),
  current_mood INTEGER CHECK (current_mood >= 1 AND current_mood <= 10),
  goals TEXT[],
  quest_frequency TEXT CHECK (quest_frequency IN ('daily', 'weekly', 'flexible')),
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  categories TEXT[],
  spark_points INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quests table
CREATE TABLE public.quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  points_reward INTEGER NOT NULL,
  estimated_time TEXT NOT NULL,
  instructions TEXT[] NOT NULL,
  reflection_prompts TEXT[],
  personality_match TEXT[],
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_quests table to track assigned and completed quests
CREATE TABLE public.user_quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  quest_id UUID REFERENCES public.quests ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('assigned', 'in_progress', 'completed')) DEFAULT 'assigned',
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  reflection_text TEXT,
  reflection_mood INTEGER CHECK (reflection_mood >= 1 AND reflection_mood <= 10),
  insights TEXT,
  UNIQUE(user_id, quest_id)
);

-- Create reflections table for multimedia submissions
CREATE TABLE public.reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  quest_id UUID REFERENCES public.quests ON DELETE CASCADE,
  type TEXT CHECK (type IN ('text', 'photo', 'audio')) NOT NULL,
  content TEXT,
  file_url TEXT,
  mood INTEGER CHECK (mood >= 1 AND mood <= 10),
  insights TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rewards table
CREATE TABLE public.rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cost INTEGER NOT NULL,
  category TEXT CHECK (category IN ('profile_boost', 'exclusive_content', 'special_features')),
  icon TEXT NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_rewards table to track purchased rewards
CREATE TABLE public.user_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  reward_id UUID REFERENCES public.rewards ON DELETE CASCADE NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, reward_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for user_quests
CREATE POLICY "Users can view their own quests" ON public.user_quests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own quests" ON public.user_quests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quests" ON public.user_quests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for reflections
CREATE POLICY "Users can view their own reflections" ON public.reflections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reflections" ON public.reflections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reflections" ON public.reflections
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for user_rewards
CREATE POLICY "Users can view their own rewards" ON public.user_rewards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rewards" ON public.user_rewards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow everyone to read quests and rewards (these are public)
CREATE POLICY "Anyone can view quests" ON public.quests
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can view rewards" ON public.rewards
  FOR SELECT TO authenticated USING (true);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, spark_points)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'New User'), 100);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample quests
INSERT INTO public.quests (title, description, category, difficulty, points_reward, estimated_time, instructions, reflection_prompts, personality_match, tags) VALUES
('Morning Gratitude Practice', 'Start your day by acknowledging three things you''re grateful for', 'Mindfulness', 'easy', 50, '10 minutes', 
 ARRAY['Find a quiet space', 'Take three deep breaths', 'Think of three specific things you''re grateful for today', 'Write them down or say them aloud'], 
 ARRAY['How did focusing on gratitude change your morning mood?', 'What surprised you about this practice?'], 
 ARRAY['introspective', 'social'], 
 ARRAY['gratitude', 'mindfulness', 'morning routine']),

('Random Act of Kindness', 'Perform one unexpected act of kindness for someone today', 'Social Connection', 'medium', 75, '30 minutes',
 ARRAY['Think of someone who could use a kind gesture', 'Plan a simple but meaningful act of kindness', 'Execute your plan without expecting anything in return', 'Observe how it makes you feel'],
 ARRAY['How did performing this act of kindness affect your mood?', 'What was the other person''s reaction?'],
 ARRAY['social', 'adventurous'],
 ARRAY['kindness', 'connection', 'empathy']),

('Creative Expression Challenge', 'Express your current emotions through any creative medium', 'Creativity', 'medium', 80, '45 minutes',
 ARRAY['Choose your medium (drawing, writing, music, dance, etc.)', 'Set aside uninterrupted time', 'Focus on expressing your current emotional state', 'Don''t worry about the outcome, focus on the process'],
 ARRAY['What emotions came up during this creative process?', 'How did creating something help you process your feelings?'],
 ARRAY['creative', 'introspective'],
 ARRAY['creativity', 'expression', 'emotions']),

('Comfort Zone Explorer', 'Do something today that pushes you slightly outside your comfort zone', 'Personal Growth', 'hard', 100, '1 hour',
 ARRAY['Identify something you''ve been avoiding or hesitant to try', 'Start small - choose something challenging but achievable', 'Take the first step, even if it feels uncomfortable', 'Notice your thoughts and feelings throughout'],
 ARRAY['What did you learn about yourself by stepping outside your comfort zone?', 'How can you apply this experience to other areas of your life?'],
 ARRAY['adventurous', 'analytical'],
 ARRAY['growth', 'courage', 'challenge']),

('Digital Detox Hour', 'Spend one hour without any digital devices or screens', 'Mindfulness', 'easy', 60, '1 hour',
 ARRAY['Choose a one-hour window in your day', 'Turn off all devices and put them away', 'Engage in analog activities (reading, walking, journaling)', 'Notice your impulses to check devices'],
 ARRAY['What did you notice about your relationship with technology?', 'How did you feel during the device-free time?'],
 ARRAY['introspective', 'analytical'],
 ARRAY['mindfulness', 'digital wellness', 'presence']);

-- Insert sample rewards
INSERT INTO public.rewards (title, description, cost, category, icon, available) VALUES
('Profile Boost', 'Increase your profile visibility for 24 hours', 150, 'profile_boost', '🚀', true),
('Exclusive Quest Pack', 'Unlock 5 premium quests designed by growth experts', 300, 'exclusive_content', '💎', true),
('Mood Tracker Plus', 'Advanced mood analytics and insights', 200, 'special_features', '📊', true),
('Custom Quest Creator', 'Create and save your own personalized quests', 400, 'special_features', '🎯', true),
('Achievement Badge', 'Unlock a special achievement badge for your profile', 100, 'profile_boost', '🏆', true),
('Reflection Insights', 'AI-powered insights from your reflection history', 250, 'exclusive_content', '🧠', true);
