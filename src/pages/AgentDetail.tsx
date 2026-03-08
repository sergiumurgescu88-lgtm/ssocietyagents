import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAgentDetail, createAgentLog } from "@/lib/agents-api";
import { useAuth } from "@/stores/auth-store";
import { AgentChat } from "@/components/agents/AgentChat";
import { TaskBoard } from "@/components/agents/TaskBoard";
import { AgentStatusIndicator } from "@/components/AgentStatusIndicator";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Bot,
  MessageSquare,
  LayoutList,
  ScrollText,
  BarChart3,
} from "lucide-react";

const roleConfig: Record<string, { label: string; gradient: string }> = {
  project_manager: { label: "Project Manager", gradient: "from-emerald-500 to-green-500" },
  developer: { label: "Developer", gradient: "from-blue-500 to-cyan-500" },
  marketer: { label: "Marketer", gradient: "from-purple-500 to-pink-500" },
  sales: { label: "Sales", gradient: "from-amber-500 to-orange-500" },
  researcher: { label: "Researcher", gradient: "from-teal-500 to-emerald-500" },
  analyst: { label: "Analyst", gradient: "from-indigo-500 to-violet-500" },
};

type Tab = "chat" | "tasks" | "logs" | "performance";

export default function AgentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("chat");

  const { data, isLoading } = useQuery({
    queryKey: ["agent-detail", id],
    queryFn: () => fetchAgentDetail(id!),
    enabled: !!id,
  });

  const refetch = () => queryClient.invalidateQueries({ queryKey: ["agent-detail", id] });

  if (isLoading) {
    return (
      <div className="space-y-4 animate-slide-in">
        <div className="h-8 w-48 animate-pulse rounded bg-secondary" />
        <div className="h-96 animate-pulse rounded-xl bg-secondary" />
      </div>
    );
  }

  const agent = data?.agent;
  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Agentul nu a fost găsit.</p>
        <Link to="/agents" className="mt-2 text-sm text-primary hover:underline">Înapoi la agenți</Link>
      </div>
    );
  }

  const logs = data?.logs ?? [];
  const conversations = data?.conversations ?? [];
  const tasks = data?.tasks ?? [];
  const rc = roleConfig[agent.role] ?? { label: agent.role, gradient: "from-gray-500 to-gray-600" };
  const projectTitle = (agent as any).projects?.title;
  const score = agent.performance_score ?? 0;
  const completed = agent.tasks_completed ?? 0;
  const total = agent.tasks_total ?? 0;

  const initialMessages = conversations.map((c) => ({
    role: c.role as "user" | "assistant",
    content: c.content,
  }));

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "tasks", label: "Task Board", icon: LayoutList },
    { id: "logs", label: "Logs", icon: ScrollText },
    { id: "performance", label: "Performanță", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div>
        <button onClick={() => navigate("/agents")} className="mb-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Înapoi la agenți
        </button>
        <div className="flex items-center gap-4">
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white", rc.gradient)}>
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{agent.name}</h1>
              <AgentStatusIndicator status={agent.status as "active" | "working" | "idle" | "blocked"} />
            </div>
            <p className="text-sm text-muted-foreground">
              {rc.label} {projectTitle && <>· 📁 {projectTitle}</>}
            </p>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-xs text-muted-foreground">Task-uri</p>
          <p className="mt-1 text-2xl font-bold">{completed}/{total}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-xs text-muted-foreground">Scor Performanță</p>
          <p className={cn("mt-1 text-2xl font-bold", score >= 70 ? "text-primary" : score >= 40 ? "text-warning" : "text-destructive")}>{score}/100</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-xs text-muted-foreground">Conversații</p>
          <p className="mt-1 text-2xl font-bold">{conversations.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-xs text-muted-foreground">Log-uri</p>
          <p className="mt-1 text-2xl font-bold">{logs.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-secondary p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "chat" && (
        <AgentChat
          agentId={agent.id}
          agentName={agent.name}
          agentRole={agent.role}
          projectTitle={projectTitle}
          initialMessages={initialMessages}
        />
      )}

      {activeTab === "tasks" && (
        <TaskBoard tasks={tasks} onRefetch={refetch} />
      )}

      {activeTab === "logs" && (
        <div className="space-y-2">
          {logs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-12 text-center">
              <ScrollText className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Niciun log încă.</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full gradient-money" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{log.action_type}</p>
                  {log.details && (
                    <pre className="mt-1 text-xs text-muted-foreground overflow-x-auto">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  )}
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {new Date(log.created_at).toLocaleString("ro-RO")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "performance" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="text-sm font-semibold mb-4">Metrici Performanță</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Task Completion Rate</span>
                <span className="font-semibold">{total > 0 ? Math.round((completed / total) * 100) : 0}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-secondary">
                <div className="h-full rounded-full gradient-money" style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Performance Score</span>
                <span className="font-semibold">{score}/100</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-secondary">
                <div className={cn("h-full rounded-full", score >= 70 ? "gradient-money" : "gradient-amber")} style={{ width: `${score}%` }} />
              </div>
            </div>
            <div className="rounded-lg gradient-money-subtle p-4 mt-4">
              <p className="text-sm font-medium text-primary">📊 Calcul Scor</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Scorul se calculează din: rata completare task-uri (60%), respectare deadline-uri (25%) și rating utilizator (15%).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
