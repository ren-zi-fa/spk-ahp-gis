import { NextResponse } from "next/server";

import { prisma } from "@/lib/database";
import {
  AlternatifMatrixSchema,
  CriteriaMatrixSchema,
  MatrixRequestBody,
} from "@/schema";

export async function POST(req: Request) {
  try {
    const body: MatrixRequestBody = await req.json();

    const parsedKriteria = CriteriaMatrixSchema.parse({
      analysisId: body.analysisId,
      data: body.criteriaMatrix,
    });

    const parsedAlternatif = AlternatifMatrixSchema.parse({
      analysisId: body.analysisId,
      data: body.alternativeMatrix,
    });

    await prisma.criteriaMatrix.create({
      data: {
        analysisId: parsedKriteria.analysisId,
        data: parsedKriteria.data,
      },
    });

    for (const altMatrix of parsedAlternatif.data) {
      await prisma.alternativeMatrix.create({
        data: {
          analysisId: parsedAlternatif.analysisId,
          data: altMatrix,
        },
      });
    }

    return NextResponse.json(
      { ok: true, message: "Data berhasil disimpan" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
