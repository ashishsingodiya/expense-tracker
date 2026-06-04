"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type CategoryBarChartProps = {
  data: Array<{ category: string; amount: number; count: number }>;
};

export function CategoryBarChart({ data }: CategoryBarChartProps) {
  if (data.length === 0) {
    return <div className="flex h-[300px] items-center justify-center text-sm text-gray-500">No data to display</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip formatter={(value) => (typeof value === "number" ? `₹${value.toFixed(2)}` : "")} contentStyle={{ borderRadius: "8px" }} />
        <Legend />
        <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
