"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  UserMinus,
  UserCheck,
  Search,
  Shield,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  isActive: boolean;
  createdAt: string;
  _count: { expenses: number };
}

type BulkAction = "activate" | "deactivate" | "set_admin" | "set_employee" | "delete";

interface AdminUsersManagerProps {
  users: UserRow[];
  currentUserId: string;
}

export function AdminUsersManager({ users: initial, currentUserId }: AdminUsersManagerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "EMPLOYEE">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<BulkAction>("activate");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE" as "ADMIN" | "EMPLOYEE",
    isActive: true,
  });

  const stats = useMemo(() => {
    const active = initial.filter((u) => u.isActive).length;
    const admins = initial.filter((u) => u.role === "ADMIN").length;
    return { total: initial.length, active, inactive: initial.length - active, admins };
  }, [initial]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return initial.filter((user) => {
      if (roleFilter !== "ALL" && user.role !== roleFilter) return false;
      if (statusFilter === "ACTIVE" && !user.isActive) return false;
      if (statusFilter === "INACTIVE" && user.isActive) return false;
      if (!q) return true;
      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q)
      );
    });
  }, [initial, search, roleFilter, statusFilter]);

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((u) => selected.has(u.id));

  function toggleSelectAll() {
    if (allFilteredSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((u) => next.delete(u.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((u) => next.add(u.id));
        return next;
      });
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: "", email: "", password: "", role: "EMPLOYEE", isActive: true });
    setOpen(true);
  }

  function openEdit(user: UserRow) {
    setEditing(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      isActive: user.isActive,
    });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const path = editing ? `/api/users/${editing.id}` : "/api/users";
      const method = editing ? "PUT" : "POST";

      const body = editing
        ? {
            name: form.name,
            email: form.email,
            role: form.role,
            isActive: form.isActive,
            ...(form.password ? { password: form.password } : {}),
          }
        : form;

      const result = await apiFetch(path, {
        method,
        body: JSON.stringify(body),
      });

      if (!result.ok) throw new Error(result.error);

      toast.success(editing ? "User updated" : "User created");
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleActive(user: UserRow) {
    if (user.id === currentUserId) {
      toast.error("You cannot deactivate your own account");
      return;
    }

    try {
      const result = await apiFetch(`/api/users/${user.id}/toggle-active`, {
        method: "PATCH",
      });
      if (!result.ok) throw new Error(result.error);
      toast.success(user.isActive ? "User resigned (deactivated)" : "User activated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Permanently delete this user? Their expenses will also be removed.")) return;

    try {
      const result = await apiFetch(`/api/users/${id}`, { method: "DELETE" });
      if (!result.ok) throw new Error(result.error);
      toast.success("User deleted");
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  async function handleBulkApply() {
    if (selected.size === 0) {
      toast.error("Select at least one user");
      return;
    }

    const ids = Array.from(selected);
    if (bulkAction === "delete") {
      if (!confirm(`Permanently delete ${ids.length} user(s)? This cannot be undone.`)) return;
    }

    setLoading(true);
    try {
      const result = await apiFetch("/api/users/bulk", {
        method: "POST",
        body: JSON.stringify({ ids, action: bulkAction }),
      });
      if (!result.ok) throw new Error(result.error);

      const labels: Record<BulkAction, string> = {
        activate: "Users activated",
        deactivate: "Users resigned (deactivated)",
        set_admin: "Users set as Admin",
        set_employee: "Users set as Employee",
        delete: "Users deleted",
      };
      toast.success(labels[bulkAction]);
      setSelected(new Set());
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bulk action failed");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(value: string) {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="admin-glow-card border-violet-500/20 bg-card/40">
          <CardContent className="flex items-center gap-3 p-4">
            <Users className="h-5 w-5 text-violet-400" />
            <div>
              <p className="text-xs text-violet-200/60">Total users</p>
              <p className="text-xl font-bold text-white">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="admin-glow-card border-emerald-500/20 bg-card/40">
          <CardContent className="flex items-center gap-3 p-4">
            <UserCheck className="h-5 w-5 text-emerald-400" />
            <div>
              <p className="text-xs text-violet-200/60">Active</p>
              <p className="text-xl font-bold text-white">{stats.active}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="admin-glow-card border-amber-500/20 bg-card/40">
          <CardContent className="flex items-center gap-3 p-4">
            <UserMinus className="h-5 w-5 text-amber-400" />
            <div>
              <p className="text-xs text-violet-200/60">Resigned / inactive</p>
              <p className="text-xl font-bold text-white">{stats.inactive}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="admin-glow-card border-violet-500/20 bg-card/40">
          <CardContent className="flex items-center gap-3 p-4">
            <Shield className="h-5 w-5 text-violet-400" />
            <div>
              <p className="text-xs text-violet-200/60">Admins</p>
              <p className="text-xl font-bold text-white">{stats.admins}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-300/50" />
            <Input
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-violet-500/20 bg-card/40"
            />
          </div>
          <Select
            value={roleFilter}
            onValueChange={(v) => {
              if (v) setRoleFilter(v as typeof roleFilter);
            }}
          >
            <SelectTrigger className="w-full sm:w-[140px] border-violet-500/20 bg-card/40">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="EMPLOYEE">Employee</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              if (v) setStatusFilter(v as typeof statusFilter);
            }}
          >
            <SelectTrigger className="w-full sm:w-[140px] border-violet-500/20 bg-card/40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={openCreate}
          className="w-full min-h-11 sm:w-auto bg-violet-600 hover:bg-violet-500 text-white shadow-violet-900/40"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {selected.size > 0 && (
        <Card className="admin-glow-card border-violet-500/30 bg-violet-950/30">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <p className="text-sm text-violet-200/80">
              <span className="font-semibold text-white">{selected.size}</span> selected
            </p>
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
              <Select
                value={bulkAction}
                onValueChange={(v) => {
                  if (v) setBulkAction(v as BulkAction);
                }}
              >
                <SelectTrigger className="w-full sm:w-[200px] border-violet-500/20 bg-card/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activate">Activate selected</SelectItem>
                  <SelectItem value="deactivate">Resign / deactivate selected</SelectItem>
                  <SelectItem value="set_admin">Set as Admin</SelectItem>
                  <SelectItem value="set_employee">Set as Employee</SelectItem>
                  <SelectItem value="delete">Delete selected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleBulkApply}
                disabled={loading}
                className="bg-violet-600 hover:bg-violet-500"
              >
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="admin-glow-card border-violet-500/20 bg-card/40">
        <CardContent className="p-0">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-violet-500/40 accent-violet-600"
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expenses</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No users match your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((user) => (
                    <TableRow
                      key={user.id}
                      className={!user.isActive ? "opacity-60" : undefined}
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selected.has(user.id)}
                          onChange={() => toggleSelect(user.id)}
                          className="h-4 w-4 rounded border-violet-500/40 accent-violet-600"
                          aria-label={`Select ${user.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.isActive ? "default" : "secondary"}
                          className={
                            user.isActive
                              ? "bg-emerald-600/80 hover:bg-emerald-600"
                              : "bg-amber-600/60"
                          }
                        >
                          {user.isActive ? "Active" : "Resigned"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user._count.expenses}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(user)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleActive(user)}
                            disabled={user.id === currentUserId}
                            title={user.isActive ? "Resign / deactivate" : "Activate"}
                          >
                            {user.isActive ? (
                              <UserMinus className="h-4 w-4 text-amber-500" />
                            ) : (
                              <UserCheck className="h-4 w-4 text-emerald-500" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(user.id)}
                            disabled={user.id === currentUserId}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="divide-y divide-border/40 md:hidden">
            {filtered.map((user) => (
              <div
                key={user.id}
                className={`flex items-center gap-3 px-4 py-3 ${!user.isActive ? "opacity-60" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={selected.has(user.id)}
                  onChange={() => toggleSelect(user.id)}
                  className="h-4 w-4 shrink-0 rounded accent-violet-600"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-sm">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {user.role} · {user.isActive ? "Active" : "Resigned"} ·{" "}
                    {user._count.expenses} expenses
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => openEdit(user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => handleToggleActive(user)}
                    disabled={user.id === currentUserId}
                  >
                    {user.isActive ? (
                      <UserMinus className="h-4 w-4 text-amber-500" />
                    ) : (
                      <UserCheck className="h-4 w-4 text-emerald-500" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => handleDelete(user.id)}
                    disabled={user.id === currentUserId}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-violet-300/50">
        Django-style: deactivate (resign) blocks login without deleting data. Delete permanently
        removes the user and their expenses.
      </p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit User" : "Add User"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{editing ? "New Password (optional)" : "Password"}</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!editing}
                minLength={6}
                placeholder={editing ? "Leave blank to keep current" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(value) => {
                  if (value) setForm({ ...form, role: value });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMPLOYEE">Employee</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
              <div>
                <Label htmlFor="isActive">Active account</Label>
                <p className="text-xs text-muted-foreground">
                  Off = resigned; user cannot log in
                </p>
              </div>
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
                disabled={editing?.id === currentUserId && form.isActive}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-500">
                {loading ? "Saving..." : editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
