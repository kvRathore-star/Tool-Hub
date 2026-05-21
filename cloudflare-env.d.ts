/// <reference types="@cloudflare/workers-types" />

declare global {
  namespace Cloudflare {
    interface Env {
      // D1 Database (tool metadata, user preferences)
      DB: D1Database;

      // KV Namespace (global config, feature flags, rate limits)
      KV_CONFIG: KVNamespace;

      // R2 Bucket (transient file processing)
      R2_STORE: R2Bucket;

      // Turnstile secret key for server-side verification
      TURNSTILE_SECRET_KEY: string;
    }
  }

  // Extend the global process.env for Edge compatibility
  namespace NodeJS {
    interface ProcessEnv extends Cloudflare.Env {}
  }
}

export type {};

// Augment the Request/response types for Cloudflare-specific contexts
declare module "next/server" {
  interface NextRequest {
    cf?: IncomingRequestCfProperties;
  }
}