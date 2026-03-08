import { useState } from "react";
import { useAuth } from "@/stores/auth-store";
import { Zap, Target, Bot, Lightbulb, GraduationCap, DollarSign, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OnboardingWizardProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: Zap,
    title: "Bine ai venit la VentureAI!",
    description: "Platforma ta AI pentru generare de venituri. Hai să configurăm totul în 2 minute.",
  },
  {
    icon: Target,
    title: "Ce vrei să faci?",
    description: "Selectează obiectivele tale principale:",
    options: [
      { id: "ecommerce", label: "E-commerce", icon: DollarSign },
      { id: "saas", label: "SaaS / Software", icon: Bot },
      { id: "freelancing", label: "Freelancing", icon: Lightbulb },
      { id: "content", label: "Content Creation", icon: GraduationCap },
    ],
  },
  {
    icon: Bot,
    title: "Agenții tăi AI",
    description: "VentureAI folosește agenți AI specializați care lucrează pentru tine 24/7. Pot face research, marketing, development și multe altele.",
  },
  {
    icon: Lightbulb,
    title: "Scanner de Oportunități",
    description: "Scannerul AI identifică zilnic oportunități profitabile bazate pe trenduri, competiție și skill-urile tale.",
  },
  {
    icon: Check,
    title: "Totul e gata!",
    description: "Contul tău este configurat. Mergi la Dashboard pentru a începe.",
  },
];

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const { profile } = useAuth();
  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) => prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="w-full max-w-md animate-slide-in px-4">
        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i <= step ? "gradient-money" : "bg-secondary")} />
          ))}
        </div>

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-money">
            <current.icon className="h-7 w-7 text-primary-foreground" />
          </div>

          <h2 className="text-xl font-bold mb-2">
            {step === 0 ? `Salut, ${profile?.full_name?.split(" ")[0] || "acolo"}! 👋` : current.title}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">{current.description}</p>

          {/* Goals selection */}
          {current.options && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {current.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => toggleGoal(opt.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                    selectedGoals.includes(opt.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <opt.icon className={cn("h-6 w-6", selectedGoals.includes(opt.id) ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-sm font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            {step > 0 && (
              <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
                Înapoi
              </Button>
            )}
            <Button
              className="flex-1 gap-2"
              onClick={() => isLast ? onComplete() : setStep(step + 1)}
            >
              {isLast ? "Începe!" : "Continuă"}
              {!isLast && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>

          {step === 0 && (
            <button onClick={onComplete} className="mt-4 text-xs text-muted-foreground hover:underline">
              Skip onboarding
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
