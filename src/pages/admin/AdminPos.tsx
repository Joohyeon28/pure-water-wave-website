import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Minus, Plus, Printer, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductsQuery } from "@/hooks/useProducts";
import type { ProductRow } from "@/hooks/useProducts";
import { useSupabase } from "@/lib/supabase-context";
import { createOrder } from "@/lib/orders";
import type { CreatedOrder } from "@/lib/orders";
import { formatCents } from "@/lib/format";
import { MAX_LINE_QUANTITY } from "@/lib/cart-types";
import type { CartLine } from "@/lib/cart-types";
import {
  categoryLabels,
  productCategories,
  toProductCategory,
} from "@/lib/validators/product";
import type { ProductCategory } from "@/lib/validators/product";

const ALL = "all";
const statusBadge = "In-store";

// In-store customers often have no email, so a placeholder address keeps the
// create_order contract satisfied without collecting one at the till.
const POS_EMAIL = "pos@extensionwater.local";

type PaymentMethod = "cash" | "card" | "eft";

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "eft", label: "EFT" },
];

interface PosReceipt {
  order: CreatedOrder;
  lines: CartLine[];
  paymentMethod: PaymentMethod;
  completedAt: string;
}

function paymentLabel(method: PaymentMethod): string {
  return paymentMethods.find((option) => option.value === method)?.label ?? method;
}

const AdminPos = () => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const productsQuery = useProductsQuery();

  const [lines, setLines] = useState<CartLine[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>(ALL);
  const [customerName, setCustomerName] = useState("Walk-in");
  const [phone, setPhone] = useState("-");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [receipt, setReceipt] = useState<PosReceipt | null>(null);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    const products = productsQuery.data ?? [];

    return products.filter((product) => {
      const matchesCategory =
        category === ALL || toProductCategory(product.category) === (category as ProductCategory);
      const matchesSearch =
        term.length === 0 || `${product.name} ${product.sku}`.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [productsQuery.data, category, search]);

  const subtotalCents = lines.reduce(
    (total, line) => total + line.unitPriceCents * line.quantity,
    0,
  );

  const addToSale = (product: ProductRow) => {
    setLines((current) => {
      const existing = current.find((line) => line.productId === product.id);

      if (!existing) {
        return [
          ...current,
          {
            productId: product.id,
            sku: product.sku,
            name: product.name,
            unit: product.unit,
            unitPriceCents: product.price_cents,
            quantity: 1,
          },
        ];
      }

      return current.map((line) =>
        line.productId === product.id
          ? { ...line, quantity: Math.min(MAX_LINE_QUANTITY, line.quantity + 1) }
          : line,
      );
    });
  };

  const setLineQuantity = (productId: string, quantity: number) => {
    setLines((current) =>
      current.map((line) =>
        line.productId === productId
          ? { ...line, quantity: Math.min(MAX_LINE_QUANTITY, Math.max(1, quantity)) }
          : line,
      ),
    );
  };

  const removeLine = (productId: string) => {
    setLines((current) => current.filter((line) => line.productId !== productId));
  };

  const completeSale = useMutation({
    mutationFn: async (): Promise<CreatedOrder> =>
      createOrder(
        supabase,
        lines.map((line) => ({ productId: line.productId, quantity: line.quantity })),
        {
          name: customerName.trim().length > 0 ? customerName.trim() : "Walk-in",
          email: POS_EMAIL,
          phone: phone.trim().length > 0 ? phone.trim() : "-",
          fulfilment: "pickup",
          channel: "in_store",
          markPaid: true,
          paymentMethod,
        },
      ),
    onSuccess: (order) => {
      setReceipt({
        order,
        lines,
        paymentMethod,
        completedAt: new Date().toISOString(),
      });
      setLines([]);
      setCustomerName("Walk-in");
      setPhone("-");
      setPaymentMethod("cash");
      void queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (receipt) {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Sale complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Reference</span>
              <span className="font-bold text-foreground">{receipt.order.reference}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Payment</span>
              <Badge variant="secondary">{paymentLabel(receipt.paymentMethod)}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="text-foreground">
                {new Date(receipt.completedAt).toLocaleString("en-ZA")}
              </span>
            </div>

            <Separator />

            <div className="space-y-2">
              {receipt.lines.map((line) => (
                <div
                  key={line.productId}
                  className="flex items-start justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-medium text-foreground">{line.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {line.quantity} × {formatCents(line.unitPriceCents)}
                    </p>
                  </div>
                  <span className="font-semibold text-foreground">
                    {formatCents(line.unitPriceCents * line.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-foreground">Total</span>
              <span className="text-xl font-extrabold text-foreground">
                {formatCents(receipt.order.total_cents)}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button type="button" onClick={() => setReceipt(null)}>
            New sale
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Point of Sale</h1>
        <p className="text-sm text-muted-foreground">
          Ring up an in-store sale. {statusBadge} payment labels are recorded, not processed.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products"
                className="pl-9"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All categories</SelectItem>
                {productCategories.map((option) => (
                  <SelectItem key={option} value={option}>
                    {categoryLabels[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {productsQuery.isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((tile) => (
                <Skeleton key={tile} className="h-24 w-full" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border py-12 text-center text-muted-foreground">
              No products match this search.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => addToSale(product)}
                  className="rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-secondary"
                >
                  <p className="font-medium text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.unit}</p>
                  <p className="mt-2 font-semibold text-foreground">
                    {formatCents(product.price_cents)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Running sale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lines.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Tap a product to start a sale.
                </p>
              ) : (
                <div className="space-y-3">
                  {lines.map((line) => (
                    <div key={line.productId} className="space-y-2 rounded-lg border border-border p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{line.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {line.unit} · {formatCents(line.unitPriceCents)}
                          </p>
                        </div>
                        <span className="shrink-0 text-sm font-semibold text-foreground">
                          {formatCents(line.unitPriceCents * line.quantity)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setLineQuantity(line.productId, line.quantity - 1)}
                          aria-label={`Decrease ${line.name}`}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <input
                          type="number"
                          min={1}
                          max={MAX_LINE_QUANTITY}
                          value={line.quantity}
                          onChange={(event) =>
                            setLineQuantity(line.productId, Number.parseInt(event.target.value, 10))
                          }
                          className="h-8 w-16 rounded-md border border-border bg-secondary text-center text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                          aria-label={`Quantity for ${line.name}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setLineQuantity(line.productId, line.quantity + 1)}
                          aria-label={`Increase ${line.name}`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="ml-auto h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeLine(line.productId)}
                          aria-label={`Remove ${line.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold text-foreground">
                  {formatCents(subtotalCents)}
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pos-name">Customer name</Label>
                <Input
                  id="pos-name"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Walk-in"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pos-phone">Phone (optional)</Label>
                <Input
                  id="pos-phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="-"
                />
              </div>

              <div className="space-y-2">
                <Label>Payment method</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(next) => {
                    if (next === "cash" || next === "card" || next === "eft") {
                      setPaymentMethod(next);
                    }
                  }}
                  className="flex gap-4"
                >
                  {paymentMethods.map((option) => (
                    <div key={option.value} className="flex items-center gap-2">
                      <RadioGroupItem value={option.value} id={`pos-payment-${option.value}`} />
                      <Label htmlFor={`pos-payment-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button
                type="button"
                className="w-full"
                disabled={lines.length === 0 || completeSale.isPending}
                onClick={() => completeSale.mutate()}
              >
                {completeSale.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Complete sale
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPos;
