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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const analysisId = searchParams.get("analysisId");

    const kriteria = await prisma.kriteria.findMany({
      where: analysisId ? { analysisId } : {},
      include: {
        analysis: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: kriteria }, { status: 200 });
  } catch (error) {
    console.error("Error fetching kriteria:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kriteria" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Parameter id diperlukan." },
        { status: 400 }
      );
    }

    const deleted = await prisma.kriteria.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "kriteria berhasil dihapus", deleted },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting kriteria:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data kriteria." },
      { status: 500 }
    );
  }
}
