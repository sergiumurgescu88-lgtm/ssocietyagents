import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  gradient?: boolean;
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon, gradient }: StatCardProps) {
  return (
    <div className={cn(
      "rounded-xl border border-border p-5 shadow-card transition-all duration-200 hover:shadow-card-hover",
      gradient ? "gradient-money text-primary-foreground" : "bg-card"
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className={cn("text-sm", gradient ? "text-primary-foreground/80" : "text-muted-foreground")}>{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          {change && (
            <p className={cn(
              "mt-1 text-xs font-medium",
              gradient
                ? "text-primary-foreground/70"
                : changeType === "positive" ? "text-primary" : changeType === "negative" ? "text-destructive" : "text-muted-foreground"
            )}>
              {change}
            </p>
          )}
        </div>
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          gradient ? "bg-primary-foreground/20" : "gradient-money-subtle"
        )}>
          <Icon className={cn("h-5 w-5", gradient ? "text-primary-foreground" : "text-primary")} />
        </div>
      </div>
    </div>
  );
}
