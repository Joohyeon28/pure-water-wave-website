import { useState } from "react";
import { Calculator, Droplets, Sparkle, Apple, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/cart-context";
import { useProductsQuery } from "@/hooks/useProducts";
import { formatCents } from "@/lib/format";
import {
  freeDeliveryThresholdLitres,
  getBottlePrice,
  getRefillProduct,
  litreRefillCostCents,
} from "@/lib/pricing-selectors";
import type { RefillKey } from "@/lib/pricing-selectors";
import type { ProductUnit } from "@/lib/validators/product";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ProductKey = "purified" | "alkaline" | "fruitJuice";

const productKeys: ProductKey[] = ["purified", "alkaline", "fruitJuice"];

const productLabels: Record<ProductKey, string> = {
  purified: "Purified Water",
  alkaline: "Alkaline Water",
  fruitJuice: "Fruit Juice",
};

const refillKeys: Record<ProductKey, RefillKey> = {
  purified: "purified",
  alkaline: "alkaline",
  fruitJuice: "fruit_juice",
};

const bottleCategories: Record<ProductKey, "bottle" | "juice"> = {
  purified: "bottle",
  alkaline: "bottle",
  fruitJuice: "juice",
};

const bottleKeys: Record<ProductKey, "purified" | "alkaline" | undefined> = {
  purified: "purified",
  alkaline: "alkaline",
  fruitJuice: undefined,
};

const containerSizes: ProductUnit[] = ["500ml", "1L", "2L", "5L", "10L"];

const productIcons: Record<ProductKey, React.ElementType> = {
  purified: Droplets,
  alkaline: Sparkle,
  fruitJuice: Apple,
};

function isProductKey(value: string): value is ProductKey {
  return productKeys.some((key) => key === value);
}

const ProductSelector = ({
  value,
  onChange,
}: {
  value: ProductKey;
  onChange: (v: ProductKey) => void;
}) => (
  <Select
    value={value}
    onValueChange={(next) => {
      if (isProductKey(next)) {
        onChange(next);
      }
    }}
  >
    <SelectTrigger className="w-full bg-secondary border-border rounded-xl py-6">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {productKeys.map((key) => {
        const Icon = productIcons[key];
        return (
          <SelectItem key={key} value={key}>
            <span className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-primary" />
              {productLabels[key]}
            </span>
          </SelectItem>
        );
      })}
    </SelectContent>
  </Select>
);

const RefillTab = () => {
  const { data, isLoading } = useProductsQuery();
  const products = data ?? [];
  const { addItem } = useCart();
  const [product, setProduct] = useState<ProductKey>("purified");
  const [litres, setLitres] = useState("");

  const refillProduct = getRefillProduct(products, refillKeys[product]);
  const Icon = productIcons[product];
  const litresValue = litres ? parseFloat(litres) : 0;
  const totalCents =
    refillProduct && litres ? litreRefillCostCents(refillProduct, litresValue) : 0;
  const total = (totalCents / 100).toFixed(2);

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Product</label>
        <ProductSelector value={product} onChange={setProduct} />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Litres</label>
        <div className="relative">
          <input
            type="number"
            min="0"
            placeholder="e.g. 25"
            value={litres}
            disabled={isLoading}
            onChange={(e) => setLitres(e.target.value)}
            className="w-full px-5 py-4 rounded-xl bg-secondary border border-border text-foreground text-lg font-medium focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">litres</span>
        </div>
      </div>

      <div className="bg-[hsl(215,70%,8%)] rounded-2xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-white/80 text-sm mb-1">
          <Calculator className="w-4 h-4" />
          Rate: {refillProduct ? `${formatCents(refillProduct.price_cents)}/L` : "—"}
        </div>
        <div className="flex items-center justify-center gap-2 text-white/60 text-xs mb-2">
          <Icon className="w-3.5 h-3.5 text-accent" />
          {productLabels[product]}
        </div>
        {isLoading ? (
          <Skeleton className="mx-auto h-12 w-40" />
        ) : (
          <div className="text-4xl sm:text-5xl font-extrabold text-white">
            R{total}
          </div>
        )}
        {!isLoading && litres && litresValue >= freeDeliveryThresholdLitres() && (
          <p className="text-accent text-sm mt-2">Free delivery included!</p>
        )}
      </div>

      <Button
        type="button"
        className="w-full"
        disabled={isLoading || !refillProduct || litresValue <= 0}
        onClick={() => {
          if (!refillProduct) {
            return;
          }

          const amount = Math.max(1, Math.round(litresValue));
          addItem(refillProduct, amount);
          toast.success(`Added ${amount}L ${productLabels[product].toLowerCase()} to your order`);
        }}
      >
        <ShoppingBag className="h-4 w-4" />
        Add to order
      </Button>
    </div>
  );
};

const InStoreTab = () => {
  const { data, isLoading } = useProductsQuery();
  const products = data ?? [];
  const { addItem } = useCart();
  const [product, setProduct] = useState<ProductKey>("purified");
  const [size, setSize] = useState<ProductUnit>("1L");
  const [quantity, setQuantity] = useState("");

  const bottleProduct = getBottlePrice(
    products,
    bottleCategories[product],
    size,
    bottleKeys[product],
  );
  const Icon = productIcons[product];
  const quantityValue = quantity ? parseInt(quantity, 10) : 0;
  const totalCents = bottleProduct && quantity ? quantityValue * bottleProduct.price_cents : 0;
  const total = (totalCents / 100).toFixed(2);

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Product</label>
        <ProductSelector value={product} onChange={setProduct} />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Container Size</label>
        <div className="grid grid-cols-5 gap-2">
          {containerSizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              disabled={isLoading}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                size === s
                  ? "bg-accent text-[hsl(215,70%,8%)] border-accent shadow-md"
                  : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
        <div className="relative">
          <input
            type="number"
            min="0"
            placeholder="e.g. 3"
            value={quantity}
            disabled={isLoading}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-5 py-4 rounded-xl bg-secondary border border-border text-foreground text-lg font-medium focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">units</span>
        </div>
      </div>

      <div className="bg-[hsl(215,70%,8%)] rounded-2xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-white/80 text-sm mb-1">
          <Calculator className="w-4 h-4" />
          {bottleProduct ? formatCents(bottleProduct.price_cents) : "—"} per {size}
        </div>
        <div className="flex items-center justify-center gap-2 text-white/60 text-xs mb-2">
          <Icon className="w-3.5 h-3.5 text-accent" />
          {productLabels[product]}
        </div>
        {isLoading ? (
          <Skeleton className="mx-auto h-12 w-40" />
        ) : (
          <div className="text-4xl sm:text-5xl font-extrabold text-white">
            R{total}
          </div>
        )}
      </div>

      <Button
        type="button"
        className="w-full"
        disabled={isLoading || !bottleProduct || quantityValue <= 0}
        onClick={() => {
          if (!bottleProduct) {
            return;
          }

          const amount = Math.max(1, quantityValue);
          addItem(bottleProduct, amount);
          toast.success(`Added ${amount} × ${productLabels[product].toLowerCase()} to your order`);
        }}
      >
        <ShoppingBag className="h-4 w-4" />
        Add to order
      </Button>
    </div>
  );
};

const CalculatorSection = () => (
  <section id="calculator" className="py-20 sm:py-28">
    <div className="container mx-auto px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-lg mx-auto"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Calculate Your Price</h2>
          <p className="text-muted-foreground">Find out your refill or in-store cost instantly.</p>
        </div>

        <div className="glass-card p-5 sm:p-8">
          <Tabs defaultValue="refill" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-6">
              <TabsTrigger value="refill">Refill Prices</TabsTrigger>
              <TabsTrigger value="instore">In-Store Prices</TabsTrigger>
            </TabsList>
            <TabsContent value="refill">
              <RefillTab />
            </TabsContent>
            <TabsContent value="instore">
              <InStoreTab />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CalculatorSection;
