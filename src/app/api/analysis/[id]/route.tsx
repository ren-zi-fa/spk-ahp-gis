import { prisma } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client"; // pastikan ini diimport
import { requireAuth } from "@/lib/auth/require-auth";
import { updateAnalysisSchema } from "@/schema";

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
    const analysis = await prisma.analysis.findFirst({
      where: { id },
      include: {
        alternatif: true,
      },
    });

    if (!analysis) {
      return NextResponse.json(
        { error: "Data tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: analysis },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saat mengambil data analysis:", error);

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validasi input
    const validationResult = updateAnalysisSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input data",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const existingAnalysis = await prisma.analysis.findUnique({
      where: { id },
    });

    if (!existingAnalysis) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 }
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    if (validationResult.data.name) {
      updateData.name = validationResult.data.name;
    }

    if (validationResult.data.createdAt) {
      updateData.createdAt = new Date(validationResult.data.createdAt);
    }

    const updatedAnalysis = await prisma.analysis.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      {
        message: "Analysis updated successfully",
        data: updatedAnalysis,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating analysis:", error);

    // Handle Prisma errors
    if (error instanceof Error) {
      // Prisma unique constraint error
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "Analysis with this name already exists" },
          { status: 409 }
        );
      }

      // Prisma foreign key constraint error
      if (error.message.includes("Foreign key constraint")) {
        return NextResponse.json(
          { error: "Cannot update analysis due to related data constraints" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
