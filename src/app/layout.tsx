import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import { DebugSanityRunner } from "@/components/DebugSanityRunner";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { PremiumProvider } from "@/context/PremiumContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gotoolhub.com'),
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
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased dark`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Header />

          <main className="flex-1">
            <PremiumProvider>
              {children}
            </PremiumProvider>
          </main>
          
          <Suspense fallback={null}>
            <AnalyticsProvider />
            {process.env.NODE_ENV === 'development' && <DebugSanityRunner />}
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

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}