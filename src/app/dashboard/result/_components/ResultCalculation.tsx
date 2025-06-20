"use client";

import { fetcher } from "@/lib/fetcher";
import { ApiResponse } from "@/types";
import React, { useEffect } from "react";
import useSWR from "swr";
import { calculateAltMatrix, calculcateCritMatrix } from "ahp-calc";
export type MatrixResponse = {
  criteriaMatrix: {
    id: string;
    analysisId: string;
    data: any;
    createdAt: string;
  } | null;
  alternativeMatrix: {
    id: string;
    data: any;
    analysisId: string;
    createdAt: string;
  }[];
};

export default function ResultCalculation({
  analysisId,
}: {
  analysisId: string;
}) {
  const { data: kriteriaAlternatif, isLoading } = useSWR<ApiResponse>(
    `/api/kriteria-alternatif?analysisId=${analysisId}`,
    fetcher
  );
  const { data: matrixData } = useSWR<MatrixResponse>(
    `/api/matrix?analysisId=${analysisId}`,
    fetcher
  );

  const matricesAlternatif = React.useMemo<string[][][]>(() => {
    if (!matrixData) return [];
    const { alternativeMatrix } = matrixData;
    return alternativeMatrix
      .map((m) => m.data)
      .filter((d) => Array.isArray(d) && d.length > 0);
  }, [matrixData]);

  const shouldCalculateAlternatif =
    matricesAlternatif.length > 0 &&
    matricesAlternatif.every((m) => m.length > 0);

  if (shouldCalculateAlternatif) {
    console.log(calculateAltMatrix(matricesAlternatif));
  }

  const shouldCalculateCriteria =
    Array.isArray(matrixData?.criteriaMatrix?.data) &&
    matrixData.criteriaMatrix.data.length > 0;
  if (shouldCalculateCriteria) {
    console.log(calculcateCritMatrix(matrixData?.criteriaMatrix?.data));
  }
  return (
    <div className="">
      {isLoading && (
        <>
          {kriteriaAlternatif}
          {matrixData}
        </>
      )}
    </div>
  );
}
