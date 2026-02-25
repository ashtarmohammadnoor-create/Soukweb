import { CartView } from "@/components/store/cart-view";
import {getTranslations} from 'next-intl/server';

export default async function CartPage() {
  const t = await getTranslations('Cart');
  return <div className="space-y-6"><h1 className="text-3xl font-semibold text-slate-950">{t('title')}</h1><CartView /></div>;
}
