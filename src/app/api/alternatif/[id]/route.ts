import { requireAuth } from "@/lib/auth/require-auth";
import { prisma } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Parameter id diperlukan." },
        { status: 400 }
      );
    }
    const deleted = await prisma.alternatif.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Alternatif berhasil dihapus", deleted },
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