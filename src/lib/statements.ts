import type { Transaction } from "./store";

export interface StatementRange {
  start: string; // yyyy-mm-dd inclusive
  end: string;   // yyyy-mm-dd inclusive
}

export interface IncomeStatement {
  incomeByCategory: Record<string, number>;
  expenseByCategory: Record<string, number>;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  margin: number;
}

export function inRange(t: Transaction, r: StatementRange) {
  return t.date >= r.start && t.date <= r.end;
}

export function buildIncomeStatement(txs: Transaction[], range: StatementRange): IncomeStatement {
  const scoped = txs.filter((t) => inRange(t, range));
  const inc: Record<string, number> = {};
  const exp: Record<string, number> = {};
  for (const t of scoped) {
    const bucket = t.type === "income" ? inc : exp;
    bucket[t.category] = (bucket[t.category] ?? 0) + t.amount;
  }
  const totalIncome = Object.values(inc).reduce((a, b) => a + b, 0);
  const totalExpenses = Object.values(exp).reduce((a, b) => a + b, 0);
  const netProfit = totalIncome - totalExpenses;
  const margin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
  return {
    incomeByCategory: inc,
    expenseByCategory: exp,
    totalIncome,
    totalExpenses,
    netProfit,
    margin,
  };
}

export interface CashFlowStatement {
  operating: number;
  investing: number;
  financing: number;
  netChange: number;
  byMethod: Record<string, number>;
}

export function buildCashFlow(txs: Transaction[], range: StatementRange): CashFlowStatement {
  const scoped = txs.filter((t) => inRange(t, range));
  let operating = 0;
  const byMethod: Record<string, number> = {};
  for (const t of scoped) {
    const signed = t.type === "income" ? t.amount : -t.amount;
    // Treat "Investments" income and equipment-like categories as investing
    if (t.category === "Investments") {
      // still income → cash in
    }
    operating += signed;
    byMethod[t.paymentMethod] = (byMethod[t.paymentMethod] ?? 0) + signed;
  }
  return { operating, investing: 0, financing: 0, netChange: operating, byMethod };
}

export interface BalanceSheet {
  assets: { cash: number; equipment: number; total: number };
  liabilities: { accountsPayable: number; total: number };
  equity: { ownerEquity: number; retainedEarnings: number; total: number };
}

export function buildBalanceSheet(
  allTxs: Transaction[],
  asOfDate: string
): BalanceSheet {
  const scoped = allTxs.filter((t) => t.date <= asOfDate);
  let cash = 0;
  for (const t of scoped) cash += t.type === "income" ? t.amount : -t.amount;
  const retained = cash; // simplified: retained earnings = accumulated net profit
  return {
    assets: { cash: Math.max(0, cash), equipment: 0, total: Math.max(0, cash) },
    liabilities: { accountsPayable: 0, total: 0 },
    equity: { ownerEquity: 0, retainedEarnings: retained, total: retained },
  };
}

export function monthlyBreakdown(txs: Transaction[], months = 6) {
  const now = new Date();
  const out: { month: string; income: number; expenses: number; net: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString("en-US", { month: "short" });
    const yr = d.getFullYear();
    const mo = d.getMonth();
    let income = 0, expenses = 0;
    for (const t of txs) {
      const td = new Date(t.date);
      if (td.getFullYear() === yr && td.getMonth() === mo) {
        if (t.type === "income") income += t.amount;
        else expenses += t.amount;
      }
    }
    out.push({ month: label, income, expenses, net: income - expenses });
  }
  return out;
}

export function healthScore(txs: Transaction[]): { score: number; label: string; reason: string } {
  if (txs.length === 0) return { score: 0, label: "No data", reason: "Add transactions to see your score." };
  const totalInc = txs.filter((t) => t.type === "income").reduce((a, b) => a + b.amount, 0);
  const totalExp = txs.filter((t) => t.type === "expense").reduce((a, b) => a + b.amount, 0);
  if (totalInc === 0) return { score: 10, label: "Critical", reason: "No income recorded yet." };
  const margin = ((totalInc - totalExp) / totalInc) * 100;
  const score = Math.max(0, Math.min(100, Math.round(50 + margin)));
  let label = "Fair";
  if (score >= 85) label = "Excellent";
  else if (score >= 70) label = "Strong";
  else if (score >= 50) label = "Fair";
  else label = "Needs attention";
  const reason =
    margin > 30
      ? "Your net margin is healthy and expenses are under control."
      : margin > 10
      ? "Profitable, but there's room to improve your margin."
      : margin > 0
      ? "You're barely profitable — review your top expenses."
      : "You're spending more than you earn — take action.";
  return { score, label, reason };
}
