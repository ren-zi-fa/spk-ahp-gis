"use client";

import { useForm, FormProvider } from "react-hook-form";
import { KriteriaSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import KriteriaFields from "./KriteriaField";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { coordinatesAlternatif } from "@/lib/alternatifKecamatan";
import { toast } from "sonner";
import { useState } from "react";
import ModalAlternatif from "./ModalAlternatif";

type FormData = z.infer<typeof KriteriaSchema>;
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <p className="text-center">Memuat peta...</p>,
});
export default function AlternatifKriteriaForm({ id }: { id: string }) {
  const form = useForm<FormData>({
    resolver: zodResolver(KriteriaSchema),
    defaultValues: {
      analysisId: id,
      criteria: [{ name: "" }],
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/kriteria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Kriteria berhasil disimpan");
        form.reset();
      } else {
        toast.error("Terjadi kesalahan saat menyimpan");
      }
    } catch (e) {
      console.error(e);
      toast.error("Gagal menyimpan kriteria");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-9">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-center text-3xl mb-2">Alternatif</h1>
            <ModalAlternatif analysisId={id} />
          </div>

          <Map coordinates={coordinatesAlternatif} analysisId={id} />
        </div>
        <div className="col-span-3">
          <h1 className="text-center text-3xl mb-2">Kriteria</h1>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <KriteriaFields name="criteria" />
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-2 rounded"
              >
                {isLoading ? "Processing..." : "Simpan"}
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}
