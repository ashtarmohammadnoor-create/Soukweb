import type {Metadata} from 'next';
import {hasLocale} from 'next-intl';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {Container} from '@/components/Container';
import {Providers} from '@/components/providers';
import {routing, type AppLocale} from '@/i18n/routing';

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const safeLocale: AppLocale = hasLocale(routing.locales, locale) ? locale : 'en';
  const t = await getTranslations({locale: safeLocale, namespace: 'Meta'});
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      languages: {
        en: '/en',
        ar: '/ar'
      }
    }
  };
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const safeLocale: AppLocale = locale;
  const dir = safeLocale === "ar" ? "rtl" : "ltr";
  setRequestLocale(safeLocale);
  const messages = await getMessages({locale: safeLocale});

  return (
    <NextIntlClientProvider locale={safeLocale} messages={messages}>
      <Providers>
        <div dir={dir} lang={safeLocale} className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Container>{children}</Container>
          </main>
          <Footer />
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
}
