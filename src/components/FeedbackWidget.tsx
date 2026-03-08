import { useState } from "react";
import { useAuth } from "@/stores/auth-store";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, X, Send, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function FeedbackWidget() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"bug" | "feature" | "general">("general");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim() || !user) return;
    setSending(true);
    try {
      // Store as notification to self for now (could be a separate feedback table)
      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "info",
        title: `Feedback: ${type}`,
        message: `Rating: ${rating}/5 — ${message}`,
      });
      toast({ title: "Mulțumim!", description: "Feedback-ul tău a fost trimis." });
      setMessage("");
      setRating(0);
      setOpen(false);
    } catch {
      toast({ title: "Eroare", variant: "destructive" });
    }
    setSending(false);
  };

  const types = [
    { id: "bug" as const, label: "Bug" },
    { id: "feature" as const, label: "Feature" },
    { id: "general" as const, label: "General" },
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full gradient-money text-primary-foreground shadow-lg transition-transform hover:scale-105"
      >
        {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 rounded-xl border border-border bg-card p-4 shadow-card-hover animate-slide-in">
          <h3 className="text-sm font-semibold mb-3">Trimite Feedback</h3>

          {/* Type selector */}
          <div className="flex gap-1.5 mb-3">
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={cn(
                  "flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                  type === t.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <span className="text-xs text-muted-foreground mr-1">Rating:</span>
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setRating(s)}>
                <Star className={cn("h-4 w-4 transition-colors", s <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
              </button>
            ))}
          </div>

          {/* Message */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Descrie feedback-ul tău..."
            maxLength={1000}
            rows={3}
            className="w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm outline-none resize-none focus:border-primary focus:ring-1 focus:ring-primary mb-3"
          />

          <Button size="sm" className="w-full gap-2" onClick={handleSubmit} disabled={sending || !message.trim()}>
            <Send className="h-3.5 w-3.5" />
            {sending ? "Se trimite..." : "Trimite"}
          </Button>
        </div>
      )}
    </>
  );
}
