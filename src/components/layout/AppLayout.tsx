import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppLayout() {
  const { sidebarOpen } = useAppStore();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
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
    </div>
  );
}
