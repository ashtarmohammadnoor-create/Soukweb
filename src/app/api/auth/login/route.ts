import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import { setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials format" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: parsed.data.email.toLowerCase(),
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  await setSessionCookie({ userId: user.id, email: user.email, role: user.role });
  return NextResponse.json({ ok: true });
}
