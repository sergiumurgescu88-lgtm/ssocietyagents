import type { User, Project, Agent, Opportunity, LearningModule, RevenueEntry, Notification } from "@/types";

export const mockUser: User = {
  id: "1",
  name: "Andrei",
  email: "andrei@ventureai.com",
  plan: "free",
  revenue: 2450,
  projectsCount: 3,
  createdAt: "2025-01-01",
};

export const mockProjects: Project[] = [
  {
    id: "p1",
    title: "E-commerce Store",
    description: "Magazin online cu produse de nișă pentru animale",
    status: "active",
    agentId: "a1",
    revenue: 1200,
    progress: 65,
    category: "E-commerce",
    createdAt: "2025-01-10",
    updatedAt: "2025-01-15",
  },
  {
    id: "p2",
    title: "SaaS Dashboard",
    description: "Platform de analytics pentru micro-business-uri",
    status: "active",
    agentId: "a2",
    revenue: 850,
    progress: 42,
    category: "SaaS",
    createdAt: "2025-01-05",
    updatedAt: "2025-01-14",
  },
  {
    id: "p3",
    title: "Affiliate Blog",
    description: "Blog de review-uri tech cu link-uri afiliate",
    status: "paused",
    agentId: "a3",
    revenue: 400,
    progress: 28,
    category: "Content",
    createdAt: "2024-12-20",
    updatedAt: "2025-01-12",
  },
];

export const mockAgents: Agent[] = [
  {
    id: "a1",
    name: "DevAgent-01",
    role: "developer",
    status: "working",
    tasksCompleted: 12,
    tasksTotal: 18,
    projectId: "p1",
    description: "Full-stack development agent specializat în e-commerce",
  },
  {
    id: "a2",
    name: "MarketBot-02",
    role: "marketer",
    status: "active",
    tasksCompleted: 8,
    tasksTotal: 15,
    projectId: "p2",
    description: "Agent de marketing digital și growth hacking",
  },
  {
    id: "a3",
    name: "ResearchAI-03",
    role: "researcher",
    status: "idle",
    tasksCompleted: 5,
    tasksTotal: 10,
    projectId: "p3",
    description: "Agent de cercetare piață și analiză competiție",
  },
  {
    id: "a4",
    name: "StrategyAI-04",
    role: "strategist",
    status: "active",
    tasksCompleted: 20,
    tasksTotal: 25,
    description: "Agent strategic pentru planificare business",
  },
];

export const mockOpportunities: Opportunity[] = [
  {
    id: "o1",
    title: "Dropshipping nișă pets",
    description: "Piață în creștere cu 23% YoY. Marjă medie 35-45%.",
    score: 87,
    source: "Market Analysis",
    category: "E-commerce",
    date: "2025-01-15",
    isNew: true,
  },
  {
    id: "o2",
    title: "AI Writing Tool SaaS",
    description: "Cerere crescândă pentru tool-uri de content AI. MRR potențial $5k+",
    score: 92,
    source: "Trend Scanner",
    category: "SaaS",
    date: "2025-01-14",
    isNew: true,
  },
  {
    id: "o3",
    title: "Newsletter Monetization",
    description: "Nișe cu CPM $20+ și audiență targetată. Setup rapid.",
    score: 74,
    source: "Community Intel",
    category: "Content",
    date: "2025-01-13",
    isNew: false,
  },
  {
    id: "o4",
    title: "Micro-SaaS Chrome Extension",
    description: "Extensii Chrome cu subscription model. Low competition.",
    score: 81,
    source: "Trend Scanner",
    category: "SaaS",
    date: "2025-01-12",
    isNew: false,
  },
];

export const mockLearningModules: LearningModule[] = [
  {
    id: "l1",
    title: "Primul tău E-commerce Store",
    description: "Ghid complet de la zero la primele vânzări",
    category: "E-commerce",
    progress: 60,
    lessons: 12,
    duration: "4h 30min",
    difficulty: "beginner",
  },
  {
    id: "l2",
    title: "SaaS de la Idee la MRR",
    description: "Cum să construiești și lansezi un produs SaaS",
    category: "SaaS",
    progress: 25,
    lessons: 18,
    duration: "6h",
    difficulty: "intermediate",
  },
  {
    id: "l3",
    title: "Marketing Digital Avansat",
    description: "Strategii de growth hacking și paid ads",
    category: "Marketing",
    progress: 0,
    lessons: 15,
    duration: "5h 15min",
    difficulty: "advanced",
  },
];

export const mockRevenue: RevenueEntry[] = [
  { id: "r1", amount: 450, source: "Stripe", projectId: "p1", date: "2025-01-15", type: "income" },
  { id: "r2", amount: 320, source: "Stripe", projectId: "p2", date: "2025-01-14", type: "income" },
  { id: "r3", amount: 750, source: "Stripe", projectId: "p1", date: "2025-01-10", type: "income" },
  { id: "r4", amount: 180, source: "Affiliate", projectId: "p3", date: "2025-01-08", type: "income" },
  { id: "r5", amount: 530, source: "Stripe", projectId: "p2", date: "2025-01-05", type: "income" },
  { id: "r6", amount: 220, source: "Affiliate", projectId: "p3", date: "2025-01-03", type: "income" },
];

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "Oportunitate nouă detectată!",
    message: "AI Writing Tool SaaS - scor 92/100",
    type: "success",
    read: false,
    createdAt: "2025-01-15T10:30:00",
  },
  {
    id: "n2",
    title: "Agent DevAgent-01 a finalizat task",
    message: "Setup payment gateway completat cu succes",
    type: "info",
    read: false,
    createdAt: "2025-01-15T09:15:00",
  },
  {
    id: "n3",
    title: "Venit nou: +$450",
    message: "E-commerce Store a generat un nou venit",
    type: "success",
    read: true,
    createdAt: "2025-01-14T18:00:00",
  },
];

export const mockRevenueChart = [
  { month: "Aug", revenue: 400 },
  { month: "Sep", revenue: 680 },
  { month: "Oct", revenue: 950 },
  { month: "Nov", revenue: 1200 },
  { month: "Dec", revenue: 1800 },
  { month: "Ian", revenue: 2450 },
];
