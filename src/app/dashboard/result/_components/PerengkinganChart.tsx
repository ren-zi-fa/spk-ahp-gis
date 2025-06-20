"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Alternatif } from "@/types"; // pastikan ini sesuai path kamu

export interface CompositeWeightChartProps {
  weights: number[];
  alternatifs: Alternatif[];
}

const COLORS = [
  "#4f46e5", "#10b981", "#f59e0b", "#ef4444",
  "#6366f1", "#14b8a6", "#f43f5e", "#3b82f6",
];

export default function CompositeWeightChart({
  weights,
  alternatifs,
}: CompositeWeightChartProps) {
  const data = weights.map((weight, index) => ({
    name: alternatifs[index]?.name ?? `A${index + 1}`,
    weight,
  }));

  return (
    <div className="mt-4">
      <h4 className="text-md font-medium mb-2">
        Visualisasi Bobot Alternatif (Composite Weight)
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          barGap={4}
          barCategoryGap="20%"
          margin={{ top: 16, right: 24, left: 8, bottom: 16 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="weight" name="Bobot">
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
