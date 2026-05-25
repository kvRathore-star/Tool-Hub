"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, HelpCircle, BookOpen, Layers, ArrowRight } from "lucide-react";
import { toolsRegistry, ToolMetadata } from "@/registry/tools";

interface ToolPageSEOContentProps {
  tool: ToolMetadata;
}

export function ToolPageSEOContent({ tool }: ToolPageSEOContentProps) {
  // Find related tools in the same category, excluding the current tool, limit to 3
  const relatedTools = toolsRegistry
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 3);

  const displayCategory = tool.category.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  // Custom step guide based on category
  const steps = [
    {
      title: "1. Upload or Input Data",
      desc: `Add your input parameters, upload files, or paste the text content you wish to process directly into the active field of the ${tool.name} interface.`
    },
    {
      title: "2. Automatic Local Execution",
      desc: "Our engine executes the calculations, formatting, or asset rendering instantly on your machine. Zero data is sent to external servers."
    },
    {
      title: "3. Save and Download Results",
      desc: "Instantly copy the calculated output to your clipboard, save the processed file, or export the structured output container to your device."
    }
  ];

  return (
    <div className="w-full mt-16 text-left space-y-16 border-t border-[var(--border-subtle)] pt-16">
      
      {/* 3-Step How To Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] flex items-center gap-2.5 pb-2">
          <BookOpen className="w-5 h-5 text-[var(--accent)]" />
          <span>How to Use the {tool.name}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-[var(--bg-overlay)] border border-[var(--border-subtle)] rounded-xl p-5 space-y-2">
              <h3 className="font-medium text-sm text-[var(--text-primary)]">{step.title}</h3>
              <p className="text-xs leading-relaxed text-[var(--text-secondary)]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Tools Directory */}
      {relatedTools.length > 0 && (
        <section className="space-y-6">
          <div className="flex justify-between items-center pb-2">
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-[var(--accent)]" />
              <span>Related {displayCategory} Tools</span>
            </h2>
            <Link 
              href={`/tools?category=${encodeURIComponent(tool.category)}`}
              className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
            >
              See all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.map((t) => (
              <Link 
                key={t.id} 
                href={`/${t.category.toLowerCase().replace(/\s+/g, "-")}/${t.slug}`}
                className="group p-5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl hover:border-[var(--border-default)] transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-2">
                    {t.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {t.description}
                  </p>
                </div>
                <div className="text-[10px] font-semibold text-[var(--text-muted)] mt-4 flex items-center gap-1">
                  <span>Open Tool</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-[2px] transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

// Helper function to generate custom FAQs for a tool
export function generateToolFAQs(tool: ToolMetadata) {
  return [
    {
      question: `Is the ${tool.name} tool free to use?`,
      answer: `Yes, the ${tool.name} tool on ToolHub is completely free. We do not require credit card registrations or charge any hidden fees for our on-device operations.`
    },
    {
      question: `How does ToolHub guarantee my privacy with the ${tool.name}?`,
      answer: "All processing happens 100% locally inside your web browser. No files, texts, or parameters are uploaded to external cloud servers, preventing data leaks."
    },
    {
      question: `Can I run the ${tool.name} offline?`,
      answer: `Absolutely. Once the page is loaded, the ${tool.name} runs entirely offline. You can safely complete your tasks without active internet bandwidth.`
    },
    {
      question: `What are the limits of the free tier for ${tool.name}?`,
      answer: "Standard tools are completely unlimited. High-value Pro tools allow up to 5 free uses daily, with premium membership removing all limits."
    },
    {
      question: "Are there any file size or data limitations?",
      answer: "Processing limits depend entirely on your client machine's hardware capabilities. Since no server resources are shared, large datasets run locally without arbitrary platform constraints."
    }
  ];
}
