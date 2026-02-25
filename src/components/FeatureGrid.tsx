type FeatureItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type Props = {
  items: FeatureItem[];
};

export function FeatureGrid({items}: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {items.map((item) => (
        <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">{item.icon}</div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
          <p className="mt-2 text-base text-slate-600">{item.description}</p>
        </article>
      ))}
    </div>
  );
}
