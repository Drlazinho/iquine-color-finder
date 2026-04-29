import { useCallback, useEffect, useState } from "react";
import { QuizFlow, STORAGE_KEY } from "@/types";

const isBrowser = typeof window !== "undefined";

function readAll(): QuizFlow[] {
  if (!isBrowser) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QuizFlow[]) : [];
  } catch {
    return [];
  }
}

function writeAll(flows: QuizFlow[]) {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(flows));
}

export function useFlows() {
  const [flows, setFlows] = useState<QuizFlow[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFlows(readAll());
    setReady(true);
  }, []);

  const refresh = useCallback(() => setFlows(readAll()), []);

  const saveFlow = useCallback((flow: QuizFlow) => {
    const all = readAll();
    const idx = all.findIndex((f) => f.id === flow.id);
    if (idx >= 0) all[idx] = flow;
    else all.push(flow);
    writeAll(all);
    setFlows(all);
  }, []);

  const deleteFlow = useCallback((id: string) => {
    const all = readAll().filter((f) => f.id !== id);
    writeAll(all);
    setFlows(all);
  }, []);

  const getFlow = useCallback((id: string): QuizFlow | undefined => {
    return readAll().find((f) => f.id === id);
  }, []);

  return { flows, ready, refresh, saveFlow, deleteFlow, getFlow };
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
