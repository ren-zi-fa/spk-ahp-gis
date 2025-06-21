"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function UndoDelete({ name }: { name: string }) {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Data Telah di hapus", {
          description: `analysis ${name}`,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    >
      Delete
    </Button>
  );
}
