import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_authenticated/settings")({
  component: () => (
    <PlaceholderPage
      icon={SettingsIcon}
      title="Settings"
      description="Currency, language, tax settings, categories, roles and dark mode."
      features={[
        "Notifications & preferences",
        "Currency & language",
        "Dark mode toggle",
        "Tax settings and categories",
        "User roles & permissions",
      ]}
    />
  ),
});
