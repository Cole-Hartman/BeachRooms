import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  email: string | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  isLoggedIn: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const user: User | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email ?? null,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        isLoggedIn: !!session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
