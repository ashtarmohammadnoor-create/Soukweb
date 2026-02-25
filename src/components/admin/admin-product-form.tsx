"use client";

import { useState, useTransition } from "react";
import {useRouter} from "@/i18n/navigation";
import {useTranslations} from 'next-intl';
import { toast } from "sonner";

type ProductFormValue = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  currency: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  images: string[];
};

export function AdminProductForm({ initial }: { initial?: ProductFormValue }) {
  const t = useTranslations('Admin');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priceCents, setPriceCents] = useState(initial?.priceCents ?? 1000);
  const [currency, setCurrency] = useState(initial?.currency ?? "usd");
  const [stock, setStock] = useState(initial?.stock ?? 1);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);

  function suggestSlug(value: string) {
    setSlug(value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body });
    const data = (await response.json()) as { error?: string; path?: string };
    setIsUploading(false);

    if (!response.ok || !data.path) {
      toast.error(data.error ?? t('uploadFailed'));
      return;
    }

    setImages((current) => [...current, data.path as string]);
    toast.success(t('uploadSuccess'));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = { name, slug, description, priceCents, currency, stock, isActive, isFeatured, images };

    startTransition(async () => {
      const endpoint = initial?.id ? `/api/admin/products/${initial.id}` : "/api/admin/products";
      const method = initial?.id ? "PATCH" : "POST";
      const response = await fetch(endpoint, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(data.error ?? t('saveFailed'));
        return;
      }

      toast.success(initial?.id ? t('updated') : t('created'));
      router.push("/admin/products");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{t('name')}</label>
          <input required value={name} onChange={(event) => { setName(event.target.value); if (!initial?.id) suggestSlug(event.target.value); }} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{t('slug')}</label>
          <input required value={slug} onChange={(event) => setSlug(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">{t('description')}</label>
        <textarea required rows={5} value={description} onChange={(event) => setDescription(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div><label className="mb-1 block text-sm font-medium text-slate-700">{t('priceCents')}</label><input required type="number" min={1} value={priceCents} onChange={(event) => setPriceCents(Number(event.target.value))} className="w-full rounded-md border border-slate-300 px-3 py-2" /></div>
        <div><label className="mb-1 block text-sm font-medium text-slate-700">{t('currency')}</label><input required value={currency} onChange={(event) => setCurrency(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2" /></div>
        <div><label className="mb-1 block text-sm font-medium text-slate-700">{t('stock')}</label><input required type="number" min={0} value={stock} onChange={(event) => setStock(Number(event.target.value))} className="w-full rounded-md border border-slate-300 px-3 py-2" /></div>
      </div>
      <div className="flex flex-wrap gap-5 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />{t('active')}</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={isFeatured} onChange={(event) => setIsFeatured(event.target.checked)} />{t('featured')}</label>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">{t('upload')}</label>
        <input type="file" accept="image/*" onChange={handleUpload} className="block w-full text-sm" />
        {isUploading ? <p className="mt-1 text-xs text-slate-500">{t('uploading')}</p> : null}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">{t('imageUrls')}</label>
        <textarea rows={3} value={images.join("\n")} onChange={(event) => setImages(event.target.value.split("\n").map((value) => value.trim()).filter(Boolean))} className="w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>
      <button type="submit" disabled={isPending || isUploading} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:bg-slate-400">
        {isPending ? t('saving') : t('saveProduct')}
      </button>
    </form>
  );
}
