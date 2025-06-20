import { NextRequest, NextResponse } from "next/server";
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

    // Hapus data lama jika sudah ada untuk analysisId yang sama
    await prisma.criteriaMatrix.deleteMany({
      where: { analysisId: parsedKriteria.analysisId },
    });

    await prisma.alternativeMatrix.deleteMany({
      where: { analysisId: parsedAlternatif.analysisId },
    });

    // Simpan data kriteria baru
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
    console.error("Terjadi kesalahan:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const analysisId = url.searchParams.get("analysisId");

    if (!analysisId) {
      return NextResponse.json(
        { message: "Parameter 'analysisId' wajib diisi." },
        { status: 400 }
      );
    }

    // Ambil data CriteriaMatrix berdasarkan analysisId
    const criteriaMatrix = await prisma.criteriaMatrix.findFirst({
      where: { analysisId },
    });

    // Ambil semua data AlternativeMatrix berdasarkan analysisId
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
    console.error("Terjadi kesalahan:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
