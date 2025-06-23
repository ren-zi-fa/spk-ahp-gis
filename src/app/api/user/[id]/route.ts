import { prisma } from "@/lib/database";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAuth } from "@/lib/auth/require-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        { error: "Parameter ID diperlukan." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        { error: "Parameter ID diperlukan." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { username, password } = body;

    if (typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Username dan password wajib berupa string." },
        { status: 400 }
      );
    }

    if (!username.trim() || !password.trim()) {
      return NextResponse.json(
        { error: "Username dan password tidak boleh kosong." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "User tidak ditemukan." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Gagal memperbarui data pengguna." },
      { status: 500 }
    );
  }
}
