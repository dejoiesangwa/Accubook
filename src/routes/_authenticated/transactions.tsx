import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Trash2, Pencil, Download, Upload, Filter, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  EXPENSE_CATEGORIES, INCOME_CATEGORIES, formatMoney,
  useStore, type Transaction, type TxType,
} from "@/lib/store";
import { useSettings } from "@/lib/settings";

export const Route = createFileRoute("/_authenticated/transactions")({
  component: TransactionsPage,
});

function TransactionsPage() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, activeBusiness, seedDemo } = useStore();
  const { currency } = useSettings();
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | TxType>("all");
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => (filterType === "all" ? true : t.type === filterType))
      .filter((t) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, query, filterType]);

  const totals = useMemo(() => {
    const income = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { income, expense, net: income - expense };
  }, [filtered]);

  const exportCsv = () => {
    const rows = [
      ["Date", "Type", "Category", "Description", "Amount", "Payment"],
      ...filtered.map((t) => [t.date, t.type, t.category, t.description, t.amount, t.paymentMethod]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported CSV");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Transactions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeBusiness?.name} · {transactions.length} records
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {transactions.length === 0 && (
            <Button variant="outline" size="sm" onClick={() => { seedDemo(); toast.success("Demo data added"); }}>
              Load demo data
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-2" onClick={exportCsv}>
            <Download className="h-4 w-4" /> Export
          </Button>
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2 gradient-brand text-white hover:opacity-95">
                <Plus className="h-4 w-4" /> Add Transaction
              </Button>
            </DialogTrigger>
            <TransactionForm
              key={editing?.id ?? "new"}
              editing={editing}
              onSubmit={(data) => {
                if (editing) {
                  updateTransaction(editing.id, data);
                  toast.success("Transaction updated");
                } else {
                  addTransaction(data);
                  toast.success("Transaction added");
                }
                setEditing(null);
                setOpen(false);
              }}
            />
          </Dialog>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatBox label="Income" value={formatMoney(totals.income, currency)} tone="text-success" />
        <StatBox label="Expenses" value={formatMoney(totals.expense, currency)} tone="text-destructive" />
        <StatBox label="Net" value={formatMoney(totals.net, currency)} tone={totals.net >= 0 ? "text-success" : "text-destructive"} />
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search description or category…" className="pl-9" />
          </div>
          <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
            <SelectTrigger className="w-[160px]"><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="income">Income only</SelectItem>
              <SelectItem value="expense">Expenses only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="grid place-items-center gap-3 p-16 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
              <Receipt className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium">No transactions yet</p>
            <p className="text-sm text-muted-foreground">Add your first income or expense to see it here.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-muted-foreground">{t.date}</TableCell>
                  <TableCell className="font-medium">{t.description}</TableCell>
                  <TableCell>
                    <Badge variant={t.type === "income" ? "default" : "secondary"} className={t.type === "income" ? "bg-success/15 text-success hover:bg-success/20" : ""}>
                      {t.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">{t.paymentMethod}</TableCell>
                  <TableCell className={`text-right font-semibold ${t.type === "income" ? "text-success" : "text-foreground"}`}>
                    {t.type === "income" ? "+" : "−"}{formatMoney(t.amount, currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => { setEditing(t); setOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => { deleteTransaction(t.id); toast.success("Deleted"); }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-1 text-xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

function TransactionForm({
  editing,
  onSubmit,
}: {
  editing: Transaction | null;
  onSubmit: (t: Omit<Transaction, "id" | "createdAt" | "businessId">) => void;
}) {
  const [type, setType] = useState<TxType>(editing?.type ?? "income");
  const [date, setDate] = useState(editing?.date ?? new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState(editing?.category ?? INCOME_CATEGORIES[0]);
  const [description, setDescription] = useState(editing?.description ?? "");
  const [amount, setAmount] = useState<string>(editing?.amount.toString() ?? "");
  const [paymentMethod, setPaymentMethod] = useState<Transaction["paymentMethod"]>(editing?.paymentMethod ?? "bank");

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(amount);
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");
    if (!description.trim()) return toast.error("Description required");
    onSubmit({
      type,
      date,
      category: categories.includes(category) ? category : categories[0],
      description: description.trim(),
      amount: amt,
      paymentMethod,
    });
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{editing ? "Edit transaction" : "Add transaction"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        <div className="flex rounded-lg border border-border p-1">
          <button type="button" onClick={() => { setType("income"); setCategory(INCOME_CATEGORIES[0]); }} className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${type === "income" ? "bg-success text-white" : "text-muted-foreground"}`}>Income</button>
          <button type="button" onClick={() => { setType("expense"); setCategory(EXPENSE_CATEGORIES[0]); }} className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${type === "expense" ? "bg-destructive text-white" : "text-muted-foreground"}`}>Expense</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5" required />
          </div>
          <div>
            <Label>Amount</Label>
            <Input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1.5" placeholder="0.00" required />
          </div>
        </div>
        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Client payment — Acme Ltd" className="mt-1.5" rows={2} />
        </div>
        <div>
          <Label>Payment method</Label>
          <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="bank">Bank transfer</SelectItem>
              <SelectItem value="mobile">Mobile money</SelectItem>
              <SelectItem value="card">Card</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button type="submit" className="w-full gradient-brand text-white hover:opacity-95">
            {editing ? "Save changes" : "Add transaction"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
