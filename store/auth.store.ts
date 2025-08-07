import { getCurrentUser } from '@/lib/appwrite';
import { User } from '@/type';
import { create } from 'zustand';

type AuthState = {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setUser: (user: User | null) => void;
    setIsLoading: (isLoading: boolean) => void;
    FetchAuthenticatedUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
isAuthenticated: false,
user: null,
isLoading: true,
setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
setUser: (user) => set({ user }),
setIsLoading: (isLoading) => set({ isLoading }),
FetchAuthenticatedUser: async () => {
    set({ isLoading: true });
    try {
      const user = await getCurrentUser() 
         if(user) set({ isAuthenticated: true, 
            user: user as User })
      else set( { isAuthenticated: false, user: null } );
    } catch (e) {
      console.log('fetchAuthenticatedUser error', e);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}))

export default useAuthStore;