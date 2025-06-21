import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import {
  AlternatifMatrixSchema,
  CriteriaMatrixSchema,
  MatrixRequestBody,
} from "@/schema";
import { requireAuth } from "@/lib/require-auth";

export async function POST(req: Request) {
  try {
    await requireAuth();
    const body: MatrixRequestBody = await req.json();

    const parsedKriteria = CriteriaMatrixSchema.parse({
      analysisId: body.analysisId,
      data: body.criteriaMatrix,
    });

    const parsedAlternatif = AlternatifMatrixSchema.parse({
      analysisId: body.analysisId,
      data: body.alternativeMatrix,
    });

    await prisma.criteriaMatrix.deleteMany({
      where: { analysisId: parsedKriteria.analysisId },
    });

    await prisma.alternativeMatrix.deleteMany({
      where: { analysisId: parsedAlternatif.analysisId },
    });

    await prisma.criteriaMatrix.create({
      data: {
        analysisId: parsedKriteria.analysisId,
        data: parsedKriteria.data,
      },
    });

    await prisma.alternativeMatrix.create({
      data: {
        analysisId: parsedAlternatif.analysisId,
        data: parsedAlternatif.data,
      },
    });

    return NextResponse.json(
      { ok: true, message: "Data berhasil disimpan dan diperbarui." },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const url = new URL(req.url);
    const analysisId = url.searchParams.get("analysisId");

    if (!analysisId) {
      return NextResponse.json(
        { message: "Parameter 'analysisId' wajib diisi." },
        { status: 400 }
      );
    }

    const criteriaMatrix = await prisma.criteriaMatrix.findFirst({
      where: { analysisId },
    });

    const alternativeMatrix = await prisma.alternativeMatrix.findMany({
      where: { analysisId },
    });

    return NextResponse.json(
      {
        data: {
          criteriaMatrix,
          alternativeMatrix,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
