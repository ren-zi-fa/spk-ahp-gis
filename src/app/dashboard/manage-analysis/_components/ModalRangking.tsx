import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Eye } from "lucide-react";
import { useState } from "react";

import { DialogTitle } from "@radix-ui/react-dialog";
import ResultCalculation from "../../result/_components/ResultCalculation";

export function ModalRangking({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-7 w-7 text-blue-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[90vh] overflow-y-auto">
        <DialogTitle>Hasil Perengkingan</DialogTitle>
        <ResultCalculation analysisId={id} />
      </DialogContent>
    </Dialog>
  );
}
