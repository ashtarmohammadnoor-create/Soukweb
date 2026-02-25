"use client";

import {useEffect, useRef, useState} from "react";
import {Link} from "@/i18n/navigation";

type CategoryItem = {
  id: string;
  label: string;
  href: string;
};

type Props = {
  triggerLabel: string;
  items: CategoryItem[];
  className?: string;
};

export function CategoriesRow({triggerLabel, items, className}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) setOpen(false);
    };

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("mousedown", onClickOutside);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div className={`border-b border-slate-200 bg-white/95 ${className ?? ""}`}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8" ref={rootRef}>
        <div className="relative flex h-11 items-center sm:h-12">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 sm:h-10 sm:px-4"
            aria-expanded={open}
          >
            {triggerLabel}
            <svg
              viewBox="0 0 24 24"
              className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {open ? (
            <div className="absolute start-0 top-12 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
