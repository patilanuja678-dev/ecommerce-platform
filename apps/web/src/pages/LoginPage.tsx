import { create } from "zustand";
import { api, setAuthToken } from "../lib/api";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  emailVerified?: boolean;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,

  setAuth: (user, accessToken) => {
    setAuthToken(accessToken);
    set({ user, accessToken, isAuthenticated: true, loading: false });
  },

  clearAuth: () => {
    setAuthToken(null);
    set({ user: null, accessToken: null, isAuthenticated: false, loading: false });
  },

  login: async (email, password) => {
    set({ loading: true });
    const response = await api.post("/auth/login", { email, password });
    const { accessToken, user } = response.data;
    get().setAuth(user, accessToken);
  },

  register: async (name, email, password) => {
    set({ loading: true });
    const response = await api.post("/auth/register", { name, email, password });
    const { accessToken, user } = response.data;
    get().setAuth(user, accessToken);
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      get().clearAuth();
    }
  },

  fetchMe: async () => {
    set({ loading: true });
    const response = await api.get("/auth/me");
    const { user } = response.data;
    set({ user, isAuthenticated: true, loading: false });
  },
}));
