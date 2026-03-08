
-- Learning modules
CREATE TABLE public.learning_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL DEFAULT 'fundamentals',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  content jsonb NOT NULL DEFAULT '[]'::jsonb,
  key_takeaways text[] DEFAULT '{}'::text[],
  action_items text[] DEFAULT '{}'::text[],
  resources jsonb DEFAULT '[]'::jsonb,
  estimated_minutes integer NOT NULL DEFAULT 15,
  xp_reward integer NOT NULL DEFAULT 100,
  difficulty text NOT NULL DEFAULT 'beginner',
  sort_order integer NOT NULL DEFAULT 0,
  lessons_count integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can view modules" ON public.learning_modules FOR SELECT TO authenticated USING (true);

-- User module progress
CREATE TABLE public.user_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module_id uuid NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'not_started',
  progress integer NOT NULL DEFAULT 0,
  quiz_score integer,
  time_spent_minutes integer DEFAULT 0,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

ALTER TABLE public.user_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their module progress" ON public.user_modules FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their module progress" ON public.user_modules FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their module progress" ON public.user_modules FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Quizzes
CREATE TABLE public.quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  passing_score integer NOT NULL DEFAULT 80,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can view quizzes" ON public.quizzes FOR SELECT TO authenticated USING (true);

-- User quiz attempts
CREATE TABLE public.user_quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  quiz_id uuid NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  score integer NOT NULL DEFAULT 0,
  passed boolean NOT NULL DEFAULT false,
  taken_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their quiz results" ON public.user_quizzes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can submit quiz answers" ON public.user_quizzes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Certificates
CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  category text NOT NULL,
  title text NOT NULL DEFAULT '',
  earned_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their certificates" ON public.certificates FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can earn certificates" ON public.certificates FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
