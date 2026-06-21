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

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  plan: string;
  credits: number;
}
