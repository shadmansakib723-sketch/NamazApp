import { useEffect } from "react";

import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import type { AuthUser } from "@/types/auth";

/**
 * Restores the persisted Supabase session on app startup and keeps
 * the Zustand auth store in sync with future auth state changes.
 *
 * Call this once at the root layout — it has no return value.
 */
export function useAuthInit(): void {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // 1. Restore session that Supabase already saved in AsyncStorage.
    setLoading(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        const restoredUser: AuthUser = {
          id: u.id,
          email: u.email ?? "",
          name:
            u.user_metadata?.full_name ??
            u.user_metadata?.name ??
            "",
          avatarUrl: u.user_metadata?.avatar_url ?? null,
        };
        setUser(restoredUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // 2. Stay in sync for sign-in / sign-out events while the app is open.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const u = session.user;
          setUser({
            id: u.id,
            email: u.email ?? "",
            name:
              u.user_metadata?.full_name ??
              u.user_metadata?.name ??
              "",
            avatarUrl: u.user_metadata?.avatar_url ?? null,
          });
        } else {
          setUser(null);
        }
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
