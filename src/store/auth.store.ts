import { create } from "zustand";

export interface User {
  id: string;
  userId: string;
  name: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;

  login: (token: string, user: User) => void;
  logout: () => void;
}

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  user: readStoredUser(),

  login(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({
      token,
      user,
    });
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      token: null,
      user: null,
    });
  },
}));
