import { create } from "zustand";
import { api } from "../lib/api";

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string | null;
  description: string;
  priceInCents: number;
  compareAtPriceInCents?: number | null;
  featured: boolean;
  ratingAvg: number;
  ratingCount: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  inStock: boolean;
  totalInventory: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  brand?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images?: Array<{ id: string; url: string; altText?: string | null; isPrimary: boolean }>; 
};

type ProductQuery = {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
};

type ProductState = {
  items: Product[];
  loading: boolean;
  total: number;
  page: number;
  totalPages: number;
  fetchProducts: (params?: ProductQuery) => Promise<void>;
  fetchProductBySlug: (slug: string) => Promise<Product | null>;
};

export const useProductStore = create<ProductState>((set) => ({
  items: [],
  loading: false,
  total: 0,
  page: 1,
  totalPages: 0,

  fetchProducts: async (params = {}) => {
    set({ loading: true });
    const response = await api.get("/products", { params });
    set({
      items: response.data.items || [],
      total: response.data.total || 0,
      page: response.data.page || 1,
      totalPages: response.data.totalPages || 0,
      loading: false,
    });
  },

  fetchProductBySlug: async (slug: string) => {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },
}));
