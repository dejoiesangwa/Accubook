import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Plus, Trash2, Check, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useStore, type Business } from "@/lib/store";

const CURRENCIES = ["USD", "EUR", "GBP", "RWF", "KES", "NGN", "ZAR", "INR"];
const BUSINESS_TYPES = ["General", "Retail", "Services", "Restaurant", "Consulting", "Manufacturing", "Freelance"];

export const Route = createFileRoute("/_authenticated/businesses")({
  component: BusinessesPage,
});

function BusinessesPage() {
  const { businesses, activeBusinessId, setActiveBusiness, createBusiness, updateBusiness, deleteBusiness } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Business | null>(null);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Businesses</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage multiple businesses and switch anytime.</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 gradient-brand text-white hover:opacity-95"><Plus className="h-4 w-4" /> Add business</Button>
          </DialogTrigger>
          <BusinessForm
            key={editing?.id ?? "new"}
            editing={editing}
            onSubmit={(data) => {
              if (editing) {
                updateBusiness(editing.id, data);
                toast.success("Business updated");
              } else {
                createBusiness(data);
                toast.success("Business added");
              }
              setEditing(null);
              setOpen(false);
            }}
          />
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {businesses.map((b) => {
          const isActive = b.id === activeBusinessId;
          return (
            <div key={b.id} className={`rounded-2xl border p-5 shadow-soft transition-all ${isActive ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl gradient-brand text-white shadow-elegant">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.type} · {b.currency}</p>
                  </div>
                </div>
                {isActive && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    <Check className="h-3 w-3" /> Active
                  </span>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {!isActive && (
                  <Button size="sm" variant="outline" onClick={() => { setActiveBusiness(b.id); toast.success(`Switched to ${b.name}`); }}>
                    Set active
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="gap-1" onClick={() => { setEditing(b); setOpen(true); }}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                {businesses.length > 1 && (
                  <Button size="sm" variant="ghost" className="gap-1 text-destructive hover:text-destructive" onClick={() => {
                    if (confirm(`Delete ${b.name}? All its transactions will also be removed.`)) {
                      deleteBusiness(b.id);
                      toast.success("Business deleted");
                    }
                  }}>
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BusinessForm({
  editing, onSubmit,
}: { editing: Business | null; onSubmit: (b: Omit<Business, "id" | "createdAt">) => void }) {
  const [name, setName] = useState(editing?.name ?? "");
  const [currency, setCurrency] = useState(editing?.currency ?? "USD");
  const [type, setType] = useState(editing?.type ?? "General");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name required");
    onSubmit({ name: name.trim(), currency, type });
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader><DialogTitle>{editing ? "Edit business" : "Add business"}</DialogTitle></DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label>Business name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Corp" className="mt-1.5" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>{CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Business type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>{BUSINESS_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="w-full gradient-brand text-white hover:opacity-95">
            {editing ? "Save changes" : "Add business"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
