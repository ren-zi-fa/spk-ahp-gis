import { prisma } from "@/lib/database";
import { requireAuth } from "@/lib/auth/require-auth";
import { AlternatifSchema } from "@/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json();
    const parsed = AlternatifSchema.parse(body);

    
    const created = await prisma.alternatif.createMany({
      data: parsed.alternatif.map((item) => ({
        name: item.name,
        lang: item.lang,
        lat: item.lat,
        analysisId: parsed.analysisId,
      })),
    });

    return NextResponse.json(
      { message: "Alternatif berhasil disimpan", count: created.count },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan alternatif." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(req.url);
    const analysisId = searchParams.get("analysisId");

    const alternatif = await prisma.alternatif.findMany({
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

    return NextResponse.json({ data: alternatif }, { status: 200 });
  } catch (error) {
    console.error("Error fetching alternatif:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data alternatif" },
      { status: 500 }
    );
  }
}
