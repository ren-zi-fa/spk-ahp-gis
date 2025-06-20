import { prisma } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { analysisId, result } = body;

    if (!analysisId || !result || typeof result !== "object") {
      return NextResponse.json(
        { message: "analysisId dan result (object) wajib diisi" },
        { status: 400 }
      );
    }

    // 🔍 Cek apakah sudah ada data hasil sebelumnya untuk analysisId
    await prisma.hasilPerengkingan.deleteMany({
      where: { analysisId: analysisId },
    });

    // ✅ Simpan data baru
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
    console.error("POST /api/hasil-perengkingan", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
