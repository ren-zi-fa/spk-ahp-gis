import { prisma } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

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
  } catch (error: any) {
    console.error("Error deleting analysis:", error);

    if (error.code === "P2025") {
      // Prisma: record not found
      return NextResponse.json(
        { error: "Data tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Gagal menghapus data." },
      { status: 500 }
    );
  }
}
