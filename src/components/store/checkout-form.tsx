"use client";

import { useEffect, useState, useTransition } from "react";
import {useRouter} from "@/i18n/navigation";
import {useSearchParams} from "next/navigation";
import {useLocale, useTranslations} from 'next-intl';
import { toast } from "sonner";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/utils";

type Props = { userEmail: string };

export function CheckoutForm({ userEmail }: Props) {
  const t = useTranslations('Checkout');
  const c = useTranslations('Common');
  const locale = useLocale();
  const { items, totalCents } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState(userEmail);
  const [shippingAddress, setShippingAddress] = useState("");

  useEffect(() => { if (searchParams.get("canceled") === "1") toast.error(t('paymentCanceled')); }, [searchParams, t]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (items.length === 0) {
      toast.error(t('cartEmpty'));
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, customerEmail, shippingAddress, cartItems: items.map((item) => ({ productId: item.productId, quantity: item.quantity })) }),
      });

      const data = (await response.json()) as { error?: string; url?: string };
      if (!response.ok || !data.url) {
        toast.error(data.error ?? t('checkoutFailed'));
        return;
      }

      router.push(data.url);
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-950">{t('title')}</h1>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{t('fullName')}</label>
          <input required value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{c('email')}</label>
          <input required type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{t('shippingAddress')}</label>
          <textarea required value={shippingAddress} onChange={(event) => setShippingAddress(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2" rows={4} />
        </div>
        <button type="submit" disabled={isPending || items.length === 0} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:bg-slate-400">
          {isPending ? t('creatingSession') : t('pay')}
        </button>
      </form>
      <aside className="h-fit rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">{t('orderSummary')}</h2>
        <div className="mt-3 space-y-2 text-sm text-slate-600">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>{formatCurrency(item.priceCents * item.quantity, item.currency, locale)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-slate-200 pt-3 text-lg font-semibold text-slate-900">{c('total')}: {formatCurrency(totalCents, 'usd', locale)}</div>
      </aside>
    </div>
  );
}
