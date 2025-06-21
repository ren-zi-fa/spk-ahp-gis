"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, SquarePen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { toast } from "sonner";
import ModalDelete from "./ModalDelete";
import { Analysis } from "@/types";
import { ModalRangking } from "./ModalRangking";
import { useRouter } from "next/navigation";
import MyLoading from "@/components/MyLoading";

export default function TableAnalysis() {
  const {
    data: analysis,
    error,
    isLoading,
    mutate,
  } = useSWR<Analysis[]>(`/api/analysis`, fetcher);

  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const deleteTimeouts = React.useRef<{ [key: string]: NodeJS.Timeout }>({});

  const handleDelete = React.useCallback(
    (id: string, name: string) => {
      if (!analysis) return;

      const previous = analysis;
      const newData = analysis.filter((a) => a.id !== id);
      mutate(newData, false);

      // Set timeout untuk eksekusi delete
      const timeout = setTimeout(() => {
        fetch(`/api/analysis/${id}`, { method: "DELETE" })
          .then(() => mutate())
          .catch(() => {
            mutate(previous, false);
            toast.error("Gagal menghapus data.");
          });
        delete deleteTimeouts.current[id];
      }, 5000); // 5 detik, bisa diubah sesuai kebutuhan

      deleteTimeouts.current[id] = timeout;

      toast.success(` ${name} dihapus`, {
        position: "bottom-right",
        action: {
          label: "Undo",
          onClick: () => {
            // Batalkan penghapusan
            clearTimeout(deleteTimeouts.current[id]);
            mutate(previous, false);
          },
        },
      });
    },
    [analysis, mutate]
  );

  const columns = React.useMemo<ColumnDef<Analysis>[]>(
    () => [
      {
        id: "no",
        header: "No",
        cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
        enableSorting: false,
        size: 30,
      },
      {
        accessorKey: "createdAt",
        header: "Waktu Dibuat",
        cell: ({ row }) => {
          const raw = row.getValue<string>("createdAt");
          const date = new Date(raw);
          const formatted = date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          });
          return <div className="whitespace-nowrap">{formatted}</div>;
        },
      },

      {
        accessorKey: "name",
        header: "Nama Analysis",
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-center ">
            <ModalRangking id={row.original.id} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                router.push(`/dashboard/create/${row.original.id}`)
              }
            >
              <SquarePen className="h-7 w-7 text-green-400" />
            </Button>
            <ModalDelete
              id={row.original.id}
              name={row.original.name}
              handleDelete={handleDelete}
            />
          </div>
        ),
      },
    ],
    [handleDelete, router]
  );

  const table = useReactTable({
    data: analysis ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  if (error) return <div>Failed to load data</div>;
  if (isLoading) return <MyLoading />;

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id === "actions" ? "actions" : column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Data Kosong
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
