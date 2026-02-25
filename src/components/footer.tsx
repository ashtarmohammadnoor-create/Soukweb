import {Link} from "@/i18n/navigation";
import {getTranslations} from "next-intl/server";
import {Container} from "@/components/Container";

export async function Footer() {
  const t = await getTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-slate-200 bg-slate-50">
      <Container className="py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{t("brand")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("description")}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">{t("linksTitle")}</h4>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
              <Link href="/products" className="hover:text-slate-900">{t("products")}</Link>
              <Link href="/#about" className="hover:text-slate-900">{t("about")}</Link>
              <Link href="/#contact" className="hover:text-slate-900">{t("contact")}</Link>
              <Link href="/privacy" className="hover:text-slate-900">{t("privacy")}</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">{t("supportTitle")}</h4>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
              <Link href="/#faq" className="hover:text-slate-900">{t("faq")}</Link>
              <Link href="/#shipping" className="hover:text-slate-900">{t("shipping")}</Link>
              <Link href="/#returns" className="hover:text-slate-900">{t("returns")}</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-xs text-slate-500">
          <p>{t("copyright", {year})}</p>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="X" className="hover:text-slate-900">X</a>
            <a href="#" aria-label="Instagram" className="hover:text-slate-900">Instagram</a>
            <a href="#" aria-label="LinkedIn" className="hover:text-slate-900">LinkedIn</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
