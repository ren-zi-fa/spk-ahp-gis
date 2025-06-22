import { prisma } from "@/lib/database";
import { requireAuth } from "@/lib/auth/require-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
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
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
