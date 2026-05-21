# CLAUDE.md — ToolHub Architecture Rules

## Project Identity

ToolHub is a privacy-first web utility platform (200+ tools) deployed on Cloudflare's
free tier. All architectural decisions flow from two inviolable constraints:

1. **Zero-Knowledge Processing** — PDFs, images, and text MUST be processed
   client-side. Server never sees user content.
2. **$0/mo Budget** — Everything must fit within Cloudflare Free Tier limits.

## Tech Stack

| Concern          | Choice                               |
| ---------------- | ------------------------------------ |
| Framework        | Next.js 16 (App Router)              |
| Export Strategy  | Static Export (`output: 'export'`)   |
| Mobile Build     | Android (Ionic CapacitorJS)          |
| Adapter          | @opennextjs/cloudflare               |
| Runtime          | Edge (NO `node:*` imports anywhere)  |
| Styling          | Tailwind CSS 4.0 + shadcn/ui         |
| DB (metadata)    | Cloudflare D1                        |
| DB (config)      | Cloudflare KV                        |
| File processing  | Cloudflare R2 (temp storage only)    |
| Heavy compute    | Client-side WASM (Rust/AssemblyScript)|
| Security         | Turnstile on every action button     |

## Directory Structure

```
src/
├── app/                    # Next.js App Router (Edge-first)
│   ├── layout.tsx
│   ├── page.tsx            # Landing page
│   ├── tools/[slug]/       # Dynamic tool routes (PPR capable)
│   └── api/                # Edge API routes
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── ToolLayout.tsx      # Generic tool wrapper (ads, SEO, Turnstile)
│   └── FileUploader.tsx    # Drag-drop, clipboard, URL import uploader
├── lib/
│   ├── tools.ts            # Tool registry (200+ tools metadata)
│   ├── turnstile.ts        # Turnstile verification helpers
│   └── wasm/               # WASM loaders (Rust/AS bindings)
├── types/                  # Shared TypeScript definitions
└── hooks/                  # Shared React hooks
cloudflare-env.d.ts         # Cloudflare Workers type augmentations
wrangler.jsonc              # Wrangler deployment configuration (2026 std)
```

## Rules

### Edge Runtime
- **ABSOLUTE**: No `node:fs`, `node:path`, `node:crypto`, `node:stream`.
  Use Web Crypto API, `crypto.subtle`, and `ReadableStream`.
- All API routes must export `export const runtime = "edge"`.

### Privacy & API Handling
- **NO PYTHON/DESKTOP BINARIES**: Terminal binaries (like yt-dlp) or Python libraries (like PyPDF) must be completely rewritten using client-side JS or WASM equivalents (e.g. pdf-lib).
- **BROWSER NATIVE FIRST**: For Canvas, Web Audio, or text processing tools, strictly prefer native browser APIs over npm packages.
- **EXTERNAL APIS (Gemini/LLMs)**: Route external API requests through an optimized Cloudflare Worker API proxy to secure keys and keep execution time under free-tier limits. Never call external API keys directly from the client.
- Files stay in-memory (ArrayBuffer / Blob). Never upload raw user data to R2
  without client-side encryption.
- No analytics/tracking scripts. No third-party CDNs.
- CSP headers must block external scripts, frames, and fonts by default.

### Performance
- Target 100/100 Lighthouse. All routes should use Partial Prerendering (PPR)
  for static shell with dynamic content.
- WASM modules must be lazily loaded (`dynamic import` with `ssr: false`).
- Worker CPU time < 10ms per request. Heavy ops are client-side only.

### Security
- Every <button> that performs an action requires Turnstile verification.
  Use the `<TurnstileGate>` wrapper component.
- Strict CSP via `_headers` or middleware. Default-src 'self'.
- All user input goes through DOMPurify or equivalent before render.

### Data
- D1 stores: tool metadata, categories, slugs, usage counts.
- KV stores: global feature flags, rate-limit config, cached tool definitions.
- R2 stores: ephemeral share links (expiring objects with lifecycle rules).

### Code Quality
- TypeScript strict mode. Every function has explicit return types.
- Components are server components by default; `"use client"` only when needed.
- No barrel exports (`index.ts` re-exporting modules). Direct imports only.
- shadcn/ui components go in `src/components/ui/` via the CLI.

### WASM Conventions
- Each WASM tool lives in `src/lib/wasm/<tool-slug>/`.
- Loader pattern: `dynamic(() => import("./wasm/<slug>/loader"), { ssr: false })`.
- WASM files served from `/public/wasm/` for direct fetch + instantiate.

## Deployment

- `wrangler.jsonc` (2026 standard) configures Pages, D1, KV, R2 bindings.
- Build: `next build && npx @opennextjs/cloudflare build`.
- Deploy: `npx wrangler pages deploy .opennext/ --project-name toolhub`.
- CI should run: `next lint`, `next build`, then `@opennextjs/cloudflare build`.

## Future Sessions

When continuing ToolHub development:
- Always check this CLAUDE.md for constraints before writing code.
- The tool registry in `src/lib/tools.ts` is the source of truth for adding tools.
- Every new tool needs: a slug, category, metadata entry, and a route at
  `src/app/tools/[slug]/page.tsx`.
- Never add `node:*` dependencies. If a library needs Node, find a Web-compatible
  alternative.