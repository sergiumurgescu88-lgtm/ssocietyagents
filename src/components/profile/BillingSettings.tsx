import { usePlan, PLAN_LIMITS } from "@/stores/plan-store";
import { PlanBadge } from "./PlanBadge";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlanType } from "@/stores/plan-store";

const plans: { type: PlanType; price: string; features: string[] }[] = [
  {
    type: "free",
    price: "$0/lună",
    features: ["2 proiecte", "1 agent AI", "100 API calls/lună", "Community support"],
  },
  {
    type: "pro",
    price: "$29/lună",
    features: ["10 proiecte", "5 agenți AI", "5.000 API calls/lună", "Priority support", "Analytics avansat"],
  },
  {
    type: "agency",
    price: "$99/lună",
    features: ["50 proiecte", "25 agenți AI", "50.000 API calls/lună", "Dedicated support", "White-label", "Team collaboration"],
  },
];

export function BillingSettings() {
  const { currentPlan, status, currentPeriodEnd } = usePlan();

  return (
    <div className="space-y-6">
      {/* Current plan status */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Plan curent</p>
            <div className="mt-1 flex items-center gap-2">
              <PlanBadge plan={currentPlan} />
              <span className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                status === "active" ? "gradient-money-subtle text-primary" : "bg-destructive/10 text-destructive"
              )}>
                {status === "active" ? "Activ" : status === "canceled" ? "Anulat" : status}
              </span>
            </div>
          </div>
          {currentPeriodEnd && (
            <p className="text-xs text-muted-foreground">
              Expiră: {new Date(currentPeriodEnd).toLocaleDateString("ro-RO")}
            </p>
          )}
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.type === currentPlan;
          return (
            <div
              key={plan.type}
              className={cn(
                "rounded-xl border p-5 transition-all",
                isCurrent
                  ? "border-primary shadow-card-hover"
                  : "border-border shadow-card hover:shadow-card-hover"
              )}
            >
              <PlanBadge plan={plan.type} />
              <p className="mt-3 text-2xl font-bold">{plan.price}</p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                disabled={isCurrent}
                className={cn(
                  "mt-5 w-full rounded-lg py-2 text-sm font-medium transition-opacity",
                  isCurrent
                    ? "bg-secondary text-muted-foreground cursor-default"
                    : "gradient-money text-primary-foreground hover:opacity-90"
                )}
              >
                {isCurrent ? "Plan curent" : (
                  <span className="flex items-center justify-center gap-1">
                    Upgrade <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
