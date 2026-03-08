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
  Rocket,
  Users,
  DollarSign,
  Clock,
  Target,
  Sparkles,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

/* ── Animated Section Wrapper ── */
function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── 3D Tilt Card ── */
function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [transform, setTransform] = useState("");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)");
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: "transform 0.25s ease-out" }}
      className={className}
    >
      {children}
    </div>
  );
}

/* ── Animated Counter ── */
function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    const numericPart = target.replace(/[^0-9.]/g, "");
    const num = parseFloat(numericPart);
    if (isNaN(num)) { setDisplay(target); return; }
    const prefix = target.match(/^[^0-9]*/)?.[0] || "";
    const steps = 40;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = num * eased;
      if (num >= 100) {
        setDisplay(`${prefix}${Math.round(current).toLocaleString()}${suffix}`);
      } else {
        setDisplay(`${prefix}${current.toFixed(1)}${suffix}`);
      }
      if (step >= steps) {
        setDisplay(target + suffix);
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [isInView, target, suffix]);

  return <span ref={ref}>{display}</span>;
}

/* ── Floating Particles ── */
function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-primary/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── Features ── */
const features = [
  {
    icon: Bot,
    title: "Agenți AI Autonomi",
    desc: "Delegă sarcini către agenți inteligenți care lucrează non-stop pentru proiectele tale.",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: ScanSearch,
    title: "Scanner Oportunități",
    desc: "Descoperă automat noi surse de venit adaptate nișei și abilităților tale.",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: TrendingUp,
    title: "Revenue Tracking",
    desc: "Dashboard complet cu vizualizarea veniturilor, cheltuielilor și marjelor de profit.",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: BookOpen,
    title: "Learning Hub",
    desc: "Module interactive cu quiz-uri și certificate pentru a-ți accelera creșterea.",
    gradient: "from-purple-500/20 to-violet-500/20",
  },
  {
    icon: BarChart3,
    title: "Analytics Avansat",
    desc: "Metrici în timp real și rapoarte detaliate pentru decizii bazate pe date.",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: Shield,
    title: "Securitate & GDPR",
    desc: "Date protejate, export complet și conformitate cu reglementările europene.",
    gradient: "from-rose-500/20 to-pink-500/20",
  },
];

/* ── Pricing Plans ── */
const plans = [
  {
    key: "free",
    name: "Free",
    price: "$0",
    period: "/lună",
    icon: Zap,
    popular: false,
    tagline: "Perfect pentru a începe",
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
    period: "/lună",
    icon: Crown,
    popular: true,
    tagline: "Cel mai ales plan",
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
    period: "/lună",
    icon: Building2,
    popular: false,
    tagline: "Pentru echipe & agenții",
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
    text: "Am crescut de la $2k la $8k/lună în 3 luni cu ajutorul agenților AI. Platforma m-a ajutat să identific oportunități pe care le ratam.",
    avatar: "AM",
    revenue: "+300%",
  },
  {
    name: "Maria S.",
    role: "Fondatoare SaaS",
    text: "Scanner-ul de oportunități mi-a descoperit o nișă pe care nu o luam în calcul. Revenue +40% în prima lună de utilizare.",
    avatar: "MS",
    revenue: "+40%",
  },
  {
    name: "Vlad P.",
    role: "Agency Owner",
    text: "Gestionez 12 proiecte simultan fără efort suplimentar. Agenții AI îmi salvează 20+ ore pe săptămână. Game changer.",
    avatar: "VP",
    revenue: "20h saved/wk",
  },
];

/* ── How it Works ── */
const steps = [
  { icon: Target, title: "Definește-ți obiectivele", desc: "Setează proiectele, bugetele și țintele de revenue." },
  { icon: Bot, title: "Activează agenții AI", desc: "Agenții tăi analizează, planifică și execută non-stop." },
  { icon: ScanSearch, title: "Descoperă oportunități", desc: "Scanner-ul identifică nișe profitabile în timp real." },
  { icon: DollarSign, title: "Generează venituri", desc: "Urmărește creșterea cu analytics detaliate." },
];

export default function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Nav ── */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-extrabold tracking-tight">
            <span className="gradient-money-text">Venture</span>AI
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">Funcționalități</a>
            <a href="#how-it-works" className="transition-colors hover:text-foreground">Cum funcționează</a>
            <a href="#pricing" className="transition-colors hover:text-foreground">Prețuri</a>
            <a href="#testimonials" className="transition-colors hover:text-foreground">Testimoniale</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Autentificare</Link>
            </Button>
            <Button size="sm" className="gradient-money border-0 text-primary-foreground shadow-lg shadow-primary/25" asChild>
              <Link to="/signup">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Începe gratuit
              </Link>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative overflow-hidden px-6 pt-16 pb-28 sm:pt-24 sm:pb-36">
        <FloatingParticles />

        {/* Animated gradient blobs */}
        <motion.div
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-[600px] w-[800px] rounded-full bg-primary/8 blur-[140px]" />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute top-20 -right-20"
          animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-[400px] w-[400px] rounded-full bg-accent/8 blur-[120px]" />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute bottom-0 -left-20"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-[300px] w-[300px] rounded-full bg-primary/5 blur-[100px]" />
        </motion.div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Badge variant="secondary" className="mb-6 gap-1.5 border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold backdrop-blur-sm">
              <Rocket className="h-3.5 w-3.5 text-primary" />
              Platforma #1 pentru antreprenori digitali
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl"
          >
            Scalează-ți afacerea
            <br />
            cu{" "}
            <span className="relative">
              <span className="gradient-money-text">Agenți AI</span>
              <motion.span
                className="absolute -bottom-2 left-0 h-1 gradient-money rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            VentureAI combină inteligența artificială cu strategia de business
            pentru a-ți <strong className="text-foreground">automatiza proiectele</strong>,{" "}
            <strong className="text-foreground">descoperi oportunități</strong> și{" "}
            <strong className="text-foreground">maximiza veniturile</strong>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button size="lg" className="gradient-money border-0 px-8 text-primary-foreground shadow-xl shadow-primary/25 text-base h-12" asChild>
              <Link to="/signup">
                Începe gratuit — 0$ <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 text-base gap-2 border-border/50 bg-card/50 backdrop-blur-sm" asChild>
              <a href="#how-it-works">
                <Play className="h-4 w-4 text-primary" />
                Cum funcționează
              </a>
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="mx-auto mt-20 grid max-w-2xl grid-cols-3 gap-6"
          >
            {[
              { value: "1.200+", label: "Utilizatori activi", icon: Users },
              { value: "$2.4M", label: "Venituri generate", icon: DollarSign },
              { value: "98%", label: "Satisfacție clienți", icon: Star },
            ].map((s) => (
              <TiltCard key={s.label}>
                <div className="rounded-2xl border border-border/50 bg-card/80 p-5 text-center shadow-card backdrop-blur-sm">
                  <s.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                  <p className="text-2xl font-extrabold sm:text-3xl gradient-money-text">
                    <AnimatedCounter target={s.value} />
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
                </div>
              </TiltCard>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Scrolling Logos / Trust Bar ── */}
      <div className="border-y border-border/50 bg-muted/20 py-6">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
            <span>🛡️ SSL Securizat</span>
            <span>🇪🇺 GDPR Compliant</span>
            <span>⚡ 99.9% Uptime</span>
            <span>🔒 Stripe Payments</span>
            <span>🤖 AI Powered</span>
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <section id="features" className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection className="text-center">
            <Badge variant="secondary" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold">
              Funcționalități
            </Badge>
            <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
              Tot ce ai nevoie,{" "}
              <span className="gradient-money-text">într-un singur loc</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground text-lg">
              De la idee la profit – VentureAI te ghidează la fiecare pas cu instrumente puternice.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 0.1}>
                <TiltCard className="h-full">
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card p-7 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary/30">
                    {/* Subtle gradient overlay */}
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100", f.gradient)} />
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-money shadow-lg shadow-primary/20">
                        <f.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                </TiltCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section id="how-it-works" className="border-t border-border/50 bg-muted/20 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <AnimatedSection className="text-center">
            <Badge variant="secondary" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold">
              Cum funcționează
            </Badge>
            <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
              4 pași simpli spre{" "}
              <span className="gradient-money-text">profit</span>
            </h2>
          </AnimatedSection>

          <div className="mt-16 grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <AnimatedSection key={step.title} delay={i * 0.15}>
                <div className="relative flex flex-col items-center px-4 py-6 text-center">
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="absolute right-0 top-14 hidden h-0.5 w-full bg-gradient-to-r from-primary/30 to-primary/5 lg:block" style={{ left: "50%" }} />
                  )}
                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-money shadow-xl shadow-primary/25">
                      <step.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-card border-2 border-primary text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <AnimatedSection className="text-center">
            <Badge variant="secondary" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold">
              Prețuri transparente
            </Badge>
            <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
              Investiție mică,{" "}
              <span className="gradient-money-text">rezultate mari</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground text-lg">
              Începe gratuit. Upgradează doar când vezi rezultate.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {plans.map((plan, i) => (
              <AnimatedSection key={plan.key} delay={i * 0.15}>
                <TiltCard className="h-full">
                  <div
                    className={cn(
                      "relative flex h-full flex-col rounded-2xl border-2 p-8 transition-all duration-300",
                      plan.popular
                        ? "border-primary bg-gradient-to-b from-primary/5 to-transparent shadow-xl shadow-primary/15"
                        : "border-border/50 bg-card shadow-card hover:shadow-card-hover hover:border-border"
                    )}
                  >
                    {plan.popular && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.5 }}
                        className="absolute -top-3.5 left-1/2 -translate-x-1/2"
                      >
                        <Badge className="gradient-money text-primary-foreground border-0 px-4 py-1 text-xs shadow-lg shadow-primary/25">
                          ⭐ Cel mai popular
                        </Badge>
                      </motion.div>
                    )}

                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-xl shadow-lg",
                          plan.popular ? "gradient-money shadow-primary/25" : "bg-secondary"
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
                        <h3 className="font-bold text-lg">{plan.name}</h3>
                        <p className="text-xs text-muted-foreground">{plan.tagline}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    </div>

                    <div className="mt-6 h-px bg-border/50" />

                    <ul className="mt-6 flex-1 space-y-3.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm">
                          <div className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                            plan.popular ? "gradient-money" : "bg-primary/10"
                          )}>
                            <Check className={cn("h-3 w-3", plan.popular ? "text-primary-foreground" : "text-primary")} />
                          </div>
                          <span className="text-muted-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={cn(
                        "mt-8 w-full h-11 text-sm font-semibold",
                        plan.popular && "gradient-money text-primary-foreground border-0 shadow-lg shadow-primary/25"
                      )}
                      variant={plan.popular ? "default" : "outline"}
                      asChild
                    >
                      <Link to="/signup">
                        {plan.key === "free" ? "Începe gratuit" : `Alege ${plan.name}`}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </TiltCard>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.4}>
            <p className="mt-10 text-center text-sm text-muted-foreground">
              💳 Fără card necesar pentru planul gratuit · Anulează oricând · Suport 24/7
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="border-t border-border/50 bg-muted/20 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <AnimatedSection className="text-center">
            <Badge variant="secondary" className="mb-4 border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold">
              Testimoniale
            </Badge>
            <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
              Rezultate{" "}
              <span className="gradient-money-text">reale</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground text-lg">
              Antreprenori ca tine, care au ales să scaleze cu VentureAI.
            </p>
          </AnimatedSection>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.15}>
                <TiltCard className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-border/50 bg-card p-7 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary/20">
                    {/* Revenue badge */}
                    <Badge variant="secondary" className="w-fit mb-4 gradient-money-subtle text-primary border-primary/20 font-bold">
                      {t.revenue}
                    </Badge>

                    <div className="flex gap-1 text-primary">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-current" />
                      ))}
                    </div>

                    <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>

                    <div className="mt-5 flex items-center gap-3 border-t border-border/50 pt-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-money text-sm font-bold text-primary-foreground">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <AnimatedSection className="relative mx-auto max-w-3xl text-center">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-6 w-fit"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-money shadow-xl shadow-primary/25">
              <Rocket className="h-8 w-8 text-primary-foreground" />
            </div>
          </motion.div>

          <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Gata să-ți{" "}
            <span className="gradient-money-text">scalezi veniturile</span>?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-lg text-muted-foreground">
            Alătură-te celor <strong className="text-foreground">1.200+</strong> antreprenori care folosesc VentureAI
            pentru a genera mai mult cu mai puțin efort.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="gradient-money border-0 px-10 h-12 text-base text-primary-foreground shadow-xl shadow-primary/25" asChild>
              <Link to="/signup">
                Creează cont gratuit <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Setup în 2 minute · Fără card
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 bg-muted/20 px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand & Powered by */}
            <div>
              <p className="text-xl font-extrabold tracking-tight">
                <span className="gradient-money-text">Venture</span>AI
              </p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Platforma inteligentă pentru antreprenori digitali care vor să scaleze.
              </p>
              <p className="mt-5 text-xs text-muted-foreground">
                Powered by{" "}
                <a href="https://ssociety.eu" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary transition">
                  ssociety.eu
                </a>{" "}
                — <span className="font-semibold">SSocietyHUB</span>
              </p>
            </div>

            {/* Company details */}
            <div>
              <p className="text-sm font-semibold mb-3">Date firmă</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="font-medium text-foreground">MURSE ADVERTISING S.R.L.</li>
                <li>CUI: 44923890</li>
                <li>Nr. Înmatriculare: J40/16148/2021</li>
                <li>EUID: ROONRC.J40/16148/2021</li>
                <li>Data înființării: 17-09-2021</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-sm font-semibold mb-3">Contact</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>
                  <a href="mailto:sergiusociety@gmail.com" className="hover:text-foreground transition">
                    sergiusociety@gmail.com
                  </a>
                </li>
                <li>
                  <a href="tel:+40768676141" className="hover:text-foreground transition">
                    +40 768 676 141
                  </a>
                </li>
              </ul>
            </div>

            {/* Links */}
            <div>
              <p className="text-sm font-semibold mb-3">Linkuri utile</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li><Link to="/terms" className="hover:text-foreground transition">Termeni și condiții</Link></li>
                <li><Link to="/privacy" className="hover:text-foreground transition">Politica de confidențialitate</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground transition">Prețuri</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-border/50 pt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} VentureAI · MURSE ADVERTISING S.R.L. Toate drepturile rezervate.
          </div>
        </div>
      </footer>
    </div>
  );
}
