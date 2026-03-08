import type { Opportunity } from "@/types";
import { cn } from "@/lib/utils";
import { TrendingUp, Sparkles } from "lucide-react";

export function OpportunityCardSimple({ opportunity }: { opportunity: Opportunity }) {
  const scoreColor = opportunity.score >= 85 ? "text-primary" : opportunity.score >= 70 ? "text-warning" : "text-muted-foreground";

  return (
    <div className="group rounded-xl border border-border bg-card p-4 shadow-card transition-all duration-200 hover:shadow-card-hover">
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          opportunity.isNew ? "gradient-money" : "bg-secondary"
        )}>
          {opportunity.isNew ? (
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          ) : (
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-semibold">{opportunity.title}</h4>
            {opportunity.isNew && (
              <span className="shrink-0 rounded-full gradient-money px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                NOU
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{opportunity.description}</p>
          <div className="mt-2 flex items-center gap-3">
            <span className={cn("text-sm font-bold", scoreColor)}>{opportunity.score}/100</span>
            <span className="text-[10px] text-muted-foreground">{opportunity.source}</span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{opportunity.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
