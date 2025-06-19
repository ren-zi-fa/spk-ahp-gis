"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DataField = {
  name: string;
  id: string;
};
interface IMatrixTable {
  title: string;
  name: string;
  cells: DataField[];
}

export const MatrixTable: React.FC<IMatrixTable> = ({ title, name, cells }) => {
  const { register } = useFormContext();

  const options = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "1/2",
    "1/3",
    "1/4",
    "1/5",
    "1/6",
    "1/7",
    "1/8",
    "1/9",
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-center text-lg font-semibold">{title}</h2>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="border border-gray-300">
            <TableHeader>
              <TableRow>
                <TableCell className="text-center font-semibold">#</TableCell>
                {cells.map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="text-center font-semibold border-l border-gray-200"
                  >
                    {cell.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {cells.map((cellRow, i) => (
                <TableRow key={cellRow.id}>
                  <TableCell className="font-semibold">
                    {cellRow.name}
                  </TableCell>
                  {cells.map((cellCol, j) => (
                    <TableCell
                      key={cellCol.id}
                      className="text-center border-l border-gray-200"
                    >
                      {i === j ? (
                        <>
                          <input
                            type="hidden"
                            value="1"
                            {...register(`${name}.${i}.${j}`, {
                              required: true,
                            })}
                          />
                          <span className="inline-block bg-red-500 text-white px-2 py-1 rounded">
                            1
                          </span>
                        </>
                      ) : (
                        <select
                          {...register(`${name}.${i}.${j}`, { required: true })}
                          onChange={(e) => {
                            const value = e.target.value;
                            const reciprocalValue = value.includes("/")
                              ? value.split("/").reverse().join("/")
                              : `1/${value}`;
                            const reciprocalField = `${name}.${j}.${i}`;
                            document
                              .querySelector(`[name="${reciprocalField}"]`)
                              ?.setAttribute("value", reciprocalValue);
                          }}
                          className="w-full text-center border rounded px-2 py-1"
                        >
                          {options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
