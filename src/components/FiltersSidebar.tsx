"use client";

import {FormEvent, useMemo, useState} from "react";
import {Link} from "@/i18n/navigation";
import {AccordionSection} from "@/components/AccordionSection";

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
};

export function FiltersSidebar({query, labels}: Props) {
  const [minDisplay, setMinDisplay] = useState(
    query.min && !Number.isNaN(Number(query.min)) ? String(Math.floor(Number(query.min) / 100)) : ""
  );
  const [maxDisplay, setMaxDisplay] = useState(
    query.max && !Number.isNaN(Number(query.max)) ? String(Math.floor(Number(query.max) / 100)) : ""
  );
  const [error, setError] = useState("");

  const minCents = useMemo(() => (minDisplay ? String(Number(minDisplay) * 100) : ""), [minDisplay]);
  const maxCents = useMemo(() => (maxDisplay ? String(Number(maxDisplay) * 100) : ""), [maxDisplay]);

  const numbersOnly = (value: string) => value.replace(/\D/g, "");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const min = minDisplay ? Number(minDisplay) : undefined;
    const max = maxDisplay ? Number(maxDisplay) : undefined;
    if (min !== undefined && max !== undefined && min > max) {
      event.preventDefault();
      setError(labels.invalidRange);
      return;
    }
    setError("");
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="pb-2 text-sm font-bold text-slate-900">{labels.filtersTitle}</div>
      <div className="divide-y divide-slate-200">
        <div className="py-3">
          <AccordionSection title={labels.price} defaultOpen>
            <input type="hidden" name="min" value={minCents} />
            <input type="hidden" name="max" value={maxCents} />
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">{labels.from}</label>
                <div className="flex items-center gap-2">
                  <input
                    value={minDisplay}
                    onChange={(event) => setMinDisplay(numbersOnly(event.target.value))}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="0"
                    className="input-field h-10 rounded-xl"
                    aria-invalid={Boolean(error)}
                  />
                  <span className="text-xs text-slate-500">{labels.currencyUnit}</span>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">{labels.to}</label>
                <div className="flex items-center gap-2">
                  <input
                    value={maxDisplay}
                    onChange={(event) => setMaxDisplay(numbersOnly(event.target.value))}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="999"
                    className="input-field h-10 rounded-xl"
                    aria-invalid={Boolean(error)}
                  />
                  <span className="text-xs text-slate-500">{labels.currencyUnit}</span>
                </div>
              </div>
            </div>
            {error ? <p className="mt-2 text-xs font-medium text-rose-600">{error}</p> : null}
          </AccordionSection>
        </div>

        <div className="py-3">
          <AccordionSection title={labels.sortSection}>
            <select name="sort" defaultValue={query.sort ?? "newest"} className="input-field h-10">
              <option value="newest">{labels.newest}</option>
              <option value="price_asc">{labels.cheapest}</option>
              <option value="price_desc">{labels.expensive}</option>
            </select>
          </AccordionSection>
        </div>

        <div className="py-3">
          <AccordionSection title={labels.availabilitySection}>
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" name="available" value="1" defaultChecked={query.available === "1"} />
              {labels.inStockOnly}
            </label>
          </AccordionSection>
        </div>

        <div className="py-3">
          <AccordionSection title={labels.searchSection}>
            <input name="q" defaultValue={query.q} placeholder={labels.search} className="input-field h-10" />
          </AccordionSection>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <button type="submit" className="btn-primary h-10 w-full rounded-xl">
          {labels.apply}
        </button>
        <Link href="/products" className="btn-secondary h-10 w-full rounded-xl">
          {labels.reset}
        </Link>
      </div>
    </form>
  );
}
