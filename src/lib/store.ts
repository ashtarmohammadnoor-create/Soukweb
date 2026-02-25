import { prisma } from "@/lib/prisma";
import { jsonToStringArray } from "@/lib/utils";

type ProductListOptions = {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  availableOnly?: boolean;
  sort?: "newest" | "price_asc" | "price_desc";
  adminView?: boolean;
  page?: number;
  limit?: number;
};

type DbProduct = Awaited<ReturnType<typeof prisma.product.findMany>>[number];

const FALLBACK_PRODUCTS: DbProduct[] = [
  {
    id: "fallback-wallet",
    slug: "minimal-leather-wallet",
    name: "Minimal Leather Wallet",
    description: "Slim full-grain leather wallet with RFID protection.",
    priceCents: 3900,
    currency: "usd",
    images: JSON.stringify(["/uploads/sample-wallet.svg"]),
    isActive: true,
    isFeatured: true,
    stock: 22,
    createdAt: new Date("2026-01-05T00:00:00.000Z"),
    updatedAt: new Date("2026-01-05T00:00:00.000Z"),
  },
  {
    id: "fallback-backpack",
    slug: "urban-backpack",
    name: "Urban Backpack",
    description: "Water-resistant everyday backpack with laptop sleeve.",
    priceCents: 7900,
    currency: "usd",
    images: JSON.stringify(["/uploads/sample-backpack.svg"]),
    isActive: true,
    isFeatured: true,
    stock: 14,
    createdAt: new Date("2026-01-04T00:00:00.000Z"),
    updatedAt: new Date("2026-01-04T00:00:00.000Z"),
  },
  {
    id: "fallback-mug",
    slug: "ceramic-coffee-mug",
    name: "Ceramic Coffee Mug",
    description: "Hand-glazed 350ml mug for daily coffee ritual.",
    priceCents: 1800,
    currency: "usd",
    images: JSON.stringify(["/uploads/sample-mug.svg"]),
    isActive: true,
    isFeatured: false,
    stock: 40,
    createdAt: new Date("2026-01-03T00:00:00.000Z"),
    updatedAt: new Date("2026-01-03T00:00:00.000Z"),
  },
  {
    id: "fallback-headphones",
    slug: "noise-isolating-headphones",
    name: "Noise-Isolating Headphones",
    description: "Comfort fit over-ear headphones with rich bass.",
    priceCents: 12900,
    currency: "usd",
    images: JSON.stringify(["/uploads/sample-headphones.svg"]),
    isActive: true,
    isFeatured: true,
    stock: 9,
    createdAt: new Date("2026-01-02T00:00:00.000Z"),
    updatedAt: new Date("2026-01-02T00:00:00.000Z"),
  },
];

function filterFallbackProducts(options: ProductListOptions): DbProduct[] {
  const search = options.search?.trim().toLowerCase();

  return FALLBACK_PRODUCTS.filter((product) => {
    if (!options.adminView && !product.isActive) return false;
    if (options.availableOnly && product.stock <= 0) return false;
    if (typeof options.minPrice === "number" && product.priceCents < options.minPrice) return false;
    if (typeof options.maxPrice === "number" && product.priceCents > options.maxPrice) return false;
    if (
      search &&
      !product.name.toLowerCase().includes(search) &&
      !product.description.toLowerCase().includes(search)
    ) {
      return false;
    }
    return true;
  });
}

function sortFallbackProducts(products: DbProduct[], sort: ProductListOptions["sort"]) {
  const sorted = [...products];
  sorted.sort((a, b) => {
    if (sort === "price_asc") return a.priceCents - b.priceCents;
    if (sort === "price_desc") return b.priceCents - a.priceCents;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
  return sorted;
}

function mapStoreProducts(products: DbProduct[]) {
  return products.map((product) => ({
    ...product,
    imageList: jsonToStringArray(product.images),
  }));
}

function buildProductsWhere(options: ProductListOptions) {
  const priceFilter: { gte?: number; lte?: number } = {};
  if (typeof options.minPrice === "number") {
    priceFilter.gte = options.minPrice;
  }
  if (typeof options.maxPrice === "number") {
    priceFilter.lte = options.maxPrice;
  }

  const where = {
    ...(options.adminView ? {} : { isActive: true }),
    ...(options.search
      ? {
          OR: [
            { name: { contains: options.search } },
            { description: { contains: options.search } },
          ],
        }
      : {}),
    ...(Object.keys(priceFilter).length > 0 ? { priceCents: priceFilter } : {}),
    ...(options.availableOnly ? { stock: { gt: 0 } } : {}),
  };
  return where;
}

export async function getProducts(options: ProductListOptions = {}) {
  const where = buildProductsWhere(options);
  const orderBy =
    options.sort === "price_asc"
      ? { priceCents: "asc" as const }
      : options.sort === "price_desc"
        ? { priceCents: "desc" as const }
        : { createdAt: "desc" as const };

  const page = Math.max(1, options.page ?? 1);
  const limit = Math.max(1, options.limit ?? 100);

  let products: Awaited<ReturnType<typeof prisma.product.findMany>> = [];
  try {
    products = await prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });
  } catch (error) {
    console.error("getProducts failed", error);
    const fallback = sortFallbackProducts(filterFallbackProducts(options), options.sort).slice(
      (page - 1) * limit,
      page * limit
    );
    return mapStoreProducts(fallback);
  }

  return mapStoreProducts(products);
}

export async function getProductsCount(options: ProductListOptions = {}) {
  const where = buildProductsWhere(options);
  try {
    return await prisma.product.count({where});
  } catch (error) {
    console.error("getProductsCount failed", error);
    return filterFallbackProducts(options).length;
  }
}

export async function getProductBySlugOrId(slugOrId: string, includeInactive = false) {
  let product = null;
  try {
    product = await prisma.product.findFirst({
      where: {
        OR: [{ id: slugOrId }, { slug: slugOrId }],
        ...(includeInactive ? {} : { isActive: true }),
      },
    });
  } catch (error) {
    console.error("getProductBySlugOrId failed", error);
    return null;
  }

  if (!product) {
    return null;
  }

  return {
    ...product,
    imageList: jsonToStringArray(product.images),
  };
}
