"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "@/lib/api";
import type { MeDTO } from "@/lib/types";

type SessionContextValue = {
  me: MeDTO | null;
  loading: boolean;
  refresh: () => Promise<void>;
  applyWallet: (balanceCents: number) => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<MeDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await api<MeDTO>("/api/auth/me");
    setMe(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api<MeDTO>("/api/auth/me");
        if (!cancelled) {
          setMe(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const applyWallet = useCallback((balanceCents: number) => {
    setMe((current) => {
      if (!current?.user || !current.wallet) return current;
      if (current.wallet.balanceCents === balanceCents) return current;
      return { ...current, wallet: { balanceCents } };
    });
  }, []);

  const value = useMemo(
    () => ({ me, loading, refresh, applyWallet }),
    [me, loading, refresh, applyWallet],
  );
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
