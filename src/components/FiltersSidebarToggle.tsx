"use client";

import {useEffect, useState} from "react";
import {FiltersSidebar} from "@/components/FiltersSidebar";

type Query = {
  q?: string;
  min?: string;
  max?: string;
  available?: string;
  sort?: string;
};

type Labels = {
  filtersTitle: string;
  searchSection: string;
  search: string;
  price: string;
  from: string;
  to: string;
  currencyUnit: string;
  sortSection: string;
  newest: string;
  cheapest: string;
  expensive: string;
  availabilitySection: string;
  inStockOnly: string;
  apply: string;
  reset: string;
  invalidRange: string;
};

type Props = {
  query: Query;
  labels: Labels;
  isRTL: boolean;
};

export function FiltersSidebarToggle({query, labels, isRTL}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <div className="mb-5">
        <button type="button" className="btn-secondary h-10 px-4" onClick={() => setOpen(true)}>
          {labels.filtersTitle}
        </button>
      </div>

      <div className={`fixed inset-0 z-50 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
        <button type="button" aria-label="close-overlay" onClick={() => setOpen(false)} className={`absolute inset-0 bg-slate-900/35 transition ${open ? "opacity-100" : "opacity-0"}`} />
        <aside
          className={`absolute top-0 h-screen w-[85vw] max-w-72 overflow-y-auto border-slate-200 bg-white p-4 shadow-xl transition-transform duration-300 ${
            isRTL ? "right-0" : "left-0"
          } ${open ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"}`}
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">{labels.filtersTitle}</h2>
            <button type="button" className="btn-secondary h-8 px-3 text-xs" onClick={() => setOpen(false)}>
              X
            </button>
          </div>
          <FiltersSidebar query={query} labels={labels} />
        </aside>
      </div>
    </>
  );
}
