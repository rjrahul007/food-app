import { createUser, getCurrentUser, restoreSession, signIn, signOut } from "@/lib/appwrite.user";
import { User } from "@/type";
import { create } from "zustand";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  init: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

   init: async () => {
    const restored = await restoreSession();
    if (restored) {
      const userDoc = await getCurrentUser();
      set({ user: userDoc as unknown as User, isAuthenticated: true, isLoading: false });
    } else {
      set({ isAuthenticated: false, isLoading: false });
    }
  },

    login: async (email, password) => {
    const session = await signIn({ email, password });
    if (session) {
      const userDoc = await getCurrentUser();
      set({ user: userDoc as unknown as User, isAuthenticated: true, isLoading: false });
    }
  },

  logout: async () => {
    await signOut();
    set({ user: null, isAuthenticated: false });
  },

  register: async (email, password, name) => {
    const userDoc = await createUser({ email, password, name });
    set({ user: userDoc as unknown as User, isAuthenticated: true, isLoading: false  });
  },
}));

export default useAuthStore;
