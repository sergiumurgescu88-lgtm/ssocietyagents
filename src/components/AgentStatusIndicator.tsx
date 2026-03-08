import type { Agent } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig = {
  active: { label: "Activ", className: "bg-primary/20 text-primary" },
  working: { label: "Lucrează", className: "gradient-money-subtle text-primary animate-pulse-glow" },
  blocked: { label: "Blocat", className: "bg-destructive/20 text-destructive" },
  idle: { label: "Inactiv", className: "bg-muted text-muted-foreground" },
};

export function AgentStatusIndicator({ status }: { status: Agent["status"] }) {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", config.className)}>
      <span className={cn(
        "h-1.5 w-1.5 rounded-full",
        status === "active" && "bg-primary",
        status === "working" && "gradient-money",
        status === "blocked" && "bg-destructive",
        status === "idle" && "bg-muted-foreground",
      )} />
      {config.label}
    </span>
  );
}
