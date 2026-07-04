import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_authenticated/businesses")({
  component: () => (
    <PlaceholderPage
      icon={Building2}
      title="Businesses"
      description="Manage multiple businesses from one account and switch instantly."
      features={[
        "Business logo, currency and tax info",
        "Financial year & business type",
        "Fast switcher across the whole app",
      ]}
    />
  ),
});
