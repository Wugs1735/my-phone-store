"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function OrderDetails({ params }: any) {
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetchOrder();
    fetchItems();
  }, []);

  async function fetchOrder() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    setOrder(data);
  }

  async function fetchItems() {
    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", params.id);

    if (error) {
      console.log(error);
      return;
    }

    setItems(data || []);
  }

  return (
    <main style={styles.main}>

      <h1 style={styles.title}>
        Order Details 📦
      </h1>

      {!order ? (
        <p style={{ color: "#aaa" }}>
          Loading order...
        </p>
      ) : (
        <div style={styles.container}>

          {/* CUSTOMER INFO */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              Customer Info
            </h2>

            <p>👤 {order.customer_name}</p>
            <p>📞 {order.phone}</p>
            <p>📍 {order.address}</p>
            <p>📝 {order.notes}</p>
            <p>💰 Total: {order.total} EGP</p>
          </div>

          {/* ITEMS */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>
              Products
            </h2>

            {items.map((item) => (
              <div
                key={item.id}
                style={styles.item}
              >
                <img
                  src={item.image}
                  style={styles.image}
                />

                <div>
                  <h3>{item.name}</h3>
                  <p>{item.price} EGP</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </main>
  );
}

const styles: any = {
  main: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #1c1c2b, #0a0a0f)",
    color: "white",
    padding: "40px",
    fontFamily: "Arial",
  },

  title: {
    fontSize: "40px",
    marginBottom: "30px",
  },

  container: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#15151f",
    border: "1px solid #2a2a2a",
    borderRadius: "20px",
    padding: "20px",
  },

  sectionTitle: {
    fontSize: "22px",
    marginBottom: "15px",
  },

  item: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    marginBottom: "15px",
  },

  image: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "10px",
  },
};