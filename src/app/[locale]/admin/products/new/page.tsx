import {getTranslations} from 'next-intl/server';
import { requireAdminForLocale } from "@/lib/auth";
import { AdminProductForm } from "@/components/admin/admin-product-form";

type Props = {params: Promise<{locale: string}>};

export default async function NewProductPage({params}: Props) {
  const {locale} = await params;
  const t = await getTranslations('Admin');
  await requireAdminForLocale(locale);
  return <div className="space-y-4"><h1 className="text-3xl font-semibold text-slate-950">{t('newProduct')}</h1><AdminProductForm /></div>;
}
