"use client";

import {Link, usePathname} from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  label: string;
};

export function NavLink({ href, label }: Props) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium transition",
        pathname === href ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-600" : "text-slate-700 hover:bg-slate-100",
      )}
    >
      {label}
    </Link>
  );
}
