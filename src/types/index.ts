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

export interface ColorCatalogMode {
  type: "ano" | "catalogo";
}

export interface QuizFlow {
  id: string;
  name: string;
  createdAt: string;
  questions: QuizQuestion[];
  colorMode: ColorCatalogMode;
}

export const STORAGE_KEY = "iquine_flows";
