import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "./auth";

export type TxType = "income" | "expense";

export interface Transaction {
  id: string;
  businessId: string;
  date: string; // ISO yyyy-mm-dd
  type: TxType;
  category: string;
  description: string;
  amount: number;
  paymentMethod: "cash" | "bank" | "mobile" | "card";
  createdAt: string;
}

export interface Business {
  id: string;
  name: string;
  currency: string;
  type: string;
  createdAt: string;
}

export const INCOME_CATEGORIES = ["Sales", "Services", "Interest", "Investments", "Other Income"];
export const EXPENSE_CATEGORIES = [
  "Salaries", "Rent", "Utilities", "Transport", "Supplies", "Marketing",
  "Software", "Meals", "Taxes", "Insurance", "Maintenance", "Other Expense",
];

interface StoreCtx {
  businesses: Business[];
  activeBusinessId: string | null;
  activeBusiness: Business | null;
  transactions: Transaction[]; // scoped to active business
  allTransactions: Transaction[];
  setActiveBusiness: (id: string) => void;
  createBusiness: (b: Omit<Business, "id" | "createdAt">) => Business;
  updateBusiness: (id: string, patch: Partial<Business>) => void;
  deleteBusiness: (id: string) => void;
  addTransaction: (t: Omit<Transaction, "id" | "createdAt" | "businessId">) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  seedDemo: () => void;
  clearAll: () => void;
}

const Ctx = createContext<StoreCtx | null>(null);

function keyFor(userId: string, kind: string) {
  return `accubook.${userId}.${kind}`;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, val: T) {
  localStorage.setItem(key, JSON.stringify(val));
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const uid = user?.id ?? "guest";

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [transactions, setAllTx] = useState<Transaction[]>([]);
  const [activeBusinessId, setActiveId] = useState<string | null>(null);

  // Load on user change
  useEffect(() => {
    if (!user) {
      setBusinesses([]);
      setAllTx([]);
      setActiveId(null);
      return;
    }
    let bs = read<Business[]>(keyFor(uid, "businesses"), []);
    if (bs.length === 0) {
      const b: Business = {
        id: crypto.randomUUID(),
        name: `${user.name.split(" ")[0]}'s Business`,
        currency: "USD",
        type: "General",
        createdAt: new Date().toISOString(),
      };
      bs = [b];
      write(keyFor(uid, "businesses"), bs);
    }
    setBusinesses(bs);
    setAllTx(read<Transaction[]>(keyFor(uid, "transactions"), []));
    const savedActive = localStorage.getItem(keyFor(uid, "activeBusiness"));
    setActiveId(savedActive && bs.some((x) => x.id === savedActive) ? savedActive : bs[0].id);
  }, [uid, user]);

  const persistBusinesses = (next: Business[]) => {
    setBusinesses(next);
    write(keyFor(uid, "businesses"), next);
  };
  const persistTx = (next: Transaction[]) => {
    setAllTx(next);
    write(keyFor(uid, "transactions"), next);
  };
  const setActiveBusiness = (id: string) => {
    setActiveId(id);
    localStorage.setItem(keyFor(uid, "activeBusiness"), id);
  };

  const value = useMemo<StoreCtx>(() => {
    const activeBusiness = businesses.find((b) => b.id === activeBusinessId) ?? null;
    const scoped = activeBusinessId
      ? transactions.filter((t) => t.businessId === activeBusinessId)
      : [];

    return {
      businesses,
      activeBusinessId,
      activeBusiness,
      transactions: scoped,
      allTransactions: transactions,
      setActiveBusiness,
      createBusiness: (b) => {
        const nb: Business = { ...b, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        persistBusinesses([...businesses, nb]);
        setActiveBusiness(nb.id);
        return nb;
      },
      updateBusiness: (id, patch) => {
        persistBusinesses(businesses.map((b) => (b.id === id ? { ...b, ...patch } : b)));
      },
      deleteBusiness: (id) => {
        const next = businesses.filter((b) => b.id !== id);
        persistBusinesses(next);
        persistTx(transactions.filter((t) => t.businessId !== id));
        if (activeBusinessId === id && next[0]) setActiveBusiness(next[0].id);
      },
      addTransaction: (t) => {
        if (!activeBusinessId) return;
        const nt: Transaction = {
          ...t,
          id: crypto.randomUUID(),
          businessId: activeBusinessId,
          createdAt: new Date().toISOString(),
        };
        persistTx([nt, ...transactions]);
      },
      updateTransaction: (id, patch) => {
        persistTx(transactions.map((t) => (t.id === id ? { ...t, ...patch } : t)));
      },
      deleteTransaction: (id) => {
        persistTx(transactions.filter((t) => t.id !== id));
      },
      seedDemo: () => {
        if (!activeBusinessId) return;
        const now = new Date();
        const demo: Transaction[] = [];
        const incomes = ["Client payment", "Product sale", "Consulting fee", "Subscription revenue"];
        const expenses = [
          ["Office rent", "Rent", 1200],
          ["Payroll", "Salaries", 4200],
          ["Google Ads", "Marketing", 380],
          ["Team lunch", "Meals", 145],
          ["Cloud hosting", "Software", 220],
          ["Electricity bill", "Utilities", 180],
          ["Fuel", "Transport", 90],
        ] as const;
        for (let m = 5; m >= 0; m--) {
          const base = new Date(now.getFullYear(), now.getMonth() - m, 5);
          incomes.forEach((desc, i) => {
            demo.push({
              id: crypto.randomUUID(),
              businessId: activeBusinessId,
              date: new Date(base.getFullYear(), base.getMonth(), 3 + i * 5).toISOString().slice(0, 10),
              type: "income",
              category: i === 2 ? "Services" : "Sales",
              description: desc,
              amount: 1500 + Math.round(Math.random() * 3500),
              paymentMethod: "bank",
              createdAt: new Date().toISOString(),
            });
          });
          expenses.forEach(([desc, cat, amt], i) => {
            demo.push({
              id: crypto.randomUUID(),
              businessId: activeBusinessId,
              date: new Date(base.getFullYear(), base.getMonth(), 4 + i * 3).toISOString().slice(0, 10),
              type: "expense",
              category: cat,
              description: desc,
              amount: amt + Math.round(Math.random() * 50),
              paymentMethod: "bank",
              createdAt: new Date().toISOString(),
            });
          });
        }
        persistTx([...demo, ...transactions]);
      },
      clearAll: () => {
        if (!activeBusinessId) return;
        persistTx(transactions.filter((t) => t.businessId !== activeBusinessId));
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businesses, transactions, activeBusinessId, uid]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used inside StoreProvider");
  return c;
}

export function formatMoney(amount: number, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}
