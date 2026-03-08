import {
  Menu,
  Moon,
  Sun,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { useAuth } from "@/stores/auth-store";
import { usePlan } from "@/stores/plan-store";
import { useTheme } from "@/hooks/use-theme";
import { PlanBadge } from "@/components/profile/PlanBadge";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function AppHeader() {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const { profile, signOut } = useAuth();
  const { currentPlan } = usePlan();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur-md sm:px-6">
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      <PlanBadge plan={currentPlan} />

      <div className="flex-1" />

      <button
        onClick={toggleTheme}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      <NotificationCenter />

      {/* User menu */}
      <div className="relative" ref={userRef}>
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary"
        >
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full gradient-money text-sm font-bold text-primary-foreground">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || "U"
            )}
          </div>
          <span className="hidden text-sm font-medium sm:inline">
            {profile?.full_name || profile?.email?.split("@")[0] || "User"}
          </span>
          <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
        </button>
        {userMenuOpen && (
          <div className="absolute right-0 top-12 w-48 rounded-xl border border-border bg-card p-1.5 shadow-card-hover animate-slide-in">
            <button
              onClick={() => { setUserMenuOpen(false); navigate("/settings"); }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              Setări
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
