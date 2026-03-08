import type { OpportunityDB } from "@/lib/opportunities-api";
import { cn } from "@/lib/utils";
import { TrendingUp, Sparkles, Bookmark, Play, X, ArrowUpRight, Flame, Zap, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const effortColors: Record<string, string> = {
  low: "bg-primary/10 text-primary",
  medium: "bg-warning/10 text-warning-foreground",
  high: "bg-destructive/10 text-destructive",
};

const effortLabels: Record<string, string> = {
  low: "Efort mic",
  medium: "Efort mediu",
  high: "Efort mare",
};

const trendIcons: Record<string, typeof TrendingUp> = {
  growing: TrendingUp,
  emerging: Flame,
  stable: BarChart3,
  declining: TrendingUp,
};

interface Props {
  opportunity: OpportunityDB;
  userStatus?: string;
  onSave: () => void;
  onDismiss: () => void;
  onStart: () => void;
  onDetail: () => void;
}

export function OpportunityCard({ opportunity, userStatus, onSave, onDismiss, onStart, onDetail }: Props) {
  const scoreColor = opportunity.profit_score >= 80
    ? "text-primary"
    : opportunity.profit_score >= 60
      ? "text-warning-foreground"
      : "text-muted-foreground";

  const scoreBg = opportunity.profit_score >= 80
    ? "gradient-money"
    : opportunity.profit_score >= 60
      ? "gradient-amber"
      : "bg-secondary";

  const TrendIcon = trendIcons[opportunity.trend] || TrendingUp;

  if (userStatus === "dismissed") return null;

  return (
    <div
      className="group rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:shadow-card-hover cursor-pointer"
      onClick={onDetail}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", scoreBg)}>
            {opportunity.is_new ? (
              <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
            ) : (
              <TrendIcon className="h-4.5 w-4.5 text-primary-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="truncate text-sm font-semibold">{opportunity.title}</h4>
              {opportunity.is_new && (
                <span className="shrink-0 rounded-full gradient-money px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                  NOU
                </span>
              )}
              {userStatus === "saved" && (
                <Bookmark className="h-3.5 w-3.5 shrink-0 fill-primary text-primary" />
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{opportunity.description}</p>
          </div>
        </div>

        {/* Score badge */}
        <div className="flex flex-col items-center shrink-0">
          <span className={cn("text-xl font-bold", scoreColor)}>{opportunity.profit_score}</span>
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">scor</span>
        </div>
      </div>

      {/* Revenue estimate */}
      <div className="mt-3 flex items-center gap-2">
        <Zap className="h-3.5 w-3.5 text-primary" />
        <span className="text-sm font-bold text-primary">
          ${opportunity.estimated_revenue_min?.toLocaleString()} – ${opportunity.estimated_revenue_max?.toLocaleString()}
        </span>
        <span className="text-[10px] text-muted-foreground">/lună</span>
      </div>

      {/* Tags + effort */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", effortColors[opportunity.effort_level] || "bg-secondary text-muted-foreground")}>
          {effortLabels[opportunity.effort_level] || opportunity.effort_level}
        </span>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
          {opportunity.category}
        </span>
        {opportunity.tags?.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
            {tag}
          </span>
        ))}
        {(opportunity.tags?.length || 0) > 3 && (
          <span className="text-[10px] text-muted-foreground">+{opportunity.tags!.length - 3}</span>
        )}
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2 border-t border-border pt-3" onClick={(e) => e.stopPropagation()}>
        <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={onSave}>
          <Bookmark className={cn("h-3 w-3", userStatus === "saved" && "fill-current")} />
          {userStatus === "saved" ? "Salvat" : "Salvează"}
        </Button>
        <Button size="sm" className="h-7 text-xs gap-1" onClick={onStart}>
          <Play className="h-3 w-3" />
          Start Proiect
        </Button>
        <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground ml-auto" onClick={onDismiss}>
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
