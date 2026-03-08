import {
  Bell,
  Menu,
  Moon,
  Sun,
  DollarSign,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { useAuth } from "@/stores/auth-store";
import { usePlan } from "@/stores/plan-store";
import { useTheme } from "@/hooks/use-theme";
import { PlanBadge } from "@/components/profile/PlanBadge";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function AppHeader() {
  const { notifications, sidebarOpen, toggleSidebar, markAllNotificationsRead } = useAppStore();
  const { profile, signOut } = useAuth();
  const { currentPlan } = usePlan();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
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

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full gradient-money text-[10px] font-bold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </button>
        {notifOpen && (
          <div className="absolute right-0 top-12 w-80 rounded-xl border border-border bg-card p-2 shadow-card-hover animate-slide-in">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-semibold">Notificări</span>
              {unreadCount > 0 && (
                <button onClick={markAllNotificationsRead} className="text-xs text-primary hover:underline">
                  Marchează toate citite
                </button>
              )}
            </div>
            <div className="max-h-64 space-y-1 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn("rounded-lg px-3 py-2 text-sm transition-colors", !n.read ? "bg-secondary" : "opacity-60")}
                >
                  <p className="font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
