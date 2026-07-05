import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Printer, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useStore, formatMoney } from "@/lib/store";
import { useSettings } from "@/lib/settings";
import {
  buildBalanceSheet, buildCashFlow, buildIncomeStatement, type StatementRange,
} from "@/lib/statements";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const Route = createFileRoute("/_authenticated/statements")({
  component: StatementsPage,
});

function firstOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}
function today() {
  return new Date().toISOString().slice(0, 10);
}

function StatementsPage() {
  const { transactions, allTransactions, activeBusiness } = useStore();
  const { currency, beginnerMode, setBeginnerMode } = useSettings();

  const [start, setStart] = useState(firstOfMonth());
  const [end, setEnd] = useState(today());
  const range: StatementRange = { start, end };

  const income = useMemo(() => buildIncomeStatement(transactions, range), [transactions, start, end]);
  const cashFlow = useMemo(() => buildCashFlow(transactions, range), [transactions, start, end]);
  const balance = useMemo(() => buildBalanceSheet(allTransactions.filter((t) => t.businessId === activeBusiness?.id), end), [allTransactions, end, activeBusiness]);

  const preset = (kind: "month" | "quarter" | "year") => {
    const d = new Date();
    let s: Date;
    if (kind === "month") s = new Date(d.getFullYear(), d.getMonth(), 1);
    else if (kind === "quarter") s = new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3, 1);
    else s = new Date(d.getFullYear(), 0, 1);
    setStart(s.toISOString().slice(0, 10));
    setEnd(today());
  };

  const exportPdf = (title: string, rows: [string, string][], footer?: [string, string][]) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(activeBusiness?.name ?? "Accubook", 14, 18);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`${title} · ${start} → ${end}`, 14, 26);
    doc.setTextColor(0);
    autoTable(doc, {
      startY: 32,
      head: [["Line", "Amount"]],
      body: rows,
      foot: footer,
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235] },
      footStyles: { fillColor: [240, 245, 255], textColor: 20, fontStyle: "bold" },
    });
    doc.save(`${title.toLowerCase().replace(/\s+/g, "-")}-${end}.pdf`);
    toast.success("PDF exported");
  };

  const incomeRows: [string, string][] = [
    ...Object.entries(income.incomeByCategory).map(([k, v]) => [beginnerMode ? `Money in — ${k}` : k, formatMoney(v, currency)] as [string, string]),
    ["", ""],
    [beginnerMode ? "Total money in" : "Total Revenue", formatMoney(income.totalIncome, currency)],
    ["", ""],
    ...Object.entries(income.expenseByCategory).map(([k, v]) => [beginnerMode ? `Money out — ${k}` : k, `(${formatMoney(v, currency)})`] as [string, string]),
    [beginnerMode ? "Total money out" : "Total Expenses", `(${formatMoney(income.totalExpenses, currency)})`],
  ];
  const incomeFooter: [string, string][] = [
    [beginnerMode ? "What you kept (Net Profit)" : "Net Profit", formatMoney(income.netProfit, currency)],
  ];

  const cashRows: [string, string][] = [
    ["Cash from operations", formatMoney(cashFlow.operating, currency)],
    ["Cash from investing", formatMoney(cashFlow.investing, currency)],
    ["Cash from financing", formatMoney(cashFlow.financing, currency)],
    ["", ""],
    ...Object.entries(cashFlow.byMethod).map(([k, v]) => [`  via ${k}`, formatMoney(v, currency)] as [string, string]),
  ];
  const cashFooter: [string, string][] = [["Net change in cash", formatMoney(cashFlow.netChange, currency)]];

  const balanceRows: [string, string][] = [
    ["ASSETS", ""],
    [beginnerMode ? "  Cash on hand" : "  Cash & equivalents", formatMoney(balance.assets.cash, currency)],
    ["  Equipment", formatMoney(balance.assets.equipment, currency)],
    ["  Total assets", formatMoney(balance.assets.total, currency)],
    ["", ""],
    ["LIABILITIES", ""],
    ["  Accounts payable", formatMoney(balance.liabilities.accountsPayable, currency)],
    ["  Total liabilities", formatMoney(balance.liabilities.total, currency)],
    ["", ""],
    ["EQUITY", ""],
    ["  Owner's equity", formatMoney(balance.equity.ownerEquity, currency)],
    [beginnerMode ? "  Money kept over time" : "  Retained earnings", formatMoney(balance.equity.retainedEarnings, currency)],
    ["  Total equity", formatMoney(balance.equity.total, currency)],
  ];
  const balanceFooter: [string, string][] = [
    ["Liabilities + Equity", formatMoney(balance.liabilities.total + balance.equity.total, currency)],
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Financial Statements</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeBusiness?.name} · Auto-generated from your transactions.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-border bg-card px-3 py-1.5 shadow-soft">
          <Sparkles className="h-4 w-4 text-primary" />
          <Label htmlFor="bm" className="text-sm">Beginner mode</Label>
          <Switch id="bm" checked={beginnerMode} onCheckedChange={setBeginnerMode} />
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div>
          <Label htmlFor="s">From</Label>
          <Input id="s" type="date" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="e">To</Label>
          <Input id="e" type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="mt-1.5" />
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => preset("month")}>This month</Button>
          <Button size="sm" variant="outline" onClick={() => preset("quarter")}>This quarter</Button>
          <Button size="sm" variant="outline" onClick={() => preset("year")}>This year</Button>
        </div>
      </div>

      <Tabs defaultValue="income">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="income">Income Statement</TabsTrigger>
          <TabsTrigger value="cash">Cash Flow</TabsTrigger>
          <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
        </TabsList>

        <TabsContent value="income">
          <StatementCard
            title={beginnerMode ? "What did you earn vs. spend?" : "Income Statement"}
            subtitle={`${start} — ${end}`}
            onExport={() => exportPdf("Income Statement", incomeRows, incomeFooter)}
          >
            <StatementSection title={beginnerMode ? "Money coming in" : "Revenue"} rows={income.incomeByCategory} currency={currency} />
            <Row bold label={beginnerMode ? "Total money in" : "Total Revenue"} value={formatMoney(income.totalIncome, currency)} tone="text-success" />
            <div className="my-3 h-px bg-border" />
            <StatementSection title={beginnerMode ? "Money going out" : "Expenses"} rows={income.expenseByCategory} currency={currency} negative />
            <Row bold label={beginnerMode ? "Total money out" : "Total Expenses"} value={`(${formatMoney(income.totalExpenses, currency)})`} tone="text-destructive" />
            <div className="my-3 h-px bg-border" />
            <Row big label={beginnerMode ? "What you kept (Net Profit)" : "Net Profit"} value={formatMoney(income.netProfit, currency)} tone={income.netProfit >= 0 ? "text-success" : "text-destructive"} />
            <p className="mt-2 text-xs text-muted-foreground">Profit margin: {income.margin.toFixed(1)}%</p>
          </StatementCard>
        </TabsContent>

        <TabsContent value="cash">
          <StatementCard
            title="Cash Flow Statement"
            subtitle={`${start} — ${end}`}
            onExport={() => exportPdf("Cash Flow", cashRows, cashFooter)}
          >
            <Row label="Cash from operations" value={formatMoney(cashFlow.operating, currency)} />
            <Row label="Cash from investing" value={formatMoney(cashFlow.investing, currency)} />
            <Row label="Cash from financing" value={formatMoney(cashFlow.financing, currency)} />
            <div className="my-3 h-px bg-border" />
            <p className="mb-2 text-sm font-medium">By payment method</p>
            {Object.entries(cashFlow.byMethod).map(([m, v]) => (
              <Row key={m} label={m} value={formatMoney(v, currency)} />
            ))}
            <div className="my-3 h-px bg-border" />
            <Row big label="Net change in cash" value={formatMoney(cashFlow.netChange, currency)} tone={cashFlow.netChange >= 0 ? "text-success" : "text-destructive"} />
          </StatementCard>
        </TabsContent>

        <TabsContent value="balance">
          <StatementCard
            title="Balance Sheet"
            subtitle={`As of ${end}`}
            onExport={() => exportPdf("Balance Sheet", balanceRows, balanceFooter)}
          >
            <p className="mb-2 text-sm font-semibold">Assets</p>
            <Row label={beginnerMode ? "Cash on hand" : "Cash & equivalents"} value={formatMoney(balance.assets.cash, currency)} />
            <Row label="Equipment" value={formatMoney(balance.assets.equipment, currency)} />
            <Row bold label="Total assets" value={formatMoney(balance.assets.total, currency)} />

            <div className="my-3 h-px bg-border" />
            <p className="mb-2 text-sm font-semibold">Liabilities</p>
            <Row label="Accounts payable" value={formatMoney(balance.liabilities.accountsPayable, currency)} />
            <Row bold label="Total liabilities" value={formatMoney(balance.liabilities.total, currency)} />

            <div className="my-3 h-px bg-border" />
            <p className="mb-2 text-sm font-semibold">Equity</p>
            <Row label="Owner's equity" value={formatMoney(balance.equity.ownerEquity, currency)} />
            <Row label={beginnerMode ? "Money kept over time" : "Retained earnings"} value={formatMoney(balance.equity.retainedEarnings, currency)} />
            <Row bold label="Total equity" value={formatMoney(balance.equity.total, currency)} />

            <div className="my-3 h-px bg-border" />
            <Row big label="Liabilities + Equity" value={formatMoney(balance.liabilities.total + balance.equity.total, currency)} />
          </StatementCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatementCard({
  title, subtitle, children, onExport,
}: {
  title: string; subtitle: string; children: React.ReactNode; onExport: () => void;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button size="sm" className="gap-2 gradient-brand text-white hover:opacity-95" onClick={onExport}>
            <Download className="h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function StatementSection({ title, rows, currency, negative }: { title: string; rows: Record<string, number>; currency: string; negative?: boolean }) {
  const entries = Object.entries(rows);
  return (
    <div className="mb-2">
      <p className="mb-2 text-sm font-semibold">{title}</p>
      {entries.length === 0 ? (
        <p className="text-sm italic text-muted-foreground">No entries in this range.</p>
      ) : (
        entries.map(([k, v]) => (
          <Row key={k} label={k} value={negative ? `(${formatMoney(v, currency)})` : formatMoney(v, currency)} />
        ))
      )}
    </div>
  );
}

function Row({ label, value, tone, bold, big }: { label: string; value: string; tone?: string; bold?: boolean; big?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1 ${big ? "text-lg" : "text-sm"} ${bold || big ? "font-bold" : ""}`}>
      <span className="capitalize">{label}</span>
      <span className={tone}>{value}</span>
    </div>
  );
}
