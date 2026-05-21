export type ToolCategory =
  | "text"
  | "image"
  | "pdf"
  | "developer"
  | "converter"
  | "security"
  | "network"
  | "math"
  | "data"
  | "misc";

export interface ToolMeta {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  // WASM-based processing runs entirely client-side
  wasm?: boolean;
  // Edge-compatible server logic
  edge?: boolean;
  tags: string[];
}

export interface ToolResult {
  ok: boolean;
  data?: unknown;
  error?: string;
}

export interface FileUploadMeta {
  file: File;
  id: string;
  progress: number;
}