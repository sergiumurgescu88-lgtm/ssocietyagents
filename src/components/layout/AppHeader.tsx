import {
  Bell,
  Menu,
  Moon,
  Sun,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

export function AppHeader() {
  const { user, notifications, sidebarOpen, toggleSidebar, markAllNotificationsRead } = useAppStore();
  const { theme, toggleTheme } = useTheme();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur-md sm:px-6">
      {/* Menu toggle */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      {/* Revenue badge */}
      <div className="flex items-center gap-2 rounded-full gradient-money-subtle px-3 py-1.5">
        <DollarSign className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-primary">
          ${user?.revenue?.toLocaleString() ?? "0"}
        </span>
        <span className="text-xs text-muted-foreground">/lună</span>
      </div>

      <div className="flex-1" />

      {/* Theme toggle */}
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
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-primary hover:underline"
                >
                  Marchează toate citite
                </button>
              )}
            </div>
            <div className="max-h-64 space-y-1 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm transition-colors",
                    !n.read ? "bg-secondary" : "opacity-60"
                  )}
                >
                  <p className="font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User avatar */}
      <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary">
        <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-money text-sm font-bold text-primary-foreground">
          {user?.name?.charAt(0) ?? "U"}
        </div>
        <span className="hidden text-sm font-medium sm:inline">{user?.name}</span>
        <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
      </button>
    </header>
  );
}
