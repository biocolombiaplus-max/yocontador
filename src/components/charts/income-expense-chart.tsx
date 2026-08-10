"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatCOP } from "@/lib/money";

export type IncomeExpensePoint = {
  label: string;
  ingresos: number;
  gastos: number;
};

const COLORS = {
  ingresos: "#0ca30c",
  gastos: "#d03b3b",
  grid: "#e1e0d9",
  axis: "#c3c2b7",
  mutedText: "#898781",
};

export default function IncomeExpenseChart({ data }: { data: IncomeExpensePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: -4, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={COLORS.grid} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: COLORS.mutedText }}
          axisLine={{ stroke: COLORS.axis }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: COLORS.mutedText }}
          axisLine={false}
          tickLine={false}
          width={64}
          tickFormatter={(v) =>
            v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `${Math.round(v / 1000)}K` : v
          }
        />
        <Tooltip
          contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13 }}
          formatter={(value) => formatCOP(Number(value))}
        />
        <Legend
          verticalAlign="top"
          height={32}
          iconType="circle"
          wrapperStyle={{ fontSize: 12, color: COLORS.mutedText }}
        />
        <Bar dataKey="ingresos" name="Ingresos" fill={COLORS.ingresos} radius={[4, 4, 0, 0]} maxBarSize={28} />
        <Bar dataKey="gastos" name="Gastos" fill={COLORS.gastos} radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
