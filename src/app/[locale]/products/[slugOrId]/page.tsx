import { notFound } from "next/navigation";
import Image from "next/image";
import {getLocale, getTranslations} from 'next-intl/server';
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { formatCurrency } from "@/lib/utils";
import { getProductBySlugOrId } from "@/lib/store";
import { localizeProduct } from "@/lib/product-i18n";

type Props = { params: Promise<{ slugOrId: string }>; };

export default async function ProductDetailsPage({ params }: Props) {
  const [{slugOrId}, locale, t] = await Promise.all([params, getLocale(), getTranslations('Products')]);
  const dbProduct = await getProductBySlugOrId(slugOrId);
  if (!dbProduct) notFound();
  const product = localizeProduct(dbProduct, locale);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3">
        <div className="relative h-96 overflow-hidden rounded-xl border border-slate-200 bg-white">{product.imageList[0] ? <Image src={product.imageList[0]} alt={product.name} fill className="object-cover" /> : null}</div>
        <div className="grid grid-cols-3 gap-3">{product.imageList.slice(1).map((image) => <div key={image} className="relative h-24 overflow-hidden rounded-md border border-slate-200 bg-white"><Image src={image} alt={product.name} fill className="object-cover" /></div>)}</div>
      </div>
      <article className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-3xl font-semibold text-slate-950">{product.name}</h1>
        <p className="mt-3 text-slate-600">{product.description}</p>
        <p className="mt-4 text-2xl font-semibold text-slate-900">{formatCurrency(product.priceCents, product.currency, locale)}</p>
        <p className="mt-1 text-sm text-slate-500">{t('stock')}: {product.stock}</p>
        <div className="mt-5"><AddToCartButton product={{id: product.id, slug: product.slug, name: product.name, priceCents: product.priceCents, currency: product.currency, stock: product.stock, image: product.imageList[0]}} /></div>
      </article>
    </div>
  );
}
