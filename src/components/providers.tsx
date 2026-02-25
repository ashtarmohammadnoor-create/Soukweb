"use client";

import { CartProvider } from "@/components/cart-provider";
import { AppToaster } from "@/components/app-toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <AppToaster />
    </CartProvider>
  );
}
