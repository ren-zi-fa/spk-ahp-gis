import { prisma } from "@/lib/database";
import { requireAuth } from "@/lib/require-auth";
import { KriteriaSchema } from "@/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json();
    const parsed = KriteriaSchema.parse(body);

    await prisma.kriteria.deleteMany({
      where: {
        analysisId: parsed.analysisId,
      },
    });
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
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAuth();
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
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
