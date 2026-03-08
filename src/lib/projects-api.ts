import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type DbProject = Database["public"]["Tables"]["projects"]["Row"];
export type DbProjectAgent = Database["public"]["Tables"]["project_agents"]["Row"];
export type DbMilestone = Database["public"]["Tables"]["milestones"]["Row"];
export type DbTask = Database["public"]["Tables"]["tasks"]["Row"];

export type ProjectCategory = Database["public"]["Enums"]["project_category"];
export type ProjectStatus = Database["public"]["Enums"]["project_status"];
export type AgentRole = Database["public"]["Enums"]["agent_role"];
export type TaskStatus = Database["public"]["Enums"]["task_status"];
export type TaskPriority = Database["public"]["Enums"]["task_priority"];

// Fetch all projects for current user
export async function fetchProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  return { data, error };
}

// Fetch single project with agents, milestones, tasks
export async function fetchProjectDetail(projectId: string) {
  const [projectRes, agentsRes, milestonesRes, tasksRes] = await Promise.all([
    supabase.from("projects").select("*").eq("id", projectId).single(),
    supabase.from("project_agents").select("*").eq("project_id", projectId).order("assigned_at"),
    supabase.from("milestones").select("*").eq("project_id", projectId).order("due_date"),
    supabase.from("tasks").select("*").eq("project_id", projectId).order("created_at", { ascending: false }),
  ]);
  return {
    project: projectRes.data,
    agents: agentsRes.data ?? [],
    milestones: milestonesRes.data ?? [],
    tasks: tasksRes.data ?? [],
    error: projectRes.error || agentsRes.error,
  };
}

// Create project
export async function createProject(data: {
  title: string;
  description: string;
  category: ProjectCategory;
  revenue_target: number;
  deadline: string | null;
  budget_money: number;
  budget_hours: number;
  tags: string[];
  user_id: string;
}) {
  const { data: project, error } = await supabase
    .from("projects")
    .insert(data)
    .select()
    .single();
  return { project, error };
}

// Agent system prompts by role
const AGENT_PROMPTS: Record<AgentRole, string> = {
  project_manager: "Tu ești Project Manager-ul. Coordonezi echipa, prioritizezi task-urile și asiguri livrarea la timp.",
  developer: "Tu ești Developer-ul. Construiești produsul, implementezi features și rezolvi bug-uri.",
  marketer: "Tu ești Marketer-ul. Creezi strategii de marketing, campanii și crești audiența.",
  sales: "Tu ești Sales Agent-ul. Identifici clienți, negociezi și închizi vânzări.",
  researcher: "Tu ești Researcher-ul. Analizezi piața, competiția și identifici oportunități.",
  analyst: "Tu ești Analistul. Monitorizezi metrici, creezi rapoarte și optimizezi performanța.",
};

const AGENT_NAMES: Record<AgentRole, string> = {
  project_manager: "PM-Agent",
  developer: "Dev-Agent",
  marketer: "Marketing-Agent",
  sales: "Sales-Agent",
  researcher: "Research-Agent",
  analyst: "Analytics-Agent",
};

// Auto-create agents for a project
export async function autoCreateAgents(
  projectId: string,
  userId: string,
  roles: AgentRole[]
) {
  // Always include project_manager
  const allRoles = roles.includes("project_manager")
    ? roles
    : ["project_manager" as AgentRole, ...roles];

  const agents = allRoles.map((role, i) => ({
    project_id: projectId,
    user_id: userId,
    name: `${AGENT_NAMES[role]}-${String(i + 1).padStart(2, "0")}`,
    role,
    system_prompt: AGENT_PROMPTS[role],
    status: "active",
    tasks_total: role === "project_manager" ? 5 : 3,
  }));

  const { data, error } = await supabase
    .from("project_agents")
    .insert(agents)
    .select();

  return { agents: data, error };
}

// Update project
export async function updateProject(projectId: string, data: Partial<DbProject>) {
  const { error } = await supabase
    .from("projects")
    .update(data)
    .eq("id", projectId);
  return { error };
}

// Create task
export async function createTask(data: {
  project_id: string;
  user_id: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  agent_id?: string;
  due_date?: string;
}) {
  const { data: task, error } = await supabase
    .from("tasks")
    .insert(data)
    .select()
    .single();
  return { task, error };
}

// Update task status
export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  const { error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", taskId);
  return { error };
}

// Create milestone
export async function createMilestone(data: {
  project_id: string;
  user_id: string;
  title: string;
  description?: string;
  due_date: string;
}) {
  const { data: milestone, error } = await supabase
    .from("milestones")
    .insert(data)
    .select()
    .single();
  return { milestone, error };
}

// Toggle milestone completion
export async function toggleMilestone(milestoneId: string, completed: boolean) {
  const { error } = await supabase
    .from("milestones")
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq("id", milestoneId);
  return { error };
}
