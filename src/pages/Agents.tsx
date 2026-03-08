import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAllAgents, deleteAgent, updateAgentStatus } from "@/lib/agents-api";
import { useAuth } from "@/stores/auth-store";
import { AgentWizard } from "@/components/agents/AgentWizard";
import { AgentStatusIndicator } from "@/components/AgentStatusIndicator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Bot,
  ArrowUpRight,
  BarChart3,
  Trash2,
  Pause,
  Play,
  TrendingUp,
} from "lucide-react";

const roleConfig: Record<string, { label: string; gradient: string }> = {
  project_manager: { label: "Project Manager", gradient: "from-emerald-500 to-green-500" },
  developer: { label: "Developer", gradient: "from-blue-500 to-cyan-500" },
  marketer: { label: "Marketer", gradient: "from-purple-500 to-pink-500" },
  sales: { label: "Sales", gradient: "from-amber-500 to-orange-500" },
  researcher: { label: "Researcher", gradient: "from-teal-500 to-emerald-500" },
  analyst: { label: "Analyst", gradient: "from-indigo-500 to-violet-500" },
};

export default function Agents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: agents = [], isLoading, refetch } = useQuery({
    queryKey: ["all-agents", user?.id],
    queryFn: async () => {
      const { data, error } = await fetchAllAgents();
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const filtered = useMemo(() => {
    let result = [...agents];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q));
    }
    if (roleFilter !== "all") result = result.filter((a) => a.role === roleFilter);
    if (statusFilter !== "all") result = result.filter((a) => a.status === statusFilter);
    return result;
  }, [agents, search, roleFilter, statusFilter]);

  // Metrics
  const totalAgents = agents.length;
  const activeCount = agents.filter((a) => a.status === "active" || a.status === "working").length;
  const totalCompleted = agents.reduce((sum, a) => sum + (a.tasks_completed ?? 0), 0);
  const avgScore = agents.length > 0
    ? Math.round(agents.reduce((sum, a) => sum + (a.performance_score ?? 0), 0) / agents.length)
    : 0;

  const handleDelete = async (agentId: string, name: string) => {
    if (!confirm(`Șterge agentul "${name}"?`)) return;
    const { error } = await deleteAgent(agentId);
    if (error) toast.error(error.message);
    else { toast.success("Agent șters"); refetch(); }
  };

  const handleTogglePause = async (agentId: string, currentStatus: string) => {
    const newStatus = currentStatus === "idle" ? "active" : "idle";
    const { error } = await updateAgentStatus(agentId, newStatus);
    if (error) toast.error(error.message);
    else { toast.success(newStatus === "active" ? "Agent activat" : "Agent pus pe pauză"); refetch(); }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agenți AI</h1>
          <p className="text-sm text-muted-foreground">{totalAgents} agenți configurați</p>
        </div>
        <button
          onClick={() => setWizardOpen(true)}
          className="flex items-center gap-2 rounded-lg gradient-money px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Agent Nou
        </button>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-xs text-muted-foreground">Total Agenți</p>
          <p className="mt-1 text-2xl font-bold">{totalAgents}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-xs text-muted-foreground">Activi</p>
          <p className="mt-1 text-2xl font-bold text-primary">{activeCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-xs text-muted-foreground">Task-uri Completate</p>
          <p className="mt-1 text-2xl font-bold">{totalCompleted}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-xs text-muted-foreground">Scor Mediu</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-2xl font-bold">{avgScore}</p>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Caută agenți..."
            className="w-full rounded-lg border border-input bg-secondary py-2 pl-10 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-input bg-secondary px-3 py-2 text-sm outline-none"
        >
          <option value="all">Toate rolurile</option>
          {Object.entries(roleConfig).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-input bg-secondary px-3 py-2 text-sm outline-none"
        >
          <option value="all">Toate statusurile</option>
          <option value="active">Activ</option>
          <option value="working">Lucrează</option>
          <option value="idle">Inactiv</option>
          <option value="blocked">Blocat</option>
        </select>
      </div>

      {/* Agent Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-52 animate-pulse rounded-xl bg-secondary" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <Bot className="h-12 w-12 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">Niciun agent găsit</p>
          <button
            onClick={() => setWizardOpen(true)}
            className="mt-4 flex items-center gap-2 rounded-lg gradient-money px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Agent Nou
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((agent) => {
            const rc = roleConfig[agent.role] ?? { label: agent.role, gradient: "from-gray-500 to-gray-600" };
            const projectTitle = (agent as any).projects?.title;
            const score = agent.performance_score ?? 0;
            const completed = agent.tasks_completed ?? 0;
            const total = agent.tasks_total ?? 0;

            return (
              <div key={agent.id} className="group rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover">
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white", rc.gradient)}>
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{rc.label}</p>
                    </div>
                  </div>
                  <AgentStatusIndicator status={agent.status as "active" | "working" | "idle" | "blocked"} />
                </div>

                {/* Project */}
                {projectTitle && (
                  <p className="mt-2 truncate text-xs text-muted-foreground">📁 {projectTitle}</p>
                )}

                {/* Performance */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-lg font-bold">{completed}</p>
                    <p className="text-[10px] text-muted-foreground">Completate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{total}</p>
                    <p className="text-[10px] text-muted-foreground">Total</p>
                  </div>
                  <div className="text-center">
                    <p className={cn("text-lg font-bold", score >= 70 ? "text-primary" : score >= 40 ? "text-warning" : "text-destructive")}>{score}</p>
                    <p className="text-[10px] text-muted-foreground">Scor</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="h-1.5 w-full rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full gradient-money transition-all"
                      style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/agent/${agent.id}`)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg gradient-money px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Chat <ArrowUpRight className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleTogglePause(agent.id, agent.status)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary"
                  >
                    {agent.status === "idle" ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                  </button>
                  <button
                    onClick={() => handleDelete(agent.id, agent.name)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {wizardOpen && <AgentWizard onClose={() => setWizardOpen(false)} onCreated={() => { setWizardOpen(false); refetch(); }} />}
    </div>
  );
}
