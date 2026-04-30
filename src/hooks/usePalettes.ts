import { useCallback, useEffect, useState } from "react";
import { ColorPalette, PALETTES_STORAGE_KEY } from "@/types";

const isBrowser = typeof window !== "undefined";

function readAll(): ColorPalette[] {
  if (!isBrowser) return [];
  try {
    const raw = localStorage.getItem(PALETTES_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ColorPalette[];
  } catch {
    return [];
  }
}

function writeAll(palettes: ColorPalette[]) {
  if (!isBrowser) return;
  localStorage.setItem(PALETTES_STORAGE_KEY, JSON.stringify(palettes));
}

export function usePalettes() {
  const [palettes, setPalettes] = useState<ColorPalette[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPalettes(readAll());
    setReady(true);
  }, []);

  const refresh = useCallback(() => setPalettes(readAll()), []);

  const savePalette = useCallback((palette: ColorPalette) => {
    let all = readAll();
    const idx = all.findIndex((p) => p.id === palette.id);
    if (idx >= 0) all[idx] = palette;
    else all.push(palette);
    writeAll(all);
    setPalettes(all);
  }, []);

  const deletePalette = useCallback((id: string) => {
    const all = readAll().filter((p) => p.id !== id);
    writeAll(all);
    setPalettes(all);
  }, []);

  const getPalette = useCallback((id: string): ColorPalette | undefined => {
    return readAll().find((p) => p.id === id);
  }, []);

  return { palettes, ready, refresh, savePalette, deletePalette, getPalette };
}
