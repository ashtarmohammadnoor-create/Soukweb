import {getTranslations} from 'next-intl/server';
import { requireAdminForLocale } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

type Props = {params: Promise<{locale: string}>};

export default async function AdminOrdersPage({params}: Props) {
  const {locale} = await params;
  const t = await getTranslations('Admin');
  const c = await getTranslations('Common');
  await requireAdminForLocale(locale);

  const orders = await prisma.order.findMany({ include: { user: true, items: true }, orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-slate-950">{t('ordersTitle')}</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="text-xs text-slate-500">{c('order')}</p><p className="font-medium text-slate-900">{order.id}</p></div>
              <div><p className="text-xs text-slate-500">{c('user')}</p><p className="font-medium text-slate-900">{order.user.email}</p></div>
              <div><p className="text-xs text-slate-500">{c('total')}</p><p className="font-semibold text-slate-900">{formatCurrency(order.totalCents, order.currency, locale)}</p></div>
              <div><p className="text-xs text-slate-500">{c('date')}</p><p className="font-semibold text-slate-900">{formatDate(order.createdAt, locale)}</p></div>
              <OrderStatusSelect orderId={order.id} status={order.status} />
            </div>
            <div className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-600">{order.items.map((item) => <p key={item.id}>{item.productName} x {item.quantity}</p>)}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
