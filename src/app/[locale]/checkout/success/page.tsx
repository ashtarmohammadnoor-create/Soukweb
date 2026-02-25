import {Link} from "@/i18n/navigation";
import {getTranslations} from 'next-intl/server';
import { ClearCartOnSuccess } from "@/components/store/clear-cart-on-success";

export default async function CheckoutSuccessPage() {
  const t = await getTranslations('Checkout');
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
      <ClearCartOnSuccess />
      <h1 className="text-3xl font-semibold text-emerald-900">{t('successTitle')}</h1>
      <p className="mt-2 text-emerald-800">{t('successDescription')}</p>
      <Link href="/account/orders" className="mt-5 inline-block rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white">{t('viewOrders')}</Link>
    </div>
  );
}
