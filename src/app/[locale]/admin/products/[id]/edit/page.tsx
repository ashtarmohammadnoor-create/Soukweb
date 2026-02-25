import { notFound } from "next/navigation";
import {getTranslations} from 'next-intl/server';
import { requireAdminForLocale } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import { jsonToStringArray } from "@/lib/utils";

type Props = {params: Promise<{locale: string; id: string}>};

export default async function EditProductPage({ params }: Props) {
  const {locale, id} = await params;
  const t = await getTranslations('Admin');
  await requireAdminForLocale(locale);

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return <div className="space-y-4"><h1 className="text-3xl font-semibold text-slate-950">{t('editProduct')}</h1><AdminProductForm initial={{id: product.id, name: product.name, slug: product.slug, description: product.description, priceCents: product.priceCents, currency: product.currency, stock: product.stock, isActive: product.isActive, isFeatured: product.isFeatured, images: jsonToStringArray(product.images)}} /></div>;
}
