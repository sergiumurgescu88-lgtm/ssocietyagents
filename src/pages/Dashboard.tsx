import { useEffect } from "react";
import {
  DollarSign,
  FolderKanban,
  Bot,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAppStore } from "@/stores/app-store";
import { useAuth } from "@/stores/auth-store";
import { usePlan } from "@/stores/plan-store";
import { mockRevenueChart } from "@/lib/mock-data";
import { StatCard } from "@/components/StatCard";
import { ProjectCard } from "@/components/ProjectCard";
import { OpportunityCardSimple } from "@/components/OpportunityCardSimple";
import { AgentStatusIndicator } from "@/components/AgentStatusIndicator";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { projects, agents, opportunities } = useAppStore();
  const { profile, user } = useAuth();
  const { currentPlan, limits, fetchSubscription } = usePlan();
  const activeAgents = agents.filter((a) => a.status === "active" || a.status === "working").length;

  useEffect(() => {
    if (user) fetchSubscription(user.id);
  }, [user]);

  const displayName = profile?.full_name || profile?.email?.split("@")[0] || "utilizator";

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          Salut, <span className="gradient-money-text">{displayName}</span> 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Plan {currentPlan} · {limits.maxProjects} proiecte · {limits.maxAgents} agenți disponibili
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Venituri Totale"
          value="$2,450"
          change="+28% față de luna trecută"
          changeType="positive"
          icon={DollarSign}
          gradient
        />
        <StatCard
          title="Proiecte Active"
          value={projects.filter((p) => p.status === "active").length}
          change={`${projects.length}/${limits.maxProjects} limită`}
          icon={FolderKanban}
        />
        <StatCard
          title="Agenți Activi"
          value={activeAgents}
          change={`${agents.length}/${limits.maxAgents} limită`}
          icon={Bot}
        />
        <StatCard
          title="Scor Oportunități"
          value={Math.round(opportunities.reduce((a, o) => a + o.score, 0) / opportunities.length)}
          change="4 oportunități noi"
          changeType="positive"
          icon={TrendingUp}
        />
      </div>

      {/* Chart + Agents */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Evoluție Venituri</h2>
            <span className="text-xs text-muted-foreground">Ultimele 6 luni</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mockRevenueChart}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(152, 69%, 45%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(152, 69%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem", fontSize: 12 }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number) => [`$${value}`, "Venit"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(152, 69%, 45%)" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Agenți AI</h2>
            <Link to="/agents" className="text-xs text-primary hover:underline">Vezi toți</Link>
          </div>
          <div className="space-y-3">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{agent.name}</p>
                  <p className="text-[11px] text-muted-foreground capitalize">{agent.role}</p>
                </div>
                <AgentStatusIndicator status={agent.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects + Opportunities */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Proiecte Recente</h2>
            <Link to="/projects" className="flex items-center gap-1 text-xs text-primary hover:underline">
              Vezi toate <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Oportunități Zilnice</h2>
            <Link to="/opportunities" className="flex items-center gap-1 text-xs text-primary hover:underline">
              Explorează <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {opportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
