import {Link} from "@/i18n/navigation";

type CategoryItem = {
  id: string;
  title: string;
  description: string;
  href: string;
};

type Props = {
  categories: CategoryItem[];
};

export function CategoryGrid({categories}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={category.href}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="text-base font-semibold text-slate-900">{category.title}</div>
          <p className="mt-1 text-sm text-slate-600">{category.description}</p>
        </Link>
      ))}
    </div>
  );
}
