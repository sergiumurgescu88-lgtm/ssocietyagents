import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

type PlanType = "free" | "pro" | "agency";

interface PlanLimits {
  maxProjects: number;
  maxAgents: number;
  maxApiCalls: number;
}

const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: { maxProjects: 2, maxAgents: 1, maxApiCalls: 100 },
  pro: { maxProjects: 10, maxAgents: 5, maxApiCalls: 5000 },
  agency: { maxProjects: 50, maxAgents: 25, maxApiCalls: 50000 },
};

interface PlanState {
  currentPlan: PlanType;
  status: "active" | "canceled" | "past_due" | "trialing";
  limits: PlanLimits;
  currentPeriodEnd: string | null;
  loading: boolean;

  fetchSubscription: (userId: string) => Promise<void>;
}

export const usePlan = create<PlanState>((set) => ({
  currentPlan: "free",
  status: "active",
  limits: PLAN_LIMITS.free,
  currentPeriodEnd: null,
  loading: false,

  fetchSubscription: async (userId) => {
    set({ loading: true });
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (data) {
      const plan = data.plan_type as PlanType;
      set({
        currentPlan: plan,
        status: data.status as PlanState["status"],
        limits: PLAN_LIMITS[plan],
        currentPeriodEnd: data.current_period_end,
      });
    }
    set({ loading: false });
  },
}));

export { PLAN_LIMITS };
export type { PlanType, PlanLimits };
