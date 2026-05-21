import type { ToolMeta } from "@/types/tool";

export const toolRegistry: ToolMeta[] = [
  // === TEXT TOOLS ===
  {
    slug: "text-humanizer",
    name: "AI Text Humanizer",
    description:
      "Transform AI-generated text into natural, human-like writing with adjustable tone and style.",
    category: "text",
    icon: "📝",
    tags: ["ai", "writing", "content"],
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    description:
      "Count words, characters, sentences, paragraphs, and reading time for any text.",
    category: "text",
    icon: "🔢",
    tags: ["writing", "statistics"],
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    description:
      "Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.",
    category: "text",
    icon: "🔤",
    tags: ["formatting", "developer"],
  },

  // === IMAGE TOOLS ===
  {
    slug: "background-remover",
    name: "Image Background Remover",
    description:
      "Remove image backgrounds instantly using on-device AI. Nothing leaves your browser.",
    category: "image",
    icon: "🖼️",
    wasm: true,
    tags: ["ai", "editing", "wasm"],
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description:
      "Compress JPEG, PNG, and WebP images without visible quality loss.",
    category: "image",
    icon: "🗜️",
    tags: ["compression", "optimization"],
  },

  // === PDF TOOLS ===
  {
    slug: "pdf-compressor",
    name: "PDF Compressor",
    description:
      "Reduce PDF file size while maintaining quality. All processing is client-side.",
    category: "pdf",
    icon: "📄",
    wasm: true,
    tags: ["compression", "wasm", "document"],
  },
  {
    slug: "pdf-merger",
    name: "PDF Merger",
    description: "Combine multiple PDFs into a single document.",
    category: "pdf",
    icon: "📎",
    tags: ["merge", "document"],
  },

  // === DEVELOPER TOOLS ===
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description:
      "Format, validate, and prettify JSON with syntax highlighting and error detection.",
    category: "developer",
    icon: "💻",
    tags: ["json", "formatter", "developer"],
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder/Decoder",
    description:
      "Encode or decode Base64 strings. Supports text, files, and data URIs.",
    category: "developer",
    icon: "🔐",
    tags: ["encoding", "developer"],
  },

  // === CONVERTER TOOLS ===
  {
    slug: "unit-converter",
    name: "Unit Converter",
    description:
      "Convert between hundreds of units across length, mass, temperature, currency, and more.",
    category: "converter",
    icon: "📐",
    tags: ["conversion", "math"],
  },

  // === MISC TOOLS ===
  {
    slug: "password-generator",
    name: "Password Generator",
    description:
      "Generate cryptographically secure passwords with customizable length and character sets.",
    category: "security",
    icon: "🔑",
    tags: ["security", "password"],
  },
];

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return toolRegistry.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string): ToolMeta[] {
  return toolRegistry.filter((t) => t.category === category);
}

export function getAllCategories(): string[] {
  return [...new Set(toolRegistry.map((t) => t.category))];
}

export function searchTools(query: string): ToolMeta[] {
  const q = query.toLowerCase();
  return toolRegistry.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.includes(q)) ||
      t.category.includes(q)
  );
}