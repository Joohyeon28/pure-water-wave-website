import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/context/cart-context";

const CartButton = () => {
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/10 hover:text-white"
        onClick={() => setOpen(true)}
        aria-label={itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
      >
        <ShoppingBag className="h-5 w-5" />
      </Button>

      {itemCount > 0 && (
        <Badge className="pointer-events-none absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full px-1 text-[10px] leading-none">
          {itemCount > 99 ? "99+" : itemCount}
        </Badge>
      )}

      <CartDrawer open={open} onOpenChange={setOpen} />
    </div>
  );
};

export default CartButton;
