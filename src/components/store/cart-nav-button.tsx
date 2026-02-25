"use client";

import {Link} from "@/i18n/navigation";
import {useTranslations} from 'next-intl';
import { useCart } from "@/components/cart-provider";

export function CartNavButton() {
  const t = useTranslations('Nav');
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
      aria-label={t('cart')}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 4h2l2.2 10.5a1 1 0 0 0 .98.8H17a1 1 0 0 0 .97-.76L20 7H7" />
        <circle cx="10" cy="19" r="1.4" />
        <circle cx="17" cy="19" r="1.4" />
      </svg>
      <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-indigo-600 px-1.5 text-center text-[11px] font-semibold text-white">
        {totalItems}
      </span>
    </Link>
  );
}
