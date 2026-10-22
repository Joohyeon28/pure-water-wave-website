import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClearCartButton from "@/components/ClearCartButton";
import LineKindBadge from "@/components/LineKindBadge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/context/cart-context";
import { formatCents } from "@/lib/format";
import { lineKindFromUnit } from "@/lib/line-kind";
import { MAX_LINE_QUANTITY } from "@/lib/cart-types";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartDrawer = ({ open, onOpenChange }: CartDrawerProps) => {
  const { lines, subtotalCents, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  const goToCheckout = () => {
    onOpenChange(false);
    navigate("/checkout");
  };

  const setClampedQuantity = (productId: string, quantity: number) => {
    const safe = Number.isFinite(quantity) ? quantity : 1;
    updateQuantity(productId, Math.min(MAX_LINE_QUANTITY, Math.max(1, Math.round(safe))));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your order</SheetTitle>
          <SheetDescription>Review your items before checkout.</SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Continue shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto py-4">
              {lines.map((line) => (
                <div
                  key={line.productId}
                  className="flex gap-3 rounded-lg border border-border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-foreground">{line.name}</p>
                      <LineKindBadge kind={lineKindFromUnit(line.unit)} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {line.unit} · {formatCents(line.unitPriceCents)}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setClampedQuantity(line.productId, line.quantity - 1)}
                        aria-label={`Decrease quantity for ${line.name}`}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>

                      <input
                        type="number"
                        min={1}
                        max={MAX_LINE_QUANTITY}
                        value={line.quantity}
                        onChange={(event) =>
                          setClampedQuantity(line.productId, Number.parseInt(event.target.value, 10))
                        }
                        className="h-8 w-16 rounded-md border border-border bg-secondary text-center text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                        aria-label={`Quantity for ${line.name}`}
                      />

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setClampedQuantity(line.productId, line.quantity + 1)}
                        aria-label={`Increase quantity for ${line.name}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="ml-auto h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(line.productId)}
                        aria-label={`Remove ${line.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="shrink-0 text-sm font-semibold text-foreground">
                    {formatCents(line.unitPriceCents * line.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <SheetFooter className="border-t border-border pt-4">
              <div className="flex w-full justify-end">
                <ClearCartButton />
              </div>
              <div className="flex w-full items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold text-foreground">
                  {formatCents(subtotalCents)}
                </span>
              </div>
              <Button type="button" className="w-full" onClick={goToCheckout}>
                Checkout
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
