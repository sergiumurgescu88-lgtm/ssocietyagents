import { Link } from "react-router-dom";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

const statusLabels: Record<Project["status"], string> = {
  active: "Activ",
  paused: "Pauză",
  completed: "Finalizat",
  archived: "Arhivat",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/project/${project.id}`}
      className="group block rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold">{project.title}</h3>
            <span className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
              project.status === "active" ? "gradient-money-subtle text-primary" : "bg-secondary text-muted-foreground"
            )}>
              {statusLabels[project.status]}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{project.category}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progres</span>
          <span className="font-medium">{project.progress}%</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full rounded-full bg-secondary">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              project.progress >= 60 ? "gradient-money" : "gradient-amber"
            )}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Revenue */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Venit generat</span>
        <span className="text-sm font-semibold text-primary">${project.revenue.toLocaleString()}</span>
      </div>
    </Link>
  );
}
