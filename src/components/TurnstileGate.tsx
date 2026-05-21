"use client";

import { useState, useCallback, type ReactNode } from "react";
import Script from "next/script";

export interface TurnstileGateProps {
  siteKey: string;
  onVerify: (token: string) => void;
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
  // Use a unique ID per instance for multiple Turnstile widgets on a page
  const [widgetId, _] = useState(() => crypto.randomUUID());

  const handleTurnstileCallback = useCallback(
    (token: string) => {
      setToken(token);
      onVerify(token);
    },
    [onVerify]
  );

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />
      <div
        id={widgetId}
        className={className}
        data-sitekey={siteKey}
        data-callback={`turnstileCb_${widgetId.replace(/-/g, "_")}`}
      />
      {/* Inject the callback into window so Turnstile can call it */}
      <Script
        id={`turnstile-cb-${widgetId}`}
        strategy="lazyOnload"
      >{`
        window.turnstileCb_${widgetId.replace(/-/g, "_")} = function(token) {
          // Dispatch to the nearest TurnstileGate
          window.dispatchEvent(new CustomEvent('turnstile:${widgetId}', { detail: token }));
        };
      `}</Script>
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
      onVerify(token);
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