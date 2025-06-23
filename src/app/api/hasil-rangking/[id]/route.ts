import { requireAuth } from "@/lib/auth/require-auth";
import { prisma } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const analysisId = (await params).id;

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
