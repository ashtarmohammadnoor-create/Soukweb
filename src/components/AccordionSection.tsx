"use client";

import {PropsWithChildren, useState} from "react";

type Props = PropsWithChildren<{
  title: string;
  defaultOpen?: boolean;
}>;

export function AccordionSection({title, defaultOpen = false, children}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/70">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold text-slate-900"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>v</span>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-3 pb-3">{children}</div>
      </div>
    </section>
  );
}
