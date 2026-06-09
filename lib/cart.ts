export type Product = {
    id: number;
    name: string;
    price: number;
  };
  
  const CART_KEY = "cart";
  
  export function getCart(): Product[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  }
  
  export function addToCart(product: Product) {
    const cart = getCart();
    cart.push(product);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    console.log("🛒 Cart updated:", cart);
  }
  
  export function clearCart() {
    localStorage.removeItem(CART_KEY);
  }