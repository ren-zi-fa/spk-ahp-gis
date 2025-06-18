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
