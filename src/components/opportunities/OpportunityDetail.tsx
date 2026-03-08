import type { OpportunityDB } from "@/lib/opportunities-api";
import { cn } from "@/lib/utils";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Zap, Bookmark, Play, ExternalLink, Target, Clock, DollarSign } from "lucide-react";

interface Props {
  opportunity: OpportunityDB | null;
  open: boolean;
  onClose: () => void;
  userStatus?: string;
  onSave: () => void;
  onStart: () => void;
}

const effortLabels: Record<string, string> = { low: "Efort mic", medium: "Efort mediu", high: "Efort mare" };
const trendLabels: Record<string, string> = { growing: "📈 În creștere", emerging: "🔥 Emergent", stable: "📊 Stabil", declining: "📉 În declin" };

export function OpportunityDetail({ opportunity, open, onClose, userStatus, onSave, onStart }: Props) {
  if (!opportunity) return null;

  const scoreColor = opportunity.profit_score >= 80 ? "text-primary" : opportunity.profit_score >= 60 ? "text-warning-foreground" : "text-muted-foreground";

  const actionPlan = [
    "Cercetare de piață: Validează cererea și identifică nișa exactă",
    "Analiză competiție: Studiază top 5 competitori și diferențiatorii",
    "MVP Planning: Definește funcționalitățile minime pentru lansare",
    "Setup tehnic: Configurează infrastructura și tool-urile necesare",
    "Lansare soft: Testează cu un grup mic de early adopters",
    "Optimizare: Iterare bazată pe feedback și metrici",
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {opportunity.is_new && (
              <span className="rounded-full gradient-money px-2 py-0.5 text-[10px] font-bold text-primary-foreground">NOU</span>
            )}
            <span className="text-xs text-muted-foreground">{opportunity.category}</span>
          </div>
          <DialogTitle className="text-lg">{opportunity.title}</DialogTitle>
          <DialogDescription>{opportunity.description}</DialogDescription>
        </DialogHeader>

        {/* Score + Revenue */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-border p-3 text-center">
            <Target className="mx-auto h-4 w-4 text-muted-foreground mb-1" />
            <p className={cn("text-2xl font-bold", scoreColor)}>{opportunity.profit_score}</p>
            <p className="text-[10px] text-muted-foreground">Profit Score</p>
          </div>
          <div className="rounded-lg border border-border p-3 text-center">
            <DollarSign className="mx-auto h-4 w-4 text-primary mb-1" />
            <p className="text-sm font-bold text-primary">
              ${opportunity.estimated_revenue_min?.toLocaleString()}–${opportunity.estimated_revenue_max?.toLocaleString()}
            </p>
            <p className="text-[10px] text-muted-foreground">Venit lunar</p>
          </div>
          <div className="rounded-lg border border-border p-3 text-center">
            <Clock className="mx-auto h-4 w-4 text-muted-foreground mb-1" />
            <p className="text-sm font-semibold">{effortLabels[opportunity.effort_level]}</p>
            <p className="text-[10px] text-muted-foreground">Nivel efort</p>
          </div>
        </div>

        {/* Trend */}
        <div className="flex items-center gap-2 rounded-lg bg-secondary p-3">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{trendLabels[opportunity.trend] || opportunity.trend}</span>
        </div>

        {/* Tags */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Skills necesare</p>
          <div className="flex flex-wrap gap-1.5">
            {opportunity.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
            ))}
          </div>
        </div>

        {/* Sources */}
        {opportunity.sources && Array.isArray(opportunity.sources) && (opportunity.sources as any[]).length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Surse</p>
            {(opportunity.sources as any[]).map((s: any, i: number) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <ExternalLink className="h-3 w-3" />
                <span>{s.name || s}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Plan */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Plan de acțiune sugerat</p>
          <ol className="space-y-2">
            {actionPlan.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                  {i + 1}
                </span>
                <span className="text-muted-foreground pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1 gap-1.5" onClick={onStart}>
            <Play className="h-4 w-4" />
            Creează Proiect
          </Button>
          <Button variant="outline" className="gap-1.5" onClick={onSave}>
            <Bookmark className={cn("h-4 w-4", userStatus === "saved" && "fill-current")} />
            {userStatus === "saved" ? "Salvat" : "Salvează"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
