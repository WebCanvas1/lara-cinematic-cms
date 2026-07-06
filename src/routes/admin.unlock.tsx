import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { unlockAdmin, checkAdminStatus } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/unlock")({
  ssr: false,
  beforeLoad: async () => {
    const { unlocked } = await checkAdminStatus();
    if (unlocked) {
      throw new (await import("@tanstack/react-router")).notFound(); // never; we redirect below in loader
    }
  },
  component: UnlockPage,
  head: () => ({ meta: [{ title: "Admin — Lara" }, { name: "robots", content: "noindex, nofollow" }] }),
});

function UnlockPage() {
  const unlock = useServerFn(unlockAdmin);
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const password = new FormData(e.currentTarget).get("password") as string;
    try {
      const { ok } = await unlock({ data: { password } });
      if (ok) {
        toast.success("Welcome back");
        navigate({ to: "/admin" });
      } else {
        toast.error("Incorrect password");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm border border-border bg-background p-10 text-center">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-mist">
          <Lock className="h-5 w-5 text-gold" />
        </div>
        <div className="font-serif text-2xl text-ink">Lara Admin</div>
        <p className="mt-2 text-sm text-muted-foreground">Enter your admin password to continue.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Password"
            className="w-full border border-border bg-transparent px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none"
          />
          <button
            type="submit" disabled={pending}
            className="w-full bg-ink px-6 py-3 text-[0.72rem] uppercase tracking-[0.28em] text-background hover:bg-gold disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}