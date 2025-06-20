"use client";

import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import {
  calculcateCritMatrix,
  calculateAltMatrix,
  calculateCompositeWeights,
} from "ahp-calc";
import CompositeWeightChart from "./PerengkinganChart";
import MatrixTable from "./HistoryCalculate";
import CalculationInfo from "./InfoResult";

type CriteriaMatrixData = string[][];
type AlternativeMatrixData = string[][][];

interface CriteriaMatrix {
  id: string;
  data: CriteriaMatrixData;
  createdAt: string;
  analysisId: string;
}

interface AlternativeMatrix {
  id: string;
  data: AlternativeMatrixData;
  createdAt: string;
  analysisId: string;
}

interface GetMatricesResponse {
  criteriaMatrix: CriteriaMatrix;
  alternativeMatrix: AlternativeMatrix[];
}

interface ResultCalculationProps {
  analysisId: string;
}
export type Kriteria = {
  id: string;
  name: string;
  createdAt: string;
  analysisId: string;
  analysis: {
    name: string;
  };
};

export type Alternatif = {
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

export type KriteriaAlternatifResponse = {
  kriteria: Kriteria[];
  alternatif: Alternatif[];
};

export default function ResultCalculation({
  analysisId,
}: ResultCalculationProps) {
  const {
    data: matrixData,
    error,
    isLoading,
  } = useSWR<GetMatricesResponse>(
    `/api/matrix?analysisId=${analysisId}`,
    fetcher
  );
  const { data } = useSWR<KriteriaAlternatifResponse>(
    `/api/kriteria-alternatif?analysisId=${analysisId}`,
    fetcher
  );
  if (data) {
    console.log(data.kriteria.map((item) => item.name));
    console.log(data.alternatif.map((item) => item.name));
  }

  if (isLoading)
    return <div className="text-gray-500 text-sm">Memuat data matriks...</div>;
  if (error)
    return (
      <div className="text-red-500 text-sm">Gagal memuat data matriks.</div>
    );
  if (!matrixData) return null;

  const critMatrix = matrixData.criteriaMatrix?.data ?? [];
  const altMatrix = matrixData.alternativeMatrix?.[0]?.data ?? [];

  const critResult = calculcateCritMatrix(critMatrix);
  const altResult = calculateAltMatrix(altMatrix);
  const finalCompositeWeights = calculateCompositeWeights(
    altResult.weightAlt,
    critResult.weightsCriteria
  );
  const {
    normalized: altNormalize,
    CR: altCR,
    lamdaMax: altLamdaMax,
    sumAlt: altSumAlt,
    originalMatrix: altOriginalMatrix,
    RI: altRI,
    Ci: altCi,
  } = calculateAltMatrix(altMatrix);

  const {
    CI: CICTrit,
    CR: CRCrit,
    RI: RICrit,
    konsistensi: konsistensiCrit,
    lamdaMax: lamdaMaxCrit,
    n: nCrit,
    normalizedMatrix: normalizedMatrixCrit,
    originalMatrix: originalMatrixCrit,
    sumCrit: sumCritCrit,
    weightsCriteria: weightsCriteriaCrit,
  } = calculcateCritMatrix(critMatrix);

  return (
    <div className="space-y-6">
      <CompositeWeightChart
        weights={finalCompositeWeights}
        alternatifs={data?.alternatif ?? []}
      />

      {/* Matriks dan Info Kriteria */}
      <MatrixTable
        title="Matriks Perbandingan Kriteria"
        headers={data?.kriteria.map((k) => k.name) ?? []}
        data={originalMatrixCrit}
        rowLabels={data?.kriteria.map((k) => k.name) ?? []}
      />
      <MatrixTable
        title="Normalisasi Matriks Kriteria"
        headers={data?.kriteria.map((k) => k.name) ?? []}
        data={normalizedMatrixCrit}
        rowLabels={data?.kriteria.map((k) => k.name) ?? []}
      />
      <CalculationInfo
        lamdaMax={lamdaMaxCrit}
        CI={CICTrit}
        CR={CRCrit}
        RI={RICrit}
        konsistensi={konsistensiCrit}
      />

      {/* Matriks dan Info Alternatif */}
      {altOriginalMatrix.map((matrix: any, idx: any) => (
        <div key={idx} className="space-y-4">
          <MatrixTable
            title={`Matriks Perbandingan Alternatif untuk Kriteria ${
              data?.kriteria[idx]?.name ?? `K${idx + 1}`
            }`}
            headers={data?.alternatif.map((a) => a.name) ?? []}
            data={matrix}
            rowLabels={data?.alternatif.map((a) => a.name) ?? []}
          />
          <MatrixTable
            title={`Normalisasi Alternatif untuk Kriteria ${
              data?.kriteria[idx]?.name ?? `K${idx + 1}`
            }`}
            headers={data?.alternatif.map((a) => a.name) ?? []}
            data={altNormalize[idx]}
            rowLabels={data?.alternatif.map((a) => a.name) ?? []}
          />
          <CalculationInfo
            lamdaMax={altLamdaMax[idx]}
            CI={altCi[idx]}
            CR={altCR[idx]?.CR}
            RI={altRI}
            konsistensi={
              altCR[idx]?.isConsistent ? "Konsisten" : "Tidak Konsisten"
            }
          />
        </div>
      ))}
    </div>
  );
}
