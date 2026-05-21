import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import { DebugSanityRunner } from "@/components/DebugSanityRunner";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { PremiumProvider } from "@/context/PremiumContext";
import "./globals.css";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://toolhub.pages.dev'),
  title: {
    default: "ToolHub — Privacy-First Web Tools",
    template: "%s | ToolHub",
  },
  description:
    "200+ free, privacy-first web tools. PDF compression, image editing, text processing, and more — all processed in your browser. Nothing uploaded, ever.",
  keywords: [
    "web tools",
    "pdf compressor",
    "image background remover",
    "text humanizer",
    "privacy first",
    "free tools",
  ],
  robots: "index, follow",
  openGraph: {
    type: "website",
    siteName: "ToolHub",
    title: "ToolHub — Privacy-First Web Tools",
    description:
      "200+ free web tools. Everything processed in your browser.",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-zinc-50 font-mono text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <a
              href="/"
              className="text-lg font-bold tracking-tight"
            >
              ToolHub
            </a>
            <nav className="flex items-center gap-4 text-sm text-zinc-500">
              <a href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100">
                Tools
              </a>
              <a href="#about" className="hover:text-zinc-900 dark:hover:text-zinc-100">
                About
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <PremiumProvider>
            {children}
          </PremiumProvider>
        </main>
        
        <Suspense fallback={null}>
          <AnalyticsProvider />
          <DebugSanityRunner />
        </Suspense>

        <Toaster 
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#18181b', // zinc-900
              color: '#fff',
              border: '1px solid #27272a',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        {/* Footer */}
        <footer className="border-t border-zinc-200 py-8 dark:border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 text-center text-sm text-zinc-400 sm:px-6">
            <p>
              ToolHub &mdash; All processing happens in your browser.
              No tracking. No ads. No BS.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}