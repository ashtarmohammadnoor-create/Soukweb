import {Link} from '@/i18n/navigation';

type Props = {
  title: string;
  href?: string;
  actionLabel?: string;
};

export function SectionHeading({title, href, actionLabel}: Props) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3 md:mb-6">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">{title}</h2>
      {href && actionLabel ? (
        <Link href={href} className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
