import { prisma } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client"; // pastikan ini diimport

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  if (!id) {
    return NextResponse.json(
      { error: "Parameter id diperlukan." },
      { status: 400 }
    );
  }

  try {
    const deleted = await prisma.analysis.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: "Data berhasil dihapus", deleted },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Data tidak ditemukan." },
          { status: 404 }
        );
      }
    }

    console.error("Error deleting analysis:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data." },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  if (!id) {
    return NextResponse.json(
      { error: "Parameter id diperlukan." },
      { status: 400 }
    );
  }

  try {
    const analysisName = await prisma.analysis.findFirst({
      where: { id },
    });
    return NextResponse.json(
      { success: true, data: analysisName },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Data tidak ditemukan." },
          { status: 404 }
        );
      }
    }

    console.error("Error fetching analysis:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data." },
      { status: 500 }
    );
  }
}
