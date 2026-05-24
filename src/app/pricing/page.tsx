"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const [isIndia, setIsIndia] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const countryCookie = cookies.find(c => c.trim().startsWith('user-country='));
    const country = countryCookie ? countryCookie.split('=')[1] : null;
    
    const isIndiaTZ = Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Kolkata';
    setIsIndia(country === 'IN' || isIndiaTZ);
  }, []);

  // Dynamic pricing based on geography
  const currencySymbol = isIndia ? "₹" : "$";
  const proPrice = isIndia ? "399" : "9";
  const proPriceYearly = isIndia ? "3990" : "90";

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      
      {/* Abstract Grid Background */}
      <div className="absolute inset-0 z-0 flex justify-center pointer-events-none opacity-[0.03]">
        <div className="w-full max-w-[1280px] h-full" style={{ backgroundImage: "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto pt-32 pb-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        <div className="text-center mb-16">
          <h1 className="font-[family-name:var(--font-serif)] text-5xl sm:text-7xl mb-6">
            Simple, transparent pricing.
          </h1>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Get unlimited access to the entire ToolHub ecosystem. No hidden fees. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
          
          {/* Free Tier */}
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-2xl)] p-8 sm:p-12">
            <h3 className="text-2xl font-medium mb-2">Free</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-mono font-semibold">{currencySymbol}0</span>
              <span className="text-[var(--text-muted)]">/month</span>
            </div>
            <p className="text-[var(--text-secondary)] mb-8">Perfect for occasional tasks.</p>
            
            <Button variant="secondary" className="w-full mb-8" size="lg">Get Started</Button>
            
            <ul className="space-y-4 text-sm text-[var(--text-secondary)]">
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[var(--success)]" /> 200+ Offline Tools</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[var(--success)]" /> 100 Local AI Operations / mo</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[var(--success)]" /> 5 Cloud AI Operations / mo</li>
              <li className="flex items-center gap-3 text-[var(--text-muted)]"><div className="w-4 h-px bg-[var(--border-subtle)]" /> No priority support</li>
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="bg-[var(--bg-overlay)] border-2 border-[var(--accent)] rounded-[var(--radius-2xl)] p-8 sm:p-12 relative shadow-[var(--shadow-glow-accent)] transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--accent)] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
              <Zap className="w-3.5 h-3.5" /> Most Popular
            </div>

            <h3 className="text-2xl font-medium mb-2 text-white">Pro</h3>
            <div className="flex items-baseline gap-2 mb-6 text-white">
              <span className="text-5xl font-mono font-semibold">{currencySymbol}{proPrice}</span>
              <span className="text-[var(--text-muted)]">/month</span>
            </div>
            <p className="text-[var(--text-secondary)] mb-8">For power users who need cloud sync and priority compute.</p>
            
            <form action="/api/payments/create-order" method="POST">
              <input type="hidden" name="plan" value="pro" />
              <input type="hidden" name="gateway" value={isIndia ? "razorpay" : "dodo"} />
              <Button variant="primary" className="w-full mb-8" size="lg" type="submit">
                Upgrade to Pro
              </Button>
            </form>
            
            <ul className="space-y-4 text-sm text-[var(--text-secondary)]">
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[var(--accent)]" /> Everything in Free</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[var(--accent)]" /> Unlimited Local AI Operations</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[var(--accent)]" /> 1,000 Cloud AI Operations / mo</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[var(--accent)]" /> Multi-device Cloud Sync</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[var(--accent)]" /> Priority Support</li>
            </ul>
          </div>

        </div>

        {/* Money Back Guarantee */}
        <div className="mt-20 flex items-center gap-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] px-6 py-4 rounded-full shadow-sm">
          <ShieldCheck className="w-6 h-6 text-[var(--success)]" />
          <p className="text-sm font-medium text-[var(--text-primary)]">30-day no-questions-asked money-back guarantee.</p>
        </div>

        {/* Trust Signals */}
        <div className="mt-24 text-center border-t border-[var(--border-subtle)] pt-12 w-full max-w-4xl">
          <p className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-8">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Minimalist text placeholders for logos */}
            <span className="font-serif font-bold text-xl">Acme Corp</span>
            <span className="font-mono font-bold text-xl">GLOBAL_SYS</span>
            <span className="font-sans font-black text-xl italic">Vanguard</span>
            <span className="font-serif font-medium text-xl">OASIS</span>
          </div>
        </div>

      </div>
    </div>
  );
}
