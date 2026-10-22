import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import LineKindBadge from "@/components/LineKindBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/cart-context";
import { useSupabase } from "@/lib/supabase-context";
import { createOrder } from "@/lib/orders";
import type { CreateOrderCustomer } from "@/lib/orders";
import { formatCents } from "@/lib/format";
import { freeDeliveryThresholdCents } from "@/lib/pricing-selectors";
import { NO_EMAIL_PLACEHOLDER } from "@/lib/contact";
import { lineKindFromUnit } from "@/lib/line-kind";
import { normaliseSaPhone } from "@/lib/phone";
import { isFutureDateTime, toLocalDateInputValue } from "@/lib/schedule";

const emailSchema = z.string().trim().email("Enter a valid email address");

const checkoutSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z
      .string()
      .trim()
      .refine((value) => value.length === 0 || emailSchema.safeParse(value).success, {
        message: "Enter a valid email address",
      }),
    phone: z
      .string()
      .trim()
      .refine((value) => value.length === 0 || normaliseSaPhone(value) !== null, {
        message: "Enter a valid South African phone number",
      }),
    fulfilment: z.enum(["pickup", "delivery"]),
    fulfilmentDate: z.string().min(1, "Choose a date"),
    fulfilmentTime: z.string().min(1, "Choose a time"),
    deliveryAddress: z.string().trim(),
    notes: z.string().trim(),
  })
  .refine((values) => values.fulfilment !== "delivery" || values.deliveryAddress.length > 0, {
    path: ["deliveryAddress"],
    message: "Delivery address is required when you choose delivery",
  })
  .refine((values) => values.email.length > 0 || values.phone.length > 0, {
    path: ["email"],
    message: "Enter an email address or a phone number",
  })
  .refine(
    (values) =>
      !values.fulfilmentDate ||
      !values.fulfilmentTime ||
      isFutureDateTime(values.fulfilmentDate, values.fulfilmentTime),
    {
      path: ["fulfilmentTime"],
      message: "Choose a future date and time",
    },
  );

type CheckoutValues = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const { lines, subtotalCents, clear } = useCart();
  const supabase = useSupabase();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      fulfilment: "pickup",
      fulfilmentDate: "",
      fulfilmentTime: "",
      deliveryAddress: "",
      notes: "",
    },
  });

  const fulfilment = watch("fulfilment");
  const fulfilmentDate = watch("fulfilmentDate");
  const now = new Date();
  const todayIso = toLocalDateInputValue(now);
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes(),
  ).padStart(2, "0")}`;
  const deliveryAvailable = subtotalCents >= freeDeliveryThresholdCents();

  useEffect(() => {
    if (!deliveryAvailable && fulfilment === "delivery") {
      setValue("fulfilment", "pickup", { shouldValidate: true });
    }
  }, [deliveryAvailable, fulfilment, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    if (lines.length === 0) {
      return;
    }

    const effectiveFulfilment = deliveryAvailable ? values.fulfilment : "pickup";
    const nationalPhone = normaliseSaPhone(values.phone);
    const email =
      values.email.trim().length > 0 ? values.email.trim() : NO_EMAIL_PLACEHOLDER;
    const scheduledFor =
      values.fulfilmentDate && values.fulfilmentTime
        ? new Date(`${values.fulfilmentDate}T${values.fulfilmentTime}`).toISOString()
        : undefined;

    const customer: CreateOrderCustomer = {
      name: values.name.trim(),
      email,
      phone: nationalPhone ? `+27${nationalPhone}` : "-",
      fulfilment: effectiveFulfilment,
      deliveryAddress:
        effectiveFulfilment === "delivery" ? values.deliveryAddress.trim() : undefined,
      notes: values.notes.trim().length > 0 ? values.notes.trim() : undefined,
      channel: "online",
      scheduledFor,
    };

    try {
      const order = await createOrder(
        supabase,
        lines.map((line) => ({ productId: line.productId, quantity: line.quantity })),
        customer,
      );

      clear();
      navigate(
        `/order/${encodeURIComponent(order.reference)}?email=${encodeURIComponent(customer.email)}`,
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "We could not place your order.");
    }
  });

  if (lines.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold text-foreground">Your cart is empty</h1>
        <p className="text-muted-foreground">Add some water or juice before checking out.</p>
        <Button asChild variant="outline">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
        </div>

        <h1 className="mb-10 text-3xl sm:text-4xl font-bold text-foreground">Checkout</h1>

        <div className="grid gap-8 md:grid-cols-2">
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" autoComplete="name" placeholder="Jane Doe" {...register("name")} />
              {errors.name ? (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="jane@example.com"
                  {...register("email")}
                />
                {errors.email ? (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                    +27
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="63 084 1172"
                    className="rounded-l-none"
                    {...register("phone")}
                  />
                </div>
                {errors.phone ? (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                ) : null}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Enter at least one of email or phone.
            </p>

            <div className="space-y-2">
              <Label>Fulfilment</Label>
              <Controller
                control={control}
                name="fulfilment"
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-6"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="pickup" id="fulfilment-pickup" />
                      <Label htmlFor="fulfilment-pickup">Pickup</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="delivery"
                        id="fulfilment-delivery"
                        disabled={!deliveryAvailable}
                      />
                      <Label
                        htmlFor="fulfilment-delivery"
                        className={!deliveryAvailable ? "text-muted-foreground/60" : undefined}
                      >
                        Delivery
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {!deliveryAvailable ? (
                <p className="text-xs text-muted-foreground">
                  Delivery is available on orders of R500 or more. Add{" "}
                  {formatCents(freeDeliveryThresholdCents() - subtotalCents)} more to qualify.
                </p>
              ) : null}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fulfilmentDate">
                  {fulfilment === "delivery" ? "Delivery" : "Pickup"} date
                </Label>
                <Input
                  id="fulfilmentDate"
                  type="date"
                  min={todayIso}
                  {...register("fulfilmentDate")}
                />
                {errors.fulfilmentDate ? (
                  <p className="text-sm text-destructive">{errors.fulfilmentDate.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fulfilmentTime">
                  {fulfilment === "delivery" ? "Delivery" : "Pickup"} time
                </Label>
                <Input
                  id="fulfilmentTime"
                  type="time"
                  min={fulfilmentDate === todayIso ? currentTime : undefined}
                  {...register("fulfilmentTime")}
                />
                {errors.fulfilmentTime ? (
                  <p className="text-sm text-destructive">{errors.fulfilmentTime.message}</p>
                ) : null}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Choose a future {fulfilment === "delivery" ? "delivery" : "pickup"} date and time.
            </p>

            {fulfilment === "delivery" ? (
              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Delivery address</Label>
                <Input
                  id="deliveryAddress"
                  autoComplete="street-address"
                  placeholder="22 Nutmeg Street, Protea Glen Ext 28"
                  {...register("deliveryAddress")}
                />
                {errors.deliveryAddress ? (
                  <p className="text-sm text-destructive">{errors.deliveryAddress.message}</p>
                ) : null}
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Anything we should know about this order?"
                {...register("notes")}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Place order
            </Button>
          </form>

          <aside className="glass-card h-fit p-6">
            <h2 className="mb-4 text-lg font-bold text-foreground">Order summary</h2>

            <div className="space-y-3">
              {lines.map((line) => (
                <div
                  key={line.productId}
                  className="flex items-start justify-between gap-4 text-sm"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-foreground">{line.name}</p>
                      <LineKindBadge kind={lineKindFromUnit(line.unit)} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {line.quantity} × {formatCents(line.unitPriceCents)}
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold text-foreground">
                    {formatCents(line.unitPriceCents * line.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">
                  {formatCents(subtotalCents)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="text-muted-foreground">
                  {fulfilment === "pickup" ? "Free" : "Calculated at checkout"}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-base font-semibold text-foreground">Total</span>
                <span className="text-xl font-extrabold text-foreground">
                  {formatCents(subtotalCents)}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
