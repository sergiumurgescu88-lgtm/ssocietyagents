import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Lock, AlertCircle, Check } from "lucide-react";
import { useAuth } from "@/stores/auth-store";
import { toast } from "sonner";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Minim 8 caractere")
  .regex(/[A-Z]/, "Cel puțin o literă mare")
  .regex(/[0-9]/, "Cel puțin o cifră")
  .regex(/[^A-Za-z0-9]/, "Cel puțin un caracter special");

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }
  }, []);

  const passwordValidation = passwordSchema.safeParse(password);
  const passwordChecks = [
    { label: "Minim 8 caractere", valid: password.length >= 8 },
    { label: "O literă mare", valid: /[A-Z]/.test(password) },
    { label: "O cifră", valid: /[0-9]/.test(password) },
    { label: "Un caracter special", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!passwordValidation.success) {
      setError(passwordValidation.error.issues[0].message);
      return;
    }
    if (password !== confirmPassword) {
      setError("Parolele nu se potrivesc");
      return;
    }
    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      toast.success("Parola a fost actualizată!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm animate-slide-in">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl gradient-money">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Parolă nouă</h1>
          <p className="mt-1 text-sm text-muted-foreground">Alege o parolă nouă pentru contul tău</p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Parolă nouă</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-input bg-secondary py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            {password && (
              <div className="mt-2 space-y-1">
                {passwordChecks.map((c) => (
                  <div key={c.label} className="flex items-center gap-1.5 text-xs">
                    <Check className={`h-3 w-3 ${c.valid ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={c.valid ? "text-primary" : "text-muted-foreground"}>{c.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Confirmă parola</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-input bg-secondary py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg gradient-money py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Se actualizează..." : "Actualizează parola"}
          </button>
        </form>
      </div>
    </div>
  );
}
