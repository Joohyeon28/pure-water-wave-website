import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSupabase } from "@/lib/supabase-context";
import type { TablesUpdate } from "@/types/supabase";
import { sanitiseSearchTerm } from "@/lib/admin-orders";
import type { AdminOrderDetail, AdminOrderRow } from "@/lib/admin-orders";

export interface AdminOrdersFilters {
  status?: string;
  channel?: string;
  search?: string;
}

export interface UpdateOrderStatusVariables {
  id: string;
  status: string;
}

const adminOrdersKey = ["admin-orders"] as const;
const adminOrderKey = (id: string | undefined) => ["admin-order", id] as const;

export function useAdminOrdersQuery(filters: AdminOrdersFilters) {
  const supabase = useSupabase();
  const status = filters.status ?? "";
  const channel = filters.channel ?? "";
  const search = sanitiseSearchTerm(filters.search ?? "");

  return useQuery({
    queryKey: ["admin-orders", { status, channel, search }],
    staleTime: 15_000,
    queryFn: async (): Promise<AdminOrderRow[]> => {
      let query = supabase
        .from("orders")
        .select("*, order_items(count)")
        .order("created_at", { ascending: false })
        .limit(200);

      if (status) {
        query = query.eq("status", status);
      }

      if (channel) {
        query = query.eq("channel", channel);
      }

      if (search) {
        const term = `%${search}%`;
        query = query.or(
          `reference.ilike.${term},customer_email.ilike.${term},customer_name.ilike.${term},customer_phone.ilike.${term}`,
        );
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data ?? []).map((row) => {
        const { order_items, ...order } = row;

        return { ...order, item_count: order_items?.[0]?.count ?? 0 };
      });
    },
  });
}

export function useAdminOrderQuery(id: string | undefined) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: adminOrderKey(id),
    enabled: Boolean(id),
    queryFn: async (): Promise<AdminOrderDetail> => {
      if (!id) {
        throw new Error("An order id is required.");
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      const { order_items, ...order } = data;

      return { ...order, items: order_items };
    },
  });
}

export function useUpdateOrderStatus() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: UpdateOrderStatusVariables): Promise<void> => {
      const patch: TablesUpdate<"orders"> = { status };

      if (status === "paid") {
        patch.paid_at = new Date().toISOString();
      }

      if (status === "fulfilled") {
        patch.fulfilled_at = new Date().toISOString();
      }

      const { error } = await supabase.from("orders").update(patch).eq("id", id);

      if (error) {
        throw error;
      }
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: adminOrdersKey });
      void queryClient.invalidateQueries({ queryKey: adminOrderKey(variables.id) });
      toast.success("Order updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
