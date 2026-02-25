"use client";

import { useTransition } from "react";
import {useRouter} from "@/i18n/navigation";
import {useTranslations} from 'next-intl';
import { toast } from "sonner";

const STATUSES = ["PENDING", "PAID", "FAILED", "PROCESSING", "SHIPPED", "CANCELED"] as const;

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const t = useTranslations('Admin');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      disabled={isPending}
      defaultValue={status}
      onChange={(event) => {
        startTransition(async () => {
          const response = await fetch(`/api/admin/orders/${orderId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: event.target.value }),
          });

          if (!response.ok) {
            toast.error(t('statusFailed'));
            return;
          }

          toast.success(t('statusUpdated'));
          router.refresh();
        });
      }}
      className="rounded-md border border-slate-300 px-2 py-1 text-sm"
    >
      {STATUSES.map((item) => (
        <option key={item} value={item}>{item}</option>
      ))}
    </select>
  );
}
