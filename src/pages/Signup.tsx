import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Mail, Lock, Eye, EyeOff, User, AlertCircle, Check } from "lucide-react";
import { useAuth } from "@/stores/auth-store";
import { toast } from "sonner";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Minim 8 caractere")
  .regex(/[A-Z]/, "Cel puțin o literă mare")
  .regex(/[0-9]/, "Cel puțin o cifră")
  .regex(/[^A-Za-z0-9]/, "Cel puțin un caracter special");

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const passwordValidation = passwordSchema.safeParse(password);
  const passwordErrors = !passwordValidation.success
    ? passwordValidation.error.issues.map((i) => i.message)
    : [];

  const passwordChecks = [
    { label: "Minim 8 caractere", valid: password.length >= 8 },
    { label: "O literă mare", valid: /[A-Z]/.test(password) },
    { label: "O cifră", valid: /[0-9]/.test(password) },
    { label: "Un caracter special", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!passwordValidation.success) {
      setError(passwordErrors[0]);
      return;
    }
    if (password !== confirmPassword) {
      setError("Parolele nu se potrivesc");
      return;
    }
    if (!acceptTerms) {
      setError("Trebuie să accepți termenii și condițiile");
      return;
    }

    setLoading(true);
    const result = await signUp(email, password, fullName);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      toast.success("Cont creat! Verifică email-ul pentru confirmare.");
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm animate-slide-in">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl gradient-money">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-bold gradient-money-text">Creează cont</h1>
          <p className="mt-1 text-sm text-muted-foreground">Începe gratuit cu VentureAI</p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Nume complet</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Andrei Popescu"
                required
                maxLength={100}
                className="w-full rounded-lg border border-input bg-secondary py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="andrei@email.com"
                required
                maxLength={255}
                className="w-full rounded-lg border border-input bg-secondary py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Parolă</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-input bg-secondary py-2.5 pl-10 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
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
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1 text-xs text-destructive">Parolele nu se potrivesc</p>
            )}
          </div>

          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
            />
            <span>
              Accept{" "}
              <button type="button" className="text-primary hover:underline">
                termenii și condițiile
              </button>{" "}
              și{" "}
              <button type="button" className="text-primary hover:underline">
                politica de confidențialitate
              </button>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !acceptTerms}
            className="w-full rounded-lg gradient-money py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Se creează contul..." : "Creează cont"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Ai deja cont?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Autentifică-te
          </Link>
        </p>
      </div>
    </div>
  );
}
