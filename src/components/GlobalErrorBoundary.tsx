"use client";

import React from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

function FallbackComponent({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : "An unexpected memory limit or processing error occurred locally on your device.";
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-950/20 border border-red-500/20 rounded-2xl w-full">
      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4 text-red-500">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      </div>
      <h3 className="text-xl font-bold text-red-500 mb-2">Tool Engine Crashed</h3>
      <p className="text-zinc-400 text-center mb-6 max-w-md text-sm">
        {message}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg transition-colors"
      >
        Reset Tool & Try Again
      </button>
    </div>
  );
}

export function GlobalErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      {children}
    </ErrorBoundary>
  );
}
