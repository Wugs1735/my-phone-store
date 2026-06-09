"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingCart, setFetchingCart] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      const { data } = await supabase.from("cart").select("*");
      setCartItems(data || []);
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setFetchingCart(false);
    }
  }

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );

  function buildWhatsAppMessage(orderId: string) {
    let itemSummary = "";
    cartItems.forEach((item) => {
      itemSummary += `• ${item.name} — ${item.price} EGP\n`;
    });

    const whatsappText =
      `🛍️ *NEW ORDER #${orderId}*\n\n` +
      `👤 *Customer Info:*\n` +
      `- *Name:* ${name}\n` +
      `- *Phone:* ${phone}\n` +
      `- *Address:* ${address}\n` +
      `${notes ? `- *Notes:* ${notes}\n` : ""}` +
      `\n📦 *Items Ordered:*\n` +
      `${itemSummary}` +
      `💰 *Total Price:* ${total} EGP\n\n` +
      `⚡ Please confirm order & payment.`;

    return encodeURIComponent(whatsappText);
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !phone || !address) {
      alert("Please fill all required fields");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your bag is empty");
      return;
    }

    setLoading(true);

    try {
      // 1. CREATE ORDER
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            customer_name: name,
            phone,
            address,
            total,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. CREATE ORDER ITEMS
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        name: item.name,
        image: item.image || "",
        price: item.price,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      // 3. CLEAR CART REMOTELY
      const { error: clearError } = await supabase.from("cart").delete().neq("id", "");
      if (clearError) console.error("Could not clear cart table safely:", clearError);

      // 4. GENERATE WHATSAPP REDIRECT URL
      const whatsappNumber = "201080026008"; // 01080026008 with Egypt code
      const message = buildWhatsAppMessage(order.id);
      const url = `https://wa.me/${whatsappNumber}?text=${message}`;

      // 5. OPEN WHATSAPP & REDIRECT TO SUCCESS
      window.open(url, "_blank");
      router.push("/success");
    } catch (error: any) {
      alert(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  if (fetchingCart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="animate-pulse text-sm font-medium text-neutral-400 tracking-tight">
          Loading bag configurations...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans antialiased selection:bg-neutral-200">
      <div className="max-w-[1040px] mx-auto px-4 py-12 md:py-20">
        {/* Apple Style Editorial Header */}
        <header className="mb-12 border-b border-neutral-200 pb-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Review your Bag.</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Free delivery. After placing your order, you’ll be redirected to WhatsApp with your full order details for quick payment confirmation (like Instapay/wallets).
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Premium Input Card */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-neutral-200/80 shadow-sm">
            <h2 className="text-xl font-medium tracking-tight mb-6">Shipping Details</h2>

            <form onSubmit={placeOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#f5f5f7] border border-transparent focus:border-neutral-400 focus:bg-white rounded-xl px-4 py-3 text-sm transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="01xxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#f5f5f7] border border-transparent focus:border-neutral-400 focus:bg-white rounded-xl px-4 py-3 text-sm transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                  Delivery Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="Apartment, Street Name, District, City"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#f5f5f7] border border-transparent focus:border-neutral-400 focus:bg-white rounded-xl px-4 py-3 text-sm transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                  Order Notes <span className="text-neutral-300 font-normal">(Optional)</span>
                </label>
                <textarea
                  placeholder="Add details about gate codes, landmarks, or delivery window instructions"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-[#f5f5f7] border border-transparent focus:border-neutral-400 focus:bg-white rounded-xl px-4 py-3 text-sm transition-all outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#0071e3] hover:bg-[#0077ed] disabled:bg-neutral-300 text-white font-medium text-sm py-3.5 rounded-xl transition-all active:scale-[0.99] shadow-sample shadow-blue-500/10"
              >
                {loading ? "Processing Securely..." : "Place Order via WhatsApp"}
              </button>

              <small className="block text-center text-neutral-400 mt-2">
                This will open WhatsApp with your order pre-filled.
              </small>
            </form>
          </div>

          {/* Right Side: Order Summary Card */}
          <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-medium tracking-tight border-b border-neutral-100 pb-4 mb-4">
                Summary
              </h2>

              {cartItems.length === 0 ? (
                <p className="text-sm text-neutral-400 py-6 text-center">Your bag is empty.</p>
              ) : (
                <div className="divide-y divide-neutral-100 max-h-[260px] overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center space-x-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg bg-neutral-50 border border-neutral-100"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-[#f5f5f7] rounded-lg flex items-center justify-center text-xs">
                            📦
                          </div>
                        )}
                        <span className="text-sm font-medium text-neutral-800 line-clamp-1 max-w-[180px]">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-neutral-600 whitespace-nowrap">
                        {item.price} EGP
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Calculations Wrapper */}
            <div className="border-t border-neutral-200 pt-4 mt-6 space-y-2">
              <div className="flex justify-between text-xs text-neutral-400 tracking-wide uppercase">
                <span>Shipping</span>
                <span className="text-[#34c759] font-semibold">FREE</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-neutral-100">
                <span className="text-base font-medium">Total Price</span>
                <span className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
                  {total} EGP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}