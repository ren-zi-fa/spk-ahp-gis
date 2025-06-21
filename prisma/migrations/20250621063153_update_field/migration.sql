-- DropForeignKey
ALTER TABLE "Alternatif" DROP CONSTRAINT "Alternatif_analysisId_fkey";

-- DropForeignKey
ALTER TABLE "AlternativeMatrix" DROP CONSTRAINT "AlternativeMatrix_analysisId_fkey";

-- DropForeignKey
ALTER TABLE "CriteriaMatrix" DROP CONSTRAINT "CriteriaMatrix_analysisId_fkey";

-- DropForeignKey
ALTER TABLE "HasilPerengkingan" DROP CONSTRAINT "HasilPerengkingan_analysisId_fkey";

-- DropForeignKey
ALTER TABLE "Kriteria" DROP CONSTRAINT "Kriteria_analysisId_fkey";

-- AddForeignKey
ALTER TABLE "Kriteria" ADD CONSTRAINT "Kriteria_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alternatif" ADD CONSTRAINT "Alternatif_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CriteriaMatrix" ADD CONSTRAINT "CriteriaMatrix_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlternativeMatrix" ADD CONSTRAINT "AlternativeMatrix_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HasilPerengkingan" ADD CONSTRAINT "HasilPerengkingan_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
