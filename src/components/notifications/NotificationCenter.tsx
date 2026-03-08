import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/stores/auth-store";
import {
  fetchNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification,
} from "@/lib/notifications-api";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Check, Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ro } from "date-fns/locale";

export function NotificationCenter() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled: !!user,
    refetchInterval: 30000,
  });

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("notifications-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => { queryClient.invalidateQueries({ queryKey: ["notifications"] }); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, queryClient]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const typeColors: Record<string, string> = {
    success: "bg-primary/10 text-primary",
    warning: "bg-amber-500/10 text-amber-600",
    error: "bg-destructive/10 text-destructive",
    info: "bg-blue-500/10 text-blue-600",
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full gradient-money text-[10px] font-bold text-primary-foreground">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-xl border border-border bg-card p-0 shadow-card-hover animate-slide-in z-50">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold">Notificări</span>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllMutation.mutate()}
                className="text-xs text-primary hover:underline"
              >
                Marchează toate citite
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="mx-auto h-8 w-8 text-muted-foreground/30" />
                <p className="mt-2 text-xs text-muted-foreground">Nicio notificare</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-secondary/50",
                    !n.read && "bg-secondary/30"
                  )}
                >
                  <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs", typeColors[n.type] || typeColors.info)}>
                    <Bell className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm", !n.read && "font-medium")}>{n.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground/60">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ro })}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!n.read && (
                      <button
                        onClick={() => markReadMutation.mutate(n.id)}
                        className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-primary"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {n.action_url && (
                      <a
                        href={n.action_url}
                        className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => deleteMutation.mutate(n.id)}
                      className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
