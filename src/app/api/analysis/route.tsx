import { prisma } from "@/lib/database";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Cek apakah nama sudah ada di database
    const existingAnalysis = await prisma.analysis.findFirst({
      where: { name: body.analysisName },
    });

    if (existingAnalysis) {
      return NextResponse.json(
        { message: "Nama analisis sudah digunakan." },
        { status: 400 }
      );
    }

    // Jika tidak ada, buat data baru
    await prisma.analysis.create({
      data: {
        id: body.id,
        name: body.analysisName,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Data berhasil disimpan",
      },
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
export async function GET() {
  try {
    const data = await prisma.analysis.findMany();
    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

