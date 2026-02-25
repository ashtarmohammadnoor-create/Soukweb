"use client";

import {Link} from "@/i18n/navigation";
import Image from "next/image";
import {useLocale} from 'next-intl';
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { formatCurrency } from "@/lib/utils";

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

export function ProductCard({ product }: ProductCardProps) {
  const locale = useLocale();

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-[4/3] w-full bg-slate-100">
          {product.image ? <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" /> : null}
        </div>
      </Link>
      <div className="space-y-3 p-4 md:p-5">
        <div>
          <Link href={`/products/${product.slug}`} className="line-clamp-1 text-base font-semibold text-slate-900 group-hover:text-indigo-600 md:text-lg">{product.name}</Link>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-slate-900">{formatCurrency(product.priceCents, product.currency, locale)}</p>
          <AddToCartButton product={{ id: product.id, slug: product.slug, name: product.name, priceCents: product.priceCents, currency: product.currency, stock: product.stock, image: product.image }} />
        </div>
      </div>
    </article>
  );
}
