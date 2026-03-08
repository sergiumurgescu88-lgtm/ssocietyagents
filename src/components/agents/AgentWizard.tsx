import { useState } from "react";
import { X, ChevronRight, ChevronLeft, Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/stores/auth-store";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { AgentRole } from "@/lib/projects-api";

interface Props {
  projectId?: string;
  onClose: () => void;
  onCreated: () => void;
}

const ROLES: { value: AgentRole; label: string; color: string; desc: string }[] = [
  { value: "project_manager", label: "Project Manager", color: "from-emerald-500 to-green-500", desc: "Coordonează echipa și prioritizează task-uri" },
  { value: "developer", label: "Developer", color: "from-blue-500 to-cyan-500", desc: "Scrie cod, debug, deployment" },
  { value: "marketer", label: "Marketer", color: "from-purple-500 to-pink-500", desc: "Strategii marketing și conținut" },
  { value: "sales", label: "Sales", color: "from-amber-500 to-orange-500", desc: "Outreach, email templates, conversii" },
  { value: "researcher", label: "Researcher", color: "from-teal-500 to-emerald-500", desc: "Analiză piață și competiție" },
  { value: "analyst", label: "Analyst", color: "from-indigo-500 to-violet-500", desc: "Analytics, metrici, rapoarte" },
];

const PROMPTS: Record<string, string> = {
  project_manager: "Ești un Project Manager AI. Coordonezi proiecte, prioritizezi task-uri, creezi planuri de acțiune.",
  developer: "Ești un Developer AI. Ajuți cu arhitectură software, cod, debugging, deployment.",
  marketer: "Ești un Marketing AI. Creezi strategii de marketing, copy, plan de conținut.",
  sales: "Ești un Sales AI. Creezi email templates, strategii de vânzare, follow-up sequences.",
  researcher: "Ești un Research AI. Analizezi piețe, competiție, trenduri.",
  analyst: "Ești un Analyst AI. Monitorizezi KPIs, creezi rapoarte, analizezi revenue.",
};

export function AgentWizard({ projectId, onClose, onCreated }: Props) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<AgentRole | null>(null);
  const [name, setName] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const selectRole = (role: AgentRole) => {
    setSelectedRole(role);
    const roleInfo = ROLES.find((r) => r.value === role);
    setName(`${roleInfo?.label ?? role}-Agent`);
    setCustomPrompt(PROMPTS[role] ?? "");
  };

  const handleCreate = async () => {
    if (!user || !selectedRole) return;
    setLoading(true);
    try {
      // If no projectId, we need one. For now create a standalone agent by finding first project or erroring
      let pid = projectId;
      if (!pid) {
        const { data: projects } = await supabase.from("projects").select("id").limit(1);
        if (projects && projects.length > 0) {
          pid = projects[0].id;
        } else {
          toast.error("Creează mai întâi un proiect pentru a adăuga agenți.");
          setLoading(false);
          return;
        }
      }
      const { error } = await supabase.from("project_agents").insert({
        project_id: pid,
        user_id: user.id,
        name: name.trim(),
        role: selectedRole,
        system_prompt: customPrompt,
        status: "active",
      });
      if (error) throw error;
      toast.success(`Agent "${name}" creat!`);
      onCreated();
    } catch (err: any) {
      toast.error(err.message || "Eroare la creare");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg animate-slide-in rounded-2xl border border-border bg-card shadow-card-hover">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold">Agent AI Nou</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-1 px-6 pt-4">
          {[0, 1].map((i) => (
            <div key={i} className={cn("h-1 flex-1 rounded-full transition-all", i <= step ? "gradient-money" : "bg-secondary")} />
          ))}
        </div>

        <div className="px-6 py-5 min-h-[300px]">
          {step === 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground mb-3">Alege rolul agentului:</p>
              {ROLES.map((role) => (
                <button
                  key={role.value}
                  onClick={() => selectRole(role.value)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all",
                    selectedRole === role.value ? "border-primary gradient-money-subtle" : "border-border hover:border-muted-foreground"
                  )}
                >
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white", role.color)}>
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{role.label}</p>
                    <p className="text-xs text-muted-foreground">{role.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Nume agent</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  className="w-full rounded-lg border border-input bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">System Prompt</label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={6}
                  maxLength={1000}
                  className="w-full rounded-lg border border-input bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                />
                <p className="mt-1 text-xs text-muted-foreground">{customPrompt.length}/1000 caractere</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <button onClick={() => (step > 0 ? setStep(0) : onClose())} className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" /> {step > 0 ? "Înapoi" : "Anulează"}
          </button>
          {step === 0 ? (
            <button
              onClick={() => setStep(1)}
              disabled={!selectedRole}
              className="flex items-center gap-1 rounded-lg gradient-money px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              Următorul <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={loading || !name.trim()}
              className="flex items-center gap-2 rounded-lg gradient-money px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {loading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Se creează..." : "Creează Agent"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
