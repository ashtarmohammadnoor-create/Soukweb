import {getTranslations} from "next-intl/server";
import {prisma} from "@/lib/prisma";
import {Hero} from "@/components/Hero";
import {SectionHeading} from "@/components/SectionHeading";
import {ProductGrid} from "@/components/ProductGrid";
import {CategoryGrid} from "@/components/CategoryGrid";
import {FeatureGrid} from "@/components/FeatureGrid";
import {Testimonials} from "@/components/Testimonials";
import {FAQ} from "@/components/FAQ";
import {Newsletter} from "@/components/Newsletter";
import {jsonToStringArray} from "@/lib/utils";

type Props = {params: Promise<{locale: string}>};

export const dynamic = "force-dynamic";

export default async function HomePage({params}: Props) {
  const {locale} = await params;
  const t = await getTranslations("Home");
  let featuredProducts: Awaited<ReturnType<typeof prisma.product.findMany>> = [];
  let newestProducts: Awaited<ReturnType<typeof prisma.product.findMany>> = [];

  try {
    [featuredProducts, newestProducts] = await Promise.all([
      prisma.product.findMany({
        where: {isActive: true, isFeatured: true},
        orderBy: [{createdAt: "desc"}],
        take: 12
      }),
      prisma.product.findMany({
        where: {isActive: true},
        orderBy: [{createdAt: "desc"}],
        take: 12
      })
    ]);
  } catch (error) {
    console.error("HomePage products query failed", error);
  }

  const productsForHero = featuredProducts.length > 0 ? featuredProducts : newestProducts;
  const productsForPopularSection = featuredProducts.length > 0 ? featuredProducts : newestProducts;
  const categories = [
    {id: "electronics", title: t("categoryElectronics"), description: t("categoryElectronicsDesc"), href: "/products"},
    {id: "home", title: t("categoryHome"), description: t("categoryHomeDesc"), href: "/products"},
    {id: "fashion", title: t("categoryFashion"), description: t("categoryFashionDesc"), href: "/products"},
    {id: "gaming", title: t("categoryGaming"), description: t("categoryGamingDesc"), href: "/products"},
    {id: "office", title: t("categoryOffice"), description: t("categoryOfficeDesc"), href: "/products"},
    {id: "lifestyle", title: t("categoryLifestyle"), description: t("categoryLifestyleDesc"), href: "/products"},
    {id: "travel", title: t("categoryTravel"), description: t("categoryTravelDesc"), href: "/products"},
    {id: "audio", title: t("categoryAudio"), description: t("categoryAudioDesc"), href: "/products"}
  ];
  const offers = [
    {id: "offer-1", title: t("offerOneTitle"), subtitle: t("offerOneSubtitle")},
    {id: "offer-2", title: t("offerTwoTitle"), subtitle: t("offerTwoSubtitle")},
    {id: "offer-3", title: t("offerThreeTitle"), subtitle: t("offerThreeSubtitle")},
    {id: "offer-4", title: t("offerFourTitle"), subtitle: t("offerFourSubtitle")}
  ];
  const features = [
    {id: "feature-quality", title: t("featureQualityTitle"), description: t("featureQualityDesc"), icon: "✓"},
    {id: "feature-shipping", title: t("featureShippingTitle"), description: t("featureShippingDesc"), icon: "🚚"},
    {id: "feature-support", title: t("featureSupportTitle"), description: t("featureSupportDesc"), icon: "💬"},
  ];
  const testimonials = [
    {id: "tm-1", quote: t("testimonialOneQuote"), name: t("testimonialOneName"), role: t("testimonialOneRole")},
    {id: "tm-2", quote: t("testimonialTwoQuote"), name: t("testimonialTwoName"), role: t("testimonialTwoRole")},
    {id: "tm-3", quote: t("testimonialThreeQuote"), name: t("testimonialThreeName"), role: t("testimonialThreeRole")},
  ];
  const faqItems = [
    {id: "faq-1", question: t("faqOneQ"), answer: t("faqOneA")},
    {id: "faq-2", question: t("faqTwoQ"), answer: t("faqTwoA")},
    {id: "faq-3", question: t("faqThreeQ"), answer: t("faqThreeA")},
    {id: "faq-4", question: t("faqFourQ"), answer: t("faqFourA")},
    {id: "faq-5", question: t("faqFiveQ"), answer: t("faqFiveA")},
  ];

  return (
    <div className="space-y-2 py-8 text-base md:text-lg">
      <Hero
        badge={t("badge")}
        title={t("title")}
        description={t("description")}
        ctaPrimary={t("shopProducts")}
        ctaSecondary={t("adminDashboard")}
        products={productsForHero.map((product) => ({
          id: product.id,
          name: product.name,
          image: jsonToStringArray(product.images)[0]
        }))}
      />

      <section className="py-12 md:py-16">
        <SectionHeading title={t("popularTitle")} description={t("popularDesc")} href="/products" actionLabel={t("shopNow")} />
        <ProductGrid
          products={productsForPopularSection}
          locale={locale}
          emptyTitle={t("emptyTitle")}
          emptyDescription={t("emptyDescription")}
          emptyCtaLabel={t("addProducts")}
          emptyCtaHref="/admin/products/new"
          emptyVariant="compact"
        />
      </section>

      <section className="py-12 md:py-16">
        <SectionHeading title={t("newArrivalsTitle")} description={t("newArrivalsDesc")} href="/products" actionLabel={t("shopNow")} />
        <ProductGrid
          products={newestProducts}
          locale={locale}
          emptyTitle={t("emptyTitle")}
          emptyDescription={t("emptyDescription")}
          emptyCtaLabel={t("addProducts")}
          emptyCtaHref="/admin/products/new"
          emptyVariant="compact"
        />
      </section>

      <section className="py-12 md:py-16">
        <SectionHeading title={t("shopByCategoryTitle")} description={t("shopByCategoryDesc")} href="/products" actionLabel={t("browseCategories")} />
        <CategoryGrid categories={categories} />
      </section>

      <section className="py-12 md:py-16">
        <SectionHeading title={t("offersTitle")} description={t("offersDesc")} href="/products" actionLabel={t("shopNow")} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {offers.map((offer) => (
            <div key={offer.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-base font-semibold text-indigo-600">{offer.title}</p>
              <p className="mt-2 text-base text-slate-600">{offer.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="py-12 md:py-16">
        <SectionHeading title={t("whyUsTitle")} description={t("whyUsDesc")} href="/#about" actionLabel={t("learnMore")} />
        <FeatureGrid items={features} />
      </section>

      <section className="py-12 md:py-16">
        <SectionHeading title={t("testimonialsTitle")} description={t("testimonialsDesc")} href="/#testimonials" actionLabel={t("readMore")} />
        <Testimonials items={testimonials} />
      </section>

      <section id="faq" className="py-12 md:py-16">
        <SectionHeading title={t("faqTitle")} description={t("faqDesc")} href="/#contact" actionLabel={t("supportCta")} />
        <FAQ items={faqItems} />
      </section>

      <section id="contact" className="py-12 md:py-16">
        <Newsletter
          title={t("newsletterTitle")}
          description={t("newsletterDesc")}
          placeholder={t("newsletterPlaceholder")}
          actionLabel={t("subscribe")}
        />
      </section>
    </div>
  );
}
