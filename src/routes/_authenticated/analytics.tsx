import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { LineChart as LineChartIcon, TrendingUp, Sparkles, AlertTriangle } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { useStore, formatMoney } from "@/lib/store";
import { useSettings } from "@/lib/settings";
import { healthScore, monthlyBreakdown } from "@/lib/statements";

export const Route = createFileRoute("/_authenticated/analytics")({
  component: AnalyticsPage,
});

const CHART_COLORS = [
  "oklch(0.52 0.19 258)", "oklch(0.68 0.16 158)", "oklch(0.72 0.15 220)",
  "oklch(0.78 0.15 75)", "oklch(0.65 0.2 20)", "oklch(0.6 0.05 258)",
];

function AnalyticsPage() {
  const { transactions } = useStore();
  const { currency } = useSettings();

  const trend = useMemo(() => monthlyBreakdown(transactions, 6), [transactions]);
  const health = useMemo(() => healthScore(transactions), [transactions]);

  const topExpenses = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter((t) => t.type === "expense").forEach((t) => {
      map[t.category] = (map[t.category] ?? 0) + t.amount;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value], i) => ({ name, value, color: CHART_COLORS[i % CHART_COLORS.length] }));
  }, [transactions]);

  const growth = useMemo(() => {
    if (trend.length < 2) return 0;
    const prev = trend[trend.length - 2].income;
    const curr = trend[trend.length - 1].income;
    if (prev === 0) return 0;
    return ((curr - prev) / prev) * 100;
  }, [trend]);

  const insights = useMemo(() => {
    const out: { tone: string; tag: string; text: string }[] = [];
    if (growth > 10) out.push({ tag: "Growth", tone: "bg-success/10 text-success", text: `Revenue grew ${growth.toFixed(1)}% vs last month — keep the momentum.` });
    else if (growth < -10) out.push({ tag: "Warning", tone: "bg-destructive/10 text-destructive", text: `Revenue dropped ${Math.abs(growth).toFixed(1)}% vs last month.` });
    if (topExpenses[0]) out.push({ tag: "Top expense", tone: "bg-primary/10 text-primary", text: `${topExpenses[0].name} is your biggest cost at ${formatMoney(topExpenses[0].value, currency)}.` });
    if (health.score >= 70) out.push({ tag: "Health", tone: "bg-success/10 text-success", text: health.reason });
    else if (health.score < 50) out.push({ tag: "Health", tone: "bg-warning/10 text-warning-foreground", text: health.reason });
    if (out.length === 0) out.push({ tag: "Tip", tone: "bg-muted text-muted-foreground", text: "Add more transactions to unlock deeper insights." });
    return out;
  }, [growth, topExpenses, health, currency]);

  const empty = transactions.length === 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Trends, growth and health for your business.</p>
      </div>

      {empty && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <LineChartIcon className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 font-medium">No data to analyze yet</p>
          <p className="text-sm text-muted-foreground">Add transactions to see trends here.</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <h2 className="font-semibold">Revenue & Expenses (6 months)</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="a-inc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.52 0.19 258)" stopOpacity={0.4} /><stop offset="100%" stopColor="oklch(0.52 0.19 258)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="a-exp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.68 0.16 158)" stopOpacity={0.4} /><stop offset="100%" stopColor="oklch(0.68 0.16 158)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 250)" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.012 250)" }} />
                <Area type="monotone" dataKey="income" stroke="oklch(0.52 0.19 258)" strokeWidth={2} fill="url(#a-inc)" />
                <Area type="monotone" dataKey="expenses" stroke="oklch(0.68 0.16 158)" strokeWidth={2} fill="url(#a-exp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-semibold">Business Health</h2>
          <div className="mt-4 flex flex-col items-center">
            <div className="relative h-32 w-32">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" stroke="oklch(0.92 0.012 250)" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="42" stroke={health.score >= 70 ? "oklch(0.68 0.16 158)" : health.score >= 50 ? "oklch(0.78 0.15 75)" : "oklch(0.65 0.2 20)"} strokeWidth="8" fill="none" strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - health.score / 100)}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <p className="text-3xl font-bold">{health.score}</p>
                  <p className="text-[10px] uppercase text-muted-foreground">/ 100</p>
                </div>
              </div>
            </div>
            <p className="mt-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{health.label}</p>
            <p className="mt-3 text-center text-xs text-muted-foreground">{health.reason}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-semibold">Top Expense Categories</h2>
          {topExpenses.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No expenses yet.</p>
          ) : (
            <>
              <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={topExpenses} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                      {topExpenses.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => formatMoney(Number(v), currency)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-1.5">
                {topExpenses.map((e) => (
                  <div key={e.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: e.color }} />
                      <span>{e.name}</span>
                    </div>
                    <span className="font-medium">{formatMoney(e.value, currency)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Monthly Net Profit</h2>
            <div className={`flex items-center gap-1 text-sm font-medium ${growth >= 0 ? "text-success" : "text-destructive"}`}>
              <TrendingUp className="h-4 w-4" /> {growth >= 0 ? "+" : ""}{growth.toFixed(1)}% MoM
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 250)" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.012 250)" }} formatter={(v: any) => formatMoney(Number(v), currency)} />
                <Bar dataKey="net" fill="oklch(0.52 0.19 258)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Smart Insights</h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {insights.map((m, i) => (
            <div key={i} className="rounded-xl border border-border bg-muted/30 p-3">
              <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${m.tone}`}>{m.tag}</span>
              <p className="mt-2 text-sm">{m.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
