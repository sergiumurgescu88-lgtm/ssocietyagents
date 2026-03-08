import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/stores/auth-store";
import {
  fetchModules, fetchUserModules, fetchCertificates,
  categoryMeta,
} from "@/lib/learning-api";
import type { LearningModuleDB } from "@/lib/learning-api";
import { ModulePlayer } from "@/components/learning/ModulePlayer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Search, BookOpen, Clock, Zap, Trophy, GraduationCap, Award,
  CheckCircle2, Star,
} from "lucide-react";

const difficultyLabels: Record<string, string> = {
  beginner: "Începător",
  intermediate: "Intermediar",
  advanced: "Avansat",
};

const difficultyColors: Record<string, string> = {
  beginner: "text-primary",
  intermediate: "text-warning-foreground",
  advanced: "text-destructive",
};

export default function Learning() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeModule, setActiveModule] = useState<LearningModuleDB | null>(null);

  const { data: modules = [], isLoading } = useQuery({
    queryKey: ["learning-modules"],
    queryFn: fetchModules,
    enabled: !!user,
  });

  const { data: userModules = [] } = useQuery({
    queryKey: ["user-modules"],
    queryFn: fetchUserModules,
    enabled: !!user,
  });

  const { data: certificates = [] } = useQuery({
    queryKey: ["certificates"],
    queryFn: fetchCertificates,
    enabled: !!user,
  });

  const userModuleMap = useMemo(() => {
    const map: Record<string, { progress: number; status: string; quiz_score: number | null }> = {};
    userModules.forEach((um) => {
      map[um.module_id] = { progress: um.progress, status: um.status, quiz_score: um.quiz_score };
    });
    return map;
  }, [userModules]);

  const categories = useMemo(() => {
    const cats = new Set(modules.map((m) => m.category));
    return ["all", ...Array.from(cats)];
  }, [modules]);

  const filtered = useMemo(() => {
    let items = [...modules];
    if (selectedCategory !== "all") items = items.filter((m) => m.category === selectedCategory);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((m) =>
        m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
      );
    }
    return items;
  }, [modules, selectedCategory, search]);

  // Stats
  const totalXP = useMemo(() => {
    return modules.reduce((sum, mod) => {
      const um = userModuleMap[mod.id];
      return sum + (um?.status === "completed" ? mod.xp_reward : 0);
    }, 0);
  }, [modules, userModuleMap]);

  const completedCount = userModules.filter((um) => um.status === "completed").length;
  const level = totalXP < 200 ? "Beginner" : totalXP < 500 ? "Intermediate" : totalXP < 1000 ? "Advanced" : "Expert";

  const handleProgressUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ["user-modules"] });
    queryClient.invalidateQueries({ queryKey: ["certificates"] });
  };

  // Module player view
  if (activeModule) {
    const um = userModuleMap[activeModule.id];
    return (
      <ModulePlayer
        module={activeModule}
        userProgress={um?.progress || 0}
        userStatus={um?.status || "not_started"}
        onBack={() => setActiveModule(null)}
        onProgressUpdate={handleProgressUpdate}
      />
    );
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Learning Hub</h1>
        <p className="text-sm text-muted-foreground">Module educaționale — cum să faci bani online</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Zap className="mx-auto h-5 w-5 text-primary mb-1" />
          <p className="text-xl font-bold">{totalXP}</p>
          <p className="text-[10px] text-muted-foreground">Total XP</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Star className="mx-auto h-5 w-5 text-primary mb-1" />
          <p className="text-sm font-bold">{level}</p>
          <p className="text-[10px] text-muted-foreground">Nivel</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <CheckCircle2 className="mx-auto h-5 w-5 text-primary mb-1" />
          <p className="text-xl font-bold">{completedCount}/{modules.length}</p>
          <p className="text-[10px] text-muted-foreground">Module completate</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Award className="mx-auto h-5 w-5 text-primary mb-1" />
          <p className="text-xl font-bold">{certificates.length}</p>
          <p className="text-[10px] text-muted-foreground">Certificate</p>
        </div>
      </div>

      {/* Certificates */}
      {certificates.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {certificates.map((cert) => (
            <div key={cert.id} className="shrink-0 flex items-center gap-2 rounded-xl gradient-money px-4 py-2">
              <Trophy className="h-4 w-4 text-primary-foreground" />
              <div>
                <p className="text-xs font-semibold text-primary-foreground">{cert.title}</p>
                <p className="text-[10px] text-primary-foreground/70">
                  {new Date(cert.earned_at).toLocaleDateString("ro-RO")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search + Category filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Caută module..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {categories.map((c) => {
            const meta = categoryMeta[c];
            return (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors",
                  selectedCategory === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {c === "all" ? "Toate" : meta ? `${meta.icon} ${meta.label}` : c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Module grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <GraduationCap className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">Niciun modul găsit</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((mod) => {
            const um = userModuleMap[mod.id];
            const progress = um?.progress || 0;
            const isCompleted = um?.status === "completed";
            const cat = categoryMeta[mod.category] || { label: mod.category, color: "bg-secondary text-muted-foreground", icon: "📚" };

            return (
              <div
                key={mod.id}
                onClick={() => setActiveModule(mod)}
                className={cn(
                  "group cursor-pointer rounded-xl border bg-card p-5 shadow-card transition-all hover:shadow-card-hover",
                  isCompleted ? "border-primary/30" : "border-border"
                )}
              >
                {/* Category + difficulty */}
                <div className="flex items-center justify-between mb-3">
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", cat.color)}>
                    {cat.icon} {cat.label}
                  </span>
                  <span className={cn("text-[10px] font-medium", difficultyColors[mod.difficulty])}>
                    {difficultyLabels[mod.difficulty]}
                  </span>
                </div>

                {/* Progress ring + title */}
                <div className="flex items-start gap-3">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
                    <svg className="h-11 w-11 -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--secondary))"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="3"
                        strokeDasharray={`${progress}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-[9px] font-bold">{progress}%</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
                      {mod.title}
                      {isCompleted && <CheckCircle2 className="inline ml-1 h-3.5 w-3.5 text-primary" />}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{mod.description}</p>
                  </div>
                </div>

                {/* Meta */}
                <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{mod.lessons_count} lecții</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{mod.estimated_minutes} min</span>
                  <span className="flex items-center gap-1 text-primary font-medium"><Zap className="h-3 w-3" />{mod.xp_reward} XP</span>
                </div>

                {/* Quiz score if completed */}
                {um?.quiz_score !== null && um?.quiz_score !== undefined && (
                  <div className="mt-2 text-[10px] text-muted-foreground">
                    Quiz: <span className="font-medium text-primary">{um.quiz_score}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
