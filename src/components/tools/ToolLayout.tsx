"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GlobalErrorBoundary } from '../GlobalErrorBoundary';
import { ChevronRight, Shield, Zap, Info, Lock } from 'lucide-react';
import { getToolByCategoryAndSlug } from '@/registry/tools';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { ToolPageSEOContent, generateToolFAQs } from './ToolPageSEOContent';

interface ToolLayoutProps {
  title: string;
  description: string;
  category: string;
  slug: string;
  children: React.ReactNode;
  faqs?: { question: string; answer: string }[];
}

export function ToolLayout({ title, description, category, slug, children, faqs = [] }: ToolLayoutProps) {
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const { data: sessionData, isPending } = useSession();

  useEffect(() => {
    if (!isPending) {
      setUserPlan((sessionData?.user as any)?.plan || "free");
    }
  }, [sessionData, isPending]);

  const tool = getToolByCategoryAndSlug(category, slug);
  const isPro = tool?.isPro || false;
  // Default to locked if isPro is true, until verified as Pro
  const isLocked = isPro && userPlan !== "pro";
  const displayCategory = category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Use custom FAQs if provided, otherwise auto-generate them
  const finalFaqs = faqs && faqs.length > 0 ? faqs : (tool ? generateToolFAQs(tool) : []);

  const faqSchema = finalFaqs && finalFaqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": finalFaqs.map(faq => ({
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
          <div className="w-full text-left bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-2xl)] shadow-[var(--shadow-md)] overflow-hidden relative">
            <GlobalErrorBoundary>
              <div className={isLocked ? "blur-md pointer-events-none select-none opacity-40 transition-all duration-300" : "transition-all duration-300"}>
                {children}
              </div>
              {isLocked && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
                  {/* Paywall Card */}
                  <div className="w-full max-w-md bg-[var(--bg-overlay)] border-2 border-[var(--accent)] rounded-[var(--radius-2xl)] p-8 text-center shadow-2xl relative overflow-hidden">
                    {/* Ambient background glow */}
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-[var(--accent)]/10 blur-2xl rounded-full pointer-events-none" />
                    
                    <div className="w-14 h-14 bg-[var(--accent)]/15 rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--accent)]/30">
                      <Lock className="w-6 h-6 text-[var(--accent)]" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">Pro Tool</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-6">
                      Unlock <strong>{title}</strong> and the full suite of 48+ premium Canvas, PDF, AI, and developer tools.
                    </p>
                    
                    <div className="space-y-4">
                      <Link href="/pricing" className="block w-full">
                        <Button variant="primary" className="w-full py-6 text-base" size="lg">
                          Upgrade to Pro
                        </Button>
                      </Link>
                      
                      <div className="text-xs text-[var(--text-muted)] pt-2">
                        Already subscribed?{" "}
                        <Link href="/dashboard" className="text-[var(--accent)] hover:underline font-semibold">
                          Log in to unlock
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </GlobalErrorBoundary>
          </div>

          {/* Dynamic How-to Steps & Related Tools */}
          {tool && <ToolPageSEOContent tool={tool} />}

          {/* SEO FAQs */}
          {finalFaqs && finalFaqs.length > 0 && (
            <section className="mt-24 w-full text-left">
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-8 flex items-center gap-3 border-b border-[var(--border-subtle)] pb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {finalFaqs.map((faq, index) => (
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
