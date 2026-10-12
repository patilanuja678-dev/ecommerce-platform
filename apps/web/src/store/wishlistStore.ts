import { create } from "zustand";
import { api } from "../lib/api";

export type WishlistItem = {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    priceInCents: number;
    images?: Array<{ url: string }>;
  };
};

type WishlistState = {
  items: WishlistItem[];
  loading: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (productId: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  loading: false,

  fetchWishlist: async () => {
    set({ loading: true });
    const response = await api.get("/wishlist");
    set({ items: response.data.items || [], loading: false });
  },

  addItem: async (productId: string) => {
    await api.post("/wishlist/items", { productId });
    await get().fetchWishlist();
  },

  removeItem: async (itemId: string) => {
    await api.delete(`/wishlist/items/${itemId}`);
    await get().fetchWishlist();
  },
}));
