import {getTranslations} from "next-intl/server";
import {prisma} from "@/lib/prisma";
import {Hero} from "@/components/Hero";
import {ProductCarousel} from "@/components/ProductCarousel";
import {SectionHeading} from "@/components/SectionHeading";
import {EmptyState} from "@/components/empty-state";
import {jsonToStringArray} from "@/lib/utils";
import {localizeProduct} from "@/lib/product-i18n";

type Props = {params: Promise<{locale: string}>};

export default async function HomePage({params}: Props) {
  const {locale} = await params;
  const [products, t] = await Promise.all([
    prisma.product.findMany({
      where: {isActive: true},
      orderBy: [{isFeatured: "desc"}, {createdAt: "desc"}],
      take: 12
    }),
    getTranslations("Home")
  ]);

  const localizedProducts = products.map((product) => ({
    ...localizeProduct(product, locale),
    image: jsonToStringArray(product.images)[0]
  }));

  return (
    <div className="space-y-10 py-10 md:space-y-12 md:py-12">
      <Hero
        badge={t("badge")}
        title={t("title")}
        description={t("description")}
        ctaPrimary={t("shopProducts")}
        ctaSecondary={t("adminDashboard")}
        products={localizedProducts}
      />

      <section className="py-10">
        <SectionHeading title={t("popularTitle")} href="/products" actionLabel={t("viewAll")} />
        {localizedProducts.length === 0 ? (
          <EmptyState
            title={t("emptyTitle")}
            description={t("emptyDescription")}
            actionHref="/admin/products"
            actionLabel={t("openAdmin")}
          />
        ) : (
          <ProductCarousel products={localizedProducts} discountBadge={t("discountBadge")} />
        )}
      </section>

      <section id="about" className="rounded-2xl border border-slate-200 bg-white p-6 py-10 shadow-sm md:p-8">
        <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">{t("aboutTitle")}</h3>
        <p className="mt-3 max-w-3xl text-slate-600">{t("aboutText")}</p>
      </section>

      <section id="contact" className="rounded-2xl border border-slate-200 bg-white p-6 py-10 shadow-sm md:p-8">
        <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">{t("contactTitle")}</h3>
        <p className="mt-3 max-w-3xl text-slate-600">{t("contactText")}</p>
      </section>
    </div>
  );
}
