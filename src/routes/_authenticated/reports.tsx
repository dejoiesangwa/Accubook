import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, FileText, FileSpreadsheet, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useStore, formatMoney } from "@/lib/store";
import { useSettings } from "@/lib/settings";
import { buildIncomeStatement } from "@/lib/statements";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const Route = createFileRoute("/_authenticated/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const { transactions, activeBusiness } = useStore();
  const { currency } = useSettings();

  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();

  const [start, setStart] = useState(new Date(y, m, 1).toISOString().slice(0, 10));
  const [end, setEnd] = useState(new Date().toISOString().slice(0, 10));

  const preset = (kind: "month" | "quarter" | "year" | "prev-month") => {
    let s: Date, e: Date;
    const d = new Date();
    switch (kind) {
      case "month": s = new Date(d.getFullYear(), d.getMonth(), 1); e = d; break;
      case "prev-month": s = new Date(d.getFullYear(), d.getMonth() - 1, 1); e = new Date(d.getFullYear(), d.getMonth(), 0); break;
      case "quarter": s = new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3, 1); e = d; break;
      case "year": s = new Date(d.getFullYear(), 0, 1); e = d; break;
    }
    setStart(s.toISOString().slice(0, 10));
    setEnd(e.toISOString().slice(0, 10));
  };

  const scoped = useMemo(
    () => transactions.filter((t) => t.date >= start && t.date <= end).sort((a, b) => a.date.localeCompare(b.date)),
    [transactions, start, end]
  );
  const report = useMemo(() => buildIncomeStatement(transactions, { start, end }), [transactions, start, end]);

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(activeBusiness?.name ?? "Accubook", 14, 18);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report · ${start} → ${end}`, 14, 26);
    doc.setTextColor(0);
    autoTable(doc, {
      startY: 32,
      head: [["Date", "Type", "Category", "Description", "Amount"]],
      body: scoped.map((t) => [t.date, t.type, t.category, t.description, formatMoney(t.amount, currency)]),
      headStyles: { fillColor: [37, 99, 235] },
    });
    const y2 = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Total Revenue: ${formatMoney(report.totalIncome, currency)}`, 14, y2);
    doc.text(`Total Expenses: ${formatMoney(report.totalExpenses, currency)}`, 14, y2 + 7);
    doc.setFont(undefined as any, "bold");
    doc.text(`Net Profit: ${formatMoney(report.netProfit, currency)}`, 14, y2 + 14);
    doc.save(`report-${start}-to-${end}.pdf`);
    toast.success("PDF exported");
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(
      scoped.map((t) => ({
        Date: t.date, Type: t.type, Category: t.category,
        Description: t.description, Amount: t.amount, Payment: t.paymentMethod,
      }))
    );
    XLSX.utils.book_append_sheet(wb, sheet, "Transactions");
    const summary = XLSX.utils.aoa_to_sheet([
      ["Report period", `${start} to ${end}`],
      [],
      ["Total Revenue", report.totalIncome],
      ["Total Expenses", report.totalExpenses],
      ["Net Profit", report.netProfit],
      ["Margin %", report.margin.toFixed(2)],
    ]);
    XLSX.utils.book_append_sheet(wb, summary, "Summary");
    XLSX.writeFile(wb, `report-${start}-to-${end}.xlsx`);
    toast.success("Excel exported");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">Build custom reports and export to PDF or Excel.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <Label>From</Label>
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>To</Label>
            <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="mt-1.5" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => preset("month")}>This month</Button>
            <Button size="sm" variant="outline" onClick={() => preset("prev-month")}>Last month</Button>
            <Button size="sm" variant="outline" onClick={() => preset("quarter")}>This quarter</Button>
            <Button size="sm" variant="outline" onClick={() => preset("year")}>This year</Button>
          </div>
          <div className="ml-auto flex gap-2">
            <Button size="sm" className="gap-2" variant="outline" onClick={exportExcel}>
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </Button>
            <Button size="sm" className="gap-2 gradient-brand text-white hover:opacity-95" onClick={exportPdf}>
              <FileText className="h-4 w-4" /> PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Kpi label="Transactions" value={String(scoped.length)} />
        <Kpi label="Revenue" value={formatMoney(report.totalIncome, currency)} tone="text-success" />
        <Kpi label="Expenses" value={formatMoney(report.totalExpenses, currency)} tone="text-destructive" />
        <Kpi label="Net profit" value={formatMoney(report.netProfit, currency)} tone={report.netProfit >= 0 ? "text-success" : "text-destructive"} />
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft">
        <div className="border-b border-border p-4">
          <h2 className="font-semibold">Preview</h2>
          <p className="text-xs text-muted-foreground">First {Math.min(15, scoped.length)} of {scoped.length} rows in this range.</p>
        </div>
        {scoped.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            <Calendar className="mx-auto mb-2 h-6 w-6" /> No transactions in this range.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/30 text-left">
                <tr>
                  <th className="p-3 font-medium">Date</th>
                  <th className="p-3 font-medium">Description</th>
                  <th className="p-3 font-medium">Category</th>
                  <th className="p-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {scoped.slice(0, 15).map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0">
                    <td className="p-3 text-muted-foreground">{t.date}</td>
                    <td className="p-3">{t.description}</td>
                    <td className="p-3 text-muted-foreground">{t.category}</td>
                    <td className={`p-3 text-right font-medium ${t.type === "income" ? "text-success" : ""}`}>
                      {t.type === "income" ? "+" : "−"}{formatMoney(t.amount, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-1 text-xl font-bold ${tone ?? ""}`}>{value}</p>
    </div>
  );
}
