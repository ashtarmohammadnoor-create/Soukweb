"use client";

import {useState} from "react";
import {Link} from "@/i18n/navigation";

type Props = {
  productsLabel: string;
  aboutLabel: string;
  contactLabel: string;
  loginLabel: string;
  accountLabel: string;
  adminLabel: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
};

export function NavbarMobileMenu({
  productsLabel,
  aboutLabel,
  contactLabel,
  loginLabel,
  accountLabel,
  adminLabel,
  isLoggedIn,
  isAdmin,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50"
        aria-label="Toggle menu"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open ? (
        <div className="absolute start-4 end-4 top-16 z-50 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
          <div className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            <Link href="/products" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-100">{productsLabel}</Link>
            <Link href="/#about" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-100">{aboutLabel}</Link>
            <Link href="/#contact" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-100">{contactLabel}</Link>
            {isAdmin ? <Link href="/admin" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-100">{adminLabel}</Link> : null}
            <Link href={isLoggedIn ? "/account/orders" : "/login"} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-100">{isLoggedIn ? accountLabel : loginLabel}</Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
