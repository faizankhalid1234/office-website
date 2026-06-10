"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Wallet, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { BudgetProgress } from "@/components/dashboard/budget-progress";
import { formatCurrency } from "@/lib/utils-format";

interface BudgetData {
  month: number;
  year: number;
  amount: number;
  used: number;
  remaining: number;
  percentage: number;
}

interface BudgetHistory {
  id: string;
  month: number;
  year: number;
  amount: number;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function BudgetManager({
  current,
  history,
}: {
  current: BudgetData;
  history: BudgetHistory[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    month: current.month,
    year: current.year,
    amount: current.amount > 0 ? current.amount.toString() : "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: form.month,
          year: form.year,
          amount: parseFloat(form.amount),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Budget saved");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        {current.amount > 0 ? (
          <BudgetProgress
            amount={current.amount}
            used={current.used}
            remaining={current.remaining}
            percentage={current.percentage}
          />
        ) : (
          <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Wallet className="h-12 w-12 mb-3 opacity-50" />
              <p>No budget set for this month</p>
            </CardContent>
          </Card>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-base">Set Monthly Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Select
                      value={form.month.toString()}
                      onValueChange={(v) => v && setForm({ ...form, month: parseInt(v) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((m, i) => (
                          <SelectItem key={m} value={(i + 1).toString()}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input
                      type="number"
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                      min={2020}
                      max={2100}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Budget Amount (PKR)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="500000"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Saving..." : "Save Budget"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base">Budget History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Budget</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    No budget history
                  </TableCell>
                </TableRow>
              ) : (
                history.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      {MONTHS[b.month - 1]} {b.year}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(b.amount)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
