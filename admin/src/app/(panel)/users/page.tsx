import { auth } from "@/auth";
import { AdminUsersManager } from "@/components/admin/admin-users-manager";
import { APP_LINKS } from "@/lib/app-urls";
import { serverApi } from "@/lib/server-api";

export default async function AdminUsersPage() {
  const session = await auth();

  const users = await serverApi<
    Array<{
      id: string;
      name: string;
      email: string;
      role: "ADMIN" | "EMPLOYEE";
      isActive: boolean;
      createdAt: string;
      _count: { expenses: number };
    }>
  >("/api/users");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300/80">Admin Site</p>
        <h1 className="mt-1 text-2xl font-bold text-white">User Management</h1>
        <p className="mt-2 text-sm text-violet-200/60">
          View all users, add accounts, change roles, resign (deactivate), or delete — like Django
          admin
        </p>
        <p className="mt-2 text-xs text-violet-300/40 font-mono">{APP_LINKS.adminLogin()}</p>
      </div>
      <AdminUsersManager
        users={users.map((u) => ({
          ...u,
          createdAt: u.createdAt,
        }))}
        currentUserId={session?.user?.id ?? ""}
      />
    </div>
  );
}
