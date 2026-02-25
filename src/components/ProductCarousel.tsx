"use client";

import {useRef} from "react";
import {useLocale} from "next-intl";
import {ProductCardCompact} from "@/components/ProductCardCompact";

type Item = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  currency: string;
  image?: string;
};

type Props = {
  products: Item[];
  discountBadge: string;
};

export function ProductCarousel({products, discountBadge}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const isRTL = locale === "ar";

  const scrollByCard = (direction: "prev" | "next") => {
    const node = trackRef.current;
    if (!node) return;
    const step = 280;
    const delta = direction === "next" ? step : -step;
    node.scrollBy({left: isRTL ? -delta : delta, behavior: "smooth"});
  };

  return (
    <div className="relative">
      <div className="absolute end-0 top-[-3.2rem] hidden items-center gap-2 md:flex">
        <button type="button" onClick={() => scrollByCard("prev")} className="btn-secondary h-10 w-10 rounded-2xl p-0" aria-label="previous">
          {"<"}
        </button>
        <button type="button" onClick={() => scrollByCard("next")} className="btn-secondary h-10 w-10 rounded-2xl p-0" aria-label="next">
          {">"}
        </button>
      </div>

      <div ref={trackRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
        {products.map((product, index) => (
          <ProductCardCompact
            key={product.id}
            locale={locale}
            product={product}
            badge={index % 3 === 0 ? discountBadge : undefined}
          />
        ))}
      </div>
    </div>
  );
}
