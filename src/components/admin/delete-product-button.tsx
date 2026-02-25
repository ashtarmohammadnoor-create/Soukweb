"use client";

import { useTransition } from "react";
import {useRouter} from "@/i18n/navigation";
import {useTranslations} from 'next-intl';
import { toast } from "sonner";

export function DeleteProductButton({ productId }: { productId: string }) {
  const t = useTranslations('Admin');
  const c = useTranslations('Common');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(t('deleteConfirm'))) return;
        startTransition(async () => {
          const response = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
          if (!response.ok) {
            toast.error(t('deleteFailed'));
            return;
          }
          toast.success(t('deleted'));
          router.refresh();
        });
      }}
      className="rounded-md border border-rose-300 px-3 py-1 text-rose-700 disabled:opacity-50"
    >
      {c('delete')}
    </button>
  );
}
