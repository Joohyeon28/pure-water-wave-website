import type { ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { SupabaseContext } from "@/lib/supabase-context";

interface SupabaseProviderProps {
  children: ReactNode;
}

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => (
  <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>
);
