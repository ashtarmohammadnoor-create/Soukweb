import {Link} from "@/i18n/navigation";
import {getTranslations} from 'next-intl/server';
import { getSession } from "@/lib/auth";
import { NavLink } from "@/components/nav-link";
import { UserMenu } from "@/components/user-menu";
import { CartNavButton } from "@/components/store/cart-nav-button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NavbarMobileMenu } from "@/components/navbar-mobile-menu";

export async function Navbar() {
  const [session, t] = await Promise.all([getSession(), getTranslations('Nav')]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex items-center gap-2 md:gap-5">
          <Link href="/" className="text-lg font-bold tracking-tight text-slate-950">
            {t('brand')}
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            <NavLink href="/products" label={t('products')} />
            <NavLink href="/#about" label={t('about')} />
            <NavLink href="/#contact" label={t('contact')} />
            {session?.role === "ADMIN" ? <NavLink href="/admin" label={t('admin')} /> : null}
          </div>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <CartNavButton />
          {session ? (
            <>
              <NavLink href="/account/orders" label={t('account')} />
              <UserMenu email={session.email} />
            </>
          ) : (
            <NavLink href="/login" label={t('login')} />
          )}
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <CartNavButton />
          <LanguageSwitcher />
          <NavbarMobileMenu
            productsLabel={t('products')}
            aboutLabel={t('about')}
            contactLabel={t('contact')}
            loginLabel={t('login')}
            accountLabel={t('account')}
            adminLabel={t('admin')}
            isLoggedIn={Boolean(session)}
            isAdmin={session?.role === "ADMIN"}
          />
        </div>
      </div>
    </header>
  );
}
