import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  features?: string[];
}

export function PlaceholderPage({ icon: Icon, title, description, features }: Props) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center shadow-soft">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl gradient-brand text-white shadow-elegant">
          <Icon className="h-7 w-7" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">Coming next</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          This section is scaffolded and ready to build out in the next step.
        </p>
        {features && (
          <ul className="mx-auto mt-6 grid max-w-md gap-2 text-left text-sm">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}
        <Button className="mt-8 gradient-brand text-white hover:opacity-95">Build this next</Button>
      </div>
    </div>
  );
}
