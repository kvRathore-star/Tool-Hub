"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Zero-Knowledge Cookieless Telemetry Dispatcher
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    const payload = {
      path: url,
      timestamp: new Date().toISOString(),
      clientType: navigator.userAgent.includes('Capacitor') ? 'Android Native' : 'Web Browser',
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      // Strictly NO IP, NO cookies, NO geographical trackers
    };

    // In a real scenario, this would fetch() to a cookieless endpoint like Plausible or a Cloudflare Worker
    console.debug('[Telemetry] Anonymized zero-knowledge page view logged:', payload);
  }, [pathname, searchParams]);

  return null;
}
