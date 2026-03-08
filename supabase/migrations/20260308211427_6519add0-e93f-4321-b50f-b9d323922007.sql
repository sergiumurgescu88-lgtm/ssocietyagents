
-- Opportunities table
CREATE TABLE public.opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  profit_score integer NOT NULL DEFAULT 50,
  effort_level text NOT NULL DEFAULT 'medium',
  estimated_revenue_min numeric DEFAULT 0,
  estimated_revenue_max numeric DEFAULT 0,
  sources jsonb DEFAULT '[]'::jsonb,
  tags text[] DEFAULT '{}'::text[],
  category text NOT NULL DEFAULT 'other',
  trend text DEFAULT '',
  is_new boolean DEFAULT true,
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their opportunities" ON public.opportunities FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create opportunities" ON public.opportunities FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete opportunities" ON public.opportunities FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- User-opportunity interactions
CREATE TABLE public.user_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'saved',
  rated_score integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, opportunity_id)
);

ALTER TABLE public.user_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their saved opportunities" ON public.user_opportunities FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can save opportunities" ON public.user_opportunities FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their saved opportunities" ON public.user_opportunities FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their saved opportunities" ON public.user_opportunities FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Scan logs
CREATE TABLE public.scan_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  sources_used text[] DEFAULT '{}'::text[],
  opportunities_found integer DEFAULT 0,
  scan_date timestamp with time zone NOT NULL DEFAULT now(),
  duration_ms integer DEFAULT 0
);

ALTER TABLE public.scan_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their scan logs" ON public.scan_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create scan logs" ON public.scan_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
