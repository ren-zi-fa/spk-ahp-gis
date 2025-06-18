"use client";

import { useForm, FormProvider } from "react-hook-form";
import { KriteriaSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import KriteriaFields from "./KriteriaField";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { coordinatesAlternatif } from "@/lib/alternatifKecamatan";

type FormData = z.infer<typeof KriteriaSchema>;
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <p className="text-center">Memuat peta...</p>,
});
export default function AlternatifKriteriaForm({ id }: { id: string }) {
  const methods = useForm<FormData>({
    resolver: zodResolver(KriteriaSchema),
    defaultValues: {
      analysisId: id,
      criteria: [{ name: "" }],
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/kriteria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Gagal simpan");
      alert("Berhasil");
    } catch (e) {
      console.error(e);
      alert("Error menyimpan data");
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-9">
          <h1 className="text-center text-3xl mb-2">Alternatif</h1>
          <Map coordinates={coordinatesAlternatif} />
        </div>
        <div className="col-span-3">
          <h1 className="text-center text-3xl mb-2">Kriteria</h1>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <KriteriaFields name="criteria" />
              <Button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded"
              >
                Simpan
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}
