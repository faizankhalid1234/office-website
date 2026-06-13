import type { CurrencyCode } from "@/lib/currency";

export type QuickExpenseType = "fuel" | "tea" | "lunch";

export const QUICK_EXPENSE_TYPES = [
  {
    id: "fuel" as const,
    label: "Fuel / Petrol",
    subtitle: "Record fuel purchase",
    categoryName: "Petrol",
    color: "#ef4444",
    icon: "fuel",
  },
  {
    id: "tea" as const,
    label: "Tea & Snacks",
    subtitle: "Tea & refreshments",
    categoryName: "Tea & Refreshments",
    color: "#f59e0b",
    icon: "tea",
  },
  {
    id: "lunch" as const,
    label: "Lunch / Meals",
    subtitle: "Staff lunch & meals",
    categoryName: "Staff Lunch",
    color: "#f97316",
    icon: "lunch",
  },
] as const;

export const TEA_ITEMS = [
  "Tea",
  "Biscuits",
  "Samosa / Pakora",
  "Cold Drink",
  "Water Bottles",
  "Milk",
  "Sugar & Supplies",
  "Other Snacks",
] as const;

export const LUNCH_ITEMS = [
  "Staff Lunch",
  "Biryani",
  "Fast Food",
  "Lentil & Bread",
  "Catering",
  "Guest Lunch",
  "Other",
] as const;

export function buildFuelTitle(
  liters: string,
  total: string,
  currency: CurrencyCode = "PKR"
) {
  const l = parseFloat(liters);
  const t = parseFloat(total);
  const label = currency === "CLP" ? "CLP" : "Rs.";
  if (l > 0 && t > 0) return `Petrol - ${l} liters (${label} ${t})`;
  if (l > 0) return `Petrol - ${l} liters`;
  return "Petrol / Fuel";
}

export function buildFuelDescription(
  liters: string,
  ratePerLiter: string,
  note: string,
  currency: CurrencyCode = "PKR"
) {
  const parts: string[] = [];
  const l = parseFloat(liters);
  const r = parseFloat(ratePerLiter);
  const label = currency === "CLP" ? "CLP" : "Rs.";
  if (l > 0) parts.push(`Fuel: ${l} liters`);
  if (r > 0) parts.push(`Rate: ${label} ${r}/liter`);
  if (note.trim()) parts.push(note.trim());
  return parts.join(" | ");
}

export function calcFuelTotal(liters: string, ratePerLiter: string): string {
  const l = parseFloat(liters);
  const r = parseFloat(ratePerLiter);
  if (l > 0 && r > 0) return (l * r).toFixed(0);
  return "";
}

export function buildTeaTitle(item: string) {
  return item ? `Tea & Refreshments - ${item}` : "Tea & Refreshments";
}

export function buildLunchTitle(item: string, people: string) {
  const p = parseInt(people);
  const base = item || "Staff Lunch";
  return p > 0 ? `${base} (${p} people)` : base;
}
