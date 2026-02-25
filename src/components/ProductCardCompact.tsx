import Image from "next/image";
import {Link} from "@/i18n/navigation";
import {formatCurrency} from "@/lib/utils";

type Props = {
  locale: string;
  product: {
    id: string;
    slug: string;
    name: string;
    priceCents: number;
    currency: string;
    image?: string;
  };
  badge?: string;
};

export function ProductCardCompact({locale, product, badge}: Props) {
  return (
    <article className="w-56 shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:w-64">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-slate-100">
          {badge ? <span className="absolute start-2 top-2 z-10 rounded-full bg-rose-500 px-2 py-1 text-[11px] font-bold text-white">{badge}</span> : null}
          {product.image ? <Image src={product.image} alt={product.name} fill className="object-cover" sizes="256px" /> : null}
        </div>
        <div className="space-y-1 p-3">
          <p className="line-clamp-2 min-h-10 text-sm font-semibold text-slate-900">{product.name}</p>
          <p className="text-base font-bold text-slate-900">{formatCurrency(product.priceCents, product.currency, locale)}</p>
        </div>
      </Link>
    </article>
  );
}
