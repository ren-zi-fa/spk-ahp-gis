import { prisma } from "@/lib/database";
import { AlternatifSchema } from "@/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AlternatifSchema.parse(body);

    const names = parsed.alternatif.map((item) => item.name);

    // Cari jika ada nama yang sudah ada
    const existing = await prisma.alternatif.findMany({
      where: {
        name: { in: names },
      },
      select: { name: true },
    });

    if (existing.length > 0) {
      return NextResponse.json(
        {
          error: "Data sudah ditambahkan",
          existing: existing.map((e) => e.name),
        },
        { status: 409 }
      );
    }

    // Jika tidak ada duplikat, insert
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
    console.error("Error saving alternatif:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan alternatif." },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest) {
  try {
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
