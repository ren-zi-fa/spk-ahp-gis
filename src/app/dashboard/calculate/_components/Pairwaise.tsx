"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { MatrixTable } from "./MatriksTable";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

type Kriteria = {
  id: string;
  name: string;
  createdAt: string;
  analysisId: string;
  analysis: {
    name: string;
  };
};

type Alternatif = {
  id: string;
  name: string;
  lat: number;
  lang: number;
  createdAt: string;
  analysisId: string;
  analysis: {
    name: string;
  };
};

type ApiResponse = {
  kriteria: Kriteria[];
  alternatif: Alternatif[];
};

type MatrixFormData = {
  critMatrix: string[][];
  altMatrixes: string[][][];
};

export default function Pairwaise({ analysisId }: { analysisId: string }) {
  const router = useRouter();

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
        alert(result.message);
      } else {
        alert(`Gagal: ${result.message}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan saat mengirim data.");
      console.error(error);
    }
  };

  return (
    <div className="w-[85%] mx-auto">
      <FormProvider {...methods}>
        {isLoading || !kriteriaAlternatif ? (
          <div>Loading....</div>
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
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded flex justify-center items-center"
            >
              Simpan
            </button>
          </form>
        )}
      </FormProvider>
    </div>
  );
}
