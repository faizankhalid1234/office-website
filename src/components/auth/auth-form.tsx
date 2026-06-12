"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Shield, BarChart3, Wallet, Sparkles } from "lucide-react";
import { CompanyLogo } from "@/components/brand/company-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COMPANY_NAME } from "@/lib/constants";

interface AuthFormProps {
  mode: "login" | "register";
}

const features = [
  { icon: Wallet, text: "Track fuel, tea & lunch expenses" },
  { icon: BarChart3, text: "Beautiful charts & reports" },
  { icon: Shield, text: "Secure admin panel" },
];

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
          throw new Error("Registration failed. Please try again.");
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Registration failed");

        const loginAfterRegister = await signIn("credentials", {
          email: form.email.trim().toLowerCase(),
          password: form.password,
          redirect: false,
        });

        if (loginAfterRegister?.ok) {
          toast.success("Account created! Welcome!");
          window.location.href = "/dashboard";
          return;
        }

        toast.success("Account created! Please sign in.");
        router.push("/auth/login");
        return;
      }

      const result = await signIn("credentials", {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        redirect: false,
      });

      if (!result) {
        toast.error("Login failed. Please try again.");
        return;
      }

      if (result.error) {
        toast.error(
          result.error === "CredentialsSignin"
            ? "Invalid email or password"
            : "Login failed. Check your connection and try again."
        );
        return;
      }

      if (!result.ok) {
        toast.error("Login failed. Please try again.");
        return;
      }

      toast.success("Welcome back!");
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left — Brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-10 bottom-20 h-60 w-60 rounded-full bg-violet-400/20 blur-3xl" />

        <div className="relative">
          <CompanyLogo size="xl" subtitle="Expense Manager" variant="light" />
        </div>

        <div className="relative space-y-8">
          <div>
            <p className="text-sm text-indigo-100/90">
              Smart office expense management for your team
            </p>
          </div>

          <div className="space-y-4">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-indigo-100">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 border border-white/10">
                  <f.icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-indigo-200/50">
          © 2026 {COMPANY_NAME}. All rights reserved.
        </p>
      </div>

      {/* Right — Form */}
      <div className="mesh-bg flex flex-1 items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-4 flex justify-center lg:hidden">
              <CompanyLogo size="md" subtitle="Expense Manager" />
            </div>
            <div className="mb-2 flex items-center gap-2 justify-center lg:justify-start">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {mode === "login" ? "Welcome back" : "Get started"}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              {mode === "login" ? "Sign in to your account" : "Create your account"}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {mode === "login"
                ? "Enter your credentials to access the dashboard"
                : "Set your name, email & password"}
            </p>
          </div>

          <div className="glass-card p-5 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="h-10 rounded-xl border-border/60 bg-background/50 text-sm"
                    required
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                  className="h-10 rounded-xl border-border/60 bg-background/50 text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="h-10 rounded-xl border-border/60 bg-background/50 text-sm"
                  minLength={6}
                  required
                />
              </div>
              <Button
                type="submit"
                className="h-10 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-xs font-semibold shadow-lg shadow-indigo-500/30 hover:from-indigo-500 hover:to-violet-500"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading
                  ? mode === "login" ? "Signing in..." : "Creating account..."
                  : mode === "login" ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/register" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
                    Register
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link href="/auth/login" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
                    Sign in
                  </Link>
                </>
              )}
            </p>

            {mode === "login" && (
              <div className="mt-4 rounded-2xl bg-indigo-50/80 p-3 text-[11px] text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                <p className="font-semibold mb-1">Demo Login</p>
                <p>admin@hhhusain.com / admin123</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
