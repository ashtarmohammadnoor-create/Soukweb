import {getTranslations} from 'next-intl/server';
import { requireUserForLocale } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";

type Props = {params: Promise<{locale: string}>};

export default async function AccountOrdersPage({params}: Props) {
  const [{locale}, t, c] = await Promise.all([params, getTranslations('Account'), getTranslations('Common')]);
  const session = await requireUserForLocale(locale);

  const orders = await prisma.order.findMany({ where: { userId: session.userId }, include: { items: true }, orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-slate-950">{t('title')}</h1>
      {orders.length === 0 ? <EmptyState title={t('emptyTitle')} description={t('emptyDescription')} actionHref="/products" actionLabel={t('startShopping')} /> : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="text-xs text-slate-500">{t('orderId')}</p><p className="font-medium text-slate-900">{order.id}</p></div>
                <div><p className="text-xs text-slate-500">{c('status')}</p><p className="font-semibold text-slate-900">{order.status}</p></div>
                <div><p className="text-xs text-slate-500">{c('total')}</p><p className="font-semibold text-slate-900">{formatCurrency(order.totalCents, order.currency, locale)}</p></div>
                <div><p className="text-xs text-slate-500">{c('date')}</p><p className="font-semibold text-slate-900">{formatDate(order.createdAt, locale)}</p></div>
              </div>
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm">{order.items.map((item) => <div key={item.id} className="flex items-center justify-between"><span>{item.productName} x {item.quantity}</span><span>{formatCurrency(item.priceCentsSnapshot * item.quantity, order.currency, locale)}</span></div>)}</div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
