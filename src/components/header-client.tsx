"use client";

import {FormEvent, useEffect, useState} from "react";
import {Link, useRouter} from "@/i18n/navigation";
import {LanguageSwitcher} from "@/components/language-switcher";
import {TopBar} from "@/components/TopBar";
import {CategoriesRow} from "@/components/CategoriesRow";
import {useCart} from "@/components/cart-provider";

type HeaderLabels = {
  brand: string;
  searchPlaceholder: string;
  allCategories: string;
  trackOrder: string;
  login: string;
  account: string;
  favorites: string;
  cart: string;
  uspFreeShipping: string;
  uspFreeReturns: string;
  uspLowPrices: string;
  uspMillions: string;
  uspSupport: string;
  categoryElectronics: string;
  categoryHome: string;
  categoryFashion: string;
  categoryGaming: string;
  categoryOffice: string;
};

type Props = {
  labels: HeaderLabels;
  isLoggedIn: boolean;
};

function ActionItem({icon, label, href, badge}: {icon: React.ReactNode; label: string; href: string; badge?: number}) {
  return (
    <Link href={href} className="relative flex min-w-11 flex-col items-center gap-1 rounded-xl px-1.5 py-1 text-slate-700 hover:bg-slate-100 sm:min-w-14 sm:px-2">
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">{icon}</span>
      {typeof badge === "number" && badge > 0 ? (
        <span className="absolute top-0 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[11px] font-semibold text-white">
          {badge}
        </span>
      ) : null}
      <span className="hidden text-[11px] font-medium sm:block">{label}</span>
    </Link>
  );
}

export function HeaderClient({labels, isLoggedIn}: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const {totalItems} = useCart();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) {
      router.push("/products");
      return;
    }
    router.push(`/products?q=${encodeURIComponent(value)}`);
  };

  return (
    <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition ${scrolled ? "shadow-sm" : ""}`}>
      <TopBar
        items={[
          {id: "free-shipping", label: labels.uspFreeShipping},
          {id: "free-returns", label: labels.uspFreeReturns},
          {id: "low-prices", label: labels.uspLowPrices},
          {id: "millions", label: labels.uspMillions},
          {id: "support", label: labels.uspSupport}
        ]}
      />

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6 lg:px-8">
          <Link href="/" className="shrink-0 text-lg font-black tracking-tight text-slate-900 sm:text-2xl">
            {labels.brand}
          </Link>

          <form onSubmit={onSearch} className="relative hidden w-full max-w-2xl md:block">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={labels.searchPlaceholder}
              className="input-field h-12 rounded-2xl border-slate-300 ps-4 pe-12"
            />
            <span className="pointer-events-none absolute inset-y-0 end-4 inline-flex items-center text-slate-400">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
          </form>

          <div className="ms-auto flex items-start gap-0.5 sm:gap-2">
            <ActionItem
              href="/account/orders"
              label={labels.trackOrder}
              icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M4 12h16M4 17h8" /></svg>}
            />
            <ActionItem
              href={isLoggedIn ? "/account/orders" : "/login"}
              label={isLoggedIn ? labels.account : labels.login}
              icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="3.3" /><path d="M5 19c1.3-3 4-4.5 7-4.5s5.7 1.5 7 4.5" /></svg>}
            />
            <ActionItem
              href="/products"
              label={labels.favorites}
              icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m12 20-6.2-5.6a4.2 4.2 0 0 1 5.8-6l.4.3.4-.3a4.2 4.2 0 0 1 5.8 6z" /></svg>}
            />
            <ActionItem
              href="/cart"
              label={labels.cart}
              badge={totalItems}
              icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 4h2l2.2 10.5a1 1 0 0 0 .98.8H17a1 1 0 0 0 .97-.76L20 7H7" /></svg>}
            />
            <div className="hidden pt-1 md:block">
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 pb-3 md:hidden">
          <div className="flex items-center gap-2">
            <form onSubmit={onSearch} className="relative w-full">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={labels.searchPlaceholder}
                className="input-field h-11 rounded-2xl border-slate-300 ps-4 pe-12"
              />
              <span className="pointer-events-none absolute inset-y-0 end-4 inline-flex items-center text-slate-400">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </span>
            </form>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <CategoriesRow
        triggerLabel={labels.allCategories}
        items={[
          {id: "electronics", label: labels.categoryElectronics, href: "/products"},
          {id: "home", label: labels.categoryHome, href: "/products"},
          {id: "fashion", label: labels.categoryFashion, href: "/products"},
          {id: "gaming", label: labels.categoryGaming, href: "/products"},
          {id: "office", label: labels.categoryOffice, href: "/products"}
        ]}
      />
    </header>
  );
}
