import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProjectDetail,
  updateProject,
  createTask,
  updateTaskStatus,
  createMilestone,
  toggleMilestone,
  type DbTask,
  type DbMilestone,
  type DbProjectAgent,
  type TaskStatus,
  type TaskPriority,
} from "@/lib/projects-api";
import { useAuth } from "@/stores/auth-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Bot,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  DollarSign,
  Target,
  Calendar,
  MoreVertical,
  Flag,
} from "lucide-react";
import { AgentStatusIndicator } from "@/components/AgentStatusIndicator";

const statusLabels: Record<string, { label: string; class: string }> = {
  active: { label: "Activ", class: "gradient-money-subtle text-primary" },
  paused: { label: "Pauză", class: "bg-warning/15 text-warning" },
  completed: { label: "Finalizat", class: "bg-blue-500/15 text-blue-500" },
  blocked: { label: "Blocat", class: "bg-destructive/15 text-destructive" },
  archived: { label: "Arhivat", class: "bg-secondary text-muted-foreground" },
};

const taskStatusIcons: Record<string, React.ElementType> = {
  todo: Circle,
  in_progress: Clock,
  done: CheckCircle2,
  blocked: AlertTriangle,
};

const priorityColors: Record<string, string> = {
  low: "text-muted-foreground",
  medium: "text-blue-500",
  high: "text-warning",
  urgent: "text-destructive",
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"tasks" | "timeline" | "agents">("tasks");
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddMilestone, setShowAddMilestone] = useState(false);

  // New task form
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>("medium");
  const [newTaskAgent, setNewTaskAgent] = useState("");

  // New milestone form
  const [newMsTitle, setNewMsTitle] = useState("");
  const [newMsDueDate, setNewMsDueDate] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProjectDetail(id!),
    enabled: !!id,
  });

  const project = data?.project;
  const agents = data?.agents ?? [];
  const milestones = data?.milestones ?? [];
  const tasks = data?.tasks ?? [];

  const refetch = () => queryClient.invalidateQueries({ queryKey: ["project", id] });

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !user || !id) return;
    const { error } = await createTask({
      project_id: id,
      user_id: user.id,
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      agent_id: newTaskAgent || undefined,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Task adăugat!");
    setNewTaskTitle("");
    setShowAddTask(false);
    refetch();
  };

  const handleToggleTask = async (task: DbTask) => {
    const next: TaskStatus = task.status === "done" ? "todo" : task.status === "todo" ? "in_progress" : "done";
    await updateTaskStatus(task.id, next);
    refetch();
  };

  const handleAddMilestone = async () => {
    if (!newMsTitle.trim() || !newMsDueDate || !user || !id) return;
    const { error } = await createMilestone({
      project_id: id,
      user_id: user.id,
      title: newMsTitle.trim(),
      due_date: newMsDueDate,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Milestone adăugat!");
    setNewMsTitle("");
    setNewMsDueDate("");
    setShowAddMilestone(false);
    refetch();
  };

  const handleToggleMilestone = async (ms: DbMilestone) => {
    await toggleMilestone(ms.id, !ms.completed);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-slide-in">
        <div className="h-8 w-48 animate-pulse rounded bg-secondary" />
        <div className="h-48 animate-pulse rounded-xl bg-secondary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Proiectul nu a fost găsit.</p>
        <Link to="/projects" className="mt-2 text-sm text-primary hover:underline">Înapoi la proiecte</Link>
      </div>
    );
  }

  const sc = statusLabels[project.status] ?? statusLabels.active;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : (project.progress ?? 0);

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button onClick={() => navigate("/projects")} className="mb-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> Înapoi la proiecte
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", sc.class)}>{sc.label}</span>
          </div>
          {project.description && (
            <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Target className="h-3.5 w-3.5" /> Progres</div>
          <p className="mt-1 text-2xl font-bold">{progress}%</p>
          <div className="mt-2 h-1.5 rounded-full bg-secondary">
            <div className={cn("h-full rounded-full transition-all", progress >= 60 ? "gradient-money" : "gradient-amber")} style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><DollarSign className="h-3.5 w-3.5" /> Venit</div>
          <p className="mt-1 text-2xl font-bold text-primary">${(project.current_revenue ?? 0).toLocaleString()}</p>
          {project.revenue_target ? (
            <p className="text-xs text-muted-foreground">din ${Number(project.revenue_target).toLocaleString()} target</p>
          ) : null}
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5" /> Task-uri</div>
          <p className="mt-1 text-2xl font-bold">{completedTasks}/{tasks.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Bot className="h-3.5 w-3.5" /> Agenți</div>
          <p className="mt-1 text-2xl font-bold">{agents.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-secondary p-1">
        {(["tasks", "timeline", "agents"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors capitalize",
              activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "tasks" ? "Task-uri" : tab === "timeline" ? "Timeline" : "Agenți AI"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "tasks" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Task-uri ({tasks.length})</h2>
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-1 rounded-lg gradient-money px-3 py-1.5 text-xs font-medium text-primary-foreground"
            >
              <Plus className="h-3 w-3" /> Task Nou
            </button>
          </div>

          {showAddTask && (
            <div className="rounded-xl border border-primary bg-card p-4 shadow-card space-y-3">
              <input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Titlu task..."
                maxLength={200}
                className="w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              />
              <div className="flex gap-2">
                <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)} className="rounded-lg border border-input bg-secondary px-2 py-1.5 text-xs">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                {agents.length > 0 && (
                  <select value={newTaskAgent} onChange={(e) => setNewTaskAgent(e.target.value)} className="rounded-lg border border-input bg-secondary px-2 py-1.5 text-xs">
                    <option value="">Neasignat</option>
                    {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                )}
                <div className="flex-1" />
                <button onClick={() => setShowAddTask(false)} className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary">Anulează</button>
                <button onClick={handleAddTask} disabled={!newTaskTitle.trim()} className="rounded-lg gradient-money px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50">Adaugă</button>
              </div>
            </div>
          )}

          {tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-12 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Niciun task încă. Adaugă primul task!</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {tasks.map((task) => {
                const StatusIcon = taskStatusIcons[task.status] ?? Circle;
                const agent = agents.find((a) => a.id === task.agent_id);
                return (
                  <div key={task.id} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-card transition-all hover:shadow-card-hover">
                    <button onClick={() => handleToggleTask(task)} className="shrink-0">
                      <StatusIcon className={cn("h-5 w-5", task.status === "done" ? "text-primary" : task.status === "blocked" ? "text-destructive" : "text-muted-foreground")} />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-sm font-medium", task.status === "done" && "line-through text-muted-foreground")}>{task.title}</p>
                      {agent && <p className="text-[10px] text-muted-foreground">{agent.name}</p>}
                    </div>
                    <Flag className={cn("h-3.5 w-3.5 shrink-0", priorityColors[task.priority])} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "timeline" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Milestones ({milestones.length})</h2>
            <button
              onClick={() => setShowAddMilestone(true)}
              className="flex items-center gap-1 rounded-lg gradient-money px-3 py-1.5 text-xs font-medium text-primary-foreground"
            >
              <Plus className="h-3 w-3" /> Milestone Nou
            </button>
          </div>

          {showAddMilestone && (
            <div className="rounded-xl border border-primary bg-card p-4 shadow-card space-y-3">
              <input
                value={newMsTitle}
                onChange={(e) => setNewMsTitle(e.target.value)}
                placeholder="Titlu milestone..."
                maxLength={200}
                className="w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
                autoFocus
              />
              <div className="flex gap-2 items-center">
                <input type="date" value={newMsDueDate} onChange={(e) => setNewMsDueDate(e.target.value)} className="rounded-lg border border-input bg-secondary px-2 py-1.5 text-xs" />
                <div className="flex-1" />
                <button onClick={() => setShowAddMilestone(false)} className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary">Anulează</button>
                <button onClick={handleAddMilestone} disabled={!newMsTitle.trim() || !newMsDueDate} className="rounded-lg gradient-money px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50">Adaugă</button>
              </div>
            </div>
          )}

          {milestones.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-12 text-center">
              <Calendar className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Niciun milestone. Adaugă deadline-uri cheie!</p>
            </div>
          ) : (
            <div className="relative ml-3 space-y-0 border-l-2 border-border pl-6">
              {milestones.map((ms) => {
                const isPast = new Date(ms.due_date) < new Date();
                return (
                  <div key={ms.id} className="relative pb-6">
                    <div className={cn(
                      "absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2",
                      ms.completed
                        ? "gradient-money border-primary"
                        : isPast
                        ? "border-destructive bg-destructive/20"
                        : "border-border bg-card"
                    )} />
                    <button onClick={() => handleToggleMilestone(ms)} className="text-left w-full">
                      <div className="flex items-center gap-2">
                        <p className={cn("text-sm font-medium", ms.completed && "line-through text-muted-foreground")}>{ms.title}</p>
                        {ms.completed && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                      </div>
                      <p className={cn("text-xs", isPast && !ms.completed ? "text-destructive" : "text-muted-foreground")}>
                        {new Date(ms.due_date).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "agents" && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Agenți asignați ({agents.length})</h2>
          {agents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-12 text-center">
              <Bot className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Niciun agent asignat.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {agents.map((agent) => (
                <div key={agent.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-money-subtle">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{agent.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{agent.role.replace("_", " ")}</p>
                      </div>
                    </div>
                    <AgentStatusIndicator status={agent.status as "active" | "working" | "idle" | "blocked"} />
                  </div>
                  {agent.system_prompt && (
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{agent.system_prompt}</p>
                  )}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Task-uri</span>
                      <span className="font-medium">{agent.tasks_completed ?? 0}/{agent.tasks_total ?? 0}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full gradient-money"
                        style={{ width: `${(agent.tasks_total ?? 0) > 0 ? ((agent.tasks_completed ?? 0) / (agent.tasks_total ?? 0)) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
