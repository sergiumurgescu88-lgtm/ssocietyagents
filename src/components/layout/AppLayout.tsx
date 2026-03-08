import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { useState, useEffect } from "react";

export function AppLayout() {
  const { sidebarOpen } = useAppStore();
  const isMobile = useIsMobile();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("ventureai-onboarding-done");
    if (!dismissed) setShowOnboarding(true);
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem("ventureai-onboarding-done", "true");
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <OfflineIndicator />
      <AppSidebar />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300",
          !isMobile && (sidebarOpen ? "ml-64" : "ml-16"),
        )}
      >
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
      <FeedbackWidget />
      {showOnboarding && <OnboardingWizard onComplete={completeOnboarding} />}
    </div>
  );
}
