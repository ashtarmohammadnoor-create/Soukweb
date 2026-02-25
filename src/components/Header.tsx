import {getTranslations} from 'next-intl/server';
import {getSession} from '@/lib/auth';
import {HeaderClient} from '@/components/header-client';

export async function Header() {
  const [session, t] = await Promise.all([getSession(), getTranslations('Nav')]);

  return (
    <HeaderClient
      labels={{
        brand: t('brand'),
        searchPlaceholder: t('searchPlaceholder'),
        allCategories: t('allCategories'),
        trackOrder: t('trackOrder'),
        login: t('login'),
        account: t('account'),
        favorites: t('favorites'),
        cart: t('cart'),
        uspFreeShipping: t('uspFreeShipping'),
        uspFreeReturns: t('uspFreeReturns'),
        uspLowPrices: t('uspLowPrices'),
        uspMillions: t('uspMillions'),
        uspSupport: t('uspSupport'),
        categoryElectronics: t('categoryElectronics'),
        categoryHome: t('categoryHome'),
        categoryFashion: t('categoryFashion'),
        categoryGaming: t('categoryGaming'),
        categoryOffice: t('categoryOffice'),
      }}
      isLoggedIn={Boolean(session)}
    />
  );
}
