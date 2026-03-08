import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Zap,
  Crown,
  Building2,
  Bot,
  TrendingUp,
  BookOpen,
  ScanSearch,
  BarChart3,
  Shield,
  ArrowRight,
  ChevronRight,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Features ── */
const features = [
  {
    icon: Bot,
    title: "Agenți AI Autonomi",
    desc: "Delegă sarcini către agenți inteligenți care lucrează non-stop pentru proiectele tale.",
  },
  {
    icon: ScanSearch,
    title: "Scanner Oportunități",
    desc: "Descoperă automat noi surse de venit adaptate nișei și abilităților tale.",
  },
  {
    icon: TrendingUp,
    title: "Revenue Tracking",
    desc: "Dashboard complet cu vizualizarea veniturilor, cheltuielilor și marjelor de profit.",
  },
  {
    icon: BookOpen,
    title: "Learning Hub",
    desc: "Module interactive cu quiz-uri și certificate pentru a-ți accelera creșterea.",
  },
  {
    icon: BarChart3,
    title: "Analytics Avansat",
    desc: "Metrici în timp real și rapoarte detaliate pentru decizii bazate pe date.",
  },
  {
    icon: Shield,
    title: "Securitate & GDPR",
    desc: "Date protejate, export complet și conformitate cu reglementările europene.",
  },
];

/* ── Pricing Plans ── */
const plans = [
  {
    key: "free",
    name: "Free",
    price: "$0",
    icon: Zap,
    popular: false,
    features: [
      "3 proiecte active",
      "2 agenți AI",
      "Scanner de bază (5 scanări/zi)",
      "Module learning gratuite",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: "$29",
    icon: Crown,
    popular: true,
    features: [
      "Proiecte nelimitate",
      "Agenți AI nelimitați",
      "Scanner avansat (nelimitat)",
      "Analytics complete",
      "Export CSV/PDF",
      "Suport prioritar",
    ],
  },
  {
    key: "agency",
    name: "Agency",
    price: "$79",
    icon: Building2,
    popular: false,
    features: [
      "Tot din Pro",
      "Echipă nelimitată",
      "White-label branding",
      "API access complet",
      "Manager dedicat",
      "Onboarding personalizat",
    ],
  },
];

/* ── Testimonials ── */
const testimonials = [
  {
    name: "Andrei M.",
    role: "Freelancer eCommerce",
    text: "Am crescut de la $2k la $8k/lună în 3 luni cu ajutorul agenților AI.",
  },
  {
    name: "Maria S.",
    role: "Fondatoare SaaS",
    text: "Scanner-ul de oportunități mi-a descoperit o nișă pe care nu o luam în calcul. Revenue +40%.",
  },
  {
    name: "Vlad P.",
    role: "Agency Owner",
    text: "Gestionez 12 proiecte simultan fără efort suplimentar. Game changer.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-extrabold tracking-tight">
            <span className="gradient-money-text">Venture</span>AI
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="transition hover:text-foreground">Funcționalități</a>
            <a href="#pricing" className="transition hover:text-foreground">Prețuri</a>
            <a href="#testimonials" className="transition hover:text-foreground">Testimoniale</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Autentificare</Link>
            </Button>
            <Button size="sm" className="gradient-money border-0 text-primary-foreground" asChild>
              <Link to="/signup">Începe gratuit</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2">
          <div className="h-[500px] w-[700px] rounded-full bg-primary/10 blur-[120px]" />
        </div>
        <div className="pointer-events-none absolute top-40 right-0">
          <div className="h-[300px] w-[300px] rounded-full bg-accent/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5 px-4 py-1.5 text-xs font-semibold">
            <Star className="h-3.5 w-3.5 text-primary" />
            Platforma #1 pentru antreprenori digitali
          </Badge>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Scalează-ți afacerea cu{" "}
            <span className="gradient-money-text">Agenți AI</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            VentureAI combină inteligența artificială cu strategia de business
            pentru a-ți automatiza proiectele, descoperi oportunități și maximiza veniturile.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="gradient-money border-0 px-8 text-primary-foreground shadow-card-hover" asChild>
              <Link to="/signup">
                Începe gratuit <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#features">
                Descoperă funcționalitățile <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Stats row */}
          <div className="mx-auto mt-16 grid max-w-xl grid-cols-3 gap-8 text-center">
            {[
              { value: "1.200+", label: "Utilizatori activi" },
              { value: "$2.4M", label: "Venituri generate" },
              { value: "98%", label: "Satisfacție clienți" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-extrabold sm:text-3xl gradient-money-text">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="border-t border-border bg-muted/30 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-semibold">Funcționalități</Badge>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Tot ce ai nevoie, într-un singur loc</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              De la idee la profit – VentureAI te ghidează la fiecare pas cu instrumente puternice.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-money-subtle">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-semibold">Prețuri</Badge>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Alege planul potrivit</h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Începe gratuit, upgradează când ești gata să scalezi.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.key}
                className={cn(
                  "relative flex flex-col rounded-2xl border-2 p-7 transition-all",
                  plan.popular
                    ? "border-primary shadow-card-hover scale-[1.03]"
                    : "border-border shadow-card hover:shadow-card-hover"
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-money text-primary-foreground border-0">
                    Popular
                  </Badge>
                )}

                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      plan.popular ? "gradient-money" : "bg-secondary"
                    )}
                  >
                    <plan.icon
                      className={cn(
                        "h-5 w-5",
                        plan.popular ? "text-primary-foreground" : "text-muted-foreground"
                      )}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold">{plan.name}</h3>
                    <p className="text-2xl font-extrabold">
                      {plan.price}
                      <span className="text-sm font-normal text-muted-foreground">/lună</span>
                    </p>
                  </div>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={cn(
                    "mt-6 w-full",
                    plan.popular && "gradient-money text-primary-foreground border-0"
                  )}
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link to="/signup">
                    {plan.key === "free" ? "Începe gratuit" : `Alege ${plan.name}`}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="border-t border-border bg-muted/30 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-semibold">Testimoniale</Badge>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Ce spun utilizatorii</h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-card-hover"
              >
                <div className="flex gap-1 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Gata să-ți scalezi veniturile?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Alătură-te celor 1.200+ antreprenori care folosesc VentureAI pentru a genera mai mult cu mai puțin efort.
          </p>
          <Button size="lg" className="mt-8 gradient-money border-0 px-10 text-primary-foreground shadow-card-hover" asChild>
            <Link to="/signup">
              Creează cont gratuit <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-muted/30 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} VentureAI. Toate drepturile rezervate.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/terms" className="hover:text-foreground transition">Termeni</Link>
            <Link to="/privacy" className="hover:text-foreground transition">Confidențialitate</Link>
            <Link to="/pricing" className="hover:text-foreground transition">Prețuri</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
