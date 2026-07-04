import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, Wallet, DollarSign, ArrowUpRight, ArrowDownRight,
  Plus, FileText, Download, Sparkles, ShieldCheck,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

const trendData = [
  { month: "Apr", income: 12500, expenses: 8200 },
  { month: "May", income: 15200, expenses: 9100 },
  { month: "Jun", income: 18400, expenses: 10800 },
  { month: "Jul", income: 17200, expenses: 11200 },
  { month: "Aug", income: 21500, expenses: 12500 },
  { month: "Sep", income: 24800, expenses: 13800 },
  { month: "Oct", income: 28200, expenses: 15200 },
];

const cashFlowData = trendData.map((d) => ({ month: d.month, net: d.income - d.expenses }));

const expenseData = [
  { name: "Salaries", value: 6800, color: "oklch(0.52 0.19 258)" },
  { name: "Rent", value: 3200, color: "oklch(0.68 0.16 158)" },
  { name: "Transport", value: 1900, color: "oklch(0.72 0.15 220)" },
  { name: "Supplies", value: 1600, color: "oklch(0.78 0.15 75)" },
  { name: "Other", value: 1700, color: "oklch(0.6 0.05 258)" },
];

const recentTransactions = [
  { id: 1, desc: "Client payment — Acme Ltd", cat: "Sales", amount: 4500, type: "income", date: "Oct 12" },
  { id: 2, desc: "Office rent — October", cat: "Rent", amount: 1200, type: "expense", date: "Oct 10" },
  { id: 3, desc: "Design services", cat: "Sales", amount: 2200, type: "income", date: "Oct 09" },
  { id: 4, desc: "Team lunch", cat: "Meals", amount: 180, type: "expense", date: "Oct 08" },
  { id: 5, desc: "Software subscriptions", cat: "Software", amount: 420, type: "expense", date: "Oct 07" },
];

function KpiCard({ icon: Icon, label, value, change, positive, gradient }: {
  icon: any; label: string; value: string; change: string; positive: boolean; gradient?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
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
      <div className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
        {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {change}
      </div>
    </motion.div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Welcome back, {firstName} 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">Here's how your business is doing today.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Export PDF</Button>
          <Button variant="outline" size="sm" className="gap-2"><FileText className="h-4 w-4" /> Generate Statement</Button>
          <Button size="sm" className="gap-2 gradient-brand text-white hover:opacity-95"><Plus className="h-4 w-4" /> Add Transaction</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard icon={DollarSign} label="Total Revenue" value="$137,800" change="+13.6%" positive />
        <KpiCard icon={Wallet} label="Total Expenses" value="$80,800" change="+8.2%" positive={false} />
        <KpiCard icon={TrendingUp} label="Net Profit" value="$57,000" change="+22.4%" positive gradient />
        <KpiCard icon={DollarSign} label="Cash Balance" value="$42,150" change="+4.1%" positive gradient />
        <KpiCard icon={TrendingUp} label="Monthly Growth" value="18.2%" change="+3.4%" positive />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Income vs Expenses</h2>
              <p className="text-xs text-muted-foreground">Last 7 months</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.52 0.19 258)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(0.52 0.19 258)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.68 0.16 158)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(0.68 0.16 158)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 250)" vertical={false} />
                <XAxis dataKey="month" stroke="oklch(0.5 0.03 250)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.5 0.03 250)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.012 250)", background: "white" }} />
                <Area type="monotone" dataKey="income" stroke="oklch(0.52 0.19 258)" strokeWidth={2} fill="url(#inc)" />
                <Area type="monotone" dataKey="expenses" stroke="oklch(0.68 0.16 158)" strokeWidth={2} fill="url(#exp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-semibold">Expense Categories</h2>
          <p className="text-xs text-muted-foreground">This month</p>
          <div className="mt-2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {expenseData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5">
            {expenseData.map((e) => (
              <div key={e.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: e.color }} />
                  <span>{e.name}</span>
                </div>
                <span className="font-medium">${e.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cash flow */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <h2 className="font-semibold">Cash Flow Trend</h2>
          <p className="text-xs text-muted-foreground">Net (income − expenses)</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 250)" vertical={false} />
                <XAxis dataKey="month" stroke="oklch(0.5 0.03 250)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.5 0.03 250)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.012 250)", background: "white" }} />
                <Bar dataKey="net" fill="oklch(0.52 0.19 258)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health score */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-success" />
            <h2 className="font-semibold">Financial Health</h2>
          </div>
          <div className="mt-6 flex flex-col items-center">
            <div className="relative h-32 w-32">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" stroke="oklch(0.92 0.012 250)" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="42" stroke="oklch(0.68 0.16 158)" strokeWidth="8" fill="none"
                  strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - 0.92)}`}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <p className="text-3xl font-bold">92</p>
                  <p className="text-[10px] uppercase text-muted-foreground">/ 100</p>
                </div>
              </div>
            </div>
            <p className="mt-3 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">Excellent</p>
            <p className="mt-3 text-center text-xs text-muted-foreground">Your cash flow is healthy and expenses are under control.</p>
          </div>
        </div>
      </div>

      {/* Smart insights + recent transactions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Recent Transactions</h2>
            <Button variant="ghost" size="sm">View all</Button>
          </div>
          <div className="divide-y divide-border">
            {recentTransactions.map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-3">
                <div className={`grid h-9 w-9 place-items-center rounded-lg ${t.type === "income" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                  {t.type === "income" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.desc}</p>
                  <p className="text-xs text-muted-foreground">{t.cat} · {t.date}</p>
                </div>
                <p className={`text-sm font-semibold ${t.type === "income" ? "text-success" : "text-foreground"}`}>
                  {t.type === "income" ? "+" : "−"}${t.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Smart Insights</h2>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { tag: "Insight", tone: "bg-primary/10 text-primary", text: "Expenses grew 18% this month, mostly in Transport." },
              { tag: "Good", tone: "bg-success/10 text-success", text: "Your net margin (32%) is above your industry average." },
              { tag: "Watch", tone: "bg-warning/10 text-warning-foreground", text: "3 recurring invoices are overdue — chase them today." },
            ].map((m, i) => (
              <div key={i} className="rounded-xl border border-border bg-muted/30 p-3">
                <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${m.tone}`}>{m.tag}</span>
                <p className="mt-2 text-sm">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
