import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import type { ProductRow } from "@/hooks/useProducts";
import {
  categoryLabels,
  productCategories,
  productFormSchema,
  productUnits,
  toDbInsert,
  toDbUpdate,
  toProductCategory,
  toProductUnit,
  unitLabels,
} from "@/lib/validators/product";
import type { ProductFormValues } from "@/lib/validators/product";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductRow | null;
}

const emptyValues: ProductFormValues = {
  sku: "",
  name: "",
  category: "refill",
  unit: "litre",
  price: "",
  sort_order: "0",
  active: true,
};

function toFormValues(product: ProductRow | null | undefined): ProductFormValues {
  if (!product) {
    return emptyValues;
  }

  return {
    sku: product.sku,
    name: product.name,
    category: toProductCategory(product.category),
    unit: toProductUnit(product.unit),
    price: (product.price_cents / 100).toFixed(2),
    sort_order: String(product.sort_order),
    active: product.active,
  };
}

const ProductFormDialog = ({ open, onOpenChange, product }: ProductFormDialogProps) => {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const isEdit = Boolean(product);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (open) {
      reset(toFormValues(product));
    }
  }, [open, product, reset]);

  const isSaving = createProduct.isPending || updateProduct.isPending;

  const finish = () => {
    reset(emptyValues);
    onOpenChange(false);
  };

  const onSubmit = handleSubmit((values) => {
    if (product) {
      updateProduct.mutate(
        { id: product.id, values: toDbUpdate(values) },
        { onSuccess: finish },
      );
      return;
    }

    createProduct.mutate(toDbInsert(values), { onSuccess: finish });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit product" : "Add product"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details for this product."
              : "Create a new product for your catalogue."}
          </DialogDescription>
        </DialogHeader>

        <form id="product-form" onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              className="uppercase"
              placeholder="EW-500ML"
              disabled={isEdit}
              {...register("sku")}
            />
            {errors.sku ? <p className="text-sm text-destructive">{errors.sku.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Still water 500ml" {...register("name")} />
            {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {categoryLabels[category]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Controller
                control={control}
                name="unit"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="unit">
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {productUnits.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unitLabels[unit]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price (R)</Label>
              <Input
                id="price"
                inputMode="decimal"
                placeholder="12.50"
                {...register("price")}
              />
              {errors.price ? (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort order</Label>
              <Input
                id="sort_order"
                type="number"
                min={0}
                step={1}
                {...register("sort_order")}
              />
              {errors.sort_order ? (
                <p className="text-sm text-destructive">{errors.sort_order.message}</p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
            <Label htmlFor="active">Active</Label>
            <Controller
              control={control}
              name="active"
              render={({ field }) => (
                <Switch id="active" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="product-form" disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isEdit ? "Save changes" : "Create product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
