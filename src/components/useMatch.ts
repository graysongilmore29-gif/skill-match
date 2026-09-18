"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { MatchDTO } from "@/lib/types";

export function useMatch(id: string | null) {
  const [match, setMatch] = useState<MatchDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(id));

  const refresh = useCallback(async () => {
    if (!id) return;
    const data = await api<{ match: MatchDTO }>(`/api/matches/${id}`);
    setMatch(data.match);
    setError(null);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let timer = 0;
    let cancelled = false;
    const tick = async () => {
      try {
        if (!cancelled) await refresh();
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load match");
          setLoading(false);
        }
      }
      if (!cancelled) timer = window.setTimeout(tick, 2000);
    };
    void tick();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [id, refresh]);

  return { match, setMatch, error, setError, loading, refresh };
}

export async function matchAction(id: string, body: Record<string, unknown>) {
  const data = await api<{ match: MatchDTO }>(`/api/matches/${id}/action`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return data.match;
}
