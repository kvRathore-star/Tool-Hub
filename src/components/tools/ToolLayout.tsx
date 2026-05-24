import React from 'react';
import Link from 'next/link';
import { GlobalErrorBoundary } from '../GlobalErrorBoundary';
import { TurnstileLock } from '../TurnstileGate';
import { ChevronRight, Shield, Zap, Info } from 'lucide-react';

interface ToolLayoutProps {
  title: string;
  description: string;
  category: string;
  children: React.ReactNode;
  faqs?: { question: string; answer: string }[];
}

export function ToolLayout({ title, description, category, children, faqs = [] }: ToolLayoutProps) {
  const displayCategory = category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <div className="min-h-screen bg-[var(--bg-base)]">
        
        {/* Background Accent Glow */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--accent)]/5 blur-[120px] rounded-full pointer-events-none" />

        <main className="max-w-[800px] mx-auto py-16 px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">ToolHub</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/tools" className="hover:text-[var(--text-primary)] transition-colors">Tools</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/${category}`} className="hover:text-[var(--text-primary)] transition-colors">{displayCategory}</Link>
          </nav>

          {/* Header */}
          <h1 className="font-[family-name:var(--font-serif)] text-5xl sm:text-6xl text-[var(--text-primary)] mb-4">
            {title}
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-6 max-w-[600px]">
            {description}
          </p>

          {/* Usage / Trust Badges */}
          <div className="flex items-center gap-4 mb-12 text-[11px] font-medium text-[var(--text-muted)] tracking-wide bg-[var(--bg-overlay)] border border-[var(--border-subtle)] px-4 py-2 rounded-full shadow-sm">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-[var(--success)]" /> 100% Private</span>
            <span className="w-[1px] h-3 bg-[var(--border-subtle)]" />
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-[var(--warning)]" /> Browser Native</span>
            <span className="w-[1px] h-3 bg-[var(--border-subtle)]" />
            <span className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-[var(--accent)]" /> 12K+ Uses</span>
          </div>

          {/* The Widget Container */}
          <div className="w-full text-left bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-2xl)] shadow-[var(--shadow-md)] overflow-hidden">
            <GlobalErrorBoundary>
              <TurnstileLock siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}>
                {children}
              </TurnstileLock>
            </GlobalErrorBoundary>
          </div>

          {/* SEO FAQs */}
          {faqs && faqs.length > 0 && (
            <section className="mt-24 w-full text-left">
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-8 flex items-center gap-3 border-b border-[var(--border-subtle)] pb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="group bg-[var(--bg-overlay)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] overflow-hidden transition-all [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center justify-between p-5 text-[var(--text-primary)] font-medium select-none">
                      <span>{faq.question}</span>
                      <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="px-5 pb-5 pt-1 text-[var(--text-secondary)] text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

        </main>
      </div>
    </>
  );
}
