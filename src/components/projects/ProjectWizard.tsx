import { useState } from "react";
import { X, ChevronRight, ChevronLeft, Check, Sparkles, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/stores/auth-store";
import { createProject, autoCreateAgents, type ProjectCategory, type AgentRole } from "@/lib/projects-api";
import { toast } from "sonner";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const CATEGORIES: { value: ProjectCategory; label: string; emoji: string }[] = [
  { value: "ecommerce", label: "E-commerce", emoji: "🛒" },
  { value: "saas", label: "SaaS", emoji: "💻" },
  { value: "content", label: "Content", emoji: "✍️" },
  { value: "affiliate", label: "Affiliate", emoji: "🔗" },
  { value: "consulting", label: "Consulting", emoji: "🎯" },
  { value: "other", label: "Altele", emoji: "📦" },
];

const AGENT_ROLES: { value: AgentRole; label: string; desc: string }[] = [
  { value: "developer", label: "Developer", desc: "Construiește produsul și implementează features" },
  { value: "marketer", label: "Marketer", desc: "Strategii de marketing și growth" },
  { value: "sales", label: "Sales", desc: "Identifică clienți și închide vânzări" },
  { value: "researcher", label: "Researcher", desc: "Analizează piața și competiția" },
  { value: "analyst", label: "Analyst", desc: "Monitorizează metrici și rapoarte" },
];

const STEPS = ["Basics", "Obiective", "Budget", "Agenți AI", "Review"];

export function ProjectWizard({ onClose, onCreated }: Props) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProjectCategory>("other");
  const [tags, setTags] = useState("");

  // Step 2
  const [revenueTarget, setRevenueTarget] = useState("");
  const [deadline, setDeadline] = useState("");

  // Step 3
  const [budgetMoney, setBudgetMoney] = useState("");
  const [budgetHours, setBudgetHours] = useState("");

  // Step 4
  const [selectedAgents, setSelectedAgents] = useState<AgentRole[]>(["developer"]);

  const canNext = () => {
    if (step === 0) return title.trim().length >= 3;
    return true;
  };

  const toggleAgent = (role: AgentRole) => {
    setSelectedAgents((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleCreate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { project, error } = await createProject({
        title: title.trim(),
        description: description.trim(),
        category,
        revenue_target: parseFloat(revenueTarget) || 0,
        deadline: deadline || null,
        budget_money: parseFloat(budgetMoney) || 0,
        budget_hours: parseInt(budgetHours) || 0,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        user_id: user.id,
      });
      if (error) throw error;
      if (project) {
        await autoCreateAgents(project.id, user.id, selectedAgents);
        toast.success(`Proiect "${title}" creat cu ${selectedAgents.length + 1} agenți!`);
        onCreated();
      }
    } catch (err: any) {
      toast.error(err.message || "Eroare la creare proiect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg animate-slide-in rounded-2xl border border-border bg-card shadow-card-hover">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-bold">Proiect Nou</h2>
            <p className="text-xs text-muted-foreground">Pas {step + 1} din {STEPS.length}: {STEPS[step]}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-1 px-6 pt-4">
          {STEPS.map((_, i) => (
            <div key={i} className={cn("h-1 flex-1 rounded-full transition-all", i <= step ? "gradient-money" : "bg-secondary")} />
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-5 min-h-[280px]">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Titlu proiect *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: E-commerce Store Pet Supplies"
                  maxLength={100}
                  className="w-full rounded-lg border border-input bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Descriere</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrie proiectul pe scurt..."
                  maxLength={500}
                  rows={3}
                  className="w-full rounded-lg border border-input bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Categorie</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setCategory(c.value)}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                        category === c.value
                          ? "border-primary gradient-money-subtle text-primary"
                          : "border-border hover:border-muted-foreground"
                      )}
                    >
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Tags (separate cu virgulă)</label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="shopify, pets, dropshipping"
                  maxLength={200}
                  className="w-full rounded-lg border border-input bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Revenue Target ($)</label>
                <input
                  type="number"
                  value={revenueTarget}
                  onChange={(e) => setRevenueTarget(e.target.value)}
                  placeholder="5000"
                  min="0"
                  className="w-full rounded-lg border border-input bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full rounded-lg border border-input bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="rounded-lg gradient-money-subtle p-4">
                <p className="text-sm font-medium text-primary">💡 Sfat</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Setează obiective realiste. Poți oricând ajusta target-ul pe parcurs.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Budget financiar ($)</label>
                <input
                  type="number"
                  value={budgetMoney}
                  onChange={(e) => setBudgetMoney(e.target.value)}
                  placeholder="500"
                  min="0"
                  className="w-full rounded-lg border border-input bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Budget timp (ore/săptămână)</label>
                <input
                  type="number"
                  value={budgetHours}
                  onChange={(e) => setBudgetHours(e.target.value)}
                  placeholder="20"
                  min="0"
                  className="w-full rounded-lg border border-input bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div className="rounded-lg gradient-money-subtle p-3 mb-4">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium text-primary">Project Manager auto-inclus</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Fiecare proiect primește automat un PM-Agent care coordonează echipa.
                </p>
              </div>
              {AGENT_ROLES.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => toggleAgent(a.value)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all",
                    selectedAgents.includes(a.value)
                      ? "border-primary gradient-money-subtle"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    selectedAgents.includes(a.value) ? "gradient-money" : "bg-secondary"
                  )}>
                    {selectedAgents.includes(a.value) ? (
                      <Check className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Bot className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Rezumat proiect</h3>
              <div className="space-y-2 rounded-lg bg-secondary p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Titlu</span>
                  <span className="font-medium">{title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Categorie</span>
                  <span className="font-medium">{CATEGORIES.find((c) => c.value === category)?.label}</span>
                </div>
                {revenueTarget && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revenue target</span>
                    <span className="font-medium text-primary">${Number(revenueTarget).toLocaleString()}</span>
                  </div>
                )}
                {deadline && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deadline</span>
                    <span className="font-medium">{new Date(deadline).toLocaleDateString("ro-RO")}</span>
                  </div>
                )}
                {budgetMoney && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">${Number(budgetMoney).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Agenți AI</span>
                  <span className="font-medium">{selectedAgents.length + 1} (incl. PM)</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full gradient-money px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                  PM-Agent
                </span>
                {selectedAgents.map((r) => (
                  <span key={r} className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium capitalize">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <button
            onClick={() => (step > 0 ? setStep(step - 1) : onClose())}
            className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            {step > 0 ? "Înapoi" : "Anulează"}
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canNext()}
              className="flex items-center gap-1 rounded-lg gradient-money px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              Următorul
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={loading || !canNext()}
              className="flex items-center gap-2 rounded-lg gradient-money px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Se creează...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Creează Proiect
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
