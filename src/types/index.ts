export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "free" | "pro" | "enterprise";
  revenue: number;
  projectsCount: number;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: "active" | "paused" | "completed" | "archived";
  agentId: string;
  revenue: number;
  progress: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: string;
  name: string;
  role: "developer" | "marketer" | "analyst" | "researcher" | "strategist";
  status: "active" | "working" | "blocked" | "idle";
  tasksCompleted: number;
  tasksTotal: number;
  projectId?: string;
  avatar?: string;
  description: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  score: number;
  source: string;
  category: string;
  date: string;
  isNew: boolean;
}

export interface Task {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  projectId: string;
  agentId?: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  lessons: number;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface RevenueEntry {
  id: string;
  amount: number;
  source: string;
  projectId: string;
  date: string;
  type: "income" | "expense";
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}
