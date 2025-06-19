import { prisma } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const analysisId = searchParams.get("analysisId");

    const whereClause = analysisId ? { analysisId } : {};

    const [kriteria, alternatif] = await Promise.all([
      prisma.kriteria.findMany({
        where: whereClause,
        include: {
          analysis: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.alternatif.findMany({
        where: whereClause,
        include: {
          analysis: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json(
      {
        data: {
          kriteria,
          alternatif,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching kriteria & alternatif:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kriteria dan alternatif" },
      { status: 500 }
    );
  }
}
