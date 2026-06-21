"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col items-center justify-center bg-[var(--bg-base)] p-8">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
            <span className="text-red-500 text-3xl font-bold">!</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
            Something went wrong
          </h1>
          <p className="text-[var(--text-secondary)] mb-8 text-sm leading-relaxed">
            A critical error occurred. Our team has been notified.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl font-medium transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
