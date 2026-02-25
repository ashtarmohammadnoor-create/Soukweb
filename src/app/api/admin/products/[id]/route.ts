import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";

type Context = { params: Promise<{ id: string }>; };

export async function PATCH(request: Request, context: Context) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid product data" }, { status: 400 });
  }

  await prisma.product.update({
    where: { id },
    data: {
      ...parsed.data,
      images: JSON.stringify(parsed.data.images),
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, context: Context) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
