"use client";

import {createContext, useContext, useEffect, useMemo, useState} from "react";
import {toast} from "sonner";
import {useTranslations} from 'next-intl';
import type { CartItem } from "@/lib/types";

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalCents: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = "webshop_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Cart');
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as CartItem[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const api = useMemo<CartContextType>(
    () => ({
      items,
      addItem: (newItem, quantity = 1) => {
        setItems((current) => {
          const found = current.find((item) => item.productId === newItem.productId);
          if (found) {
            return current.map((item) => item.productId === newItem.productId ? {...item, quantity: Math.min(item.quantity + quantity, item.stock)} : item);
          }
          return [...current, {...newItem, quantity: Math.min(quantity, newItem.stock)}];
        });
        toast.success(t('added'));
      },
      updateQuantity: (productId, quantity) => {
        setItems((current) => current.map((item) => item.productId === productId ? {...item, quantity: Math.min(Math.max(quantity, 1), item.stock)} : item).filter((item) => item.quantity > 0));
      },
      removeItem: (productId) => {
        setItems((current) => current.filter((item) => item.productId !== productId));
        toast.success(t('removed'));
      },
      clearCart: () => setItems([]),
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      totalCents: items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0),
    }),
    [items, t],
  );

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
