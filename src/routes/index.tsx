import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, BarChart3, Wallet, FileText, TrendingUp, Building2, Download,
  Sparkles, Bell, LineChart, ShieldCheck, Zap, Check, Star, Play, Menu,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  component: Landing,
});

const features = [
  { icon: Wallet, title: "Transaction Management", desc: "Track every business income and expense in one place." },
  { icon: FileText, title: "Income Statement", desc: "Generate profit & loss reports instantly." },
  { icon: BarChart3, title: "Balance Sheet", desc: "Assets, liabilities and equity calculated automatically." },
  { icon: TrendingUp, title: "Cash Flow Statement", desc: "See money entering and leaving your business." },
  { icon: LineChart, title: "Financial Analytics", desc: "Interactive charts and clear business insights." },
  { icon: Building2, title: "Multi-Business", desc: "Manage several businesses from one account." },
  { icon: Download, title: "Export Reports", desc: "Download PDF and Excel with one click." },
  { icon: Sparkles, title: "Smart Insights", desc: "AI recommendations based on your performance." },
];

const steps = [
  { n: "01", title: "Record Transactions", desc: "Add income and expenses in seconds — no accounting jargon." },
  { n: "02", title: "Categorize Automatically", desc: "Smart suggestions turn messy notes into clean books." },
  { n: "03", title: "Generate Statements", desc: "Income, balance, cash flow and equity — ready to share." },
  { n: "04", title: "Receive Insights", desc: "Actionable recommendations and a live health score." },
];

const testimonials = [
  { name: "Aline U.", role: "Boutique Owner, Kigali", quote: "I stopped using notebooks. Accubook showed my real profit for the first time." },
  { name: "Jean-Paul M.", role: "Freelance Designer", quote: "Beginner mode made accounting finally click. I generate my P&L in minutes." },
  { name: "Sarah K.", role: "Startup Founder", quote: "The health score and alerts feel like having a CFO on the team." },
];

const plans = [
  { name: "Starter", price: "Free", desc: "For freelancers just getting started.", features: ["1 business", "Unlimited transactions", "Basic statements", "PDF export"], cta: "Start Free" },
  { name: "Business", price: "$12", period: "/mo", desc: "For growing small businesses.", features: ["Up to 5 businesses", "All statements", "Smart insights", "PDF + Excel export", "Priority support"], cta: "Start Free Trial", featured: true },
  { name: "Pro", price: "$29", period: "/mo", desc: "For teams and accountants.", features: ["Unlimited businesses", "Custom reports", "Team roles", "API access", "Dedicated support"], cta: "Contact Sales" },
];

const faqs = [
  { q: "Do I need accounting knowledge?", a: "No. Accubook has a Beginner Mode that replaces terms like Assets with 'What You Own'. Anyone can use it." },
  { q: "Is my data safe?", a: "Yes. All data stays in your browser storage in this local build. No cloud sync, no third-party servers." },
  { q: "Can I export my reports?", a: "Absolutely. Every statement can be downloaded as PDF or Excel, or printed directly." },
  { q: "Can I manage multiple businesses?", a: "Yes. Create as many businesses as your plan allows and switch between them instantly." },
  { q: "Does it work offline?", a: "This build runs entirely in your browser, so yes — after the first load it works offline." },
];

function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    ["Features", "#features"], ["How It Works", "#how"], ["Pricing", "#pricing"],
    ["Testimonials", "#testimonials"], ["FAQ", "#faq"], ["Contact", "#contact"],
  ] as const;
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-border/50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand shadow-elegant">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Accubook</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {links.map(([label, href]) => (
              <a key={href} href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button asChild variant="ghost" size="sm"><Link to="/login">Login</Link></Button>
            <Button asChild size="sm" className="gradient-brand text-white shadow-elegant hover:opacity-95">
              <Link to="/register">Get Started <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
        {open && (
          <div className="border-t border-border/50 px-4 py-3 md:hidden">
            <div className="flex flex-col gap-3">
              {links.map(([label, href]) => (
                <a key={href} href={href} onClick={() => setOpen(false)} className="text-sm text-muted-foreground">{label}</a>
              ))}
              <div className="flex gap-2 pt-2">
                <Button asChild variant="outline" size="sm" className="flex-1"><Link to="/login">Login</Link></Button>
                <Button asChild size="sm" className="flex-1 gradient-brand text-white"><Link to="/register">Get Started</Link></Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Built for small businesses in Africa & beyond
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Financial Statements{" "}
              <span className="gradient-text">Made Simple</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Track your income, expenses and automatically generate professional financial
              reports in minutes — no accounting knowledge required.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gradient-brand text-white shadow-elegant hover:opacity-95">
                <Link to="/register">Start Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Play className="h-4 w-4" /> Watch Demo
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> No credit card</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> Free forever plan</div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative">
            <div className="glass rounded-2xl p-6 shadow-elegant">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Net Profit — This Month</p>
                  <p className="mt-1 text-3xl font-bold">$24,830</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-success">
                    <TrendingUp className="h-4 w-4" /> +18.2% vs last month
                  </p>
                </div>
                <div className="grid h-14 w-14 place-items-center rounded-xl gradient-emerald text-white shadow-glow">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-6 h-40 rounded-xl bg-gradient-to-t from-primary/10 to-transparent p-4">
                <div className="flex h-full items-end gap-2">
                  {[40, 65, 45, 80, 55, 90, 70, 95, 75, 100, 85, 110].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t gradient-brand opacity-80" style={{ height: `${h * 0.7}%` }} />
                  ))}
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: "Revenue", value: "$52k", icon: TrendingUp, color: "gradient-brand" },
                  { label: "Expenses", value: "$27k", icon: Wallet, color: "gradient-emerald" },
                  { label: "Health", value: "92", icon: ShieldCheck, color: "gradient-brand" },
                ].map((k) => (
                  <div key={k.label} className="rounded-xl border border-border bg-card/60 p-3">
                    <k.icon className="h-4 w-4 text-primary" />
                    <p className="mt-2 text-xs text-muted-foreground">{k.label}</p>
                    <p className="text-lg font-semibold">{k.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -right-6 -top-6 hidden h-24 w-24 rounded-full bg-primary/20 blur-3xl md:block" />
            <div className="absolute -bottom-8 -left-8 hidden h-32 w-32 rounded-full bg-success/20 blur-3xl md:block" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Features</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Everything you need to run your books</h2>
          <p className="mt-4 text-muted-foreground">From daily bookkeeping to boardroom-ready reports, all in one clean workspace.</p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl gradient-brand text-white shadow-elegant transition-transform group-hover:scale-110">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="border-y border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">How It Works</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Clean books in four steps</h2>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <span className="text-4xl font-bold gradient-text">{s.n}</span>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InnovativeSection() {
  const items = [
    { icon: Sparkles, title: "Smart Financial Assistant", desc: "Plain-English explanations of what your numbers mean." },
    { icon: ShieldCheck, title: "Financial Health Score", desc: "A live 0–100 score with actionable next steps." },
    { icon: Zap, title: "Beginner Mode", desc: "Replaces jargon: 'Assets' becomes 'What You Own'." },
    { icon: Bell, title: "Business Alerts", desc: "Low cash, expense spikes and profit drops — before they hurt." },
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">What makes us different</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Easier than Excel. Smarter than QuickBooks.</h2>
            <p className="mt-4 text-muted-foreground">Accubook isn't just software that stores numbers — it explains them, coaches you, and grows with your business.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {items.map((it) => (
                <div key={it.title} className="rounded-xl border border-border bg-card p-4 shadow-soft">
                  <div className="grid h-9 w-9 place-items-center rounded-lg gradient-emerald text-white">
                    <it.icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold">{it.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{it.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-8 shadow-elegant">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full gradient-brand text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Smart Assistant</p>
                <p className="text-xs text-muted-foreground">Analyzing October transactions…</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {[
                { tag: "Insight", color: "bg-primary/10 text-primary", text: "Your expenses increased by 18% this month, mostly in Transport." },
                { tag: "Good news", color: "bg-success/10 text-success", text: "Your business is profitable — net margin is 32%." },
                { tag: "Watch", color: "bg-warning/10 text-warning-foreground", text: "Cash balance is trending low — consider invoicing pending clients." },
              ].map((m, i) => (
                <div key={i} className="rounded-xl border border-border bg-card/80 p-4">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${m.color}`}>{m.tag}</span>
                  <p className="mt-2 text-sm">{m.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="border-y border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Testimonials</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Loved by founders and freelancers</h2>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <div className="flex gap-1 text-warning">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-4 text-sm leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full gradient-brand text-sm font-semibold text-white">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Pricing</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-muted-foreground">Start free. Upgrade when your business grows.</p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={`relative rounded-2xl border p-8 shadow-soft transition-all ${p.featured ? "border-primary bg-card shadow-elegant scale-[1.02]" : "border-border bg-card"}`}>
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-brand px-3 py-1 text-xs font-semibold text-white shadow-elegant">Most Popular</div>
              )}
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{p.price}</span>
                {p.period && <span className="text-sm text-muted-foreground">{p.period}</span>}
              </div>
              <Button asChild className={`mt-6 w-full ${p.featured ? "gradient-brand text-white hover:opacity-95" : ""}`} variant={p.featured ? "default" : "outline"}>
                <Link to="/register">{p.cta}</Link>
              </Button>
              <ul className="mt-8 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="border-y border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">FAQ</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Frequently asked questions</h2>
        </div>
        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-left text-base font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-brand p-12 text-center shadow-elegant">
          <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 80%, white 0, transparent 40%)" }} />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to clean up your books?</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">Join hundreds of small businesses running clearer, calmer finances with Accubook.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Link to="/register">Start Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">
                <a href="mailto:hello@accubook.app">Contact Sales</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand shadow-elegant">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">Accubook</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">Financial statements made simple. Built for the next generation of small businesses.</p>
          </div>
          {[
            { title: "Product", items: [["Features", "#features"], ["Pricing", "#pricing"], ["How It Works", "#how"]] },
            { title: "Company", items: [["About", "#"], ["Blog", "#"], ["Contact", "#contact"]] },
            { title: "Legal", items: [["Privacy", "#"], ["Terms", "#"], ["Security", "#"]] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-2">
                {col.items.map(([label, href]) => (
                  <li key={label}><a href={href} className="text-sm text-muted-foreground hover:text-foreground">{label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Accubook. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built for small businesses in Africa & beyond.</p>
        </div>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <InnovativeSection />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
