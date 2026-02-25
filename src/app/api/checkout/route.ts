import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { checkoutSchema } from "@/lib/validations/checkout";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
  }

  const productIds = parsed.data.cartItems.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      isActive: true,
    },
  });

  const productMap = new Map(products.map((product) => [product.id, product]));

  const missingItem = parsed.data.cartItems.find((item) => !productMap.has(item.productId));
  if (missingItem) {
    return NextResponse.json({ error: "One or more products are unavailable" }, { status: 400 });
  }

  for (const item of parsed.data.cartItems) {
    const product = productMap.get(item.productId);
    if (!product || product.stock < item.quantity) {
      return NextResponse.json({ error: `Insufficient stock for ${product?.name ?? "item"}` }, { status: 400 });
    }
  }

  const totalCents = parsed.data.cartItems.reduce((sum, item) => {
    const product = productMap.get(item.productId)!;
    return sum + product.priceCents * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      userId: session.userId,
      status: "PENDING",
      totalCents,
      currency: "usd",
      customerName: parsed.data.customerName,
      customerEmail: parsed.data.customerEmail,
      shippingAddress: parsed.data.shippingAddress,
      items: {
        create: parsed.data.cartItems.map((item) => {
          const product = productMap.get(item.productId)!;
          return {
            productId: product.id,
            quantity: item.quantity,
            priceCentsSnapshot: product.priceCents,
            productName: product.name,
          };
        }),
      },
    },
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${env.NEXT_PUBLIC_APP_URL}/checkout/success`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/checkout?canceled=1`,
    client_reference_id: session.userId,
    metadata: {
      orderId: order.id,
      userId: session.userId,
    },
    line_items: parsed.data.cartItems.map((item) => {
      const product = productMap.get(item.productId)!;
      return {
        quantity: item.quantity,
        price_data: {
          currency: product.currency,
          unit_amount: product.priceCents,
          product_data: {
            name: product.name,
            description: product.description,
          },
        },
      };
    }),
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: checkoutSession.id },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
