import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User as UserIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your personal info.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full gradient-brand text-lg font-bold text-white shadow-elegant">
            {(name || user?.email || "?").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold">{name || "Your name"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "recently"}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="n">Full name</Label>
            <Input id="n" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="e">Email</Label>
            <Input id="e" value={user?.email ?? ""} disabled className="mt-1.5" />
            <p className="mt-1 text-xs text-muted-foreground">Email is your login and cannot be changed in local mode.</p>
          </div>
          <Button className="gap-2 gradient-brand text-white hover:opacity-95" onClick={() => toast.success("Profile updated locally")}>
            <Save className="h-4 w-4" /> Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
