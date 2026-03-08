import { cn } from "@/lib/utils";
import { Crown, Sparkles, Zap } from "lucide-react";
import type { PlanType } from "@/stores/plan-store";

const planConfig: Record<PlanType, { label: string; icon: React.ElementType; className: string }> = {
  free: { label: "Free", icon: Zap, className: "bg-secondary text-muted-foreground" },
  pro: { label: "Pro", icon: Sparkles, className: "gradient-money text-primary-foreground" },
  agency: { label: "Agency", icon: Crown, className: "bg-gradient-to-r from-amber-500 to-orange-500 text-white" },
};

export function PlanBadge({ plan }: { plan: PlanType }) {
  const config = planConfig[plan];
  const Icon = config.icon;

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", config.className)}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}
