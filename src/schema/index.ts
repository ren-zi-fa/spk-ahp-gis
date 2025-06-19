import { z } from "zod";
export const AnalysisSchema = z.object({
  analysisName: z.string().min(3),
  id: z.string(),
});
export const KriteriaSchema = z.object({
  analysisId: z.string().uuid(),
  criteria: z.array(
    z.object({
      name: z.string().min(1),
    })
  ),
});
export const AlternatifSchema = z.object({
  analysisId: z.string().uuid(),
  alternatif: z.array(
    z.object({
      name: z.string().min(1),
      lat: z.any(),
      lang: z.any(),
    })
  ),
});

export const CriteriaMatrixSchema = z.object({
  analysisId: z.string().uuid(),
  data: z.array(z.array(z.string())),
});

export const AlternatifMatrixSchema = z.object({
  analysisId: z.string().uuid(),
  data: z.array(z.array(z.array(z.string()))),
});

export type MatrixRequestBody = {
  criteriaMatrix: string[][];
  alternativeMatrix: string[][][];
  analysisId: string;
};
