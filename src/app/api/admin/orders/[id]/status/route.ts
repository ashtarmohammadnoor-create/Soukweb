import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateOrderStatusSchema } from "@/lib/validations/product";

type Context = { params: Promise<{ id: string }>; };

export async function PATCH(request: Request, context: Context) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const parsed = updateOrderStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  await prisma.order.update({ where: { id }, data: { status: parsed.data.status } });
  return NextResponse.json({ ok: true });
}
