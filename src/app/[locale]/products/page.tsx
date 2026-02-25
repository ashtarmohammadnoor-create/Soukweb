import {Link} from "@/i18n/navigation";
import {getTranslations} from 'next-intl/server';
import { EmptyState } from "@/components/empty-state";
import {ProductCard} from '@/components/ProductCard';
import {FiltersSidebarToggle} from '@/components/FiltersSidebarToggle';
import { getProducts, getProductsCount } from "@/lib/store";
import { localizeProduct } from "@/lib/product-i18n";

type SortOption = "newest" | "price_asc" | "price_desc";

const isSortOption = (value: unknown): value is SortOption =>
  value === "newest" || value === "price_asc" || value === "price_desc";

type Props = {
  params: Promise<{locale: string}>;
  searchParams: Promise<{q?: string; min?: string; max?: string; available?: string; sort?: string; page?: string;}>;
};

export default async function ProductsPage({ params, searchParams }: Props) {
  const {locale} = await params;
  const isRTL = locale === "ar";
  const query = await searchParams;
  const t = await getTranslations('Products');
  const c = await getTranslations('Common');
  const page = Math.max(1, Number(query.page ?? "1") || 1);
  const limit = 24;
  const sortRaw = query.sort;
  const sort = typeof sortRaw === "string" && isSortOption(sortRaw) ? sortRaw : undefined;
  const filterOptions = {
    search: query.q,
    minPrice: query.min ? Number(query.min) : undefined,
    maxPrice: query.max ? Number(query.max) : undefined,
    availableOnly: query.available === "1",
    sort
  };

  const [products, totalProducts] = await Promise.all([
    getProducts({...filterOptions, page, limit}),
    getProductsCount(filterOptions)
  ]);
  const totalPages = Math.max(1, Math.ceil(totalProducts / limit));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const buildPageHref = (nextPage: number) => {
    const params = new URLSearchParams();
    if (query.q) params.set("q", query.q);
    if (query.min) params.set("min", query.min);
    if (query.max) params.set("max", query.max);
    if (query.available) params.set("available", query.available);
    if (query.sort) params.set("sort", query.sort);
    params.set("page", String(nextPage));
    return `/products?${params.toString()}`;
  };
  const labels = {
    filtersTitle: t('filtersTitle'),
    searchSection: t('searchSection'),
    search: t('search'),
    price: t('price'),
    from: t('from'),
    to: t('to'),
    currencyUnit: t('currencyUnit'),
    sortSection: t('sortSection'),
    newest: t('newest'),
    cheapest: t('cheapest'),
    expensive: t('expensive'),
    availabilitySection: t('availabilitySection'),
    inStockOnly: t('inStockOnly'),
    apply: c('apply'),
    reset: t('resetFilters'),
    invalidRange: t('invalidRange'),
  };

  return (
    <div className="pt-6 pb-10 md:pt-8 md:pb-12">
      <h1 className="mb-7 text-3xl font-bold tracking-tight text-slate-950 md:mb-8 md:text-4xl">{t('title')}</h1>

      <FiltersSidebarToggle query={query} labels={labels} isRTL={isRTL} />

      {products.length === 0 ? <div className="mt-6"><EmptyState title={t('emptyTitle')} description={t('emptyDescription')} actionHref="/products" actionLabel={t('resetFilters')} /></div> : <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={{...localizeProduct(product, locale), image: product.imageList[0]}} />)}</div>}
      {totalProducts > limit ? (
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          {canPrev ? (
            <Link href={buildPageHref(page - 1)} className="btn-secondary h-10 rounded-xl">
              {t('prev')}
            </Link>
          ) : <span />}
          <p className="text-sm text-slate-600">{t('pageInfo', {page, total: totalPages})}</p>
          {canNext ? (
            <Link href={buildPageHref(page + 1)} className="btn-secondary h-10 rounded-xl">
              {t('next')}
            </Link>
          ) : <span />}
        </div>
      ) : null}
      <p className="text-xs text-slate-500">{t('tip')} <Link href="/products" className="underline">/products/[slugOrId]</Link></p>
    </div>
  );
}
