import {Link} from "@/i18n/navigation";
import {getTranslations} from 'next-intl/server';
import { requireAdminForLocale } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Props = {params: Promise<{locale: string}>};

export default async function AdminPage({params}: Props) {
  const {locale} = await params;
  const t = await getTranslations('Admin');
  await requireAdminForLocale(locale);

  const [productsCount, ordersCount, usersCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-slate-950">{t('dashboard')}</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">{t('productsCount')}</p><p className="text-3xl font-bold text-slate-900">{productsCount}</p></article>
        <article className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">{t('ordersCount')}</p><p className="text-3xl font-bold text-slate-900">{ordersCount}</p></article>
        <article className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">{t('usersCount')}</p><p className="text-3xl font-bold text-slate-900">{usersCount}</p></article>
      </div>
      <div className="flex gap-3">
        <Link href="/admin/products" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">{t('manageProducts')}</Link>
        <Link href="/admin/orders" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">{t('manageOrders')}</Link>
      </div>
    </div>
  );
}
