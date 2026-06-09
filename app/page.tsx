"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    try {
      // Fetch both products and current cart count concurrently
      const [productsResponse, cartResponse] = await Promise.all([
        supabase.from("products").select("*"),
        supabase.from("cart").select("*", { count: "exact", head: false })
      ]);

      if (productsResponse.data) setProducts(productsResponse.data);
      if (cartResponse.data) setCartCount(cartResponse.data.length);
    } catch (error) {
      console.error("Error connecting to Supabase data streams:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(product: any) {
    try {
      const { error } = await supabase.from("cart").insert([
        {
          name: product.name,
          image: product.image,
          price: product.price,
        },
      ]);

      if (error) throw error;
      
      // Update cart count UI locally on successful insert
      setCartCount((prev) => prev + 1);
    } catch (error) {
      console.error("Cart insertion matrix failed:", error);
      alert("Failed to add item to your bag.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="animate-pulse text-sm font-medium text-neutral-400 tracking-tight">
          Loading Randoms Store...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans antialiased selection:bg-neutral-200">
      
      {/* Premium Sticky Glassmorphism Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-neutral-200/80 transition-all">
        <div className="max-w-[1040px] mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <Link href="/" className="text-base font-semibold tracking-tight hover:opacity-80 transition-opacity">
            Randoms STORE <span className="text-xs text-[#0071e3] ml-0.5">⚡</span>
          </Link>

          <Link href="/cart" className="relative group">
            <button className="bg-[#1d1d1f] hover:bg-[#333336] text-white text-xs font-medium px-4 py-2 rounded-full flex items-center space-x-1.5 shadow-sm transition-all active:scale-[0.97]">
              <span>Bag</span>
              <span className="bg-white/20 text-white rounded-full px-1.5 py-0.25 text-[10px] font-bold min-w-[18px] text-center">
                {cartCount}
              </span>
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Editorial Block */}
      <header className="max-w-[1040px] mx-auto px-4 pt-12 pb-8 md:pt-20 md:pb-12 text-center md:text-left">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#0071e3] block mb-2">
          New Arrivals
        </span>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-xl leading-tight">
          Upgrade your space.
        </h2>
        <p className="text-neutral-500 text-sm md:text-base mt-2 max-w-md font-normal">
          Minimalist, aesthetic room essentials engineered for local Gen Z vibes.
        </p>
      </header>

      {/* Responsive Store Grid Layout */}
      <main className="max-w-[1040px] mx-auto px-4 pb-20">
        {products.length === 0 ? (
          <div className="text-center bg-white border border-neutral-200 rounded-2xl py-16 px-4 shadow-sm">
            <p className="text-sm text-neutral-400">No storefront essentials found inside your database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white border border-neutral-200/60 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-all duration-300"
              >
                
                {/* Premium Image Container */}
                <div className="w-full aspect-square bg-[#f5f5f7] relative overflow-hidden border-b border-neutral-100">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      📦
                    </div>
                  )}
                </div>

                {/* Card Context Data */}
                <div className="p-4 flex flex-col flex-grow justify-between">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-neutral-800 tracking-tight line-clamp-1 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-neutral-500 font-normal">
                      {product.price} EGP
                    </p>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#0071e3] text-xs font-semibold py-2.5 rounded-xl transition-all active:scale-[0.98] tracking-tight"
                  >
                    Add to Bag
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}