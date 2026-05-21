"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { runSanityCheck } from '@/utils/debugSanityCheck';

export function DebugSanityRunner() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    if (searchParams.get('test') === 'all') {
      runSanityCheck();
    }
  }, [searchParams]);
  
  return null;
}
