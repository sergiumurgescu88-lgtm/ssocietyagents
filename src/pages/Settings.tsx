import { useAppStore } from "@/stores/app-store";
import { User, CreditCard, Key, Bell } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAppStore();

  const sections = [
    { icon: User, title: "Profil", description: "Numele, email-ul și avatar-ul tău" },
    { icon: CreditCard, title: "Billing", description: "Planul curent și metoda de plată" },
    { icon: Key, title: "API Keys", description: "Gestionează cheile tale de acces" },
    { icon: Bell, title: "Notificări", description: "Preferințe de notificare" },
  ];

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">Setări</h1>
        <p className="text-sm text-muted-foreground">Gestionează contul și preferințele</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <div key={s.title} className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-money-subtle">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{s.title}</h3>
                <p className="text-xs text-muted-foreground">{s.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
