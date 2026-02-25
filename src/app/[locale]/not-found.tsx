import {Link} from "@/i18n/navigation";
import {getTranslations} from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('Common');
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-8 text-center">
      <h1 className="text-3xl font-semibold text-slate-950">{t('notFoundTitle')}</h1>
      <p className="mt-2 text-slate-600">{t('notFoundDescription')}</p>
      <Link href="/" className="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">{t('backHome')}</Link>
    </div>
  );
}
