"use client";

import {Link, useRouter} from "@/i18n/navigation";
import { useState, useTransition } from "react";
import {useTranslations} from 'next-intl';
import { toast } from "sonner";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const t = useTranslations('Auth');
  const c = useTranslations('Common');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        toast.error(data.error ?? t('authFailed'));
        return;
      }

      toast.success(mode === "login" ? t('welcomeBack') : t('accountCreated'));
      router.push("/");
      router.refresh();
    });
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-semibold text-slate-950">{mode === "login" ? t('login') : t('createAccount')}</h1>
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        {mode === "register" ? (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{c('name')}</label>
            <input required value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2" />
          </div>
        ) : null}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{c('email')}</label>
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">{c('password')}</label>
          <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2" />
        </div>
        <button type="submit" disabled={isPending} className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:bg-slate-400">
          {isPending ? t('pleaseWait') : mode === "login" ? t('login') : t('createAccount')}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        {mode === "login" ? t('noAccount') : t('alreadyHave')} {" "}
        <Link href={mode === "login" ? "/register" : "/login"} className="font-medium text-slate-900 underline">
          {mode === "login" ? t('createOne') : t('login')}
        </Link>
      </p>
    </div>
  );
}
