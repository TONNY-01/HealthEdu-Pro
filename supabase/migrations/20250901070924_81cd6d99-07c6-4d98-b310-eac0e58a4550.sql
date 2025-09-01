-- Create users table extension (Supabase auth handles the core user table)
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  clinic_name TEXT NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tips table
CREATE TABLE public.tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  confidence INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for lessons
CREATE POLICY "Everyone can view free lessons" ON public.lessons
  FOR SELECT USING (is_premium = FALSE);

CREATE POLICY "Premium users can view all lessons" ON public.lessons
  FOR SELECT USING (
    is_premium = FALSE OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_premium = TRUE)
  );

-- RLS Policies for tips
CREATE POLICY "Users can view their own tips" ON public.tips
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tips" ON public.tips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can insert payments" ON public.payments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service can update payments" ON public.payments
  FOR UPDATE USING (true);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (NEW.id, NEW.email, NEW.created_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample lessons
INSERT INTO public.lessons (title, content_markdown, "order", is_premium) VALUES
('Basic Health Fundamentals', '# Health Fundamentals

## Daily Wellness Basics
- **Hydration**: Drink 8-10 glasses of water daily
- **Sleep**: Aim for 7-9 hours of quality sleep
- **Exercise**: 30 minutes of moderate activity daily
- **Nutrition**: Eat a balanced diet with fruits and vegetables

## Key Health Metrics
- Blood pressure: 120/80 mmHg (normal)
- Resting heart rate: 60-100 bpm
- BMI: 18.5-24.9 (healthy range)

Regular checkups with healthcare providers are essential for maintaining optimal health.', 1, false),

('Nutrition and Diet Planning', '# Nutrition Essentials

## Macronutrients Balance
- **Proteins**: 20-35% of daily calories
- **Carbohydrates**: 45-65% of daily calories  
- **Fats**: 20-35% of daily calories

## Meal Planning Tips
1. Plan meals weekly
2. Include variety in colors and textures
3. Control portion sizes
4. Stay consistent with meal times

## Foods to Prioritize
- Lean proteins (chicken, fish, legumes)
- Whole grains (brown rice, quinoa, oats)
- Fresh fruits and vegetables
- Healthy fats (avocado, nuts, olive oil)', 2, false),

('Exercise and Fitness Basics', '# Exercise Fundamentals

## Types of Exercise
### Cardiovascular Training
- Running, cycling, swimming
- 150 minutes moderate intensity per week
- Or 75 minutes vigorous intensity per week

### Strength Training
- Weight lifting, resistance bands
- 2-3 sessions per week
- Target all major muscle groups

### Flexibility and Mobility
- Stretching, yoga, tai chi
- Daily practice recommended
- Improves range of motion and prevents injury

## Creating Your Routine
1. Start with 20-30 minutes, 3x per week
2. Gradually increase duration and intensity
3. Listen to your body and rest when needed
4. Stay consistent rather than perfect', 3, false),

('Advanced Wellness Strategies', '# Advanced Wellness

## Stress Management Techniques
- **Meditation**: 10-20 minutes daily
- **Breathing exercises**: 4-7-8 technique
- **Time management**: Priority setting and boundaries
- **Social connections**: Maintain relationships

## Sleep Optimization
- Consistent sleep schedule
- Dark, cool sleeping environment
- No screens 1 hour before bed
- Avoid caffeine after 2 PM

## Biohacking Basics
- Track health metrics consistently
- Experiment with intermittent fasting
- Cold exposure therapy
- Red light therapy

*This lesson requires premium membership*', 4, true),

('Mental Health and Mindfulness', '# Mental Wellness

## Mindfulness Practices
- **Present moment awareness**
- **Non-judgmental observation**
- **Acceptance of thoughts and feelings**

## Stress Reduction
- Progressive muscle relaxation
- Guided imagery
- Journal writing
- Nature exposure

## Building Resilience
- Develop coping strategies
- Build support networks
- Practice self-compassion
- Set realistic goals

## When to Seek Help
- Persistent sadness or anxiety
- Changes in sleep or appetite
- Difficulty functioning daily
- Thoughts of self-harm

*Premium feature: Personalized mental health plans*', 5, true);