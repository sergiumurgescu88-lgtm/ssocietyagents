import { supabase } from "@/integrations/supabase/client";

export interface LearningModuleDB {
  id: string;
  category: string;
  title: string;
  description: string;
  content: any[];
  key_takeaways: string[];
  action_items: string[];
  resources: any[];
  estimated_minutes: number;
  xp_reward: number;
  difficulty: string;
  sort_order: number;
  lessons_count: number;
  created_at: string;
}

export interface UserModuleDB {
  id: string;
  user_id: string;
  module_id: string;
  status: string;
  progress: number;
  quiz_score: number | null;
  time_spent_minutes: number | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuizDB {
  id: string;
  module_id: string;
  questions: QuizQuestion[];
  passing_score: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface UserQuizDB {
  id: string;
  user_id: string;
  quiz_id: string;
  answers: number[];
  score: number;
  passed: boolean;
  taken_at: string;
}

export interface CertificateDB {
  id: string;
  user_id: string;
  category: string;
  title: string;
  earned_at: string;
}

export async function fetchModules() {
  const { data, error } = await supabase
    .from("learning_modules")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as unknown as LearningModuleDB[];
}

export async function fetchUserModules() {
  const { data, error } = await supabase.from("user_modules").select("*");
  if (error) throw error;
  return data as unknown as UserModuleDB[];
}

export async function fetchQuizForModule(moduleId: string) {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("module_id", moduleId)
    .single();
  if (error) throw error;
  return data as unknown as QuizDB;
}

export async function fetchUserQuizzes() {
  const { data, error } = await supabase.from("user_quizzes").select("*");
  if (error) throw error;
  return data as unknown as UserQuizDB[];
}

export async function fetchCertificates() {
  const { data, error } = await supabase.from("certificates").select("*");
  if (error) throw error;
  return data as unknown as CertificateDB[];
}

export async function updateModuleProgress(moduleId: string, progress: number, status?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const updateData: any = {
    progress,
    updated_at: new Date().toISOString(),
  };
  if (status) updateData.status = status;
  if (status === "completed") updateData.completed_at = new Date().toISOString();

  // Upsert
  const { data: existing } = await supabase
    .from("user_modules")
    .select("id")
    .eq("user_id", user.id)
    .eq("module_id", moduleId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("user_modules")
      .update(updateData)
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("user_modules").insert({
      user_id: user.id,
      module_id: moduleId,
      status: status || "in_progress",
      progress,
    });
    if (error) throw error;
  }
}

export async function submitQuiz(quizId: string, answers: number[], score: number, passed: boolean) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("user_quizzes").insert({
    user_id: user.id,
    quiz_id: quizId,
    answers,
    score,
    passed,
  });
  if (error) throw error;
}

export async function earnCertificate(category: string, title: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Check if already earned
  const { data: existing } = await supabase
    .from("certificates")
    .select("id")
    .eq("user_id", user.id)
    .eq("category", category)
    .maybeSingle();

  if (existing) return;

  const { error } = await supabase.from("certificates").insert({
    user_id: user.id,
    category,
    title,
  });
  if (error) throw error;
}

export const categoryMeta: Record<string, { label: string; color: string; icon: string }> = {
  fundamentals: { label: "Fundamentale", color: "bg-primary/10 text-primary", icon: "🧠" },
  online_business: { label: "Online Business", color: "bg-chart-1/10 text-chart-1", icon: "🛒" },
  freelancing: { label: "Freelancing", color: "bg-chart-2/10 text-chart-2", icon: "💼" },
  content_creation: { label: "Content Creation", color: "bg-chart-3/10 text-chart-3", icon: "🎬" },
  ai_automation: { label: "AI & Automation", color: "bg-chart-4/10 text-chart-4", icon: "🤖" },
  investing: { label: "Investiții", color: "bg-chart-5/10 text-chart-5", icon: "📈" },
};
