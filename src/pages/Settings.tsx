import { useEffect, useState } from "react";
import { useAuth } from "@/stores/auth-store";
import { usePlan } from "@/stores/plan-store";
import { UserProfile } from "@/components/profile/UserProfile";
import { BillingSettings } from "@/components/profile/BillingSettings";
import { NotificationPreferences } from "@/components/notifications/NotificationPreferences";
import { PlanBadge } from "@/components/profile/PlanBadge";
import { User, CreditCard, Key, Bell, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

type Tab = "profile" | "billing" | "api" | "notifications";

export default function SettingsPage() {
  const { user, profile, signOut } = useAuth();
  const { currentPlan, fetchSubscription } = usePlan();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchSubscription(user.id);
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "Profil", icon: User },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "api", label: "API Keys", icon: Key },
    { id: "notifications", label: "Notificări", icon: Bell },
  ];

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Setări</h1>
          <p className="text-sm text-muted-foreground">Gestionează contul și preferințele</p>
        </div>
        <div className="flex items-center gap-3">
          <PlanBadge plan={currentPlan} />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-secondary p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        {activeTab === "profile" && <UserProfile />}
        {activeTab === "billing" && <BillingSettings />}
        {activeTab === "api" && (
          <div className="text-center py-12">
            <Key className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              Gestionarea API keys va fi disponibilă în curând.
            </p>
          </div>
        )}
        {activeTab === "notifications" && <NotificationPreferences />}
      </div>
    </div>
  );
}
