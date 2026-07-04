import { createFileRoute } from "@tanstack/react-router";
import { Receipt } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_authenticated/transactions")({
  component: () => (
    <PlaceholderPage
      icon={Receipt}
      title="Transactions"
      description="Record, categorize, search and import all business income and expenses."
      features={[
        "Add / edit / delete transactions with attachments",
        "Search and filter by date, category, business",
        "Import from CSV, export to CSV",
        "Automatic category suggestions",
      ]}
    />
  ),
});
