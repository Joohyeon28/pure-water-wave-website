import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CartContext } from "@/context/cart-context";
import type { CartContextValue } from "@/context/cart-context";
import { loadCart, saveCart } from "@/lib/cart-storage";
import {
  addLine,
  clearLines,
  itemCount as countItems,
  removeLine,
  subtotalCents as calculateSubtotal,
  updateQuantity as setLineQuantity,
} from "@/lib/cart-types";
import type { CartLine } from "@/lib/cart-types";
import type { ProductRow } from "@/hooks/useProducts";

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [lines, setLines] = useState<CartLine[]>(() => loadCart());

  useEffect(() => {
    saveCart(lines);
  }, [lines]);

  const addItem = useCallback((product: ProductRow, quantity = 1) => {
    setLines((current) =>
      addLine(
        current,
        {
          productId: product.id,
          sku: product.sku,
          name: product.name,
          unit: product.unit,
          unitPriceCents: product.price_cents,
        },
        quantity,
      ),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setLines((current) => removeLine(current, productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setLines((current) => setLineQuantity(current, productId, quantity));
  }, []);

  const clear = useCallback(() => {
    setLines(clearLines());
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      itemCount: countItems(lines),
      subtotalCents: calculateSubtotal(lines),
      addItem,
      removeItem,
      updateQuantity,
      clear,
    }),
    [lines, addItem, removeItem, updateQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
