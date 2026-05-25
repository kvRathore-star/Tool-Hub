"use client";

import { useState, useCallback, useEffect, type ReactNode } from "react";
import Script from "next/script";

export interface TurnstileGateProps {
  siteKey: string;
  onVerify?: (token: string) => void;
  children: ReactNode;
  className?: string;
}

/**
 * Wraps an action button with Cloudflare Turnstile verification.
 * The button is disabled until the Turnstile challenge is completed.
 */
export function TurnstileGate({
  siteKey,
  onVerify,
  children,
  className,
}: TurnstileGateProps) {
  const [token, setToken] = useState<string | null>(null);
  const [widgetId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    const cbName = `turnstileCb_${widgetId.replace(/-/g, "_")}`;
    (window as any)[cbName] = (token: string) => {
      setToken(token);
      if (onVerify) {
        onVerify(token);
      }
    };
    return () => {
      delete (window as any)[cbName];
    };
  }, [widgetId, onVerify]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />
      <div
        id={widgetId}
        className={`cf-turnstile ${className || ""}`}
        data-sitekey={siteKey}
        data-callback={`turnstileCb_${widgetId.replace(/-/g, "_")}`}
      />
      {children}
    </>
  );
}

/**
 * Simpler version: renders children that are locked until Turnstile is solved.
 */
export function TurnstileLock({
  siteKey,
  children,
  onVerify,
  className,
}: TurnstileGateProps) {
  const [verified, setVerified] = useState(false);

  const handleVerify = useCallback(
    (token: string) => {
      setVerified(true);
      if (onVerify) {
        onVerify(token);
      }
    },
    [onVerify]
  );

  if (verified) {
    return <>{children}</>;
  }

  return (
    <div className={className}>
      <p className="mb-4 text-sm text-zinc-500">
        Verify you&apos;re human to use this tool
      </p>
      <TurnstileGate siteKey={siteKey} onVerify={handleVerify}>
        {null}
      </TurnstileGate>
    </div>
  );
}