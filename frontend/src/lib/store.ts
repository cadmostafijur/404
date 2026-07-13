import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format } from "date-fns";
import type { User } from "./types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      setAuth: (user, accessToken) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", accessToken);
        }
        set({ user, accessToken });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
        }
        set({ user: null, accessToken: null });
      },
      isAuthenticated: () => !!get().accessToken,
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    },
  ),
);

interface DateState {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export const useDateStore = create<DateState>((set) => ({
  selectedDate: format(new Date(), "yyyy-MM-dd"),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
