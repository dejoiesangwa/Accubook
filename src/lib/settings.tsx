import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Currency = "USD" | "EUR" | "GBP" | "RWF" | "KES" | "NGN" | "ZAR" | "INR";
export type Theme = "light" | "dark";

interface Settings {
  currency: Currency;
  theme: Theme;
  beginnerMode: boolean;
}

interface SettingsCtx extends Settings {
  setCurrency: (c: Currency) => void;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setBeginnerMode: (b: boolean) => void;
}

const Ctx = createContext<SettingsCtx | null>(null);
const KEY = "accubook.settings";

const DEFAULT: Settings = { currency: "USD", theme: "light", beginnerMode: false };

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Settings>(DEFAULT);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setS({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", s.theme === "dark");
  }, [s.theme]);

  const update = (patch: Partial<Settings>) => {
    setS((prev) => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return (
    <Ctx.Provider
      value={{
        ...s,
        setCurrency: (c) => update({ currency: c }),
        setTheme: (t) => update({ theme: t }),
        toggleTheme: () => update({ theme: s.theme === "dark" ? "light" : "dark" }),
        setBeginnerMode: (b) => update({ beginnerMode: b }),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useSettings() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSettings must be used inside SettingsProvider");
  return c;
}
