import { createFileRoute } from "@tanstack/react-router";
import { FolderDown } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_authenticated/reports")({
  component: () => (
    <PlaceholderPage
      icon={FolderDown}
      title="Reports"
      description="Monthly, quarterly, annual and custom reports — download, print or email."
      features={[
        "Monthly / quarterly / annual presets",
        "Custom date-range reports",
        "One-click PDF & Excel download",
        "Email directly from ClearLedger",
      ]}
    />
  ),
});
