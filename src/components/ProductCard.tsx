"use client";

import Image from "next/image";
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {AddToCartButton} from '@/components/store/add-to-cart-button';
import {formatCurrency} from '@/lib/utils';

type ProductCardProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    description: string;
    priceCents: number;
    currency: string;
    stock: number;
    image?: string;
  };
};

export function ProductCard({product}: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations('Products');
  const inStock = product.stock > 0;
  const safeName = product.name?.trim() || t("fallbackName");
  const safeDescription = product.description?.trim() || t("fallbackDescription");
  const safePrice = Number.isFinite(product.priceCents) ? product.priceCents : 0;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-soft">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <span
            className={`absolute end-3 top-3 z-10 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
              inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}
          >
            {inStock ? t('inStock') : t('outOfStock')}
          </span>
          {product.image ? (
            <Image
              src={product.image}
              alt={safeName}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : null}
        </div>
      </Link>

      <div className="space-y-3 p-4 md:p-5">
        <div className="space-y-1.5">
          <Link href={`/products/${product.slug}`} className="line-clamp-2 text-base font-semibold leading-6 text-slate-900 transition group-hover:text-indigo-600 md:text-lg">
            {safeName}
          </Link>
          <p className="line-clamp-2 text-sm leading-6 text-slate-600">{safeDescription}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-slate-900">{formatCurrency(safePrice, product.currency, locale)}</p>
        </div>

        <div>
          <AddToCartButton product={{id: product.id, slug: product.slug, name: safeName, priceCents: safePrice, currency: product.currency, stock: product.stock, image: product.image}} />
        </div>
      </div>
    </article>
  );
}
