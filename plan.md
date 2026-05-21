# Batch Implementation Plan for Tool UI

Now that the "Big Bang Initialization" is complete, the Core Engine can load any of the 200 tools from `src/registry/tools.ts`. To avoid creating 200 monolithic files, we will batch-implement the UI in logical phases.

## Strategy: Category-Driven Development

Since many tools share the same libraries (e.g., all PDF tools use `pdf-lib`, all Image tools use `Canvas API` and `browser-image-compression`), we will implement them by category rather than one by one.

### Phase 1: The Utilities (Low Complexity)
- **Categories**: Utility, Finance, HR, Marketing
- **Stack**: Vanilla JS, React State, `date-fns`
- **Goal**: Build generic hooks (e.g., `useCalculations`, `useRandomizer`) that power these 50+ simple calculators and randomizers. They can share a single UI template where only the formulas change.

### Phase 2: The Document Factory (Medium Complexity)
- **Categories**: PDF, Text
- **Stack**: `pdf-lib`, `jspdf`, `papaparse`, Canvas API
- **Goal**: Create a universal `FileUploader` component that accepts drag-and-drop. Write a unified worker strategy for processing PDFs securely on the client-side.

### Phase 3: The Media Engine (High Complexity)
- **Categories**: Image, Video, Audio
- **Stack**: `@ffmpeg/ffmpeg`, WebCodecs API, `@tensorflow/tfjs`
- **Goal**: Implement lazy-loaded WASM modules. Since WASM binaries are heavy, we will build a `WasmLoader` boundary that shows a loading state while fetching from the Cloudflare CDN, avoiding freezing the UI. 

### Phase 4: The Edge Proxies (API / AI Dependent)
- **Categories**: AI, Downloader
- **Stack**: Cloudflare Workers, Turnstile
- **Goal**: For tools that require fetching from third parties (e.g., `yt-dlp` functionality via a wrapper API, or OpenAI API calls), we will build the Cloudflare Worker proxy routes to securely pass the inputs without exposing keys on the client-side.

## Next Steps
To begin, simply instruct me to:
> "Execute Phase 1: The Utilities"
I will then generate the shared calculator hooks and map them to the registry UI renderer!
