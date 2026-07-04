import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_authenticated/help")({
  component: () => (
    <PlaceholderPage
      icon={HelpCircle}
      title="Help & Learning Center"
      description="Explain Profit, Cash Flow, Assets, Liabilities and Equity in simple language."
      features={[
        "Beginner-friendly guides",
        "Video walkthroughs",
        "FAQ and troubleshooting",
        "Contact support",
      ]}
    />
  ),
});
