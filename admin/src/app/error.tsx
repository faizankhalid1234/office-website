"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isBackend = error.message.includes("backend") || error.message.includes("port 5000");

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-xl font-bold text-white">Admin panel error</h1>
      <p className="max-w-md text-sm text-violet-200/70">
        {isBackend
          ? "Start backend first: npm run dev (from office-expense folder)"
          : error.message}
      </p>
      <div className="flex gap-2">
        <Button onClick={reset}>Retry</Button>
        <Link
          href="/login"
          className="inline-flex h-9 items-center justify-center rounded-lg border border-violet-500/30 px-4 text-sm text-violet-200 hover:bg-white/5"
        >
          Admin login
        </Link>
      </div>
    </div>
  );
}
