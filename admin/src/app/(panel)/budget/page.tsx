import { AdminBudgetManager } from "@/components/admin/admin-budget-manager";
import { serverApi } from "@/lib/server-api";

export default async function AdminBudgetPage() {
  const [budgetData, history] = await Promise.all([
    serverApi<{
      budget: { amount: number; currency: string } | null;
      used: number;
      remaining: number;
      percentage: number;
      month: number;
      year: number;
    }>("/api/budget"),
    serverApi<
      Array<{ id: string; month: number; year: number; amount: number; currency: string }>
    >("/api/budget/history"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300/80">
          Admin Site
        </p>
        <h1 className="mt-1 text-2xl font-bold text-white">Company Budget</h1>
        <p className="mt-2 text-sm text-violet-200/60">
          Set the monthly company budget here. The employee website updates automatically.
        </p>
      </div>

      <AdminBudgetManager
        current={{
          month: budgetData.month,
          year: budgetData.year,
          amount: budgetData.budget?.amount ?? 0,
          used: budgetData.used,
          remaining: budgetData.remaining,
          percentage: budgetData.percentage,
          currency: (budgetData.budget?.currency as "PKR" | "CLP" | undefined) ?? "PKR",
        }}
        history={history.map((b) => ({
          ...b,
          currency: b.currency as "PKR" | "CLP",
        }))}
      />
    </div>
  );
}
