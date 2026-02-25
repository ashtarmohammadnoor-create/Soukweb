import {Link} from "@/i18n/navigation";
import {getTranslations} from 'next-intl/server';
import { requireAdminForLocale } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

type Props = {params: Promise<{locale: string}>};

export default async function AdminProductsPage({params}: Props) {
  const {locale} = await params;
  const t = await getTranslations('Admin');
  const c = await getTranslations('Common');
  await requireAdminForLocale(locale);

  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-slate-950">{t('productsTitle')}</h1>
        <Link href="/admin/products/new" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">{t('addProduct')}</Link>
      </div>

      {products.length === 0 ? (
        <EmptyState title={t('noProductsTitle')} description={t('noProductsDescription')} actionHref="/admin/products/new" actionLabel={t('addProduct')} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">{t('name')}</th><th className="px-4 py-3">{t('price')}</th><th className="px-4 py-3">{t('stock')}</th><th className="px-4 py-3">{t('active')}</th><th className="px-4 py-3">{c('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-slate-100">
                  <td className="px-4 py-3"><p className="font-medium text-slate-900">{product.name}</p><p className="text-xs text-slate-500">{product.slug}</p></td>
                  <td className="px-4 py-3">{formatCurrency(product.priceCents, product.currency, locale)}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">{product.isActive ? c('yes') : c('no')}</td>
                  <td className="px-4 py-3"><div className="flex gap-2"><Link href={`/admin/products/${product.id}/edit`} className="rounded-md border border-slate-300 px-3 py-1">{c('edit')}</Link><DeleteProductButton productId={product.id} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
