"use client";
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export function MemoryWatchdog() {
  useEffect(() => {
    const checkMemory = () => {
      if (typeof navigator !== 'undefined' && 'deviceMemory' in navigator) {
        const ram = (navigator as any).deviceMemory as number;
        if (ram && ram < 4) {
          toast('Low-RAM Mode Activated. Processing may take longer.', {
            icon: '⚡',
            style: {
              borderRadius: '10px',
              background: '#18181b',
              color: '#fbbf24',
              border: '1px solid rgba(251, 191, 36, 0.2)',
            },
            id: 'memory-watchdog',
          });
        }
      }
    };

    checkMemory();
  }, []);

  return null;
}
