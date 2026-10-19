import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductFormDialog from "@/components/admin/ProductFormDialog";
import { useProductsQuery, useToggleProductActive } from "@/hooks/useProducts";
import type { ProductRow } from "@/hooks/useProducts";
import { formatCents } from "@/lib/format";
import {
  categoryLabels,
  toProductCategory,
  toProductUnit,
  unitLabels,
} from "@/lib/validators/product";
import type { ProductCategory } from "@/lib/validators/product";

const categoryVariant: Record<ProductCategory, "default" | "secondary" | "outline" | "destructive"> = {
  refill: "secondary",
  bottle: "default",
  juice: "outline",
  cooler: "destructive",
};

const skeletonRows = [0, 1, 2, 3];

const AdminProducts = () => {
  const [includeInactive, setIncludeInactive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);

  const productsQuery = useProductsQuery({ includeInactive });
  const toggleActive = useToggleProductActive();

  const products = productsQuery.data ?? [];
  const total = products.length;

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (product: ProductRow) => {
    setEditing(product);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">
            {productsQuery.isLoading
              ? "Loading products…"
              : `${total} product${total === 1 ? "" : "s"}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="show-inactive"
              checked={includeInactive}
              onCheckedChange={setIncludeInactive}
            />
            <Label htmlFor="show-inactive" className="text-sm">
              Show inactive
            </Label>
          </div>

          <Button type="button" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add product
          </Button>
        </div>
      </div>

      {productsQuery.isError ? (
        <p className="text-sm text-destructive">
          {productsQuery.error?.message ?? "Failed to load products."}
        </p>
      ) : null}

      {productsQuery.isLoading ? (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Sort order</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skeletonRows.map((row) => (
                <TableRow key={row}>
                  {skeletonRows.map((cell) => (
                    <TableCell key={cell}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : total === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-muted-foreground">
            {includeInactive ? "No products found." : "No active products found."}
          </p>
          <Button type="button" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add product
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Sort order</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const category = toProductCategory(product.category);

                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.sku}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <Badge variant={categoryVariant[category]}>{categoryLabels[category]}</Badge>
                    </TableCell>
                    <TableCell>{unitLabels[toProductUnit(product.unit)]}</TableCell>
                    <TableCell className="text-right">{formatCents(product.price_cents)}</TableCell>
                    <TableCell className="text-right">{product.sort_order}</TableCell>
                    <TableCell>
                      <Switch
                        checked={product.active}
                        disabled={toggleActive.isPending}
                        onCheckedChange={(checked) =>
                          toggleActive.mutate({ id: product.id, active: checked })
                        }
                        aria-label={`Toggle ${product.name} active`}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <ProductFormDialog open={dialogOpen} onOpenChange={setDialogOpen} product={editing} />
    </div>
  );
};

export default AdminProducts;
