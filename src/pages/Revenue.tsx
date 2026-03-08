import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/stores/auth-store";
import { fetchTransactions, addTransaction, fetchExpenses, addExpense, deleteExpense } from "@/lib/revenue-api";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Plus, Download, PieChart, BarChart3, Receipt, Trash2,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

type Tab = "overview" | "transactions" | "expenses";

const PIE_COLORS = [
  "hsl(152, 69%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(200, 80%, 50%)",
  "hsl(280, 60%, 55%)",
  "hsl(0, 70%, 55%)",
  "hsl(170, 60%, 40%)",
];

export default function Revenue() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("overview");
  const [showAddTx, setShowAddTx] = useState(false);
  const [showAddExp, setShowAddExp] = useState(false);
  const [newTx, setNewTx] = useState({ amount: "", source: "manual", category: "income", description: "", date: format(new Date(), "yyyy-MM-dd") });
  const [newExp, setNewExp] = useState({ amount: "", category: "other", description: "", date: format(new Date(), "yyyy-MM-dd") });

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
    enabled: !!user,
  });

  const { data: expenses = [] } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
    enabled: !!user,
  });

  const addTxMutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setShowAddTx(false);
      setNewTx({ amount: "", source: "manual", category: "income", description: "", date: format(new Date(), "yyyy-MM-dd") });
      toast({ title: "Tranzacție adăugată" });
    },
  });

  const addExpMutation = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setShowAddExp(false);
      setNewExp({ amount: "", category: "other", description: "", date: format(new Date(), "yyyy-MM-dd") });
      toast({ title: "Cheltuială adăugată" });
    },
  });

  const deleteExpMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
  });

  // Compute stats
  const totalRevenue = transactions.reduce((s, t) => s + Number(t.amount), 0);
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const netProfit = totalRevenue - totalExpenses;

  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const thisMonthRev = transactions
    .filter((t) => isWithinInterval(new Date(t.date), { start: thisMonthStart, end: thisMonthEnd }))
    .reduce((s, t) => s + Number(t.amount), 0);
  const lastMonthRev = transactions
    .filter((t) => isWithinInterval(new Date(t.date), { start: lastMonthStart, end: lastMonthEnd }))
    .reduce((s, t) => s + Number(t.amount), 0);
  const growthPct = lastMonthRev > 0 ? ((thisMonthRev - lastMonthRev) / lastMonthRev * 100) : 0;

  // Monthly chart data (last 6 months)
  const chartData = useMemo(() => {
    const months: { month: string; revenue: number; expenses: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(now, i);
      const start = startOfMonth(d);
      const end = endOfMonth(d);
      const rev = transactions.filter((t) => isWithinInterval(new Date(t.date), { start, end })).reduce((s, t) => s + Number(t.amount), 0);
      const exp = expenses.filter((e) => isWithinInterval(new Date(e.date), { start, end })).reduce((s, e) => s + Number(e.amount), 0);
      months.push({ month: format(d, "MMM"), revenue: rev, expenses: exp });
    }
    return months;
  }, [transactions, expenses]);

  // Revenue by source
  const bySource = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.forEach((t) => { map[t.source] = (map[t.source] || 0) + Number(t.amount); });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Sumar", icon: BarChart3 },
    { id: "transactions", label: "Tranzacții", icon: Receipt },
    { id: "expenses", label: "Cheltuieli", icon: TrendingDown },
  ];

  const exportCSV = () => {
    const rows = [["Data", "Suma", "Sursă", "Categorie", "Descriere"]];
    transactions.forEach((t) => rows.push([t.date, String(t.amount), t.source, t.category, t.description || ""]));
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ventureai-revenue-${format(now, "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Venituri</h1>
          <p className="text-sm text-muted-foreground">Tracking venituri, cheltuieli și profit net</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={exportCSV}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button size="sm" className="gap-2" onClick={() => setShowAddTx(true)}>
            <Plus className="h-4 w-4" />
            Adaugă tranzacție
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Venit Total" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} change={growthPct !== 0 ? `${growthPct > 0 ? "+" : ""}${growthPct.toFixed(0)}% vs luna trecută` : undefined} changeType={growthPct > 0 ? "positive" : "negative"} />
        <StatCard title="Luna aceasta" value={`$${thisMonthRev.toLocaleString()}`} icon={TrendingUp} />
        <StatCard title="Cheltuieli Total" value={`$${totalExpenses.toLocaleString()}`} icon={TrendingDown} />
        <StatCard title="Profit Net" value={`$${netProfit.toLocaleString()}`} icon={ArrowUpRight} changeType={netProfit > 0 ? "positive" : "negative"} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-secondary p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              tab === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <t.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Revenue chart */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-card">
            <h2 className="mb-4 text-sm font-semibold">Evoluție Venituri vs Cheltuieli</h2>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(152, 69%, 45%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(152, 69%, 45%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem", fontSize: 12 }}
                  formatter={(value: number, name: string) => [`$${value}`, name === "revenue" ? "Venit" : "Cheltuieli"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(152, 69%, 45%)" strokeWidth={2} fill="url(#revGrad)" />
                <Area type="monotone" dataKey="expenses" stroke="hsl(0, 84%, 60%)" strokeWidth={2} fill="url(#expGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* By source pie */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h2 className="mb-4 text-sm font-semibold">Venituri pe sursă</h2>
            {bySource.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
                Nicio tranzacție înregistrată
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <RePieChart>
                    <Pie data={bySource} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={2}>
                      {bySource.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => `$${v}`} />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-2">
                  {bySource.map((s, i) => (
                    <div key={s.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-muted-foreground">{s.name}</span>
                      </div>
                      <span className="font-medium">${s.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {tab === "transactions" && (
        <div className="rounded-xl border border-border bg-card shadow-card">
          {showAddTx && (
            <div className="border-b border-border p-4">
              <div className="grid gap-3 sm:grid-cols-5">
                <Input type="number" placeholder="Sumă" value={newTx.amount} onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })} />
                <Input placeholder="Sursă" value={newTx.source} onChange={(e) => setNewTx({ ...newTx, source: e.target.value })} />
                <Input placeholder="Descriere" value={newTx.description} onChange={(e) => setNewTx({ ...newTx, description: e.target.value })} />
                <Input type="date" value={newTx.date} onChange={(e) => setNewTx({ ...newTx, date: e.target.value })} />
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => addTxMutation.mutate({ amount: Number(newTx.amount), source: newTx.source, category: newTx.category, description: newTx.description, date: newTx.date, currency: "USD", project_id: null })} disabled={!newTx.amount}>Adaugă</Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddTx(false)}>Anulează</Button>
                </div>
              </div>
            </div>
          )}
          <div className="divide-y divide-border">
            {transactions.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">Nicio tranzacție. Adaugă prima ta tranzacție!</div>
            ) : (
              transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-money-subtle">
                      <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.description || t.source}</p>
                      <p className="text-xs text-muted-foreground">{t.date} · {t.source}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-primary">+${Number(t.amount).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === "expenses" && (
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="text-sm font-semibold">Cheltuieli</h2>
            <Button size="sm" variant="outline" className="gap-2" onClick={() => setShowAddExp(true)}>
              <Plus className="h-3.5 w-3.5" />
              Adaugă
            </Button>
          </div>
          {showAddExp && (
            <div className="border-b border-border p-4">
              <div className="grid gap-3 sm:grid-cols-4">
                <Input type="number" placeholder="Sumă" value={newExp.amount} onChange={(e) => setNewExp({ ...newExp, amount: e.target.value })} />
                <Input placeholder="Categorie" value={newExp.category} onChange={(e) => setNewExp({ ...newExp, category: e.target.value })} />
                <Input placeholder="Descriere" value={newExp.description} onChange={(e) => setNewExp({ ...newExp, description: e.target.value })} />
                <div className="flex gap-2">
                  <Input type="date" value={newExp.date} onChange={(e) => setNewExp({ ...newExp, date: e.target.value })} />
                  <Button size="sm" onClick={() => addExpMutation.mutate({ amount: Number(newExp.amount), category: newExp.category, description: newExp.description, date: newExp.date, project_id: null })} disabled={!newExp.amount}>Adaugă</Button>
                </div>
              </div>
            </div>
          )}
          <div className="divide-y divide-border">
            {expenses.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">Nicio cheltuială înregistrată</div>
            ) : (
              expenses.map((e) => (
                <div key={e.id} className="group flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
                      <ArrowDownRight className="h-4 w-4 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{e.description || e.category}</p>
                      <p className="text-xs text-muted-foreground">{e.date} · {e.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-destructive">-${Number(e.amount).toLocaleString()}</span>
                    <button onClick={() => deleteExpMutation.mutate(e.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
