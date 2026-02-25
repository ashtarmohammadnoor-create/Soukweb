"use client";

import {useTranslations} from 'next-intl';
import { useCart } from "@/components/cart-provider";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    priceCents: number;
    currency: string;
    stock: number;
    image?: string;
  };
};

export function AddToCartButton({ product }: Props) {
  const t = useTranslations('Products');
  const { addItem } = useCart();

  return (
    <button
      type="button"
      disabled={product.stock === 0}
      onClick={() =>
        addItem({ productId: product.id, slug: product.slug, name: product.name, priceCents: product.priceCents, currency: product.currency, stock: product.stock, image: product.image }, 1)
      }
      className="w-full rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {product.stock > 0 ? t('addToCart') : t('outOfStock')}
    </button>
  );
}
