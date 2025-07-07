// src/components/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../../../../packages/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    console.log("🟢 AuthProvider mounted");

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error("❌ getSession error:", error.message);
      else console.log("✅ Initial session:", data.session);
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log("🔁 Auth state changed:", newSession);
      setSession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
