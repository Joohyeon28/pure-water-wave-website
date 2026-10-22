import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { Calculator, Droplets, Sparkle, Apple, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ClearCartButton from "@/components/ClearCartButton";
import LineKindBadge from "@/components/LineKindBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCart } from "@/context/cart-context";
import { useProductsQuery } from "@/hooks/useProducts";
import { MAX_LINE_QUANTITY } from "@/lib/cart-types";
import { formatCents } from "@/lib/format";
import { lineKindFromUnit } from "@/lib/line-kind";
import {
  freeDeliveryThresholdCents,
  getBottlePrice,
  getRefillProduct,
  litreRefillCostCents,
} from "@/lib/pricing-selectors";
import type { RefillKey } from "@/lib/pricing-selectors";
import type { ProductUnit } from "@/lib/validators/product";

type ProductKey = "purified" | "alkaline" | "fruitJuice";

const productKeys: ProductKey[] = ["purified", "alkaline", "fruitJuice"];

const productLabels: Record<ProductKey, string> = {
  purified: "Purified",
  alkaline: "Alkaline",
  fruitJuice: "100% Fruit Juice",
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

interface SizeOption {
  label: string;
  unit: ProductUnit;
}

const bottleSizeOptions: SizeOption[] = [
  { label: "500ml", unit: "500ml" },
  { label: "1.5Lt", unit: "1.5L" },
  { label: "5Lt", unit: "5L" },
];

const juiceSizeOption: SizeOption = { label: "330ml", unit: "330ml" };

const productIcons: Record<ProductKey, React.ElementType> = {
  purified: Droplets,
  alkaline: Sparkle,
  fruitJuice: Apple,
};

interface ProductPriceButtonProps {
  productKey: ProductKey;
  selected: boolean;
  priceLabel: string;
  onSelect: (key: ProductKey) => void;
}

const ProductPriceButton = ({
  productKey,
  selected,
  priceLabel,
  onSelect,
}: ProductPriceButtonProps) => {
  const Icon = productIcons[productKey];

  return (
    <button
      type="button"
      onClick={() => onSelect(productKey)}
      aria-pressed={selected}
      className={`flex flex-col items-center gap-1 rounded-xl border p-2.5 text-center transition-all sm:p-3 ${
        selected
          ? "border-accent bg-accent/10 ring-2 ring-accent/30"
          : "border-border bg-secondary hover:border-primary/30"
      }`}
    >
      <Icon className={`h-5 w-5 ${selected ? "text-accent" : "text-primary"}`} />
      <span className="text-[11px] font-semibold text-foreground sm:text-sm">
        {productLabels[productKey]}
      </span>
      <span className="text-[11px] text-muted-foreground sm:text-xs">{priceLabel}</span>
    </button>
  );
};

interface CategoryButtonProps {
  productKey: ProductKey;
  selected: boolean;
  onSelect: (key: ProductKey) => void;
}

const CategoryButton = ({ productKey, selected, onSelect }: CategoryButtonProps) => {
  const Icon = productIcons[productKey];

  return (
    <button
      type="button"
      onClick={() => onSelect(productKey)}
      aria-pressed={selected}
      className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all sm:text-sm ${
        selected
          ? "border-accent bg-accent/10 text-foreground ring-2 ring-accent/30"
          : "border-border bg-secondary text-muted-foreground hover:border-primary/30 hover:text-foreground"
      }`}
    >
      <Icon className={`h-4 w-4 ${selected ? "text-accent" : "text-primary"}`} />
      {productLabels[productKey]}
    </button>
  );
};

interface RefillTabProps {
  product: ProductKey;
  onProductChange: (product: ProductKey) => void;
  litres: string;
  onLitresChange: (litres: string) => void;
}

const RefillTab = ({ product, onProductChange, litres, onLitresChange }: RefillTabProps) => {
  const { data, isLoading } = useProductsQuery();
  const products = data ?? [];
  const { addItem } = useCart();

  const refillProduct = getRefillProduct(products, refillKeys[product]);
  const Icon = productIcons[product];
  const litresValue = litres ? parseFloat(litres) : 0;
  const totalCents =
    refillProduct && litres ? litreRefillCostCents(refillProduct, litresValue) : 0;
  const total = (totalCents / 100).toFixed(2);

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Choose a product</label>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {productKeys.map((key) => {
            const refill = getRefillProduct(products, refillKeys[key]);
            const priceLabel = isLoading
              ? "…"
              : refill
                ? `${formatCents(refill.price_cents)}/L`
                : "—";

            return (
              <ProductPriceButton
                key={key}
                productKey={key}
                selected={product === key}
                priceLabel={priceLabel}
                onSelect={onProductChange}
              />
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Enter litres</label>
        <div className="relative">
          <input
            type="number"
            min="0"
            placeholder="e.g. 25"
            value={litres}
            disabled={isLoading}
            onChange={(e) => onLitresChange(e.target.value)}
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
        {!isLoading && totalCents >= freeDeliveryThresholdCents() && (
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

interface InStoreTabProps {
  product: ProductKey;
  onProductChange: (product: ProductKey) => void;
  quantities: Record<string, number>;
  onQuantitiesChange: Dispatch<SetStateAction<Record<string, number>>>;
}

const InStoreTab = ({
  product,
  onProductChange,
  quantities,
  onQuantitiesChange,
}: InStoreTabProps) => {
  const { data, isLoading } = useProductsQuery();
  const products = data ?? [];
  const { addItem } = useCart();

  const sizeOptions =
    product === "fruitJuice" ? [juiceSizeOption, ...bottleSizeOptions] : bottleSizeOptions;

  const rows = sizeOptions.map((option) => ({
    ...option,
    bottle: getBottlePrice(products, bottleCategories[product], option.unit, bottleKeys[product]),
  }));

  const selectedLines = products
    .map((item) => ({ product: item, quantity: quantities[item.id] ?? 0 }))
    .filter((line) => line.quantity > 0);

  const selectedCount = selectedLines.reduce((total, line) => total + line.quantity, 0);
  const totalCents = selectedLines.reduce(
    (total, line) => total + line.product.price_cents * line.quantity,
    0,
  );
  const total = (totalCents / 100).toFixed(2);

  const setLineQuantity = (productId: string, value: number) => {
    const next = Number.isFinite(value)
      ? Math.min(MAX_LINE_QUANTITY, Math.max(0, Math.floor(value)))
      : 0;

    onQuantitiesChange((current) => ({ ...current, [productId]: next }));
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Choose a product</label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {productKeys.map((key) => (
            <CategoryButton
              key={key}
              productKey={key}
              selected={product === key}
              onSelect={onProductChange}
            />
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-foreground">Size</TableHead>
              <TableHead className="text-right text-foreground">Price</TableHead>
              <TableHead className="text-right text-foreground">Enter number</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const quantity = row.bottle ? (quantities[row.bottle.id] ?? 0) : 0;

              return (
                <TableRow key={row.unit}>
                  <TableCell className="font-semibold text-foreground">{row.label}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {row.bottle ? formatCents(row.bottle.price_cents) : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <input
                      type="number"
                      min={0}
                      max={MAX_LINE_QUANTITY}
                      value={quantity}
                      disabled={isLoading || !row.bottle}
                      onChange={(event) => {
                        if (!row.bottle) {
                          return;
                        }

                        setLineQuantity(row.bottle.id, Number.parseInt(event.target.value, 10));
                      }}
                      className="h-9 w-20 rounded-md border border-border bg-secondary px-2 text-center text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-50"
                      aria-label={`Quantity for ${row.label}`}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {selectedLines.length > 0 ? (
        <div className="space-y-1 rounded-xl bg-secondary/60 p-3 text-sm">
          {selectedLines.map((line) => (
            <div key={line.product.id} className="flex items-center justify-between gap-3">
              <span className="truncate text-muted-foreground">
                {line.product.name} × {line.quantity}
              </span>
              <span className="shrink-0 font-semibold text-foreground">
                {formatCents(line.product.price_cents * line.quantity)}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="bg-[hsl(215,70%,8%)] rounded-2xl p-6 text-center">
        <div className="text-sm text-white/70">Total Price</div>
        {isLoading ? (
          <Skeleton className="mx-auto h-12 w-40" />
        ) : (
          <div className="text-4xl sm:text-5xl font-extrabold text-white">R{total}</div>
        )}
        {!isLoading && totalCents >= freeDeliveryThresholdCents() && (
          <p className="text-accent text-sm mt-2">Free delivery included!</p>
        )}
      </div>

      <Button
        type="button"
        className="w-full"
        disabled={isLoading || selectedCount === 0}
        onClick={() => {
          selectedLines.forEach((line) => addItem(line.product, line.quantity));
          toast.success(
            `Added ${selectedCount} item${selectedCount === 1 ? "" : "s"} to your order`,
          );
          onQuantitiesChange({});
        }}
      >
        <ShoppingBag className="h-4 w-4" />
        Add to order
      </Button>
    </div>
  );
};

const CalculatorSection = () => {
  const [refillProduct, setRefillProduct] = useState<ProductKey>("purified");
  const [litres, setLitres] = useState("");
  const [bottledProduct, setBottledProduct] = useState<ProductKey>("purified");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const { lines, subtotalCents, itemCount } = useCart();

  return (
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
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Calculate Your Price
            </h2>
            <p className="text-muted-foreground">
              Find out your refill or bottled cost instantly.
            </p>
          </div>

          <div className="glass-card p-5 sm:p-8">
            <Tabs defaultValue="refill" className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-6">
                <TabsTrigger value="refill">Refill</TabsTrigger>
                <TabsTrigger value="bottled">Bottled</TabsTrigger>
              </TabsList>
              <TabsContent value="refill">
                <RefillTab
                  product={refillProduct}
                  onProductChange={setRefillProduct}
                  litres={litres}
                  onLitresChange={setLitres}
                />
              </TabsContent>
              <TabsContent value="bottled">
                <InStoreTab
                  product={bottledProduct}
                  onProductChange={setBottledProduct}
                  quantities={quantities}
                  onQuantitiesChange={setQuantities}
                />
              </TabsContent>
            </Tabs>

            {itemCount > 0 ? (
              <div className="mt-6 rounded-xl border border-border bg-secondary/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-foreground">Your order so far</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {itemCount} item{itemCount === 1 ? "" : "s"}
                    </span>
                    <ClearCartButton label="Clear" />
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  {lines.map((line) => (
                    <div
                      key={line.productId}
                      className="flex items-start justify-between gap-3 text-sm"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="truncate text-muted-foreground">
                          {line.name} × {line.quantity}
                        </span>
                        <LineKindBadge kind={lineKindFromUnit(line.unit)} />
                      </span>
                      <span className="shrink-0 font-medium text-foreground">
                        {formatCents(line.unitPriceCents * line.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm font-semibold text-foreground">Order subtotal</span>
                  <span className="text-lg font-extrabold text-foreground">
                    {formatCents(subtotalCents)}
                  </span>
                </div>

                {subtotalCents >= freeDeliveryThresholdCents() ? (
                  <p className="mt-1 text-xs text-accent">
                    Free delivery included within 10km.
                  </p>
                ) : null}

                <Button asChild className="mt-3 w-full">
                  <Link to="/checkout">Go to checkout</Link>
                </Button>
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CalculatorSection;
