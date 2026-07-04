import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_authenticated/statements")({
  component: () => (
    <PlaceholderPage
      icon={FileText}
      title="Financial Statements"
      description="Auto-generated Income Statement, Balance Sheet, Cash Flow and Owner's Equity."
      features={[
        "Date range selector with quarterly / annual presets",
        "Beginner Mode: plain-English labels",
        "Export to PDF and Excel, or print",
        "Step-by-step statement wizard",
      ]}
    />
  ),
});
