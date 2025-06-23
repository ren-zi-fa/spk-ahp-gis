"use client";

/* eslint-disable @typescript-eslint/no-explicit-any*/

import { fetcher } from "@/lib/fetcher";
import useSWR, { mutate } from "swr";
import {
  calculcateCritMatrix,
  calculateAltMatrix,
  calculateCompositeWeights,
} from "ahp-calc";
import CompositeWeightChart from "./PerengkinganChart";
import MatrixTable from "./HistoryCalculate";
import CalculationInfo from "./InfoResult";
import { toast } from "sonner";
import { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";
import { Alternatif, Analysis, Kriteria } from "@/types";
import MyLoading from "@/components/MyLoading";
import { CircleAlert } from "lucide-react";

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

type KriteriaAlternatifResponse = {
  kriteria: Kriteria[];
  alternatif: Alternatif[];
};

export default function ResultCalculation({
  analysisId,
}: ResultCalculationProps) {
  const { data: analysisName } = useSWR<Analysis>(
    analysisId === "0" ? null : `/api/analysis/${analysisId}`,
    fetcher
  );

  const pdfRef = useRef<HTMLDivElement>(null);

  const exportToPDF = async () => {
    if (!pdfRef.current) return;

    const element = pdfRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`hasil-perengkingan-${analysisName?.name}.pdf`);
  };

  const {
    data: matrixData,
    error,
    isLoading,
  } = useSWR<GetMatricesResponse>(
    analysisId === "0" ? null : `/api/matrix?analysisId=${analysisId}`,
    fetcher
  );

  const { data } = useSWR<KriteriaAlternatifResponse>(
    analysisId === "0"
      ? null
      : `/api/kriteria-alternatif?analysisId=${analysisId}`,
    fetcher
  );

  if (isLoading) return <MyLoading />;
  if (error)
    return (
      <div className="text-red-500 text-sm">Gagal memuat data matriks.</div>
    );
  if (!matrixData) return null;

  if (!data?.kriteria?.length || !data?.alternatif?.length) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 text-red-600 text-lg text-center">
        <CircleAlert className="w-12 h-12" />
        <p>
          Upss!!! Anda belum melakukan proses <br /> perhitungan data pada
          analisis ini.
        </p>
      </div>
    );
  }

  const critMatrix = matrixData.criteriaMatrix?.data ?? [];
  const altMatrix = matrixData.alternativeMatrix?.[0]?.data ?? [];

  // Cek apakah matriks valid sebelum menjalankan kalkulasi
  const isCritMatrixValid = critMatrix.length > 0;
  const isAltMatrixValid =
    altMatrix.length > 0 && altMatrix.every((m) => m.length > 0);

  if (!isCritMatrixValid || !isAltMatrixValid) {
    return (
      <div className="text-red-500 flex justify-center items-center h-10">
        Data matriks belum lengkap <br /> untuk dilakukan perhitungan.
      </div>
    );
  }

  // Jalankan kalkulasi
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
    originalMatrix: altOriginalMatrix,
    RI: altRI,
    Ci: altCi,
  } = altResult;

  const {
    CI: CICTrit,
    CR: CRCrit,
    RI: RICrit,
    konsistensi: konsistensiCrit,
    lamdaMax: lamdaMaxCrit,
    normalizedMatrix: normalizedMatrixCrit,
    originalMatrix: originalMatrixCrit,
  } = critResult;

  const saveResult = async () => {
    if (!data?.alternatif || !finalCompositeWeights) return;

    const result = data.alternatif.reduce((acc, alt, i) => {
      acc[alt.name] = finalCompositeWeights[i];
      return acc;
    }, {} as Record<string, number>);

    const res = await fetch("/api/hasil-rangking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        analysisId,
        result,
      }),
    });

    if (res.ok) {
      toast.success("Perengkingan berhasil disimpan");
      mutate("/api/hasil-rangking");
    } else {
      console.error("Gagal menyimpan hasil perengkingan");
    }
  };

  return (
    <div className="space-y-6 w-[300px] md:w-full">
      <div className="flex items-center gap-2 justify-between">
        <button
          onClick={saveResult}
          className="px-2 py-1 mt-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Simpan Hasil Perengkingan
        </button>
        <button
          onClick={exportToPDF}
          className="px-2 py-1 mt-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export to PDF
        </button>
      </div>

      <div className="px-4" ref={pdfRef}>
        <CompositeWeightChart
          weights={finalCompositeWeights}
          alternatifs={data.alternatif}
        />

        <MatrixTable
          title="Matriks Perbandingan Kriteria"
          headers={data.kriteria.map((k) => k.name)}
          data={originalMatrixCrit}
          rowLabels={data.kriteria.map((k) => k.name)}
        />

        <MatrixTable
          title="Normalisasi Matriks Kriteria"
          headers={data.kriteria.map((k) => k.name)}
          data={normalizedMatrixCrit}
          rowLabels={data.kriteria.map((k) => k.name)}
        />

        <CalculationInfo
          lamdaMax={lamdaMaxCrit}
          CI={CICTrit}
          CR={CRCrit}
          RI={RICrit}
          konsistensi={konsistensiCrit}
        />

        {altOriginalMatrix.map((matrix: any, idx: number) => (
          <div key={idx}>
            <div className="space-y-5 gap-2 h-fit">
              <MatrixTable
                className="h-1/2"
                title={`Matriks Perbandingan Alternatif untuk Kriteria ${
                  data.kriteria[idx]?.name ?? `K${idx + 1}`
                }`}
                headers={data.alternatif.map((a) => a.name)}
                data={matrix}
                rowLabels={data.alternatif.map((a) => a.name)}
              />

              <MatrixTable
                className="h-1/2"
                title={`Normalisasi Alternatif untuk Kriteria ${
                  data.kriteria[idx]?.name ?? `K${idx + 1}`
                }`}
                headers={data.alternatif.map((a) => a.name)}
                data={altNormalize[idx]}
                rowLabels={data.alternatif.map((a) => a.name)}
              />
            </div>

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
    </div>
  );
}
