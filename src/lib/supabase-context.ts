import { createContext, useContext } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export const SupabaseContext = createContext<SupabaseClient<Database> | null>(null);

export const useSupabase = (): SupabaseClient<Database> => {
  const client = useContext(SupabaseContext);

  if (!client) {
    throw new Error("useSupabase must be used within a <SupabaseProvider>.");
  }

  return client;
};
