import { prisma } from "@/lib/database";
import { KriteriaSchema } from "@/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = KriteriaSchema.parse(body);

    // Hapus semua kriteria lama untuk analysisId tersebut
    await prisma.kriteria.deleteMany({
      where: {
        analysisId: parsed.analysisId,
      },
    });

    // Simpan kriteria baru
    const created = await prisma.kriteria.createMany({
      data: parsed.criteria.map((item) => ({
        name: item.name,
        analysisId: parsed.analysisId,
      })),
    });

    return NextResponse.json(
      { message: "Kriteria berhasil diperbarui", count: created.count },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving kriteria:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan kriteria." },
      { status: 500 }
    );
  }
}
