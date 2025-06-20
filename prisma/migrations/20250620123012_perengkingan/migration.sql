-- CreateTable
CREATE TABLE "HasilPerengkingan" (
    "id" TEXT NOT NULL,
    "dataRangking" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "analysisId" TEXT NOT NULL,

    CONSTRAINT "HasilPerengkingan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HasilPerengkingan" ADD CONSTRAINT "HasilPerengkingan_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
