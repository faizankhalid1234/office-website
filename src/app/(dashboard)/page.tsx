import { StatCard } from "@/components/dashboard/stat-card";
import { BudgetProgress } from "@/components/dashboard/budget-progress";
import { CategoryPieChart, MonthlyBarChart } from "@/components/dashboard/charts";
import { RecentExpenses } from "@/components/dashboard/recent-expenses";
import { QuickExpenseWrapper } from "@/components/dashboard/quick-expense-wrapper";
import { InsightCards } from "@/components/dashboard/insight-cards";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import { SectionHeader } from "@/components/dashboard/section-header";
import { getExpenseStats } from "@/lib/expense-service";
import { auth } from "@/auth";
import { formatCurrency } from "@/lib/utils-format";
import { Sparkles, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default async function DashboardPage() {
  const [stats, session] = await Promise.all([getExpenseStats(), auth()]);

  const monthChange =
    stats.lastMonthTotal > 0
      ? ((stats.totals.month - stats.lastMonthTotal) / stats.lastMonthTotal) * 100
      : 0;

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";
  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <div className="space-y-8 pb-4">
      {/* ── 1. HERO BANNER ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-6 text-white shadow-2xl shadow-indigo-500/25 md:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 left-1/3 h-32 w-32 rounded-full bg-violet-400/20 blur-2xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-indigo-100">
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span className="text-sm font-medium">{today}</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              Welcome back, {firstName}!
            </h1>
            <p className="mt-1.5 text-sm text-indigo-100/80 max-w-lg">
              Full overview of office expenses — fuel, tea, lunch, rent &amp; more
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs border border-white/20">
              <Calendar className="h-3 w-3" />
              Role: {session?.user?.role ?? "Employee"}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm border border-white/20">
              <p className="text-[11px] text-indigo-100 uppercase tracking-wide">This Month</p>
              <p className="text-xl font-extrabold mt-0.5">{formatCurrency(stats.totals.month)}</p>
            </div>
            <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm border border-white/20">
              <p className="text-[11px] text-indigo-100 uppercase tracking-wide flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> vs Last Month
              </p>
              <p className="text-xl font-extrabold mt-0.5">
                {monthChange >= 0 ? "+" : ""}{monthChange.toFixed(1)}%
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm border border-white/20">
              <p className="text-[11px] text-indigo-100 uppercase tracking-wide">This Year</p>
              <p className="text-xl font-extrabold mt-0.5">{formatCurrency(stats.totals.year)}</p>
            </div>
            <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm border border-white/20">
              <p className="text-[11px] text-indigo-100 uppercase tracking-wide">Transactions</p>
              <p className="text-xl font-extrabold mt-0.5">{stats.monthCount}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. QUICK ADD ── */}
      <section>
        <SectionHeader
          title="Quick Add"
          description="Fuel, tea & lunch — add in seconds"
        />
        <QuickExpenseWrapper compact />
      </section>

      {/* ── 3. EXPENSE TOTALS ── */}
      <section>
        <SectionHeader
          title="Expense Totals"
          description="Today, week, month & year spending"
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Today" value={stats.totals.today} icon="calendar" gradient="bg-gradient-to-br from-blue-500 to-cyan-500" index={0} />
          <StatCard title="This Week" value={stats.totals.week} icon="trending" gradient="bg-gradient-to-br from-violet-500 to-purple-500" index={1} />
          <StatCard title="This Month" value={stats.totals.month} icon="wallet" trend={`${monthChange >= 0 ? "+" : ""}${monthChange.toFixed(1)}% vs last month`} gradient="bg-gradient-to-br from-emerald-500 to-teal-500" index={2} />
          <StatCard title="This Year" value={stats.totals.year} icon="receipt" gradient="bg-gradient-to-br from-orange-500 to-amber-500" index={3} />
        </div>
      </section>

      {/* ── 4. INSIGHTS ── */}
      <section>
        <SectionHeader title="Key Insights" description="Summary at a glance" />
        <InsightCards
          monthCount={stats.monthCount}
          highestCategory={stats.highestCategory}
          monthTotal={stats.totals.month}
          lastMonthTotal={stats.lastMonthTotal}
          budgetRemaining={stats.budget?.remaining ?? null}
        />
      </section>

      {/* ── 5. CHARTS ── */}
      <section>
        <SectionHeader
          title="Analytics"
          description="Monthly trends & category distribution"
          action={
            <Link href="/reports" className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
              Full Reports →
            </Link>
          }
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <MonthlyBarChart data={stats.monthlyData} />
          <CategoryPieChart data={stats.categoryData} />
        </div>
      </section>

      {/* ── 6. CATEGORY TABLE + BUDGET + RECENT ── */}
      <section>
        <SectionHeader
          title="Details"
          description="Category breakdown, budget & recent transactions"
        />
        <div className="grid gap-6 xl:grid-cols-12">
          {/* Category breakdown — 5 cols */}
          <div className="xl:col-span-5 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">
              Category Breakdown
            </h3>
            <CategoryBreakdown data={stats.categoryData} total={stats.totals.month} />
          </div>

          {/* Budget + Recent — 7 cols */}
          <div className="xl:col-span-7 space-y-6">
            {stats.budget ? (
              <BudgetProgress
                amount={stats.budget.amount}
                used={stats.budget.used}
                remaining={stats.budget.remaining}
                percentage={stats.budget.percentage}
              />
            ) : (
              <div className="glass-card flex flex-col items-center justify-center gap-2 p-8 text-center">
                <p className="font-semibold">No Budget Set</p>
                <p className="text-xs text-muted-foreground">Admin can set monthly budget</p>
                <Link href="/budget" className="mt-2 text-xs font-semibold text-indigo-600 hover:underline">
                  Set Budget →
                </Link>
              </div>
            )}
            <RecentExpenses expenses={stats.recentExpenses} />
          </div>
        </div>
      </section>
    </div>
  );
}
