import { useEffect, useState, useCallback } from "react";

export type StatKey = "emails" | "tasks" | "meetings" | "research";

const KEY = "workplace-ai-stats-v1";

type Stats = Record<StatKey, number>;
const empty: Stats = { emails: 0, tasks: 0, meetings: 0, research: 0 };

function read(): Stats {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

export function bumpStat(key: StatKey) {
  if (typeof window === "undefined") return;
  const current = read();
  current[key] = (current[key] ?? 0) + 1;
  window.localStorage.setItem(KEY, JSON.stringify(current));
  window.dispatchEvent(new CustomEvent("workplace-ai-stats"));
}

export function useStats() {
  const [stats, setStats] = useState<Stats>(empty);
  const refresh = useCallback(() => setStats(read()), []);
  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("workplace-ai-stats", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("workplace-ai-stats", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [refresh]);
  return stats;
}