import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects, type DbProject, type ProjectStatus } from "@/lib/projects-api";
import { useAuth } from "@/stores/auth-store";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Filter,
  ArrowUpDown,
  FolderKanban,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectWizard } from "@/components/projects/ProjectWizard";

const statusConfig: Record<string, { label: string; class: string }> = {
  active: { label: "Activ", class: "gradient-money-subtle text-primary" },
  paused: { label: "Pauză", class: "bg-warning/15 text-warning" },
  completed: { label: "Finalizat", class: "bg-blue-500/15 text-blue-500" },
  blocked: { label: "Blocat", class: "bg-destructive/15 text-destructive" },
  archived: { label: "Arhivat", class: "bg-secondary text-muted-foreground" },
};

const categoryLabels: Record<string, string> = {
  ecommerce: "E-commerce",
  saas: "SaaS",
  content: "Content",
  affiliate: "Affiliate",
  consulting: "Consulting",
  other: "Altele",
};

type SortKey = "title" | "created_at" | "current_revenue" | "progress";
type ViewMode = "grid" | "list";

export default function Projects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [sortBy, setSortBy] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const { data: projects = [], isLoading, refetch } = useQuery({
    queryKey: ["projects", user?.id],
    queryFn: async () => {
      const { data, error } = await fetchProjects();
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const filtered = useMemo(() => {
    let result = [...projects];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q) ||
          (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }
    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "title") cmp = a.title.localeCompare(b.title);
      else if (sortBy === "created_at") cmp = a.created_at.localeCompare(b.created_at);
      else if (sortBy === "current_revenue") cmp = (a.current_revenue ?? 0) - (b.current_revenue ?? 0);
      else if (sortBy === "progress") cmp = (a.progress ?? 0) - (b.progress ?? 0);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [projects, search, statusFilter, sortBy, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(key); setSortDir("desc"); }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Proiecte</h1>
          <p className="text-sm text-muted-foreground">{projects.length} proiecte în total</p>
        </div>
        <button
          onClick={() => setWizardOpen(true)}
          className="flex items-center gap-2 rounded-lg gradient-money px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Proiect Nou
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Caută proiecte..."
            className="w-full rounded-lg border border-input bg-secondary py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | "all")}
            className="rounded-lg border border-input bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="all">Toate statusurile</option>
            <option value="active">Activ</option>
            <option value="paused">Pauză</option>
            <option value="completed">Finalizat</option>
            <option value="blocked">Blocat</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => toggleSort(e.target.value as SortKey)}
            className="rounded-lg border border-input bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="created_at">Dată creare</option>
            <option value="title">Nume</option>
            <option value="current_revenue">Venit</option>
            <option value="progress">Progres</option>
          </select>
          <div className="flex rounded-lg border border-input">
            <button
              onClick={() => setView("grid")}
              className={cn("p-2 transition-colors", view === "grid" ? "bg-secondary text-foreground" : "text-muted-foreground")}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn("p-2 transition-colors", view === "list" ? "bg-secondary text-foreground" : "text-muted-foreground")}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className={cn("grid gap-4", view === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "")}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-secondary" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
          <FolderKanban className="h-12 w-12 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">Niciun proiect găsit</p>
          <p className="text-xs text-muted-foreground">Creează primul tău proiect pentru a începe</p>
          <button
            onClick={() => setWizardOpen(true)}
            className="mt-4 flex items-center gap-2 rounded-lg gradient-money px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Proiect Nou
          </button>
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectGridCard key={p.id} project={p} onClick={() => navigate(`/project/${p.id}`)} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <ProjectListRow key={p.id} project={p} onClick={() => navigate(`/project/${p.id}`)} />
          ))}
        </div>
      )}

      {/* Wizard modal */}
      {wizardOpen && (
        <ProjectWizard
          onClose={() => setWizardOpen(false)}
          onCreated={() => { setWizardOpen(false); refetch(); }}
        />
      )}
    </div>
  );
}

function ProjectGridCard({ project: p, onClick }: { project: DbProject; onClick: () => void }) {
  const sc = statusConfig[p.status] ?? statusConfig.active;
  return (
    <button
      onClick={onClick}
      className="group w-full rounded-xl border border-border bg-card p-5 text-left shadow-card transition-all hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold">{p.title}</h3>
            <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium", sc.class)}>
              {sc.label}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{categoryLabels[p.category] ?? p.category}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      {p.description && (
        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{p.description}</p>
      )}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progres</span>
          <span className="font-medium">{p.progress ?? 0}%</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full rounded-full bg-secondary">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              (p.progress ?? 0) >= 60 ? "gradient-money" : "gradient-amber"
            )}
            style={{ width: `${p.progress ?? 0}%` }}
          />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Venit</span>
        <span className="text-sm font-semibold text-primary">
          ${(p.current_revenue ?? 0).toLocaleString()}
          {p.revenue_target ? (
            <span className="text-xs text-muted-foreground font-normal"> / ${Number(p.revenue_target).toLocaleString()}</span>
          ) : null}
        </span>
      </div>
    </button>
  );
}

function ProjectListRow({ project: p, onClick }: { project: DbProject; onClick: () => void }) {
  const sc = statusConfig[p.status] ?? statusConfig.active;
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-xl border border-border bg-card px-5 py-3 text-left shadow-card transition-all hover:shadow-card-hover"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold">{p.title}</h3>
          <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium", sc.class)}>
            {sc.label}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{categoryLabels[p.category]}</p>
      </div>
      <div className="hidden w-32 sm:block">
        <div className="h-1.5 w-full rounded-full bg-secondary">
          <div
            className={cn("h-full rounded-full", (p.progress ?? 0) >= 60 ? "gradient-money" : "gradient-amber")}
            style={{ width: `${p.progress ?? 0}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground text-right">{p.progress ?? 0}%</p>
      </div>
      <span className="text-sm font-semibold text-primary">${(p.current_revenue ?? 0).toLocaleString()}</span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100" />
    </button>
  );
}
