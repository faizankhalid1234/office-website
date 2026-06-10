import {
  LayoutDashboard,
  Receipt,
  Tags,
  FileBarChart,
  Wallet,
  Settings,
  PlusCircle,
} from "lucide-react";

export const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/expenses/add", label: "Add Expense", icon: PlusCircle, highlight: true },
  { href: "/categories", label: "Categories", icon: Tags, adminOnly: true },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/budget", label: "Budget", icon: Wallet, adminOnly: true },
  { href: "/settings", label: "Settings", icon: Settings, adminOnly: true },
] as const;
