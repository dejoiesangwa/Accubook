import { createFileRoute } from "@tanstack/react-router";
import { LineChart } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_authenticated/analytics")({
  component: () => (
    <PlaceholderPage
      icon={LineChart}
      title="Analytics"
      description="Interactive insights, trends and your live Business Health Score."
      features={[
        "Monthly revenue and expense trends",
        "Profit margin & growth percentage",
        "Top expenses breakdown",
        "AI-powered recommendations",
      ]}
    />
  ),
});
