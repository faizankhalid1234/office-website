import Link from "next/link";
import { Users, Shield, UserCircle, Receipt, ArrowRight } from "lucide-react";
import { auth } from "@/auth";
import { APP_PATHS, APP_LINKS } from "@/lib/app-urls";
import { serverApi } from "@/lib/server-api";

export default async function AdminDashboardPage() {
  const session = await auth();

  const overview = await serverApi<{
    userCount: number;
    adminCount: number;
    employeeCount: number;
    expenseCount: number;
  }>("/api/admin/overview");

  const stats = [
    { label: "Total Users", value: overview.userCount, icon: Users },
    { label: "Admins", value: overview.adminCount, icon: Shield },
    { label: "Employees", value: overview.employeeCount, icon: UserCircle },
    { label: "Total Expenses", value: overview.expenseCount, icon: Receipt },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300/80">
          Admin Control Center
        </p>
        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
          Welcome, {session?.user?.name?.split(" ")[0] ?? "Admin"}
        </h1>
        <p className="mt-2 text-sm text-violet-200/60">
          Separate admin backend — manage users &amp; system data
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="admin-stat-card">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-violet-200/60">{stat.label}</p>
                <Icon className="h-4 w-4 text-violet-400/60" />
              </div>
              <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="admin-glow-card p-6">
        <h2 className="text-lg font-semibold text-white">Quick actions</h2>
        <p className="mt-1 text-sm text-violet-200/60">Manage your team from this admin portal</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link
            href={APP_PATHS.adminUsers}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 hover:bg-violet-500 transition-colors"
          >
            <Users className="h-4 w-4" />
            Manage Users
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={APP_LINKS.websiteLogin()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-500/20 bg-white/5 px-4 py-3 text-sm font-medium text-violet-200 hover:bg-white/10 transition-colors"
          >
            Open Employee Website
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
