import { create } from "zustand";

// Holds the signed-in user and the short-lived access token in memory.
// The refresh token lives in an httpOnly cookie set by the server, so it is
// intentionally NOT stored here — the browser sends it automatically and JS
// can't read it (safer against XSS). On a page reload this store resets and
// we recover the session by calling /auth/refresh (see utils/api.js).
export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,

  // False until the on-load /auth/refresh attempt has finished. Guarded pages
  // should wait for this before deciding the user is logged out, otherwise a
  // reload briefly flashes the signed-out state.
  isAuthReady: false,

  // True once we have a token — handy for guarding protected UI.
  // (Read it as a selector: useAuthStore((s) => !!s.accessToken))

  setUser: (user) => set({ user }),
  setAccessToken: (accessToken) => set({ accessToken }),

  // Convenience for login responses that return both at once.
  setSession: ({ user, accessToken }) => set({ user, accessToken }),

  markAuthReady: () => set({ isAuthReady: true }),

  logout: () => set({ user: null, accessToken: null }),
}));
