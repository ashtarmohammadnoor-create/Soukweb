import Stripe from "stripe";

export function getStripeClient(secretKey?: string) {
  const key = secretKey ?? process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  return new Stripe(key, {
    apiVersion: "2026-01-28.clover",
  });
}
