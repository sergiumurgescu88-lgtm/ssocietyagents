import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Bot,
  Lightbulb,
  GraduationCap,
  DollarSign,
  Settings,
  ChevronLeft,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Proiecte", url: "/projects", icon: FolderKanban },
  { title: "Agenți AI", url: "/agents", icon: Bot },
  { title: "Oportunități", url: "/opportunities", icon: Lightbulb },
  { title: "Learning", url: "/learning", icon: GraduationCap },
  { title: "Venituri", url: "/revenue", icon: DollarSign },
  { title: "Setări", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useAppStore();
  const isMobile = useIsMobile();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-border bg-sidebar transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16",
          isMobile && !sidebarOpen && "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link to="/dashboard" className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-money">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            {sidebarOpen && (
              <span className="text-lg font-bold gradient-money-text">VentureAI</span>
            )}
          </Link>
          {sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.url}
              to={item.url}
              onClick={() => isMobile && setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive(item.url)
                  ? "gradient-money-subtle text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive(item.url) && "text-primary")} />
              {sidebarOpen && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>

        {/* Upgrade card */}
        {sidebarOpen && (
          <div className="m-3 rounded-xl gradient-money p-4">
            <p className="text-sm font-semibold text-primary-foreground">Upgrade la Pro</p>
            <p className="mt-1 text-xs text-primary-foreground/80">
              Deblochează agenți nelimitați și analytics avansat
            </p>
            <button className="mt-3 w-full rounded-lg bg-primary-foreground/20 px-3 py-1.5 text-xs font-medium text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/30">
              Vezi planuri
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
