type FeatureItem = {
  id: string;
  title: string;
  description: string;
  icon: "quality" | "shipping" | "support";
};

type Props = {
  items: FeatureItem[];
};

export function FeatureGrid({items}: Props) {
  const renderIcon = (icon: FeatureItem["icon"]) => {
    if (icon === "quality") {
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3 5 6v6c0 4.5 3.1 7.6 7 9 3.9-1.4 7-4.5 7-9V6l-7-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    }
    if (icon === "shipping") {
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 7h11v8H3z" />
          <path d="M14 10h3l3 3v2h-6z" />
          <circle cx="8" cy="18" r="1.8" />
          <circle cx="18" cy="18" r="1.8" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 5h16v10H8l-4 4z" />
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {items.map((item) => (
        <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">{renderIcon(item.icon)}</div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
          <p className="mt-2 text-base text-slate-600">{item.description}</p>
        </article>
      ))}
    </div>
  );
}
