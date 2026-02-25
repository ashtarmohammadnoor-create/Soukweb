import {NextRequest, NextResponse} from "next/server";
import {getProducts, getProductsCount} from "@/lib/store";

type SortOption = "newest" | "price_asc" | "price_desc";

function isSortOption(value: string | null): value is SortOption {
  return value === "newest" || value === "price_asc" || value === "price_desc";
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "24") || 24));
  const sortRaw = searchParams.get("sort");
  const sort = isSortOption(sortRaw) ? sortRaw : undefined;

  const options = {
    search: searchParams.get("q") ?? undefined,
    minPrice: searchParams.get("min") ? Number(searchParams.get("min")) : undefined,
    maxPrice: searchParams.get("max") ? Number(searchParams.get("max")) : undefined,
    availableOnly: searchParams.get("available") === "1",
    sort,
    page,
    limit,
  };

  console.info("[api/products] request", {
    page,
    limit,
    sort: sort ?? "newest",
    availableOnly: options.availableOnly,
    hasSearch: Boolean(options.search),
  });

  const [products, total] = await Promise.all([
    getProducts(options),
    getProductsCount(options),
  ]);

  console.info("[api/products] response", {
    count: products.length,
    total,
    page,
    limit,
  });

  return NextResponse.json({
    items: products,
    total,
    page,
    limit,
  });
}
