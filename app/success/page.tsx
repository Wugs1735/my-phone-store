"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SuccessPage() {
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Safely reads order ID from current URL query if provided
    const id = new URLSearchParams(window.location.search).get("id");
    setOrderId(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans antialiased selection:bg-neutral-200 flex flex-col justify-between">
      
      {/* Structural Empty Header for Balance */}
      <header className="h-14 md:h-16" />

      {/* Main Core Success Card Frame */}
      <main className="max-w-[440px] w-full mx-auto px-6 text-center flex flex-col items-center justify-center flex-grow -mt-12 md:-mt-16">
        
        {/* Apple Style Premium Icon Ring */}
        <div className="w-20 h-20 bg-white border border-neutral-200 rounded-full flex items-center justify-center shadow-sm mb-6 animate-fade-in">
          <span className="text-3xl text-[#34c759]">✓</span>
        </div>

        {/* Dynamic Editorial Text Blocks */}
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-3">
          Thank You for Your Bag Order.
        </h1>
        
        <p className="text-neutral-500 text-sm font-normal leading-relaxed mb-6">
          Your reservation request has been processed remotely. We've sent your setup tracking parameters to our warehouse team via WhatsApp message.
        </p>

        {/* Dynamic Contextual Order ID Banner */}
        {orderId && (
          <div className="bg-white border border-neutral-200/80 rounded-xl px-4 py-2.5 text-xs font-mono font-medium text-neutral-600 shadow-sm mb-8 tracking-tight">
            ORDER REFERENCE: #{orderId}
          </div>
        )}

        {/* Single Navigation Call To Action */}
        <Link href="/" className="w-full">
          <button className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-sm py-3.5 rounded-xl shadow-sm shadow-blue-500/10 transition-all active:scale-[0.99]">
            Continue Shopping
          </button>
        </Link>
      </main>

      {/* Premium Minimalistic Subtle Brand Footer */}
      <footer className="py-6 text-center text-[11px] text-neutral-400 tracking-tight font-normal">
        Copyright © {new Date().getFullYear()} Hussen Store. All rights reserved.
      </footer>

    </div>
  );
}