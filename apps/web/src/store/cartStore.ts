import { create } from "zustand";
import { api } from "../lib/api";

export type CartItem = {
  id: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  priceSnapshotInCents: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images?: Array<{ url: string }>;
  };
};

type CartState = {
  items: CartItem[];
  subtotalInCents: number;
  totalInCents: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (payload: { productId: string; quantity: number; variantId?: string }) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotalInCents: 0,
  totalInCents: 0,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    const response = await api.get("/cart");
    set({
      items: response.data.items || [],
      subtotalInCents: response.data.subtotalInCents || 0,
      totalInCents: response.data.totalInCents || 0,
      loading: false,
    });
  },

  addItem: async (payload) => {
    await api.post("/cart/items", payload);
    await get().fetchCart();
  },

  updateItem: async (itemId, quantity) => {
    await api.patch(`/cart/items/${itemId}`, { quantity });
    await get().fetchCart();
  },

  removeItem: async (itemId) => {
    await api.delete(`/cart/items/${itemId}`);
    await get().fetchCart();
  },

  clearCart: async () => {
    await api.delete("/cart");
    await get().fetchCart();
  },
}));
