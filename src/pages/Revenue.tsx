import { mockRevenue, mockRevenueChart } from "@/lib/mock-data";
import { useAppStore } from "@/stores/app-store";
import { DollarSign } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Revenue() {
  const { user } = useAppStore();

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">Venituri</h1>
        <p className="text-sm text-muted-foreground">Tracking venituri și tranzacții</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-4 text-sm font-semibold">Evoluție Venituri</h2>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={mockRevenueChart}>
            <defs>
              <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(152, 69%, 45%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(152, 69%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem", fontSize: 12 }}
              formatter={(value: number) => [`$${value}`, "Venit"]}
            />
            <Area type="monotone" dataKey="revenue" stroke="hsl(152, 69%, 45%)" strokeWidth={2} fill="url(#revGrad2)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold">Tranzacții Recente</h2>
        </div>
        <div className="divide-y divide-border">
          {mockRevenue.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-money-subtle">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{entry.source}</p>
                  <p className="text-xs text-muted-foreground">{entry.date}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-primary">+${entry.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
