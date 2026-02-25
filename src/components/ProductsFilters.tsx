"use client";

import {FormEvent, useState} from "react";
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
  search: string;
  price: string;
  from: string;
  to: string;
  min: string;
  max: string;
  newest: string;
  cheapest: string;
  expensive: string;
  inStockOnly: string;
  apply: string;
  reset: string;
  invalidRange: string;
};

export function ProductsFilters({query, labels}: {query: Query; labels: Labels}) {
  const [minPrice, setMinPrice] = useState(query.min ?? "");
  const [maxPrice, setMaxPrice] = useState(query.max ?? "");
  const [error, setError] = useState("");

  const numbersOnly = (value: string) => value.replace(/\D/g, "");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const min = minPrice === "" ? undefined : Number(minPrice);
    const max = maxPrice === "" ? undefined : Number(maxPrice);

    if (min !== undefined && max !== undefined && min > max) {
      event.preventDefault();
      setError(labels.invalidRange);
      return;
    }

    setError("");
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_170px_auto] md:items-start">
        <input name="q" defaultValue={query.q} placeholder={labels.search} className="input-field h-10" />

        <AccordionSection title={labels.price} defaultOpen>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">{labels.from}</label>
              <input
                name="min"
                value={minPrice}
                onChange={(event) => setMinPrice(numbersOnly(event.target.value))}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0"
                className="input-field h-10 rounded-xl"
                aria-invalid={Boolean(error)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">{labels.to}</label>
              <input
                name="max"
                value={maxPrice}
                onChange={(event) => setMaxPrice(numbersOnly(event.target.value))}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="999"
                className="input-field h-10 rounded-xl"
                aria-invalid={Boolean(error)}
              />
            </div>
          </div>
          {error ? <p className="mt-2 text-xs font-medium text-rose-600">{error}</p> : null}
        </AccordionSection>

        <div className="space-y-3">
          <select name="sort" defaultValue={query.sort ?? "newest"} className="input-field h-10">
            <option value="newest">{labels.newest}</option>
            <option value="price_asc">{labels.cheapest}</option>
            <option value="price_desc">{labels.expensive}</option>
          </select>

          <label className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-slate-700">
            <input type="checkbox" name="available" value="1" defaultChecked={query.available === "1"} />
            {labels.inStockOnly}
          </label>

          <div className="flex items-center gap-3">
            <button type="submit" className="btn-primary h-10 px-4">
              {labels.apply}
            </button>
            <Link href="/products" className="text-xs font-semibold text-slate-500 hover:text-indigo-600">
              {labels.reset}
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
