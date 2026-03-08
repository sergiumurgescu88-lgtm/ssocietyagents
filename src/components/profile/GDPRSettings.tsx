import { useState } from "react";
import { useAuth } from "@/stores/auth-store";
import { supabase } from "@/integrations/supabase/client";
import { Download, Trash2, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function GDPRSettings() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleExport = async () => {
    if (!user) return;
    setExporting(true);
    try {
      const tables = ["profiles", "projects", "project_agents", "tasks", "opportunities", "user_opportunities", "revenue_transactions", "expenses", "notifications", "user_modules", "certificates"] as const;
      const exportData: Record<string, unknown[]> = {};

      for (const table of tables) {
        const { data } = await (supabase.from(table) as any).select("*").eq("user_id", user.id);
        if (data && data.length > 0) exportData[table] = data;
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ventureai-data-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Export complet", description: "Datele tale au fost descărcate." });
    } catch {
      toast({ title: "Eroare la export", variant: "destructive" });
    }
    setExporting(false);
  };

  const handleDelete = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      const tables = ["notifications", "notification_preferences", "expenses", "revenue_transactions", "user_opportunities", "user_modules", "user_quizzes", "certificates", "agent_conversations", "agent_logs", "tasks", "project_agents", "milestones", "scan_logs", "opportunities", "projects", "usage_tracking", "subscriptions", "profiles"] as const;
      for (const table of tables) {
        await (supabase.from(table) as any).delete().eq("user_id", user.id);
      }
      await signOut();
      toast({ title: "Cont șters", description: "Toate datele tale au fost șterse." });
      navigate("/login");
    } catch {
      toast({ title: "Eroare la ștergere", variant: "destructive" });
    }
    setDeleting(false);
  };

  return (
    <div className="space-y-6 mt-8 border-t border-border pt-6">
      <div>
        <h3 className="text-sm font-semibold">Date Personale (GDPR)</h3>
        <p className="text-xs text-muted-foreground mt-1">Exportă sau șterge datele tale conform GDPR</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" className="gap-2" onClick={handleExport} disabled={exporting}>
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Exportă toate datele (JSON)
        </Button>

        {!confirmDelete ? (
          <Button variant="outline" className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="h-4 w-4" />
            Șterge contul și datele
          </Button>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/5 p-3">
            <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
            <p className="text-xs text-destructive">Această acțiune este ireversibilă!</p>
            <Button size="sm" variant="destructive" className="ml-auto gap-1" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              Confirm ștergerea
            </Button>
            <Button size="sm" variant="outline" onClick={() => setConfirmDelete(false)}>Anulează</Button>
          </div>
        )}
      </div>
    </div>
  );
}
