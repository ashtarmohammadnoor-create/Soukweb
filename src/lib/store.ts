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

  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  });

  return products.map((product) => ({
    ...product,
    imageList: jsonToStringArray(product.images),
  }));
}

export async function getProductsCount(options: ProductListOptions = {}) {
  const where = buildProductsWhere(options);
  return prisma.product.count({where});
}

export async function getProductBySlugOrId(slugOrId: string, includeInactive = false) {
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id: slugOrId }, { slug: slugOrId }],
      ...(includeInactive ? {} : { isActive: true }),
    },
  });

  if (!product) {
    return null;
  }

  return {
    ...product,
    imageList: jsonToStringArray(product.images),
  };
}
