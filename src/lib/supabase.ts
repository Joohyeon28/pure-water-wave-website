import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl: string | undefined = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey: string | undefined = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing VITE_SUPABASE_URL. Copy .env.example to .env.local and set your Supabase project URL.",
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_ANON_KEY. Copy .env.example to .env.local and set your Supabase anon (public) key.",
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
