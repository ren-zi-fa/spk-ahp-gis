import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TableKriteria from "./TableKriteria";
export default function ModalKriteria({ analysisId }: { analysisId: string }) {
  return (
    <Dialog>
      <DialogTrigger className="underline hover:text-red-700">
        Kriteria
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="w-[350px] md:w-3xl "
      >
        <DialogHeader>
          <DialogTitle>Kriteria</DialogTitle>
          <DialogDescription>
            This action cannot be undone. if you remove
          </DialogDescription>
        </DialogHeader>
        <TableKriteria analysisId={analysisId} />
      </DialogContent>
    </Dialog>
  );
}
