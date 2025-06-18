import { z } from "zod";
export const AnalysisSchema = z.object({
  analysisName: z.string().min(3),
  id: z.string(),
});
export const KriteriaSchema = z.object({
  kriteriaName: z.string().min(3),
});
