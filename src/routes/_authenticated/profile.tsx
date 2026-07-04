import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/_authenticated/profile")({
  component: () => (
    <PlaceholderPage
      icon={User}
      title="Profile"
      description="Manage your name, avatar and personal preferences."
      features={["Name, email and avatar", "Change password", "Two-factor authentication"]}
    />
  ),
});
