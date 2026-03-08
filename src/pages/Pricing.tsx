import { useState } from "react";
import { useAuth } from "@/stores/auth-store";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Building2, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const PLANS = {
  free: {
    name: "Free",
    price: "$0",
    priceId: null,
    productId: null,
    icon: Zap,
    features: ["3 proiecte active", "2 agenți AI", "Scanner de bază (5 scanări/zi)", "Module learning gratuite"],
  },
  pro: {
    name: "Pro",
    price: "$29",
    priceId: "price_1T8p6yLDo9sXtuKJ5JU88cOn",
    productId: "prod_U73DWYeiq2qxH9",
    icon: Crown,
    features: ["Proiecte nelimitate", "Agenți AI nelimitați", "Scanner avansat (nelimitat)", "Analytics complete", "Export CSV/PDF", "Suport prioritar"],
  },
  agency: {
    name: "Agency",
    price: "$79",
    priceId: "price_1T8p7PLDo9sXtuKJXIgJYLfM",
    productId: "prod_U73DabxsNQOJay",
    icon: Building2,
    features: ["Tot din Pro", "Echipă nelimitată", "White-label branding", "API access complet", "Manager dedicat", "Onboarding personalizat"],
  },
};

export default function PricingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string) => {
    if (!user) {
      toast({ title: "Trebuie să fii autentificat", variant: "destructive" });
      return;
    }
    setLoading(priceId);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    }
    setLoading(null);
  };

  const handlePortal = async () => {
    setLoading("portal");
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast({ title: "Eroare", description: err.message, variant: "destructive" });
    }
    setLoading(null);
  };

  return (
    <div className="min-h-screen bg-background p-6 sm:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">Alege planul potrivit</h1>
          <p className="text-muted-foreground">Începe gratuit, upgradează când ești gata să scalezi</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {Object.entries(PLANS).map(([key, plan]) => {
            const isPro = key === "pro";
            return (
              <div
                key={key}
                className={cn(
                  "relative rounded-2xl border-2 p-6 transition-all",
                  isPro
                    ? "border-primary shadow-card-hover scale-[1.02]"
                    : "border-border shadow-card hover:shadow-card-hover"
                )}
              >
                {isPro && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-money text-primary-foreground border-0">
                    Popular
                  </Badge>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    isPro ? "gradient-money" : "bg-secondary"
                  )}>
                    <plan.icon className={cn("h-5 w-5", isPro ? "text-primary-foreground" : "text-muted-foreground")} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{plan.name}</h3>
                    <p className="text-2xl font-bold">{plan.price}<span className="text-sm font-normal text-muted-foreground">/lună</span></p>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                {plan.priceId ? (
                  <Button
                    className={cn("w-full gap-2", isPro && "gradient-money text-primary-foreground border-0")}
                    variant={isPro ? "default" : "outline"}
                    onClick={() => handleCheckout(plan.priceId!)}
                    disabled={loading === plan.priceId}
                  >
                    {loading === plan.priceId ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Alege {plan.name}
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Plan curent
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handlePortal}
            className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {loading === "portal" ? "Se deschide..." : "Gestionează abonamentul existent"}
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/terms" className="hover:underline">Termeni</Link>
          {" · "}
          <Link to="/privacy" className="hover:underline">Confidențialitate</Link>
        </div>
      </div>
    </div>
  );
}
