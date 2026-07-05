import { createFileRoute } from "@tanstack/react-router";
import { Moon, Sun, Sparkles, Trash2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useSettings, type Currency } from "@/lib/settings";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

const CURRENCIES: Currency[] = ["USD", "EUR", "GBP", "RWF", "KES", "NGN", "ZAR", "INR"];

function SettingsPage() {
  const { theme, toggleTheme, currency, setCurrency, beginnerMode, setBeginnerMode } = useSettings();
  const { clearAll, seedDemo, transactions } = useStore();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Personalize how Accubook looks and behaves.</p>
      </div>

      <Section title="Appearance" desc="Choose your preferred theme and display options.">
        <Row
          label={theme === "dark" ? "Dark mode" : "Light mode"}
          desc="Reduce eye strain at night with dark theme."
          icon={theme === "dark" ? Moon : Sun}
        >
          <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
        </Row>
        <Row label="Beginner mode" desc="Uses plain-English labels in financial statements." icon={Sparkles}>
          <Switch checked={beginnerMode} onCheckedChange={setBeginnerMode} />
        </Row>
      </Section>

      <Section title="Currency & language" desc="Applies to money formatting across the app.">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label>Default currency</Label>
            <p className="text-xs text-muted-foreground">Used when formatting amounts on statements & analytics.</p>
          </div>
          <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>{CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </Section>

      <Section title="Data" desc="Your data is stored locally in this browser. Nothing is sent to any server.">
        <Row label="Load demo data" desc="Add 6 months of realistic sample transactions." icon={Database}>
          <Button size="sm" variant="outline" onClick={() => { seedDemo(); toast.success("Demo data loaded"); }}>Load</Button>
        </Row>
        <Row label="Clear all transactions" desc={`${transactions.length} transactions for the active business.`} icon={Trash2}>
          <Button size="sm" variant="destructive" onClick={() => {
            if (confirm("Delete ALL transactions for this business? This cannot be undone.")) {
              clearAll();
              toast.success("All transactions cleared");
            }
          }}>Clear</Button>
        </Row>
      </Section>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-xs text-muted-foreground">{desc}</p>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, desc, icon: Icon, children }: { label: string; desc: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
