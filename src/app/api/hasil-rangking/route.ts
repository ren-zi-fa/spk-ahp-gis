import { prisma } from "@/lib/database";
import { requireAuth } from "@/lib/require-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json();
    const { analysisId, result } = body;

    if (!analysisId || !result || typeof result !== "object") {
      return NextResponse.json(
        { message: "analysisId dan result (object) wajib diisi" },
        { status: 400 }
      );
    }
    await prisma.hasilPerengkingan.deleteMany({
      where: { analysisId: analysisId },
    });

    const created = await prisma.hasilPerengkingan.create({
      data: {
        analysisId,
        dataRangking: result,
      },
    });

    return NextResponse.json(
      { message: "Berhasil menyimpan hasil perengkingan", data: created },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(req.url);
    const analysisId = searchParams.get("analysisId");

    if (!analysisId) {
      return NextResponse.json(
        { message: "Parameter 'analysisId' wajib disertakan" },
        { status: 400 }
      );
    }

    const result = await prisma.hasilPerengkingan.findFirst({
      where: { analysisId },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Data tidak ditemukan untuk analysisId tersebut" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
