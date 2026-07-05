import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle, BookOpen, MessageCircle } from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/_authenticated/help")({
  component: HelpPage,
});

const glossary = [
  { term: "Revenue (Sales)", plain: "Money you earn from customers before subtracting any costs." },
  { term: "Expenses", plain: "Money you spend to run your business — rent, salaries, supplies, etc." },
  { term: "Net Profit", plain: "What's left after subtracting expenses from revenue. If this is positive, you made money." },
  { term: "Cash Flow", plain: "The actual movement of money in and out of your business — cash in, cash out." },
  { term: "Assets", plain: "Things your business owns that have value — cash, equipment, inventory." },
  { term: "Liabilities", plain: "What your business owes to others — loans, unpaid bills, taxes owed." },
  { term: "Equity", plain: "What the business is worth to you (owner) after paying off all debts." },
  { term: "Profit Margin", plain: "Net profit divided by revenue, shown as a percentage. Higher is better." },
];

const faqs = [
  { q: "Where is my data stored?", a: "Everything is saved in your browser's local storage. Nothing is uploaded to any server — Accubook runs 100% locally." },
  { q: "Can I export my data?", a: "Yes. Use Transactions → Export, or Reports → PDF/Excel to download your books at any time." },
  { q: "What does Beginner Mode do?", a: "Beginner Mode rewrites accounting labels using plain English (e.g. 'Money coming in' instead of 'Revenue') on the Financial Statements page." },
  { q: "Can I manage multiple businesses?", a: "Yes — head to Businesses to add as many as you want and switch between them. Each has its own transactions." },
  { q: "How is the Health Score calculated?", a: "It combines your profit margin and expense discipline into a 0–100 score. 85+ is excellent." },
];

function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Help & Learning Center</h1>
        <p className="mt-1 text-sm text-muted-foreground">Accounting explained in plain English.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card icon={BookOpen} title="Getting started" text="Add your first transaction and generate a statement in under 2 minutes." />
        <Card icon={HelpCircle} title="Beginner Mode" text="Turn on plain-English labels in Settings → Beginner Mode." />
        <Card icon={MessageCircle} title="Local only" text="No cloud, no accounts, no tracking. Your books stay on this device." />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-semibold">Plain-English Glossary</h2>
        <p className="text-xs text-muted-foreground">Accounting jargon translated.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {glossary.map((g) => (
            <div key={g.term} className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-sm font-semibold">{g.term}</p>
              <p className="mt-1 text-sm text-muted-foreground">{g.plain}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-semibold">Frequently asked</h2>
        <Accordion type="single" collapsible className="mt-2">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`i${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="grid h-10 w-10 place-items-center rounded-xl gradient-brand text-white shadow-elegant">
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
