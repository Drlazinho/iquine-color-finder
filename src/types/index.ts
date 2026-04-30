export interface QuizOption {
  id: string;
  text: string;
  imageUrl?: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: { id: string; name: string; hex: string }[];
}

export interface ColorCatalogMode {
  type: "ano" | "catalogo" | "custom";
}

export interface QuizFlow {
  id: string;
  name: string;
  createdAt: string;
  questions: QuizQuestion[];
  colorMode: ColorCatalogMode;
  customPalette?: ColorPalette;
  isActive: boolean;
  activeFrom?: string; // ISO date (YYYY-MM-DD)
  activeTo?: string;   // ISO date (YYYY-MM-DD)
}

export type FlowStatus = "live" | "scheduled" | "expired" | "inactive";

export const STORAGE_KEY = "iquine_flows";
export const QUESTIONS_STORAGE_KEY = "iquine_questions";
export const PALETTES_STORAGE_KEY = "iquine_palettes";

/** Returns the flow's current scheduling status. */
export function getFlowStatus(flow: QuizFlow, now: Date = new Date()): FlowStatus {
  if (!flow.isActive) return "inactive";
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const from = flow.activeFrom ? new Date(flow.activeFrom + "T00:00:00").getTime() : undefined;
  const to = flow.activeTo ? new Date(flow.activeTo + "T23:59:59").getTime() : undefined;
  if (from !== undefined && today < from) return "scheduled";
  if (to !== undefined && today > to) return "expired";
  return "live";
}

export function isFlowAvailable(flow: QuizFlow, now: Date = new Date()): boolean {
  return getFlowStatus(flow, now) === "live";
}
