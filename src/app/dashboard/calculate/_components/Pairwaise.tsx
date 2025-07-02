"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { MatrixTable } from "./MatriksTable";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { ApiResponse, MatrixFormData } from "@/types";
import MyLoading from "@/components/MyLoading";
import { Button } from "@/components/ui/button";

export default function Pairwaise({ analysisId }: { analysisId: string }) {
  const router = useRouter();
  const [isLoadings, setIsLoadings] = useState(false);
  const { data: kriteriaAlternatif, isLoading } = useSWR<ApiResponse>(
    `/api/kriteria-alternatif?analysisId=${analysisId}`,
    fetcher
  );

  const getDefaultMatrix = (length: number) =>
    Array.from({ length }, () => Array.from({ length }, () => "1"));

  const defaultValues: MatrixFormData = kriteriaAlternatif
    ? {
        critMatrix: getDefaultMatrix(kriteriaAlternatif.kriteria.length),
        altMatrixes: kriteriaAlternatif.kriteria.map(() =>
          getDefaultMatrix(kriteriaAlternatif.alternatif.length)
        ),
      }
    : {
        critMatrix: [],
        altMatrixes: [],
      };

  const methods: UseFormReturn<MatrixFormData> = useForm({
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: MatrixFormData) => {
    try {
      setIsLoadings(true);

      const response = await fetch("/api/matrix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId,
          criteriaMatrix: data.critMatrix,
          alternativeMatrix: data.altMatrixes,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        router.push(`/dashboard/result/${analysisId}`);
      } else {
        alert(`Gagal: ${result.message}`);
        return;
      }
    } catch (error) {
      alert("Terjadi kesalahan saat mengirim data.");
      console.error(error);
    } finally {
      setIsLoadings(false);
    }
  };
  if (isLoadings) {
    return <MyLoading />;
  }
  return (
    <div className="w-auto lg:w-[85%] mx-auto">
      <FormProvider {...methods}>
        {isLoading || !kriteriaAlternatif ? (
          <MyLoading />
        ) : (
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="mb-8 mt-10">
              <MatrixTable
                title="Matrix of pairwise comparisons for criteria"
                name="critMatrix"
                cells={kriteriaAlternatif.kriteria}
              />
            </div>
            {kriteriaAlternatif.kriteria.map((criterion, index) => (
              <div key={index} className="mb-8">
                <MatrixTable
                  title={`Matrix of pairwise comparisons for criterion ${criterion.name}`}
                  name={`altMatrixes.${index}`}
                  cells={kriteriaAlternatif.alternatif}
                />
              </div>
            ))}
            <Button
              type="submit"
              disabled={isLoadings}
              className="px-4 py-2 bg-blue-600 text-white rounded w-[200px] flex justify-center mx-auto "
            >
              {isLoading ? "Processing..." : "Process"}
            </Button>
          </form>
        )}
      </FormProvider>
    </div>
  );
}
