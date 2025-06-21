import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { fetcher } from "@/lib/fetcher";
import { HasilPerengkinganData } from "@/types";
import { Eye } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DialogTitle } from "@radix-ui/react-dialog";

export function ModalRangking({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const { data } = useSWR<HasilPerengkinganData>(
    open ? `/api/hasil-rangking?analysisId=${id}` : null,
    fetcher
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Eye className="h-7 w-7 text-blue-400" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogTitle className="text-lg font-semibold mb-4">
            Hasil Perengkingan
          </DialogTitle>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Nama Wilayah</TableHead>
                <TableHead>Nilai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.dataRangking &&
              Object.keys(data.dataRangking).length > 0 ? (
                [...Object.entries(data.dataRangking)]
                  .sort((a, b) => b[1] - a[1]) // Urutkan dari terbesar ke terkecil
                  .map(([key, value], index) => (
                    <TableRow key={key}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="capitalize">
                        {key.replaceAll(".", " ")}
                      </TableCell>
                      <TableCell>{value.toFixed(3)}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground"
                  >
                    Hasil Perengkingan tidak ada / Belum dibuat
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="mt-4 text-xs text-muted-foreground">
            <p>ID Analisis: {data?.analysisId}</p>
            <p>Dibuat: {new Date(data?.createdAt || "").toLocaleString()}</p>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
