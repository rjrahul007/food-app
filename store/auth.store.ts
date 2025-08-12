import { createUser, getCurrentUser, signIn, signOut } from "@/lib/appwrite.user";
import { User } from "@/type";
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  fetchAuthenticatedUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user }),
  setLoading: (value) => set({ isLoading: value }),

  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });
    try {
      const user = await getCurrentUser();
      if (user) {
        set({ isAuthenticated: true, user: user as unknown as User });
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } catch (error) {
      console.error("fetchAuthenticatedUser error", error);
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    await signIn({ email, password });
    await useAuthStore.getState().fetchAuthenticatedUser();
  },

  register: async (email, password, name) => {
    await createUser({ email, password, name });
    await useAuthStore.getState().fetchAuthenticatedUser();
  },

  logout: async () => {
    await signOut();
    set({ isAuthenticated: false, user: null });
  }
}));

export default useAuthStore;
