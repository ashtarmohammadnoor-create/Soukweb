import {ProductCard} from "@/components/ProductCard";
import {EmptyState} from "@/components/EmptyState";
import {Link} from "@/i18n/navigation";
import {localizeProduct} from "@/lib/product-i18n";
import {jsonToStringArray} from "@/lib/utils";

type ProductItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  currency: string;
  stock: number;
  images: string;
};

type Props = {
  products: ProductItem[];
  locale: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyCtaLabel: string;
  emptyCtaHref?: string;
  emptyVariant?: "full" | "compact";
};

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="aspect-[4/3] w-full animate-pulse bg-slate-100" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}

export function ProductGrid({
  products,
  locale,
  emptyTitle,
  emptyDescription,
  emptyCtaLabel,
  emptyCtaHref = "/products",
  emptyVariant = "full",
}: Props) {
  if (products.length === 0) {
    if (emptyVariant === "compact") {
      return (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-base text-slate-600">{emptyDescription}</p>
            <Link href={emptyCtaHref} className="btn-primary mt-3 inline-flex h-11 rounded-2xl px-5">
              {emptyCtaLabel}
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {Array.from({length: 8}).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <EmptyState title={emptyTitle} description={emptyDescription} ctaLabel={emptyCtaLabel} ctaHref={emptyCtaHref} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {Array.from({length: 8}).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {products.map((product) => {
        const localized = localizeProduct(product, locale);
        return (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              slug: product.slug,
              name: localized.name,
              description: localized.description,
              priceCents: product.priceCents,
              currency: product.currency,
              stock: product.stock,
              image: jsonToStringArray(product.images)[0],
            }}
          />
        );
      })}
    </div>
  );
}
