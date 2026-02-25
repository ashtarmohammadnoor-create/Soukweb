import {Link} from "@/i18n/navigation";

type Props = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({ title, description, actionHref, actionLabel }: Props) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-slate-600">{description}</p>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="mt-5 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
