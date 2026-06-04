"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type CategoryChartProps = {
  data: Array<{ name: string; value: number }>;
};

const COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#14b8a6", // teal
];

export function CategoryChart({ data }: CategoryChartProps) {
  if (data.length === 0) {
    return <div className="flex h-[300px] items-center justify-center text-sm text-gray-500">No data to display</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => (percent ? `${name}: ${(percent * 100).toFixed(0)}%` : name)}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => (typeof value === "number" ? `₹${value.toFixed(2)}` : "")} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
