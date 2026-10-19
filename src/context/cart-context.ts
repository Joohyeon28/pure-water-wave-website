import { createContext, useContext } from "react";
import type { CartLine } from "@/lib/cart-types";
import type { ProductRow } from "@/hooks/useProducts";

export interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotalCents: number;
  addItem: (product: ProductRow, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a <CartProvider>.");
  }

  return context;
};
