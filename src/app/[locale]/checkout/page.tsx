import { CheckoutForm } from "@/components/store/checkout-form";
import { requireUserForLocale } from "@/lib/auth";

type Props = {params: Promise<{locale: string}>};

export default async function CheckoutPage({params}: Props) {
  const {locale} = await params;
  const session = await requireUserForLocale(locale);
  return <CheckoutForm userEmail={session.email} />;
}
