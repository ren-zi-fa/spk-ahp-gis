"use client";

import { useForm, FormProvider } from "react-hook-form";
import { KriteriaSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import KriteriaFields from "./KriteriaField";
import { Button } from "@/components/ui/button";
import { coordinatesAlternatif } from "@/lib/alternatifKecamatan";
import { toast } from "sonner";
import { useState } from "react";
import ModalAlternatif from "./ModalAlternatif";
import ModalKriteria from "./ModalKriteria";
import { FastForward } from "lucide-react";
import Map from "@/components/Map";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof KriteriaSchema>;
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

  const router = useRouter();
  return (
    <>
      <div className="">
        <div className="flex gap-2 mt-4 ">
          <div className="">See current</div>
          <ModalAlternatif analysisId={id} />
          <ModalKriteria analysisId={id} />
          <button
            className="flex items-center gap-2 hover:text-red-500 underline"
            onClick={() => router.push(`/dashboard/calculate/${id}`)}
          >
            <p>Process This data</p>
            <FastForward />
          </button>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-9">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-center text-3xl mb-2">Alternatif</h1>
            </div>
            <Map coordinates={coordinatesAlternatif} analysisId={id} />
          </div>
          <div className="col-span-3">
            <h1 className="text-center text-3xl mb-2">Kriteria</h1>
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
      </div>
    </>
  );
}
