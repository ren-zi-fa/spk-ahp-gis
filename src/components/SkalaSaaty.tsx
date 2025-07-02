"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function SkalaSaaty() {
  const skalaSaaty = [
    { nilai: 1, makna: "Kedua elemen sama penting" },
    { nilai: 3, makna: "Elemen yang satu sedikit lebih penting dari yang lain" },
    { nilai: 5, makna: "Elemen yang satu lebih penting secara kuat dari yang lain" },
    { nilai: 7, makna: "Elemen yang satu sangat kuat lebih penting dari yang lain" },
    { nilai: 9, makna: "Elemen yang satu mutlak lebih penting dari yang lain" },
    { nilai: "2, 4, 6, 8", makna: "Nilai antara dua pertimbangan yang berdekatan" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Lihat Tabel Skala Perbandingan</Button>
      </DialogTrigger>
      <DialogContent className="dark:bg-blue-300">
        <DialogHeader>
          <DialogTitle>Skala Perbandingan Saaty (AHP)</DialogTitle>
        </DialogHeader>
        <div className="mt-4 dark:bg-white">
          <table className="w-full  text-left border border-gray-300 rounded-md overflow-hidden dark:text-blue-500">
            <thead className="bg-gray-100 dark:bg-yellow-400">
              <tr>
                <th className="p-2 border">Nilai</th>
                <th className="p-2 border">Makna</th>
              </tr>
            </thead>
            <tbody>
              {skalaSaaty.map((item, index) => (
                <tr key={index} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border text-center">{item.nilai}</td>
                  <td className="p-2 border">{item.makna}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
