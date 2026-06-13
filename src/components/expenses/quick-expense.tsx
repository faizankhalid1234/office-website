"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Fuel, Coffee, UtensilsCrossed, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PAYMENT_METHODS } from "@/lib/constants";
import { CurrencySelect } from "@/components/currency/currency-select";
import { CurrencyAmount } from "@/components/currency/currency-amount";
import { useInputCurrency } from "@/components/currency/currency-provider";
import {
  petrolRateForCurrency,
  type CurrencyCode,
} from "@/lib/currency";
import {
  QUICK_EXPENSE_TYPES,
  TEA_ITEMS,
  LUNCH_ITEMS,
  type QuickExpenseType,
  buildFuelTitle,
  buildFuelDescription,
  calcFuelTotal,
  buildTeaTitle,
  buildLunchTitle,
} from "@/lib/quick-expense";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  color: string;
}

const ICONS = {
  fuel: Fuel,
  tea: Coffee,
  lunch: UtensilsCrossed,
};

interface QuickExpenseProps {
  categories: Category[];
  compact?: boolean;
}

export function QuickExpense({ categories, compact = false }: QuickExpenseProps) {
  const router = useRouter();
  const { inputCurrency, setInputCurrency } = useInputCurrency();
  const [activeType, setActiveType] = useState<QuickExpenseType | null>(null);
  const [loading, setLoading] = useState(false);

  const [fuel, setFuel] = useState({
    liters: "",
    ratePerLiter: "",
    totalAmount: "",
    note: "",
    paymentMethod: "CASH",
    date: format(new Date(), "yyyy-MM-dd"),
    currency: inputCurrency,
  });

  const [tea, setTea] = useState({
    item: TEA_ITEMS[0],
    amount: "",
    note: "",
    paymentMethod: "CASH",
    date: format(new Date(), "yyyy-MM-dd"),
    currency: inputCurrency,
  });

  const [lunch, setLunch] = useState({
    item: LUNCH_ITEMS[0],
    amount: "",
    people: "",
    note: "",
    paymentMethod: "CASH",
    date: format(new Date(), "yyyy-MM-dd"),
    currency: inputCurrency,
  });

  function getCategoryId(name: string) {
    return categories.find((c) => c.name === name)?.id ?? "";
  }

  async function submitExpense(data: {
    title: string;
    amount: number;
    currency: CurrencyCode;
    categoryId: string;
    description?: string;
    paymentMethod: string;
    date: string;
  }) {
    setLoading(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to save");
      toast.success("Expense added!");
      setActiveType(null);
      resetForms();
      router.refresh();
      if (!compact) router.push("/expenses");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  function resetForms() {
    const today = format(new Date(), "yyyy-MM-dd");
    const rate = String(petrolRateForCurrency(inputCurrency));
    setFuel({
      liters: "",
      ratePerLiter: rate,
      totalAmount: "",
      note: "",
      paymentMethod: "CASH",
      date: today,
      currency: inputCurrency,
    });
    setTea({
      item: TEA_ITEMS[0],
      amount: "",
      note: "",
      paymentMethod: "CASH",
      date: today,
      currency: inputCurrency,
    });
    setLunch({
      item: LUNCH_ITEMS[0],
      amount: "",
      people: "",
      note: "",
      paymentMethod: "CASH",
      date: today,
      currency: inputCurrency,
    });
  }

  function openQuickType(type: QuickExpenseType) {
    if (type === "fuel") {
      const rate = String(petrolRateForCurrency(inputCurrency));
      setFuel((prev) => ({
        ...prev,
        currency: inputCurrency,
        ratePerLiter: prev.ratePerLiter || rate,
      }));
    } else if (type === "tea") {
      setTea((prev) => ({ ...prev, currency: inputCurrency }));
    } else {
      setLunch((prev) => ({ ...prev, currency: inputCurrency }));
    }
    setActiveType(type);
  }

  async function handleFuelSubmit(e: React.FormEvent) {
    e.preventDefault();
    const categoryId = getCategoryId("Petrol");
    if (!categoryId) return toast.error("Petrol category not found");
    const amount = parseFloat(fuel.totalAmount);
    if (!amount || amount <= 0) return toast.error("Total amount is required");

    await submitExpense({
      title: buildFuelTitle(fuel.liters, fuel.totalAmount, fuel.currency),
      amount,
      currency: fuel.currency,
      categoryId,
      description: buildFuelDescription(
        fuel.liters,
        fuel.ratePerLiter,
        fuel.note,
        fuel.currency
      ),
      paymentMethod: fuel.paymentMethod,
      date: fuel.date,
    });
  }

  async function handleTeaSubmit(e: React.FormEvent) {
    e.preventDefault();
    const categoryId = getCategoryId("Tea & Refreshments");
    if (!categoryId) return toast.error("Tea category not found");
    const amount = parseFloat(tea.amount);
    if (!amount || amount <= 0) return toast.error("Amount is required");

    await submitExpense({
      title: buildTeaTitle(tea.item),
      amount,
      currency: tea.currency,
      categoryId,
      description: tea.note || `${tea.item} - office tea/snacks`,
      paymentMethod: tea.paymentMethod,
      date: tea.date,
    });
  }

  async function handleLunchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const categoryId = getCategoryId("Staff Lunch");
    if (!categoryId) return toast.error("Lunch category not found");
    const amount = parseFloat(lunch.amount);
    if (!amount || amount <= 0) return toast.error("Amount is required");

    const desc = [
      lunch.item,
      lunch.people ? `${lunch.people} people` : "",
      lunch.note,
    ]
      .filter(Boolean)
      .join(" | ");

    await submitExpense({
      title: buildLunchTitle(lunch.item, lunch.people),
      amount,
      currency: lunch.currency,
      categoryId,
      description: desc,
      paymentMethod: lunch.paymentMethod,
      date: lunch.date,
    });
  }

  const fuelCalc =
    fuel.liters && fuel.ratePerLiter
      ? parseFloat(calcFuelTotal(fuel.liters, fuel.ratePerLiter) || "0")
      : 0;

  return (
    <>
      <div className={cn(compact ? "soft-card p-4" : "soft-card p-5 md:p-6")}>
        {!compact && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">Quick Add</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Fuel, tea, or lunch — tap to add
            </p>
          </div>
        )}
        <div
          className={cn(
            "grid gap-2 sm:gap-3",
            compact
              ? "grid-cols-1 min-[400px]:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-3"
          )}
        >
          {QUICK_EXPENSE_TYPES.map((type, i) => {
            const Icon = ICONS[type.icon as keyof typeof ICONS];
            return (
              <motion.button
                key={type.id}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => openQuickType(type.id)}
                className="flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-2xl border border-border/40 bg-muted/20 p-3 text-center transition hover:border-indigo-300/50 hover:bg-indigo-50/50 sm:min-h-0 dark:hover:bg-indigo-500/10"
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm sm:h-12 sm:w-12"
                  style={{ backgroundColor: type.color }}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground sm:text-base">{type.label}</p>
                  {!compact && (
                    <p className="text-xs text-muted-foreground">{type.subtitle}</p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Fuel Dialog */}
      <Dialog open={activeType === "fuel"} onOpenChange={(o) => !o && setActiveType(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5 text-red-500" />
              Add Fuel Expense
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFuelSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Currency</Label>
              <CurrencySelect
                value={fuel.currency}
                onChange={(c) => {
                  setInputCurrency(c);
                  setFuel({
                    ...fuel,
                    currency: c,
                    ratePerLiter: String(petrolRateForCurrency(c)),
                  });
                }}
              />
              <p className="text-[10px] text-muted-foreground">
                Chile petrol: 1,596 CLP/L · 1 CLP = 0.31 PKR
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Liters</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="e.g. 20"
                  value={fuel.liters}
                  onChange={(e) => setFuel({ ...fuel, liters: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Rate / liter ({fuel.currency === "CLP" ? "CLP" : "PKR"})
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={
                    fuel.currency === "CLP" ? "e.g. 1596" : "e.g. 494"
                  }
                  value={fuel.ratePerLiter}
                  onChange={(e) => setFuel({ ...fuel, ratePerLiter: e.target.value })}
                />
              </div>
            </div>

            {fuelCalc > 0 && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-700 dark:text-red-400">
                <Calculator className="h-4 w-4 shrink-0" />
                <span className="min-w-0 flex-1">
                  Auto total:{" "}
                  <CurrencyAmount
                    amount={fuelCalc}
                    currency={fuel.currency}
                    size="sm"
                  />
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-auto h-7 shrink-0 text-xs"
                  onClick={() => setFuel({ ...fuel, totalAmount: fuelCalc.toString() })}
                >
                  Use this
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Label>
                Total Amount ({fuel.currency === "CLP" ? "CLP" : "PKR"}) *
              </Label>
              <Input
                type="number"
                min="1"
                required
                placeholder="Total fuel cost"
                value={fuel.totalAmount}
                onChange={(e) => setFuel({ ...fuel, totalAmount: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={fuel.date}
                  onChange={(e) => setFuel({ ...fuel, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Payment</Label>
                <Select
                  value={fuel.paymentMethod}
                  onValueChange={(v) => v && setFuel({ ...fuel, paymentMethod: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Note (optional)</Label>
              <Textarea
                placeholder="Vehicle number, pump name..."
                value={fuel.note}
                onChange={(e) => setFuel({ ...fuel, note: e.target.value })}
                rows={2}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Add Fuel Expense"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Tea Dialog */}
      <Dialog open={activeType === "tea"} onOpenChange={(o) => !o && setActiveType(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Coffee className="h-5 w-5 text-amber-500" />
              Tea & Snacks
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleTeaSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Currency</Label>
              <CurrencySelect
                value={tea.currency}
                onChange={(c) => {
                  setInputCurrency(c);
                  setTea({ ...tea, currency: c });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>What was purchased?</Label>
              <Select
                value={tea.item}
                onValueChange={(v) => v && setTea({ ...tea, item: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TEA_ITEMS.map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Amount ({tea.currency === "CLP" ? "CLP" : "PKR"}) *</Label>
              <Input
                type="number"
                min="1"
                required
                placeholder="Amount"
                value={tea.amount}
                onChange={(e) => setTea({ ...tea, amount: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={tea.date}
                  onChange={(e) => setTea({ ...tea, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Payment</Label>
                <Select
                  value={tea.paymentMethod}
                  onValueChange={(v) => v && setTea({ ...tea, paymentMethod: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Note (optional)</Label>
              <Textarea
                placeholder="Number of cups, purpose..."
                value={tea.note}
                onChange={(e) => setTea({ ...tea, note: e.target.value })}
                rows={2}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Add Tea Expense"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lunch Dialog */}
      <Dialog open={activeType === "lunch"} onOpenChange={(o) => !o && setActiveType(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-orange-500" />
              Lunch / Meals
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLunchSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Currency</Label>
              <CurrencySelect
                value={lunch.currency}
                onChange={(c) => {
                  setInputCurrency(c);
                  setLunch({ ...lunch, currency: c });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Meal type</Label>
              <Select
                value={lunch.item}
                onValueChange={(v) => v && setLunch({ ...lunch, item: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LUNCH_ITEMS.map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Number of people (optional)</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 5"
                  value={lunch.people}
                  onChange={(e) => setLunch({ ...lunch, people: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Amount ({lunch.currency === "CLP" ? "CLP" : "PKR"}) *</Label>
                <Input
                  type="number"
                  min="1"
                  required
                  placeholder="Amount"
                  value={lunch.amount}
                  onChange={(e) => setLunch({ ...lunch, amount: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={lunch.date}
                  onChange={(e) => setLunch({ ...lunch, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Payment</Label>
                <Select
                  value={lunch.paymentMethod}
                  onValueChange={(v) => v && setLunch({ ...lunch, paymentMethod: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Note (optional)</Label>
              <Textarea
                placeholder="Restaurant, guest lunch..."
                value={lunch.note}
                onChange={(e) => setLunch({ ...lunch, note: e.target.value })}
                rows={2}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Add Lunch Expense"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
