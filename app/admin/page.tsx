"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({ name: "", price: "", imageFile: null as File | null });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [{ data: productsData }, { data: ordersData }] = await Promise.all([
        supabase.from("products").select("*"),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
      ]);

      setProducts(productsData || []);
      setOrders(ordersData || []);
    } catch (error) {
      console.error("Dashboard engine synchronization error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, imageFile: e.target.files[0] });
    }
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    const { name, price, imageFile } = form;
    if (!name || !price || !imageFile) {
      alert("Please complete all fields and attach an image.");
      return;
    }

    setSubmitting(true);

    try {
      const fileName = `${Date.now()}-${imageFile.name}`;

      // Upload file directly to your Supabase storage bucket
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // Construct your static public URL asset string
      const image = `https://zoekgfqooakfylyzfwvy.supabase.co/storage/v1/object/public/products/${fileName}`;

      // Insert full item metadata to your 'products' table
      const { error: insertError } = await supabase
        .from("products")
        .insert([{ name, price: Number(price), image }]);

      if (insertError) throw insertError;

      // Reset Form Matrix cleanly on success
      setForm({ name: "", price: "", imageFile: null });
      loadData();
    } catch (error: any) {
      alert(error.message || "Failed to catalog product structural element.");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Are you sure you want to remove this product item permanently?")) return;
    try {
      await supabase.from("products").delete().eq("id", id);
      loadData();
    } catch (error) {
      console.error("Failed to delete record:", error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="animate-pulse text-sm font-medium text-neutral-400 tracking-tight">
          Synchronizing analytics databases...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans antialiased selection:bg-neutral-200">
      
      {/* Top Glassmorphism Dashboard Control Strip */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-neutral-200/80">
        <div className="max-w-[1040px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0071e3] animate-ping" />
            <h1 className="text-sm font-semibold tracking-tight">Console Control Desk</h1>
          </div>

          {/* Premium iOS Segmented Switcher Control */}
          <div className="bg-neutral-200/60 p-0.5 rounded-full flex relative">
            <button
              onClick={() => setActiveTab("products")}
              className={`text-xs font-medium px-4 py-1.5 rounded-full transition-all duration-200 ${
                activeTab === "products" ? "bg-white text-black shadow-sm" : "text-neutral-500 hover:text-black"
              }`}
            >
              Inventory
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`text-xs font-medium px-4 py-1.5 rounded-full transition-all duration-200 ${
                activeTab === "orders" ? "bg-white text-black shadow-sm" : "text-neutral-500 hover:text-black"
              }`}
            >
              Orders ({orders.length})
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1040px] mx-auto px-4 py-10">
        <AnimatePresence mode="wait">
          {activeTab === "products" ? (
            
            /* TAB: PRODUCTS CATALOG MANAGEMENT PANEL */
            <motion.div
              key="products-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Product Creation Card */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm">
                <h2 className="text-lg font-medium tracking-tight mb-4">Catalog New Asset</h2>
                
                <form onSubmit={addProduct} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Cyberpunk Sunset Projector"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-transparent focus:border-neutral-400 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Price (EGP)</label>
                    <input
                      type="number"
                      required
                      placeholder="450"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full bg-[#f5f5f7] border border-transparent focus:border-neutral-400 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Media Asset</label>
                    <div className="relative group border border-dashed border-neutral-200 hover:border-neutral-400 rounded-xl bg-[#f5f5f7] transition-colors p-4 text-center cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="text-xs text-neutral-500 font-medium">
                        {form.imageFile ? (
                          <span className="text-[#0071e3] font-semibold block truncate">✓ {form.imageFile.name}</span>
                        ) : (
                          "Select or Drop Product Image"
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#0071e3] hover:bg-[#0077ed] disabled:bg-neutral-300 text-white font-medium text-xs py-3 rounded-xl shadow-sm transition-all active:scale-[0.99] mt-2"
                  >
                    {submitting ? "Uploading Infrastructure..." : "Publish to Storefront"}
                  </button>
                </form>
              </div>

              {/* Real-Time Live Catalog Render Grid */}
              <div className="lg:col-span-7 space-y-3">
                <h2 className="text-lg font-medium tracking-tight mb-4">Live Storefront Inventory ({products.length})</h2>
                
                {products.length === 0 ? (
                  <p className="text-xs text-neutral-400 text-center py-12 bg-white border border-neutral-200 rounded-2xl">No items posted in database yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {products.map((p) => (
                      <div key={p.id} className="bg-white border border-neutral-200/60 p-3 rounded-xl flex items-center justify-between shadow-sm gap-2">
                        <div className="flex items-center space-x-3 truncate">
                          <img src={p.image} className="w-10 h-10 object-cover rounded-lg bg-neutral-100 flex-shrink-0" alt="" />
                          <div className="truncate">
                            <h3 className="text-xs font-medium text-neutral-800 truncate">{p.name}</h3>
                            <p className="text-[11px] text-neutral-400 font-normal mt-0.5">{p.price} EGP</p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="text-[10px] font-semibold text-red-400 hover:text-red-600 px-2.5 py-1.5 rounded-lg bg-red-50/50 hover:bg-red-100/50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            
            /* TAB: ORDERS ARCHIVE & FULFILLMENT AUDIT FEED */
            <motion.div
              key="orders-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 max-w-[760px] mx-auto"
            >
              <h2 className="text-lg font-medium tracking-tight mb-6">Customer Purchase Orders</h2>

              {orders.length === 0 ? (
                <div className="bg-white border border-neutral-200 rounded-2xl p-16 text-center shadow-sm">
                  <p className="text-sm text-neutral-400">No client transactions logged inside your records.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-sm space-y-4">
                    {/* Upper Core Panel Metadata Block */}
                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-neutral-100 pb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-800 tracking-tight">{order.customer_name}</h3>
                        <p className="text-xs text-neutral-400 font-normal mt-0.5">Reference ID: #{order.id}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-neutral-900">{order.total} EGP</span>
                        <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                        </p>
                      </div>
                    </div>

                    {/* Operational Details Flex Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-neutral-500">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Phone Link</span>
                        <a href={`tel:${order.phone}`} className="text-[#0071e3] font-medium hover:underline">{order.phone}</a>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Destination Address</span>
                        <span className="text-neutral-700 font-normal">{order.address}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}