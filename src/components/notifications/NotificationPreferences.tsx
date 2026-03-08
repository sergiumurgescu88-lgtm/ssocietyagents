import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/stores/auth-store";
import { fetchNotificationPrefs, upsertNotificationPrefs, type NotificationPrefs } from "@/lib/notifications-api";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Mail, Smartphone, Clock, Bot, FolderKanban, Lightbulb, GraduationCap, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const defaultPrefs: Omit<NotificationPrefs, "id" | "user_id"> = {
  email_enabled: true,
  push_enabled: true,
  in_app_enabled: true,
  daily_digest_enabled: true,
  daily_digest_time: "07:00",
  agent_updates: true,
  project_alerts: true,
  opportunity_alerts: true,
  learning_reminders: true,
  revenue_alerts: true,
};

export function NotificationPreferences() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: prefs } = useQuery({
    queryKey: ["notification-prefs"],
    queryFn: fetchNotificationPrefs,
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: upsertNotificationPrefs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-prefs"] });
      toast({ title: "Preferințe salvate" });
    },
  });

  const current = prefs || defaultPrefs;

  const toggle = (key: keyof typeof defaultPrefs) => {
    mutation.mutate({ [key]: !current[key as keyof typeof current] });
  };

  const channels = [
    { key: "in_app_enabled" as const, label: "In-App", desc: "Notificări în aplicație", icon: Bell },
    { key: "email_enabled" as const, label: "Email", desc: "Notificări prin email", icon: Mail },
    { key: "push_enabled" as const, label: "Push", desc: "Notificări browser/mobile", icon: Smartphone },
  ];

  const types = [
    { key: "agent_updates" as const, label: "Actualizări agenți", desc: "Task completat, blocat, necesită input", icon: Bot },
    { key: "project_alerts" as const, label: "Alerte proiecte", desc: "Deadline apropiat, milestone atins", icon: FolderKanban },
    { key: "opportunity_alerts" as const, label: "Oportunități", desc: "Oportunități noi cu scor mare", icon: Lightbulb },
    { key: "learning_reminders" as const, label: "Learning", desc: "Reminder module, quiz, certificat", icon: GraduationCap },
    { key: "revenue_alerts" as const, label: "Venituri", desc: "Plată primită, target atins", icon: DollarSign },
  ];

  return (
    <div className="space-y-8">
      {/* Channels */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Canale de notificare</h3>
        <div className="space-y-4">
          {channels.map((ch) => (
            <div key={ch.key} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <ch.icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{ch.label}</p>
                  <p className="text-xs text-muted-foreground">{ch.desc}</p>
                </div>
              </div>
              <Switch
                checked={!!current[ch.key as keyof typeof current]}
                onCheckedChange={() => toggle(ch.key)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Daily Digest */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Daily Digest</h3>
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Digest zilnic</p>
              <p className="text-xs text-muted-foreground">Top 3 oportunități + rezumat zilnic</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="time"
              className="w-24 h-8 text-xs"
              value={typeof current.daily_digest_time === "string" ? current.daily_digest_time : "07:00"}
              onChange={(e) => mutation.mutate({ daily_digest_time: e.target.value })}
            />
            <Switch
              checked={!!current.daily_digest_enabled}
              onCheckedChange={() => toggle("daily_digest_enabled")}
            />
          </div>
        </div>
      </div>

      {/* Types */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Tipuri de notificări</h3>
        <div className="space-y-3">
          {types.map((t) => (
            <div key={t.key} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <t.icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
              </div>
              <Switch
                checked={!!current[t.key as keyof typeof current]}
                onCheckedChange={() => toggle(t.key)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
