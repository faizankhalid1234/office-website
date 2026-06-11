"use client";

import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils-format";
import { CHART_COLORS } from "@/lib/constants";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface MonthlyData {
  month: string;
  amount: number;
}

interface TrendData {
  date: string;
  amount: number;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border bg-card px-3 py-2 text-sm shadow-lg">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-bold text-foreground">{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

function ChartBox({
  title,
  subtitle,
  children,
  empty,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  empty?: boolean;
}) {
  return (
    <div className="soft-card flex h-full flex-col overflow-hidden">
      <div className="border-b border-border/40 px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {empty ? (
        <div className="flex flex-1 items-center justify-center py-16 text-sm text-muted-foreground">
          No data yet
        </div>
      ) : (
        <div className="flex-1 px-3 py-4">{children}</div>
      )}
    </div>
  );
}

export function CategoryPieChart({ data }: { data: CategoryData[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="h-full"
    >
      <ChartBox
        title="By Category"
        subtitle="This month's split"
        empty={!data.length}
      >
        {data.length > 0 && (
          <div className="relative">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  strokeWidth={0}
                >
                  {data.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color || CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-[10px] text-muted-foreground">Total</p>
              <p className="text-sm font-bold text-foreground">{formatCurrency(total)}</p>
            </div>
          </div>
        )}
      </ChartBox>
    </motion.div>
  );
}

export function MonthlyBarChart({ data }: { data: MonthlyData[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="h-full"
    >
      <ChartBox title="Monthly Trend" subtitle="Last 12 months">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              className="text-muted-foreground"
            />
            <YAxis
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              className="text-muted-foreground"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" fill="#818cf8" radius={[6, 6, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>
    </motion.div>
  );
}

export function ExpenseTrendChart({ data }: { data: TrendData[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="h-full"
    >
      <ChartBox title="Expense Trend" subtitle="Last 30 days" empty={!data.length}>
        {data.length > 0 && (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => d.slice(5)}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                className="text-muted-foreground"
              />
              <YAxis
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#818cf8"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, fill: "#6366f1" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartBox>
    </motion.div>
  );
}
