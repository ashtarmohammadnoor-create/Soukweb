import {Link} from '@/i18n/navigation';

type Props = {
  title: string;
  description?: string;
  href?: string;
  actionLabel?: string;
};

export function SectionHeading({title, description, href, actionLabel}: Props) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">{title}</h2>
        {description ? <p className="mt-2 text-sm text-slate-600 md:text-base">{description}</p> : null}
      </div>
      {href && actionLabel ? <Link href={href} className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700">{actionLabel}</Link> : null}
    </div>
  );
}
