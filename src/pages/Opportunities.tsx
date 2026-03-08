import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/stores/auth-store";
import {
  fetchOpportunities, fetchUserOpportunities,
  saveOpportunity, dismissOpportunity, startProjectFromOpportunity,
  scanForOpportunities,
} from "@/lib/opportunities-api";
import type { OpportunityDB } from "@/lib/opportunities-api";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { OpportunityDetail } from "@/components/opportunities/OpportunityDetail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Search, SlidersHorizontal, Sparkles, Bookmark, RefreshCw, TrendingUp, Zap, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["all", "ecommerce", "saas", "content", "affiliate", "consulting", "crypto", "freelancing"];
const effortLevels = ["all", "low", "medium", "high"];
const sortOptions = [
  { value: "score", label: "Scor" },
  { value: "revenue", label: "Venit" },
  { value: "date", label: "Dată" },
  { value: "effort", label: "Efort" },
];

type ViewTab = "feed" | "saved";

export default function Opportunities() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [effort, setEffort] = useState("all");
  const [sort, setSort] = useState("score");
  const [tab, setTab] = useState<ViewTab>("feed");
  const [selectedOpp, setSelectedOpp] = useState<OpportunityDB | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data: opportunities = [], isLoading } = useQuery({
    queryKey: ["opportunities"],
    queryFn: fetchOpportunities,
    enabled: !!user,
  });

  const { data: userOpps = [] } = useQuery({
    queryKey: ["user-opportunities"],
    queryFn: fetchUserOpportunities,
    enabled: !!user,
  });

  const scanMutation = useMutation({
    mutationFn: (cat?: string) => scanForOpportunities(cat),
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      toast({ title: "Scanare completă", description: `${count} oportunități noi generate!` });
    },
    onError: (e: any) => {
      toast({ title: "Eroare scanare", description: e.message, variant: "destructive" });
    },
  });

  const saveMutation = useMutation({
    mutationFn: saveOpportunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-opportunities"] });
      toast({ title: "Salvat!" });
    },
  });

  const dismissMutation = useMutation({
    mutationFn: dismissOpportunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-opportunities"] });
    },
  });

  const startMutation = useMutation({
    mutationFn: startProjectFromOpportunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-opportunities"] });
      toast({ title: "Proiect creat!", description: "Mergi la Proiecte pentru a configura." });
      navigate("/projects");
    },
  });

  const userOppMap = useMemo(() => {
    const map: Record<string, string> = {};
    userOpps.forEach((uo) => { map[uo.opportunity_id] = uo.status; });
    return map;
  }, [userOpps]);

  const filtered = useMemo(() => {
    let items = [...opportunities];

    // Tab filter
    if (tab === "saved") {
      const savedIds = new Set(userOpps.filter((uo) => uo.status === "saved").map((uo) => uo.opportunity_id));
      items = items.filter((o) => savedIds.has(o.id));
    } else {
      // Hide dismissed in feed
      const dismissedIds = new Set(userOpps.filter((uo) => uo.status === "dismissed").map((uo) => uo.opportunity_id));
      items = items.filter((o) => !dismissedIds.has(o.id));
    }

    if (search) {
      const q = search.toLowerCase();
      items = items.filter((o) =>
        o.title.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (category !== "all") items = items.filter((o) => o.category === category);
    if (effort !== "all") items = items.filter((o) => o.effort_level === effort);

    // Sort
    const effortOrder: Record<string, number> = { low: 1, medium: 2, high: 3 };
    items.sort((a, b) => {
      if (sort === "score") return b.profit_score - a.profit_score;
      if (sort === "revenue") return (b.estimated_revenue_max || 0) - (a.estimated_revenue_max || 0);
      if (sort === "effort") return (effortOrder[a.effort_level] || 2) - (effortOrder[b.effort_level] || 2);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return items;
  }, [opportunities, userOpps, search, category, effort, sort, tab]);

  const newCount = opportunities.filter((o) => o.is_new).length;

  return (
    <div className="space-y-5 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Oportunități</h1>
          <p className="text-sm text-muted-foreground">Scanner AI de oportunități profitabile</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => scanMutation.mutate(category !== "all" ? category : undefined)}
          disabled={scanMutation.isPending}
        >
          {scanMutation.isPending ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {scanMutation.isPending ? "Scanez..." : "Scanează acum"}
        </Button>
      </div>

      {/* Daily digest banner */}
      {newCount > 0 && tab === "feed" && (
        <div className="rounded-xl gradient-money p-4 flex items-center gap-3">
          <Zap className="h-5 w-5 text-primary-foreground shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary-foreground">
              {newCount} oportunități noi azi!
            </p>
            <p className="text-xs text-primary-foreground/80">
              Scannerul AI a identificat oportunități cu scor mare de profit
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setTab("feed")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            tab === "feed" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
          )}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Feed
        </button>
        <button
          onClick={() => setTab("saved")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            tab === "saved" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
          )}
        >
          <Bookmark className="h-3.5 w-3.5" />
          Salvate
          {userOpps.filter((u) => u.status === "saved").length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 text-[10px]">
              {userOpps.filter((u) => u.status === "saved").length}
            </Badge>
          )}
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Caută oportunități..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant={showFilters ? "secondary" : "outline"}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-card p-3">
            <div>
              <p className="text-[10px] font-medium text-muted-foreground mb-1.5">Categorie</p>
              <div className="flex flex-wrap gap-1">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                      category === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {c === "all" ? "Toate" : c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground mb-1.5">Efort</p>
              <div className="flex gap-1">
                {effortLevels.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEffort(e)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                      effort === e ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {e === "all" ? "Toate" : e === "low" ? "Mic" : e === "medium" ? "Mediu" : "Mare"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground mb-1.5">Sortare</p>
              <div className="flex gap-1">
                {sortOptions.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSort(s.value)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                      sort === s.value ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Sparkles className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">
            {tab === "saved" ? "Nicio oportunitate salvată" : "Nicio oportunitate găsită"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            {tab === "saved"
              ? "Salvează oportunități din feed pentru a le review-ui mai târziu"
              : "Apasă 'Scanează acum' pentru a genera oportunități noi cu AI"}
          </p>
          {tab === "feed" && (
            <Button
              className="mt-4 gap-2"
              onClick={() => scanMutation.mutate(undefined)}
              disabled={scanMutation.isPending}
            >
              <Sparkles className="h-4 w-4" />
              Scanează acum
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              userStatus={userOppMap[opp.id]}
              onSave={() => saveMutation.mutate(opp.id)}
              onDismiss={() => dismissMutation.mutate(opp.id)}
              onStart={() => startMutation.mutate(opp.id)}
              onDetail={() => setSelectedOpp(opp)}
            />
          ))}
        </div>
      )}

      {/* Detail modal */}
      <OpportunityDetail
        opportunity={selectedOpp}
        open={!!selectedOpp}
        onClose={() => setSelectedOpp(null)}
        userStatus={selectedOpp ? userOppMap[selectedOpp.id] : undefined}
        onSave={() => { if (selectedOpp) saveMutation.mutate(selectedOpp.id); }}
        onStart={() => { if (selectedOpp) startMutation.mutate(selectedOpp.id); }}
      />
    </div>
  );
}
