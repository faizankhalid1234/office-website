"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Loader2,
  Shield,
  Lock,
  Sparkles,
  ExternalLink,
  Users,
  KeyRound,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_PATHS, APP_LINKS } from "@/lib/app-urls";
import { apiPath } from "@/lib/api-config";
import { COMPANY_NAME } from "@/lib/constants";

export function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const email = form.email.trim().toLowerCase();

    try {
      let loginRes: Response;
      try {
        loginRes = await fetch(apiPath("/api/auth/login"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: form.password }),
        });
      } catch {
        toast.error(
          "Cannot reach backend API. Run: npm run dev (backend must be on port 5000)"
        );
        return;
      }

      const loginData = (await loginRes.json().catch(() => ({}))) as {
        error?: string;
        user?: { role: string };
      };

      if (!loginRes.ok) {
        toast.error(loginData.error ?? "Invalid email or password");
        return;
      }

      if (loginData.user?.role !== "ADMIN") {
        toast.error(
          "This portal is admin-only. Use the employee website to sign in."
        );
        return;
      }

      const result = await signIn("credentials", {
        email,
        password: form.password,
        redirect: false,
      });

      if (!result?.ok || result.error) {
        toast.error("Session could not be created. Try again.");
        return;
      }

      toast.success("Welcome to Admin Control Center");
      window.location.href = APP_PATHS.adminDashboard;
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-bg relative flex min-h-screen min-h-[100dvh] items-center justify-center overflow-hidden p-4">
      <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div
        className="admin-login-orb pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-violet-600/25 blur-3xl"
      />
      <div
        className="admin-login-orb pointer-events-none absolute -right-16 bottom-1/4 h-64 w-64 rounded-full bg-fuchsia-600/20 blur-3xl"
        style={{ animationDelay: "-3s" }}
      />

      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
          {/* Brand panel */}
          <div className="hidden lg:block space-y-8 px-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/20 ring-1 ring-violet-400/30">
                <Shield className="h-8 w-8 text-violet-300" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300/80">
                  Secure Portal
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Admin Control Center
                </h1>
              </div>
            </div>

            <p className="text-lg text-violet-100/70 leading-relaxed max-w-md">
              Separate admin site for {COMPANY_NAME}. Manage users, roles, and passwords —
              not the employee expense website.
            </p>

            <div className="space-y-3">
              {[
                { icon: Users, text: "Create & edit user accounts" },
                { icon: KeyRound, text: "Reset passwords & assign roles" },
                { icon: LayoutDashboard, text: "Admin-only dashboard & stats" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 rounded-xl border border-violet-500/10 bg-white/5 px-4 py-3"
                >
                  <item.icon className="h-4 w-4 text-violet-300" />
                  <span className="text-sm text-violet-100/80">{item.text}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-violet-300/50">
              Demo: admin@hhhusain.com / admin123
            </p>
          </div>

          {/* Login card */}
          <div className="admin-glow-card mx-auto w-full max-w-md p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20">
                <Shield className="h-6 w-6 text-violet-300" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-violet-300">
                  Admin only
                </p>
                <h2 className="text-lg font-bold text-white">Control Center</h2>
              </div>
            </div>

            <div className="mb-6 hidden lg:block">
              <div className="flex items-center gap-2 text-violet-300">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Admin sign in
                </span>
              </div>
              <h2 className="mt-2 text-2xl font-bold text-white">Enter admin credentials</h2>
              <p className="mt-1 text-sm text-violet-200/60">
                This is not the employee website login
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-violet-200/70">
                  Admin email
                </Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@company.com"
                  className="h-11 rounded-xl border-violet-500/20 bg-black/30 text-white placeholder:text-violet-300/30"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-violet-200/70">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-400/50" />
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-violet-500/20 bg-black/30 pl-10 text-white placeholder:text-violet-300/30"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-xl bg-violet-600 text-sm font-semibold text-white shadow-lg shadow-violet-900/50 hover:bg-violet-500"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Verifying..." : "Access Admin Panel"}
              </Button>
            </form>

            <div className="mt-6 rounded-xl border border-violet-500/10 bg-violet-950/40 p-3 text-center text-[11px] text-violet-200/60">
              <p className="font-medium text-violet-200/90">Employee website (port 3000)</p>
              <Link
                href={APP_LINKS.websiteLogin()}
                className="mt-1 inline-flex items-center gap-1 font-semibold text-violet-300 hover:text-violet-200 hover:underline"
              >
                {APP_LINKS.websiteLogin()}
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
