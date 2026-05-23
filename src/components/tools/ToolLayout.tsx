import React from 'react';
import { GlobalErrorBoundary } from '../GlobalErrorBoundary';
import { TurnstileLock } from '../TurnstileGate';

interface ToolLayoutProps {
  title: string;
  description: string;
  category: string;
  children: React.ReactNode;
  faqs?: { question: string; answer: string }[];
}

export function ToolLayout({ title, description, category, children, faqs = [] }: ToolLayoutProps) {
  const displayCategory = category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Schema generation for FAQ
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
      <div className="min-h-screen bg-black text-zinc-100 selection:bg-blue-500/30 font-sans antialiased overflow-x-hidden relative">
        {/* Background glow effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />

        <main className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Glassmorphic SEO Breadcrumbs */}
          <nav className="inline-flex items-center space-x-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs font-medium text-zinc-400 mb-12 shadow-2xl" aria-label="Breadcrumb">
            <a href="/" className="hover:text-blue-400 transition-colors">ToolHub</a>
            <span className="text-zinc-600">/</span>
            <a href={`/${category}`} className="hover:text-blue-400 transition-colors">{displayCategory}</a>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-100">{title}</span>
          </nav>

          {/* Premium Header */}
          <header className="mb-12 max-w-4xl">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 mb-6 drop-shadow-sm">
              {title}
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed">
              {description}
            </p>
          </header>

          {/* Secure Trust Panel */}
          <div className="mb-8 p-1 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-transparent border border-white/5 backdrop-blur-sm max-w-fit">
            <div className="px-4 py-2 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
              <span className="text-sm font-medium text-zinc-300 tracking-wide">
                100% Client-Side Processing <span className="text-zinc-600 mx-2">|</span> Zero Data Retention <span className="text-zinc-600 mx-2">|</span> Turnstile Secured
              </span>
            </div>
          </div>

          {/* Ultralux Tool Interface Wrapper */}
          <section className="bg-zinc-900/40 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl p-6 sm:p-12 mb-16 relative overflow-hidden group">
            {/* Subtle inner glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative z-10">
              <GlobalErrorBoundary>
                <TurnstileLock 
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} 
                >
                  {children}
                </TurnstileLock>
              </GlobalErrorBoundary>
            </div>
          </section>

          {/* Schema-Ready FAQ System */}
          {faqs && faqs.length > 0 && (
            <section className="mt-20 max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100 mb-8 flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Technical FAQs
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="group bg-zinc-900/30 hover:bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-white/5 transition-all duration-300 [&_summary::-webkit-details-marker]:hidden overflow-hidden">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 text-zinc-200 font-medium">
                      <h3 className="text-lg">{faq.question}</h3>
                      <span className="relative flex-shrink-0 w-6 h-6">
                        <svg className="absolute inset-0 w-6 h-6 opacity-100 group-open:opacity-0 transition-opacity text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <svg className="absolute inset-0 w-6 h-6 opacity-0 group-open:opacity-100 transition-opacity text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
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
