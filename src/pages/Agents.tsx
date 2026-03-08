import { useAppStore } from "@/stores/app-store";
import { AgentStatusIndicator } from "@/components/AgentStatusIndicator";
import { Plus, Bot } from "lucide-react";

export default function Agents() {
  const { agents } = useAppStore();

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agenți AI</h1>
          <p className="text-sm text-muted-foreground">{agents.length} agenți configurați</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg gradient-money px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          <Plus className="h-4 w-4" />
          Agent Nou
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <div key={agent.id} className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-money-subtle">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <AgentStatusIndicator status={agent.status} />
            </div>
            <h3 className="mt-3 font-semibold">{agent.name}</h3>
            <p className="text-xs text-muted-foreground capitalize">{agent.role}</p>
            <p className="mt-2 text-xs text-muted-foreground">{agent.description}</p>
            <div className="mt-4">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Task-uri</span>
                <span className="font-medium">{agent.tasksCompleted}/{agent.tasksTotal}</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-secondary">
                <div
                  className="h-full rounded-full gradient-money transition-all"
                  style={{ width: `${(agent.tasksCompleted / agent.tasksTotal) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
