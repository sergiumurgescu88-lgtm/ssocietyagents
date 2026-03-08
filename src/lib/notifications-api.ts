import { supabase } from "@/integrations/supabase/client";

export interface NotificationDB {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  action_url: string | null;
  created_at: string;
}

export interface NotificationPrefs {
  id: string;
  user_id: string;
  email_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  daily_digest_enabled: boolean;
  daily_digest_time: string;
  agent_updates: boolean;
  project_alerts: boolean;
  opportunity_alerts: boolean;
  learning_reminders: boolean;
  revenue_alerts: boolean;
}

export async function fetchNotifications(): Promise<NotificationDB[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data || []) as NotificationDB[];
}

export async function markNotificationRead(id: string) {
  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
  if (error) throw error;
}

export async function markAllNotificationsRead() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
  if (error) throw error;
}

export async function deleteNotification(id: string) {
  const { error } = await supabase.from("notifications").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchNotificationPrefs(): Promise<NotificationPrefs | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw error;
  return data as NotificationPrefs | null;
}

export async function upsertNotificationPrefs(prefs: Partial<NotificationPrefs>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  
  const existing = await fetchNotificationPrefs();
  if (existing) {
    const { error } = await supabase
      .from("notification_preferences")
      .update({ ...prefs, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("notification_preferences")
      .insert({ user_id: user.id, ...prefs });
    if (error) throw error;
  }
}
