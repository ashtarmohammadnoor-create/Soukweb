import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripeClient } from "@/lib/stripe";
import { getEnv } from "@/lib/env";

export const runtime = "nodejs";

async function handlePaid(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        stripePaymentId: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
      },
    });

    for (const item of order.items) {
      if (!item.productId) {
        continue;
      }
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }
  });
}

async function handleFailed(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    return;
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "FAILED" },
  });
}

export async function POST(request: Request) {
  const env = getEnv();
  const stripe = getStripeClient(env.STRIPE_SECRET_KEY);
  const rawBody = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    await handlePaid(event.data.object as Stripe.Checkout.Session);
  }

  if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
    await handleFailed(event.data.object as Stripe.Checkout.Session);
  }

  return NextResponse.json({ received: true });
}
