import { useState } from "react";
import { cn } from "@/lib/utils";
import { updateTaskStatus, type TaskStatus } from "@/lib/projects-api";
import { Circle, Clock, CheckCircle2, AlertTriangle, Flag, GripVertical } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type DbTask = Database["public"]["Tables"]["tasks"]["Row"];

const columns: { id: TaskStatus; label: string; icon: React.ElementType; color: string }[] = [
  { id: "todo", label: "Todo", icon: Circle, color: "text-muted-foreground" },
  { id: "in_progress", label: "În Progres", icon: Clock, color: "text-blue-500" },
  { id: "done", label: "Finalizat", icon: CheckCircle2, color: "text-primary" },
  { id: "blocked", label: "Blocat", icon: AlertTriangle, color: "text-destructive" },
];

const priorityColors: Record<string, string> = {
  low: "text-muted-foreground",
  medium: "text-blue-500",
  high: "text-warning",
  urgent: "text-destructive",
};

interface Props {
  tasks: DbTask[];
  onRefetch: () => void;
}

export function TaskBoard({ tasks, onRefetch }: Props) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);

  const handleDragStart = (taskId: string) => setDragging(taskId);

  const handleDragOver = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    setDragOverCol(colId);
  };

  const handleDrop = async (colId: TaskStatus) => {
    if (dragging) {
      const task = tasks.find((t) => t.id === dragging);
      if (task && task.status !== colId) {
        await updateTaskStatus(dragging, colId);
        onRefetch();
      }
    }
    setDragging(null);
    setDragOverCol(null);
  };

  const handleDragEnd = () => {
    setDragging(null);
    setDragOverCol(null);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        const Icon = col.icon;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDrop={() => handleDrop(col.id)}
            onDragLeave={() => setDragOverCol(null)}
            className={cn(
              "rounded-xl border bg-secondary/30 p-3 min-h-[200px] transition-all",
              dragOverCol === col.id ? "border-primary bg-primary/5" : "border-border"
            )}
          >
            {/* Column header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", col.color)} />
                <span className="text-xs font-semibold">{col.label}</span>
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold">
                {colTasks.length}
              </span>
            </div>

            {/* Tasks */}
            <div className="space-y-2">
              {colTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "group cursor-grab rounded-lg border border-border bg-card p-3 shadow-card transition-all hover:shadow-card-hover active:cursor-grabbing",
                    dragging === task.id && "opacity-50"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100" />
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-xs font-medium", task.status === "done" && "line-through text-muted-foreground")}>
                        {task.title}
                      </p>
                      {task.due_date && (
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {new Date(task.due_date).toLocaleDateString("ro-RO")}
                        </p>
                      )}
                    </div>
                    <Flag className={cn("h-3 w-3 shrink-0", priorityColors[task.priority])} />
                  </div>
                </div>
              ))}

              {colTasks.length === 0 && (
                <div className="rounded-lg border border-dashed border-border py-6 text-center">
                  <p className="text-[10px] text-muted-foreground">Drop aici</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
