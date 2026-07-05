import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo } from "react";
import {
  TrendingUp, Wallet, DollarSign, ArrowUpRight, ArrowDownRight,
  Plus, FileText, Sparkles, ShieldCheck, Receipt,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useStore, formatMoney } from "@/lib/store";
import { useSettings } from "@/lib/settings";
import { healthScore, monthlyBreakdown } from "@/lib/statements";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

const PIE_COLORS = [
  "oklch(0.52 0.19 258)", "oklch(0.68 0.16 158)", "oklch(0.72 0.15 220)",
  "oklch(0.78 0.15 75)", "oklch(0.6 0.05 258)",
];

function KpiCard({ icon: Icon, label, value, change, positive, gradient }: {
  icon: any; label: string; value: string; change?: string; positive?: boolean; gradient?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:shadow-elegant"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-xl text-white shadow-elegant ${gradient ? "gradient-emerald" : "gradient-brand"}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {change !== undefined && (
        <div className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {change}
        </div>
      )}
    </motion.div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const { transactions, activeBusiness, seedDemo } = useStore();
  const { currency } = useSettings();
  const firstName = user?.name.split(" ")[0] ?? "there";

  const trend = useMemo(() => monthlyBreakdown(transactions, 7), [transactions]);
  const health = useMemo(() => healthScore(transactions), [transactions]);

  const totals = useMemo(() => {
    const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { income, expense, net: income - expense };
  }, [transactions]);

  const growth = useMemo(() => {
    if (trend.length < 2) return 0;
    const prev = trend[trend.length - 2].income;
    const curr = trend[trend.length - 1].income;
    return prev === 0 ? 0 : ((curr - prev) / prev) * 100;
  }, [trend]);

  const expensePie = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter((t) => t.type === "expense").forEach((t) => { map[t.category] = (map[t.category] ?? 0) + t.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([name, value], i) => ({ name, value, color: PIE_COLORS[i % PIE_COLORS.length] }));
  }, [transactions]);

  const recent = useMemo(
    () => [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6),
    [transactions]
  );

  const empty = transactions.length === 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Welcome back, {firstName} 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeBusiness?.name} · Here's how your business is doing today.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link to="/statements"><FileText className="h-4 w-4" /> Statements</Link>
          </Button>
          <Button asChild size="sm" className="gap-2 gradient-brand text-white hover:opacity-95">
            <Link to="/transactions"><Plus className="h-4 w-4" /> Add Transaction</Link>
          </Button>
        </div>
      </div>

      {empty && (
        <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-primary" />
          <p className="mt-2 font-semibold">Welcome to Accubook</p>
          <p className="text-sm text-muted-foreground">Add your first transaction, or load some demo data to explore.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={seedDemo}>Load demo data</Button>
            <Button asChild size="sm" className="gradient-brand text-white hover:opacity-95">
              <Link to="/transactions">Add transaction</Link>
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={DollarSign} label="Total Revenue" value={formatMoney(totals.income, currency)}
          change={`${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`} positive={growth >= 0} />
        <KpiCard icon={Wallet} label="Total Expenses" value={formatMoney(totals.expense, currency)} />
        <KpiCard icon={TrendingUp} label="Net Profit" value={formatMoney(totals.net, currency)}
          change={totals.net >= 0 ? "Profitable" : "Loss"} positive={totals.net >= 0} gradient />
        <KpiCard icon={ShieldCheck} label="Health Score" value={`${health.score}/100`} change={health.label} positive={health.score >= 70} gradient />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="mb-4">
            <h2 className="font-semibold">Income vs Expenses</h2>
            <p className="text-xs text-muted-foreground">Last 7 months</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.52 0.19 258)" stopOpacity={0.35} /><stop offset="100%" stopColor="oklch(0.52 0.19 258)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.68 0.16 158)" stopOpacity={0.35} /><stop offset="100%" stopColor="oklch(0.68 0.16 158)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 250)" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.012 250)" }} formatter={(v: any) => formatMoney(Number(v), currency)} />
                <Area type="monotone" dataKey="income" stroke="oklch(0.52 0.19 258)" strokeWidth={2} fill="url(#inc)" />
                <Area type="monotone" dataKey="expenses" stroke="oklch(0.68 0.16 158)" strokeWidth={2} fill="url(#exp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-semibold">Expense Categories</h2>
          <p className="text-xs text-muted-foreground">All-time · top 5</p>
          {expensePie.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">No expenses yet.</p>
          ) : (
            <>
              <div className="mt-2 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expensePie} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                      {expensePie.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => formatMoney(Number(v), currency)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-1.5">
                {expensePie.map((e) => (
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
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <h2 className="font-semibold">Cash Flow Trend</h2>
          <p className="text-xs text-muted-foreground">Net (income − expenses)</p>
          <div className="mt-4 h-56">
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

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-success" />
            <h2 className="font-semibold">Financial Health</h2>
          </div>
          <div className="mt-6 flex flex-col items-center">
            <div className="relative h-32 w-32">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" stroke="oklch(0.92 0.012 250)" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="42" stroke={health.score >= 70 ? "oklch(0.68 0.16 158)" : health.score >= 50 ? "oklch(0.78 0.15 75)" : "oklch(0.65 0.2 20)"} strokeWidth="8" fill="none"
                  strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - health.score / 100)}`} strokeLinecap="round" />
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

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Recent Transactions</h2>
          <Button asChild variant="ghost" size="sm"><Link to="/transactions">View all</Link></Button>
        </div>
        {recent.length === 0 ? (
          <div className="grid place-items-center gap-2 py-8 text-center">
            <Receipt className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No transactions yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recent.map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-3">
                <div className={`grid h-9 w-9 place-items-center rounded-lg ${t.type === "income" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                  {t.type === "income" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.description}</p>
                  <p className="text-xs text-muted-foreground">{t.category} · {t.date}</p>
                </div>
                <p className={`text-sm font-semibold ${t.type === "income" ? "text-success" : "text-foreground"}`}>
                  {t.type === "income" ? "+" : "−"}{formatMoney(t.amount, currency)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
