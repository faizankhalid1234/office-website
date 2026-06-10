"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileSpreadsheet, TrendingDown, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { CategoryPieChart, ExpenseTrendChart } from "@/components/dashboard/charts";
import { formatCurrency, formatDate } from "@/lib/utils-format";
import { exportToPDF, exportToExcel } from "@/lib/export";

interface ReportData {
  month: number;
  year: number;
  total: number;
  breakdown: { name: string; color?: string; total: number }[];
  highest: { name: string; total: number } | null;
  prevMonthTotal: number;
  comparison: number;
  expenses: {
    id: string;
    title: string;
    amount: number;
    date: Date | string;
    paymentMethod: string;
    category: { name: string };
  }[];
}

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export function ReportsView({
  initialReport,
  trendData,
  initialMonth,
  initialYear,
}: {
  initialReport: ReportData;
  trendData: { date: string; amount: number }[];
  initialMonth: number;
  initialYear: number;
}) {
  const [report, setReport] = useState(initialReport);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [loading, setLoading] = useState(false);

  async function fetchReport(m: number, y: number) {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?month=${m}&year=${y}`);
      const data = await res.json();
      if (res.ok) setReport(data);
    } finally {
      setLoading(false);
    }
  }

  function handlePeriodChange(m: number, y: number) {
    setMonth(m);
    setYear(y);
    fetchReport(m, y);
  }

  const pieData = report.breakdown.map((b, i) => ({
    name: b.name,
    value: b.total,
    color: b.color ?? `hsl(${i * 40}, 70%, 50%)`,
  }));

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <Select
            value={month.toString()}
            onValueChange={(v) => v && handlePeriodChange(parseInt(v), year)}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value.toString()}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={year.toString()}
            onValueChange={(v) => v && handlePeriodChange(month, parseInt(v))}
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportToPDF(report)}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => exportToExcel(report)}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading report...</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(report.total)}</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">vs Previous Month</p>
                  <div className="flex items-center gap-2 mt-1">
                    {report.comparison >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-red-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-green-500" />
                    )}
                    <p className="text-2xl font-bold">
                      {report.comparison >= 0 ? "+" : ""}
                      {report.comparison.toFixed(1)}%
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Prev: {formatCurrency(report.prevMonthTotal)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Highest Category</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <p className="text-lg font-bold">{report.highest?.name ?? "N/A"}</p>
                  </div>
                  {report.highest && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(report.highest.total)}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold mt-1">{report.expenses.length}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <CategoryPieChart data={pieData} />
            <ExpenseTrendChart data={trendData} />
          </div>

          <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-base">Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">% of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.breakdown.map((b) => (
                    <TableRow key={b.name}>
                      <TableCell className="font-medium">{b.name}</TableCell>
                      <TableCell className="text-right">{formatCurrency(b.total)}</TableCell>
                      <TableCell className="text-right">
                        {report.total > 0
                          ? ((b.total / report.total) * 100).toFixed(1)
                          : 0}
                        %
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-base">All Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.expenses.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>{formatDate(e.date)}</TableCell>
                      <TableCell>{e.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{e.category.name}</Badge>
                      </TableCell>
                      <TableCell>{e.paymentMethod}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(e.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
