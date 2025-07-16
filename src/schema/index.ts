import { z } from "zod";
export const AnalysisSchema = z.object({
  analysisName: z
    .string()
    .min(3, { message: "minimal 3 karakter" })
    .refine((val) => val.trim().split(/\s+/).length <= 3, {
      message: "maximal 3 kata",
    }),
  id: z.string().optional(),
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

export const LoginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const updateAnalysisSchema = z.object({
  name: z.string().optional(),
  createdAt: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return !isNaN(new Date(val).getTime());
      },
      { message: "createdAt must be a valid date string" }
    ),
});
