"use client";

import {useLocale, useTranslations} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';

export function LanguageSwitcher() {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="inline-flex items-center rounded-xl border border-slate-300 bg-white p-1">
      <button
        type="button"
        onClick={() => {
          const nextLocale: 'en' | 'ar' = 'en';
          document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
          router.replace(pathname, {locale: nextLocale});
          router.refresh();
        }}
        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${locale === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
        aria-label={t('english')}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => {
          const nextLocale: 'en' | 'ar' = 'ar';
          document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
          router.replace(pathname, {locale: nextLocale});
          router.refresh();
        }}
        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${locale === 'ar' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
        aria-label={t('arabic')}
      >
        AR
      </button>
    </div>
  );
}
