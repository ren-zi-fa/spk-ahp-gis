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
import { MapPinned, SquarePen, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";

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

  const [editedRows, setEditedRows] = React.useState<{
    [id: string]: Partial<Analysis>;
  }>({});

  const [editingCell, setEditingCell] = React.useState<{
    [key: string]: { [column: string]: boolean };
  }>({});

  const [isSaving, setIsSaving] = React.useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const deleteTimeouts = React.useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Hitung jumlah perubahan
  const changesCount = Object.keys(editedRows).reduce((total, rowId) => {
    return total + Object.keys(editedRows[rowId]).length;
  }, 0);

  const handleSaveChanges = async () => {
    if (changesCount === 0) return;

    setIsSaving(true);
    try {
      const promises = Object.entries(editedRows).map(async ([id, changes]) => {
        if (!Object.keys(changes).length) return; // Skip jika kosong

        const response = await fetch(`/api/analysis/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changes),
        });

        if (!response.ok) {
          throw new Error(`Failed to update ${id}`);
        }

        return response.json();
      });

      await Promise.all(promises);

      setEditedRows({});
      mutate();
      toast.success(
        `${changesCount} ${
          changesCount === 1 ? "change" : "changes"
        } saved successfully`,
        { position: "bottom-right" }
      );
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes", { position: "bottom-right" });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle discard changes
  const handleDiscardChanges = () => {
    setEditedRows({});
    setEditingCell({});
    toast.info("Changes discarded", { position: "bottom-right" });
  };

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
          const id = row.original.id;
          const raw = row.getValue<string>("createdAt");
          const defaultValue = new Date(raw).toISOString().split("T")[0];
          const isEditing = editingCell[id]?.createdAt;
          const hasChanges = editedRows[id]?.createdAt !== undefined;

          if (isEditing) {
            return (
              <input
                type="date"
                className={`border px-2 py-1 rounded ${
                  hasChanges ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
                defaultValue={editedRows[id]?.createdAt || defaultValue}
                autoFocus
                onBlur={(e) => {
                  const newValue = e.target.value;
                  setEditingCell((prev) => ({
                    ...prev,
                    [id]: { ...prev[id], createdAt: false },
                  }));
                  if (newValue !== defaultValue) {
                    setEditedRows((prev) => ({
                      ...prev,
                      [id]: { ...(prev[id] || {}), createdAt: newValue },
                    }));
                  } else {
                    setEditedRows((prev) => {
                      const newState = { ...prev };
                      if (newState[id]) {
                        delete newState[id].createdAt;
                        if (Object.keys(newState[id]).length === 0) {
                          delete newState[id];
                        }
                      }
                      return newState;
                    });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    (e.target as HTMLInputElement).blur();
                  }
                  if (e.key === "Escape") {
                    setEditingCell((prev) => ({
                      ...prev,
                      [id]: { ...prev[id], createdAt: false },
                    }));
                  }
                }}
              />
            );
          }

          const displayValue = editedRows[id]?.createdAt || raw;
          const formatted = new Date(displayValue).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          });

          return (
            <div
              onClick={() =>
                setEditingCell((prev) => ({
                  ...prev,
                  [id]: { ...prev[id], createdAt: true },
                }))
              }
              className={`cursor-pointer rounded px-1 py-1 ${
                hasChanges
                  ? "bg-blue-50 border border-blue-200"
                  : "hover:bg-gray-50"
              }`}
            >
              {formatted}
            </div>
          );
        },
      },

      {
        accessorKey: "name",
        header: "Nama Analysis",
        cell: ({ row }) => {
          const id = row.original.id;
          const defaultValue = row.getValue<string>("name");
          const isEditing = editingCell[id]?.name;
          const hasChanges = editedRows[id]?.name !== undefined;

          if (isEditing) {
            return (
              <input
                className={`border px-2 py-1 w-full rounded ${
                  hasChanges ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
                defaultValue={editedRows[id]?.name || defaultValue}
                autoFocus
                onBlur={(e) => {
                  const newValue = e.target.value;
                  setEditingCell((prev) => ({
                    ...prev,
                    [id]: { ...prev[id], name: false },
                  }));
                  if (newValue !== defaultValue) {
                    setEditedRows((prev) => ({
                      ...prev,
                      [id]: { ...(prev[id] || {}), name: newValue },
                    }));
                  } else {
                    setEditedRows((prev) => {
                      const newState = { ...prev };
                      if (newState[id]) {
                        delete newState[id].name;
                        if (Object.keys(newState[id]).length === 0) {
                          delete newState[id];
                        }
                      }
                      return newState;
                    });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    (e.target as HTMLInputElement).blur();
                  }
                  if (e.key === "Escape") {
                    setEditingCell((prev) => ({
                      ...prev,
                      [id]: { ...prev[id], name: false },
                    }));
                  }
                }}
              />
            );
          }

          const displayValue = editedRows[id]?.name || defaultValue;

          return (
            <div
              onClick={() =>
                setEditingCell((prev) => ({
                  ...prev,
                  [id]: { ...prev[id], name: true },
                }))
              }
              className={`cursor-pointer rounded px-1 py-1 ${
                hasChanges
                  ? "bg-blue-50 border border-blue-200"
                  : "hover:bg-gray-50"
              }`}
            >
              {displayValue}
            </div>
          );
        },
      },

      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-center ">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                router.push(`/dashboard/mapping/${row.original.id}`)
              }
            >
              <MapPinned className="h-7 w-7 text-green-400" />
            </Button>
            <ModalRangking id={row.original.id} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                router.push(`/dashboard/create/${row.original.id}`)
              }
            >
              <SquarePen className="h-7 w-7 text-yellow-400" />
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
    [handleDelete, router, editingCell, editedRows]
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
    <div className="w-sm lg:w-full max-w-3xl mx-auto">
      {/* Save Changes Bar - Responsive & Aligned */}
      {changesCount > 0 && (
        <div className="flex justify-between items-center gap-3 mb-3 bg-white border border-blue-200 shadow-md rounded-lg px-4 py-3  sticky top-2 z-40">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDiscardChanges}
              disabled={isSaving}
              className="h-8"
            >
              <X className="h-3 w-3 mr-1" />
              Discard
            </Button>
            <Button
              size="sm"
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="h-8 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-3 w-3 mr-1" />
              {isSaving
                ? "Saving..."
                : `Save ${changesCount} ${
                    changesCount === 1 ? "change" : "changes"
                  }`}
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            {changesCount} unsaved {changesCount === 1 ? "change" : "changes"}
          </div>
        </div>
      )}

      <div className="rounded-md border  lg:w-3xl ">
        <Table className="max-w-sm lg:max-w-full lg:w-full">
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
