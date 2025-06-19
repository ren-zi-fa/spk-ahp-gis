import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TableAlternatif from "./TableAlternatif";
export default function ModalAlternatif({
  analysisId,
}: {
  analysisId: string;
}) {
  return (
    <Dialog>
      <DialogTrigger className="underline hover:text-red-700">
        See Current Alternatif
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <TableAlternatif analysisId={analysisId} />
      </DialogContent>
    </Dialog>
  );
}
