// app/api/analysis/route.ts
import { prisma } from "@/lib/database";
import { requireAuth } from "@/lib/auth/require-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await requireAuth();

    const body = await req.json();

    const existingAnalysis = await prisma.analysis.findFirst({
      where: { name: body.analysisName },
    });

    if (existingAnalysis) {
      return NextResponse.json(
        { message: "Nama analisis sudah digunakan." },
        { status: 400 }
      );
    }

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
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.error("Terjadi kesalahan:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await requireAuth();

    const data = await prisma.analysis.findMany();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.error("Terjadi kesalahan:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
