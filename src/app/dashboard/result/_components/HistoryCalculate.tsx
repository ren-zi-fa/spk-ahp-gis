// components/MatrixTable.tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/card";

interface MatrixTableProps {
  title: string;
  headers: string[];
  data: number[][];
  rowLabels: string[];
  className?: string;
}

export default function MatrixTable({
  title,
  headers,
  data,
  rowLabels,
  className = "",
}: MatrixTableProps) {
  return (
    <Card className={`p-4 space-y-2 h-full ${className}`}>
      <h3 className="text-md font-semibold">{title}</h3>
      <div className="overflow-auto w-full h-full">
        <table className="table-auto border-collapse border w-full h-full text-sm text-center shadow rounded">
          <thead>
            <tr>
              <th className="border px-3 py-2 dark:bg-gray-500 bg-gray-100 font-semibold">
                #
              </th>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className="border dark:bg-gray-500 px-3 py-2 bg-gray-100 font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr key={rowIdx}>
                <td className="border px-3 py-2 font-medium">
                  {rowLabels[rowIdx]}
                </td>
                {row.map((val, colIdx) => (
                  <td key={colIdx} className="border px-3 py-2">
                    {val.toFixed(3)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
