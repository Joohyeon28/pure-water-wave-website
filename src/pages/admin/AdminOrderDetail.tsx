import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminOrderQuery, useUpdateOrderStatus } from "@/hooks/useAdminOrders";
import { formatCents } from "@/lib/format";
import {
  canCancel,
  canMarkFulfilled,
  canMarkPaid,
  canRefund,
  statusLabel,
  statusVariant,
} from "@/lib/admin-orders";

function titleCase(value: string): string {
  return value.length === 0 ? value : value.charAt(0).toUpperCase() + value.slice(1);
}

function paymentMethodLabel(method: string): string {
  return method === "eft" ? "EFT" : titleCase(method);
}

const AdminOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const orderQuery = useAdminOrderQuery(id);
  const updateStatus = useUpdateOrderStatus();
  const [refundOpen, setRefundOpen] = useState(false);

  if (orderQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-56" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-56 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">Order not found</h1>
        <p className="text-muted-foreground">
          This order may have been removed, or the link is incorrect.
        </p>
        <Button asChild variant="outline">
          <Link to="/admin/orders">Back to orders</Link>
        </Button>
      </div>
    );
  }

  const order = orderQuery.data;
  const pending = updateStatus.isPending;

  const markPaid = () => updateStatus.mutate({ id: order.id, status: "paid" });
  const markFulfilled = () => updateStatus.mutate({ id: order.id, status: "fulfilled" });
  const cancelOrder = () => updateStatus.mutate({ id: order.id, status: "cancelled" });
  const confirmRefund = () => {
    updateStatus.mutate({ id: order.id, status: "refunded" });
    setRefundOpen(false);
  };

  const hasActions =
    canMarkPaid(order.status) ||
    canMarkFulfilled(order.status) ||
    canCancel(order.status) ||
    canRefund(order.status);

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">{order.reference}</h1>
          <Badge variant={statusVariant(order.status)}>{statusLabel(order.status)}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Placed {new Date(order.created_at).toLocaleString("en-ZA")} (
          {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })})
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Name</dt>
                  <dd className="text-foreground">{order.customer_name}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Email</dt>
                  <dd className="break-all text-foreground">{order.customer_email}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Phone</dt>
                  <dd className="text-foreground">{order.customer_phone}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                    Fulfilment
                  </dt>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit price</TableHead>
                    <TableHead className="text-right">Line total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-foreground">{item.sku}</TableCell>
                      <TableCell className="text-foreground">{item.name}</TableCell>
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
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Totals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
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
              {order.payment_method ? (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Payment method</span>
                  <span className="text-foreground">
                    {paymentMethodLabel(order.payment_method)}
                  </span>
                </div>
              ) : null}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-lg font-extrabold text-foreground">
                  {formatCents(order.total_cents)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {canMarkPaid(order.status) ? (
                <Button type="button" disabled={pending} onClick={markPaid}>
                  {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Mark as paid
                </Button>
              ) : null}

              {canMarkFulfilled(order.status) ? (
                <Button type="button" disabled={pending} onClick={markFulfilled}>
                  {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Mark as fulfilled
                </Button>
              ) : null}

              {canCancel(order.status) ? (
                <Button
                  type="button"
                  variant="destructive"
                  disabled={pending}
                  onClick={cancelOrder}
                >
                  Cancel order
                </Button>
              ) : null}

              {canRefund(order.status) ? (
                <Button
                  type="button"
                  variant="destructive"
                  disabled={pending}
                  onClick={() => setRefundOpen(true)}
                >
                  Mark as refunded
                </Button>
              ) : null}

              {!hasActions ? (
                <p className="text-sm text-muted-foreground">
                  No actions are available for this order status.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark {order.reference} as refunded?</DialogTitle>
            <DialogDescription>
              Refund the customer in your payment provider dashboard first, then record it here.
              This only updates the order status.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRefundOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" disabled={pending} onClick={confirmRefund}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Mark as refunded
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrderDetail;
