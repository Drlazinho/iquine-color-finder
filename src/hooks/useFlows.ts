import { useCallback, useEffect, useState } from "react";
import { QuizFlow, STORAGE_KEY, isFlowAvailable } from "@/types";

const isBrowser = typeof window !== "undefined";

function readAll(): QuizFlow[] {
  if (!isBrowser) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QuizFlow[];
    // backfill defaults for older records
    return parsed.map((f) => ({ ...f, isActive: f.isActive ?? false }));
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
    let all = readAll();
    const idx = all.findIndex((f) => f.id === flow.id);
    if (idx >= 0) all[idx] = flow;
    else all.push(flow);
    // Exclusive activation: only one active flow at a time
    if (flow.isActive) {
      all = all.map((f) => (f.id === flow.id ? f : { ...f, isActive: false }));
    }
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

  const setActive = useCallback((id: string, active: boolean) => {
    const all = readAll().map((f) => {
      if (f.id === id) return { ...f, isActive: active };
      return active ? { ...f, isActive: false } : f;
    });
    writeAll(all);
    setFlows(all);
  }, []);

  const getAvailableFlow = useCallback((): QuizFlow | undefined => {
    return readAll().find((f) => isFlowAvailable(f));
  }, []);

  return { flows, ready, refresh, saveFlow, deleteFlow, getFlow, setActive, getAvailableFlow };
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
