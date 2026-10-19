import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "@/lib/supabase-context";
import { fetchOrder } from "@/lib/order-read";
import type { OrderRead } from "@/lib/order-read";

export function useOrderQuery(reference: string | undefined, email: string | undefined) {
  const supabase = useSupabase();

  return useQuery<OrderRead>({
    queryKey: ["order", reference, email],
    enabled: Boolean(reference && email),
    staleTime: 30_000,
    queryFn: async () => {
      if (!reference || !email) {
        throw new Error("An order reference and email are required.");
      }

      return fetchOrder(supabase, reference, email);
    },
  });
}
