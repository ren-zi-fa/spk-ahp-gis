"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TableAlternatif from "./TableAlternatif";
import { useState } from "react";
export default function ModalAlternatif({
  analysisId,
}: {
  analysisId: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="underline hover:text-red-700">
        Alternatif
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="w-[350px] md:w-3xl "
      >
        <DialogHeader>
          <DialogTitle>Alternatif</DialogTitle>
          <DialogDescription>
            This action cannot be undone. if you remove
          </DialogDescription>
        </DialogHeader>
        <TableAlternatif analysisId={analysisId} />
      </DialogContent>
    </Dialog>
  );
}
