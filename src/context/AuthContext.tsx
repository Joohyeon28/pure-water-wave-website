import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session, User } from "@supabase/supabase-js";
import { useSupabase } from "@/lib/supabase-context";

export type AppRole = "admin" | "staff" | "customer";

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshRoles: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const rolesQuery = useQuery<boolean>({
    queryKey: ["user-roles", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");

      if (error) throw error;

      const rows = data ?? [];
      return rows.length > 0;
    },
  });

  const refetchRoles = rolesQuery.refetch;

  const refreshRoles = useCallback(async () => {
    await refetchRoles();
  }, [refetchRoles]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error ? error.message : null };
    },
    [supabase],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    await queryClient.invalidateQueries({ queryKey: ["user-roles"] });
  }, [supabase, queryClient]);

  const isAdmin = user ? (rolesQuery.isPending ? null : rolesQuery.data ?? false) : false;

  const value = useMemo<AuthContextValue>(
    () => ({ session, user, loading, isAdmin, signIn, signOut, refreshRoles }),
    [session, user, loading, isAdmin, signIn, signOut, refreshRoles],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>.");
  }

  return context;
};
