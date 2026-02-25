import Image from "next/image";
import {Link} from "@/i18n/navigation";

type HeroProduct = {
  id: string;
  name: string;
  image?: string;
};

type Props = {
  badge: string;
  title: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  products: HeroProduct[];
};

export function Hero({badge, title, description, ctaPrimary, ctaSecondary, products}: Props) {
  const heroImages = products.slice(0, 4);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-10">
      <div className="grid items-center gap-6 md:grid-cols-2 md:gap-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">{badge}</p>
          <h1 className="mt-3 text-2xl font-bold leading-tight text-slate-950 sm:text-3xl md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-xl text-base text-slate-600 md:text-lg">{description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/products" className="btn-primary h-11 rounded-2xl px-5">{ctaPrimary}</Link>
            <Link href="/admin" className="btn-secondary h-11 rounded-2xl px-5">{ctaSecondary}</Link>
          </div>
        </div>

        <div className="relative min-h-[210px] sm:min-h-[260px]">
          <span className="absolute -top-4 end-8 h-16 w-16 rounded-full bg-indigo-100 sm:-top-6 sm:end-10 sm:h-24 sm:w-24" />
          <span className="absolute bottom-0 start-6 h-14 w-14 rounded-full bg-sky-100 sm:start-8 sm:h-20 sm:w-20" />
          <span className="absolute top-8 start-0 h-10 w-10 rounded-full bg-emerald-100 sm:top-10 sm:h-14 sm:w-14" />

          <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
            {heroImages.map((item, index) => (
              <div key={item.id} className={`relative aspect-square overflow-hidden rounded-full border border-slate-200 bg-slate-100 ${index % 2 ? "mt-5 sm:mt-8" : ""}`}>
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 45vw, 240px" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
