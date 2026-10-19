import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Eye, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ORDER_STATUSES, statusLabel, statusVariant } from "@/lib/admin-orders";

const ALL = "all";
const skeletonRows = [0, 1, 2, 3, 4];

function channelLabel(channel: string): string {
  if (channel === "in_store") return "In-store";
  if (channel === "online") return "Online";
  return channel;
}

function titleCase(value: string): string {
  return value.length === 0 ? value : value.charAt(0).toUpperCase() + value.slice(1);
}

const AdminOrders = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>(ALL);
  const [channel, setChannel] = useState<string>(ALL);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  const ordersQuery = useAdminOrdersQuery({
    status: status === ALL ? "" : status,
    channel: channel === ALL ? "" : channel,
    search: debouncedSearch.trim(),
  });

  const orders = ordersQuery.data ?? [];
  const total = orders.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground">
          {ordersQuery.isLoading ? "Loading orders…" : `${total} order${total === 1 ? "" : "s"}`}
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="space-y-2 sm:w-44">
          <Label htmlFor="status-filter">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All</SelectItem>
              {ORDER_STATUSES.map((option) => (
                <SelectItem key={option} value={option}>
                  {statusLabel(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:w-44">
          <Label htmlFor="channel-filter">Channel</Label>
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger id="channel-filter">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="in_store">In-store</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:min-w-64 sm:flex-1">
          <Label htmlFor="order-search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="order-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Reference, name, email or phone"
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {ordersQuery.isError ? (
        <p className="text-sm text-destructive">
          {ordersQuery.error?.message ?? "Failed to load orders."}
        </p>
      ) : null}

      {ordersQuery.isLoading ? (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Fulfilment</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Lines</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">View</TableHead>
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
          <p className="text-muted-foreground">No orders match these filters.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Fulfilment</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Lines</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                >
                  <TableCell className="font-medium text-foreground">{order.reference}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <span className="block text-foreground">{order.customer_name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {order.customer_email}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {titleCase(order.fulfilment)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {channelLabel(order.channel)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {order.item_count}
                  </TableCell>
                  <TableCell className="text-right text-foreground">
                    {formatCents(order.total_cents)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(order.status)}>{statusLabel(order.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination is deferred; the query is capped at 200 rows. */}
    </div>
  );
};

export default AdminOrders;
