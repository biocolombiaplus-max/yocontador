"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export type TrendPoint = {
  label: string;
  facebook: number;
  instagram: number;
};

const CHROME = {
  grid: "#e1e0d9",
  axis: "#c3c2b7",
  mutedText: "#898781",
};

const SERIES = {
  facebook: "#2a78d6",
  instagram: "#1baf7a",
};

export default function FollowersTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={CHROME.grid} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: CHROME.mutedText }}
          axisLine={{ stroke: CHROME.axis }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: CHROME.mutedText }}
          axisLine={false}
          tickLine={false}
          width={44}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            fontSize: 13,
          }}
        />
        <Legend
          verticalAlign="top"
          height={32}
          iconType="circle"
          wrapperStyle={{ fontSize: 12, color: CHROME.mutedText }}
        />
        <Line
          type="monotone"
          dataKey="facebook"
          name="Facebook"
          stroke={SERIES.facebook}
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="instagram"
          name="Instagram"
          stroke={SERIES.instagram}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
