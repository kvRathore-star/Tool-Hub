import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(
    // Note: process.env.DB is populated by Cloudflare Pages / OpenNext bindings
    drizzle(process.env.DB as unknown as D1Database, { schema }),
    {
      provider: "sqlite",
      schema,
    }
  ),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      credits: {
        type: "number",
        defaultValue: 100,
      },
      plan: {
        type: "string",
        defaultValue: "free",
      },
    },
  },
});
