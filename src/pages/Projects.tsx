import { useAppStore } from "@/stores/app-store";
import { ProjectCard } from "@/components/ProjectCard";
import { Plus } from "lucide-react";

export default function Projects() {
  const { projects } = useAppStore();

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Proiecte</h1>
          <p className="text-sm text-muted-foreground">{projects.length} proiecte în total</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg gradient-money px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          <Plus className="h-4 w-4" />
          Proiect Nou
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
