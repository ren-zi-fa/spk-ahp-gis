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
import { FastForward, Info, Loader2 } from "lucide-react";
import Map from "@/components/Map";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Kriteria } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { Alternatif } from "./TableAlternatif";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const { data: kriteriaData, isLoading: loadingKriteria } = useSWR<Kriteria[]>(
    `/api/kriteria?analysisId=${id}`,
    fetcher
  );
  const { data: alternatifData, isLoading: loadingAlternatif } = useSWR<
    Alternatif[]
  >(`/api/alternatif?analysisId=${id}`, fetcher);
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

  const nextButton = () => {
    if (
      !kriteriaData ||
      kriteriaData.length === 0 ||
      !alternatifData ||
      alternatifData.length === 0
    ) {
      toast.error("Data kriteria dan alternatif belum lengkap");
      return;
    }
    router.push(`/dashboard/calculate/${id}`);
  };

  const router = useRouter();
  if (loadingKriteria || loadingAlternatif) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
        <p className="mt-4 text-sm text-muted-foreground">Memuat data...</p>
      </div>
    );
  }
  return (
    <>
      <div className="">
        <div className="flex gap-2 mt-4 lg:text-sm text-xs items-center">
          <div className="">See current</div>
          <ModalAlternatif analysisId={id} />
          <ModalKriteria analysisId={id} />
          <button
            className="flex items-center gap-2 hover:text-red-500 underline"
            onClick={nextButton}
          >
            <p>Process This data</p>
            <FastForward />
          </button>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-9">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-center text-sm md:text-3xl mb-2">Alternatif</h1>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-blue-500 hover:bg-blue-400 cursor-pointer"
                    size="icon"
                    aria-label="Help"
                  >
                    <QuestionMarkCircledIcon className="text-white" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-yellow-600 text-white">
                  <div className="flex items-start gap-2">
                    <Info className="w-20 h-20 mt-1" />
                    <p>
                      Click icon dan double click pada nama kecamatan untuk
                      menambahkan alternatif
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <Map coordinates={coordinatesAlternatif} analysisId={id} />
          </div>
          <div className="col-span-12 md:col-span-3">
            <h1 className="text-center  text-sm md:text-3xl  mb-2">Kriteria</h1>
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
