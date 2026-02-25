"use client";

import {useTransition} from "react";
import {useRouter} from "@/i18n/navigation";
import {useTranslations} from 'next-intl';

export function UserMenu({ email }: { email: string }) {
  const t = useTranslations('Nav');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleLogout() {
    startTransition(async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="btn-secondary h-10 disabled:opacity-50"
      title={email}
    >
      {isPending ? t('loggingOut') : t('logout')}
    </button>
  );
}
