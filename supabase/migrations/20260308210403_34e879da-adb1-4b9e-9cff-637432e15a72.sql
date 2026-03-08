
-- Create project category enum
CREATE TYPE public.project_category AS ENUM ('ecommerce', 'saas', 'content', 'affiliate', 'consulting', 'other');
CREATE TYPE public.project_status AS ENUM ('active', 'paused', 'completed', 'blocked', 'archived');
CREATE TYPE public.agent_role AS ENUM ('project_manager', 'developer', 'marketer', 'sales', 'researcher', 'analyst');
CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'done', 'blocked');
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category public.project_category NOT NULL DEFAULT 'other',
  status public.project_status NOT NULL DEFAULT 'active',
  revenue_target NUMERIC(12,2) DEFAULT 0,
  current_revenue NUMERIC(12,2) DEFAULT 0,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  deadline DATE,
  budget_money NUMERIC(12,2) DEFAULT 0,
  budget_hours INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);

-- Project agents table
CREATE TABLE public.project_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role public.agent_role NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'working', 'idle', 'blocked')),
  system_prompt TEXT DEFAULT '',
  performance_score INTEGER DEFAULT 0 CHECK (performance_score >= 0 AND performance_score <= 100),
  tasks_completed INTEGER DEFAULT 0,
  tasks_total INTEGER DEFAULT 0,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.project_agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their project agents" ON public.project_agents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create project agents" ON public.project_agents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update project agents" ON public.project_agents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete project agents" ON public.project_agents FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_project_agents_project ON public.project_agents(project_id);

-- Milestones table
CREATE TABLE public.milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  due_date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their milestones" ON public.milestones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create milestones" ON public.milestones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update milestones" ON public.milestones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete milestones" ON public.milestones FOR DELETE USING (auth.uid() = user_id);

-- Tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.project_agents(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status public.task_status NOT NULL DEFAULT 'todo',
  priority public.task_priority NOT NULL DEFAULT 'medium',
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete tasks" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_tasks_project ON public.tasks(project_id);
CREATE INDEX idx_tasks_agent ON public.tasks(agent_id);
