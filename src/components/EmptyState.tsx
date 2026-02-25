import {Link} from "@/i18n/navigation";

type Props = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

export function EmptyState({title, description, ctaLabel, ctaHref}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">{description}</p>
      <Link href={ctaHref} className="btn-primary mt-4 h-11 rounded-2xl px-5">
        {ctaLabel}
      </Link>
    </div>
  );
}
