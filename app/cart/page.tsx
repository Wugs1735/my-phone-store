"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const { data } = await supabase.from("cart").select("*");
      setCartItems(data || []);
    } catch (error) {
      console.error("Error fetching cart matrix:", error);
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(id: string) {
    try {
      // Optimistically update UI local state instantly for lightning-fast responsiveness
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      
      // Delete from Supabase silently in background
      await supabase.from("cart").delete().eq("id", id);
    } catch (error) {
      console.error("Failed to delete row item remotely:", error);
      fetchCart(); // Roll back to actual state if remote error occurs
    }
  }

  const total = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="animate-pulse text-sm font-medium text-neutral-400 tracking-tight">
          Reviewing bag elements...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans antialiased selection:bg-neutral-200">
      
      {/* Apple-Style Glassmorphism Navbar */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-neutral-200/80">
        <div className="max-w-[1040px] mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <h1 className="text-base font-semibold tracking-tight">Review your Bag</h1>
          
          <Link href="/">
            <button className="bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 text-xs font-medium px-4 py-2 rounded-full transition-all active:scale-[0.97]">
              Continue Shopping
            </button>
          </Link>
        </div>
      </nav>

      {/* Main Wrapper Box */}
      <div className="max-w-[1040px] mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Dynamic Items Stream */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {cartItems.length === 0 ? (
              <div className="bg-white border border-neutral-200/60 rounded-2xl p-12 text-center shadow-sm">
                <h2 className="text-xl font-medium tracking-tight text-neutral-800">Your Bag is empty.</h2>
                <p className="text-neutral-400 text-xs mt-2 max-w-xs mx-auto">
                  Explore our minimal collection items to discover modern setup additions.
                </p>
                <Link href="/" className="inline-block mt-6">
                  <button className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-[0.98]">
                    Explore Essentials
                  </button>
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.01, y: -1 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="flex items-center justify-between bg-white border border-neutral-200/60 p-4 rounded-2xl shadow-sm gap-4"
                >
                  <div className="flex items-center space-x-4">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl bg-neutral-50 border border-neutral-100" 
                      />
                    ) : (
                      <div className="w-16 h-16 bg-[#f5f5f7] rounded-xl flex items-center justify-center text-xl">
                        📦
                      </div>
                    )}
                    
                    <div>
                      <h2 className="text-sm font-medium text-neutral-800 line-clamp-1 max-w-[180px] md:max-w-[280px]">
                        {item.name}
                      </h2>
                      <p className="text-xs text-neutral-500 font-normal mt-0.5">
                        {item.price} EGP
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs font-medium text-neutral-400 hover:text-red-500 bg-neutral-50 hover:bg-red-50/50 border border-neutral-200/40 rounded-xl px-3 py-2 transition-colors duration-200 active:scale-[0.97]"
                  >
                    Remove
                  </button>
                </motion.div>
              ))
            )}
          </div>

          {/* Right Side: Order Calculation Summary Dashboard */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-5 bg-white border border-neutral-200/60 p-6 md:p-8 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-medium tracking-tight border-b border-neutral-100 pb-4 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-neutral-500">
                    <span>Total Items</span>
                    <span className="text-neutral-800 font-medium">{cartItems.length}</span>
                  </div>
                  <div className="flex justify-between text-sm text-neutral-500">
                    <span>Estimated Shipping</span>
                    <span className="text-[#34c759] font-medium tracking-wide uppercase text-xs">Free</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-4 mt-6">
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-base font-medium">Total Price</span>
                  <span className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
                    {total} EGP
                  </span>
                </div>

                <Link href="/checkout" className="w-full block">
                  <button className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-sm py-3.5 rounded-xl transition-all active:scale-[0.99] shadow-sm shadow-blue-500/10 text-center">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}