"use client";

type USPItem = {
  id: string;
  label: string;
};

type Props = {
  items: USPItem[];
};

export function TopBar({items}: Props) {
  return (
    <div className="h-10 border-b border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center gap-6 overflow-x-auto px-4 sm:px-6 lg:px-8">
        {items.map((item) => (
          <div key={item.id} className="flex shrink-0 items-center gap-2 text-xs font-medium text-slate-200">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
