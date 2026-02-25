"use client";

import Image from "next/image";
import {Link} from "@/i18n/navigation";
import {useLocale, useTranslations} from 'next-intl';
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/utils";

export function CartView() {
  const t = useTranslations('Cart');
  const locale = useLocale();
  const { items, totalCents, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <h2 className="text-xl font-semibold text-slate-900">{t('emptyTitle')}</h2>
        <p className="mt-2 text-slate-600">{t('emptyDescription')}</p>
        <Link href="/products" className="mt-5 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">{t('browse')}</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {items.map((item) => (
          <article key={item.productId} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-md bg-slate-100">
              {item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" /> : null}
            </div>
            <div className="flex flex-1 items-center justify-between gap-4">
              <div>
                <p className="font-medium text-slate-900">{item.name}</p>
                <p className="text-sm text-slate-500">{formatCurrency(item.priceCents, item.currency, locale)}</p>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min={1} max={item.stock} value={item.quantity} onChange={(event) => updateQuantity(item.productId, Number(event.target.value))} className="w-16 rounded-md border border-slate-300 px-2 py-1 text-sm" />
                <button type="button" onClick={() => removeItem(item.productId)} className="rounded-md border border-rose-300 px-3 py-1 text-sm text-rose-700">{t('remove')}</button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <aside className="h-fit rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">{t('summary')}</h2>
        <p className="mt-2 text-sm text-slate-600">{t('subtotal')}</p>
        <p className="text-2xl font-semibold text-slate-900">{formatCurrency(totalCents, 'usd', locale)}</p>
        <Link href="/checkout" className="mt-4 inline-block w-full rounded-md bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white">{t('checkout')}</Link>
      </aside>
    </div>
  );
}
