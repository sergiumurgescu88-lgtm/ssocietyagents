import { mockLearningModules } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";

const difficultyLabels = { beginner: "Începător", intermediate: "Intermediar", advanced: "Avansat" };

export default function Learning() {
  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">Learning Hub</h1>
        <p className="text-sm text-muted-foreground">Module educaționale — cum să faci bani online</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockLearningModules.map((mod) => (
          <div key={mod.id} className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-money-subtle">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mt-3 text-sm font-semibold">{mod.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{mod.description}</p>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span>{mod.lessons} lecții</span>
              <span>·</span>
              <span>{mod.duration}</span>
              <span>·</span>
              <span className={cn(
                mod.difficulty === "beginner" ? "text-primary" : mod.difficulty === "intermediate" ? "text-warning" : "text-destructive"
              )}>{difficultyLabels[mod.difficulty]}</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progres</span>
                <span className="font-medium">{mod.progress}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-secondary">
                <div
                  className={cn("h-full rounded-full transition-all", mod.progress > 0 ? "gradient-money" : "")}
                  style={{ width: `${mod.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
