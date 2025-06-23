import { prisma } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client"; // pastikan ini diimport
import { requireAuth } from "@/lib/auth/require-auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        { error: "Parameter id diperlukan." },
        { status: 400 }
      );
    }

    const deleted = await prisma.analysis.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: "Data berhasil dihapus", deleted },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Data tidak ditemukan." },
          { status: 404 }
        );
      }
    }
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
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Data tidak ditemukan." },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
