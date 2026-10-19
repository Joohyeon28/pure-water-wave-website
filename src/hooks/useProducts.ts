import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSupabase } from "@/lib/supabase-context";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/supabase";

export type ProductRow = Tables<"products">;

export interface ProductsQueryOptions {
  includeInactive?: boolean;
}

export interface UpdateProductVariables {
  id: string;
  values: TablesUpdate<"products">;
}

export interface ToggleProductVariables {
  id: string;
  active: boolean;
}

const productsKey = ["products"] as const;

function productsQueryKey(includeInactive: boolean) {
  return ["products", { includeInactive }] as const;
}

const allProductsQueryKey = productsQueryKey(true);

export function useProductsQuery(options?: ProductsQueryOptions) {
  const supabase = useSupabase();
  const includeInactive = options?.includeInactive ?? false;

  return useQuery({
    queryKey: productsQueryKey(includeInactive),
    staleTime: 60_000,
    queryFn: async (): Promise<ProductRow[]> => {
      const baseQuery = supabase
        .from("products")
        .select("*")
        .order("category", { ascending: true })
        .order("sort_order", { ascending: true });

      const { data, error } = includeInactive
        ? await baseQuery
        : await baseQuery.eq("active", true);

      if (error) {
        throw error;
      }

      return data ?? [];
    },
  });
}

export function useCreateProduct() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: TablesInsert<"products">): Promise<ProductRow> => {
      const { data, error } = await supabase.from("products").insert(input).select().single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productsKey });
      toast.success("Product created");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateProduct() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values }: UpdateProductVariables): Promise<ProductRow> => {
      const { data, error } = await supabase
        .from("products")
        .update(values)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productsKey });
      toast.success("Product updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useToggleProductActive() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, active }: ToggleProductVariables): Promise<void> => {
      const { error } = await supabase.from("products").update({ active }).eq("id", id);

      if (error) {
        throw error;
      }
    },
    onMutate: async ({ id, active }) => {
      await queryClient.cancelQueries({ queryKey: allProductsQueryKey });

      const previous = queryClient.getQueryData<ProductRow[]>(allProductsQueryKey);

      queryClient.setQueryData<ProductRow[]>(allProductsQueryKey, (old) =>
        old?.map((product) => (product.id === id ? { ...product, active } : product)),
      );

      return { previous };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(allProductsQueryKey, context.previous);
      }

      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Product updated");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: productsKey });
    },
  });
}
