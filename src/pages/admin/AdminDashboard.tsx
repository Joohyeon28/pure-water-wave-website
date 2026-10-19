import { Link } from "react-router-dom";
import { startOfToday } from "date-fns";
import {
  BadgeDollarSign,
  ClipboardList,
  Clock,
  ShoppingCart,
  Store,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminOrdersQuery } from "@/hooks/useAdminOrders";
import { formatCents } from "@/lib/format";
import { statusLabel, statusVariant } from "@/lib/admin-orders";

const LATEST_COUNT = 5;

const AdminDashboard = () => {
  const ordersQuery = useAdminOrdersQuery({});
  const orders = ordersQuery.data ?? [];

  const todayStart = startOfToday().getTime();
  const todayOrders = orders.filter(
    (order) => new Date(order.created_at).getTime() >= todayStart,
  );
  const todayRevenueCents = todayOrders
    .filter((order) => order.status === "paid" || order.status === "fulfilled")
    .reduce((total, order) => total + order.total_cents, 0);
  const pendingPaymentCount = orders.filter(
    (order) => order.status === "pending_payment",
  ).length;
  const unfulfilledCount = orders.filter((order) => order.status === "paid").length;

  const latestOrders = orders.slice(0, LATEST_COUNT);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Everything at a glance for today and the current backlog.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/admin/orders">
              <ClipboardList className="h-4 w-4" />
              All orders
            </Link>
          </Button>
          <Button asChild>
            <Link to="/admin/pos">
              <Store className="h-4 w-4" />
              Point of Sale
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {ordersQuery.isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold text-foreground">{todayOrders.length}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's revenue
            </CardTitle>
            <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {ordersQuery.isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-2xl font-bold text-foreground">
                {formatCents(todayRevenueCents)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending payment
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {ordersQuery.isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold text-foreground">{pendingPaymentCount}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unfulfilled
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {ordersQuery.isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold text-foreground">{unfulfilledCount}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {ordersQuery.isLoading ? (
            <div className="space-y-2 p-6">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          ) : latestOrders.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-foreground">
                      <Link to={`/admin/orders/${order.id}`} className="hover:underline">
                        {order.reference}
                      </Link>
                    </TableCell>
                    <TableCell className="text-foreground">{order.customer_name}</TableCell>
                    <TableCell className="text-right text-foreground">
                      {formatCents(order.total_cents)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(order.status)}>
                        {statusLabel(order.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
