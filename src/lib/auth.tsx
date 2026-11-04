import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const DEMO_USER: User = {
  id: "demo-user-fincontrol",
  app_metadata: { provider: "email" },
  user_metadata: { full_name: "Karla Castro" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  email: "karla@fincontrol.app",
  role: "authenticated",
} as unknown as User;

type AuthContextValue = {
  user: User;
  session: Session | null;
  loading: boolean;
  isDemo: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: DEMO_USER,
  session: null,
  loading: false,
  isDemo: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
        setSession(s);
      });
      supabase.auth.getSession().then(({ data }) => {
        if (data?.session) {
          setSession(data.session);
        }
      });
      return () => sub.subscription.unsubscribe();
    } catch {
      // Ignore network errors in demo mode
    }
  }, []);

  const activeUser = session?.user ?? DEMO_USER;

  return (
    <AuthContext.Provider value={{ user: activeUser, session, loading, isDemo: !session }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
