import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import LineKindBadge from "@/components/LineKindBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrderQuery } from "@/hooks/useOrder";
import { displayEmail } from "@/lib/contact";
import { formatCents } from "@/lib/format";
import { lineKindFromSku } from "@/lib/line-kind";

function titleCase(value: string): string {
  if (value.length === 0) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

const OrderConfirmation = () => {
  const { reference } = useParams<{ reference: string }>();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email") ?? undefined;

  const orderQuery = useOrderQuery(reference, email);

  const notFound = (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold text-foreground">We can't find that order.</h1>
      <p className="text-muted-foreground">
        Check your email for your order confirmation.
      </p>
      <Button asChild variant="outline">
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  );

  if (!reference || !email) {
    return notFound;
  }

  if (orderQuery.isLoading) {
    return (
      <div className="py-20 sm:py-28">
        <div className="container mx-auto max-w-3xl space-y-6 px-4 sm:px-6">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-40" />
          <div className="space-y-3 rounded-2xl border border-border p-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (orderQuery.isError || !orderQuery.data) {
    return notFound;
  }

  const order = orderQuery.data;

  return (
    <div className="py-20 sm:py-28">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Order {order.reference}
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <Badge variant="secondary">{order.status.replace(/_/g, " ")}</Badge>
              <span className="text-sm text-muted-foreground">
                Placed {new Date(order.created_at).toLocaleString("en-ZA")}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
            </Button>
            <Button type="button" variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        <p className="mb-8 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Payment coming soon — this order is not yet paid.
        </p>

        <section className="glass-card mb-6 p-6">
          <h2 className="mb-4 text-lg font-bold text-foreground">Customer details</h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Name</dt>
              <dd className="text-foreground">{order.customer_name}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Email</dt>
              <dd className="break-all text-foreground">{displayEmail(order.customer_email)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Phone</dt>
              <dd className="text-foreground">{order.customer_phone}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Fulfilment</dt>
              <dd className="text-foreground">{titleCase(order.fulfilment)}</dd>
            </div>
            {order.delivery_address ? (
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Delivery address
                </dt>
                <dd className="text-foreground">{order.delivery_address}</dd>
              </div>
            ) : null}
            {order.notes ? (
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Notes</dt>
                <dd className="text-foreground">{order.notes}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="glass-card mb-6 overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-foreground">Item</TableHead>
                <TableHead className="text-foreground">Type</TableHead>
                <TableHead className="text-right text-foreground">Qty</TableHead>
                <TableHead className="text-right text-foreground">Unit price</TableHead>
                <TableHead className="text-right text-foreground">Line total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={`${item.sku}-${item.name}`}>
                  <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                  <TableCell>
                    <LineKindBadge kind={lineKindFromSku(item.sku)} />
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatCents(item.unit_price_cents)}
                  </TableCell>
                  <TableCell className="text-right text-foreground">
                    {formatCents(item.line_total_cents)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        <section className="glass-card p-6">
          <div className="ml-auto max-w-xs space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">
                {formatCents(order.subtotal_cents)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span className="text-foreground">
                {order.delivery_cents === 0 ? "Free" : formatCents(order.delivery_cents)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-base font-semibold text-foreground">Total</span>
              <span className="text-xl font-extrabold text-foreground">
                {formatCents(order.total_cents)}
              </span>
            </div>
          </div>
        </section>

        <div className="mt-6">
          <Button asChild className="w-full">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Return to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
