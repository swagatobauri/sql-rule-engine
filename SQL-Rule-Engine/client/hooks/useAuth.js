import { useMutation } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { useAuthStore } from "@/store/auth.store";

// Pull a human-readable message out of the server's error envelope
// ({ success:false, message, ... }) so forms can show something useful.
function readError(error, fallback) {
  return error?.response?.data?.message || fallback;
}

// POST /api/auth/login  →  { data: { accessToken, user } }
// On success we stash the user + token in the auth store; the refresh cookie
// is set by the server automatically.
export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await api.post("/auth/login", { email, password });
      return data.data; // unwrap the { success, message, data } envelope
    },
    onSuccess: ({ user, accessToken }) => {
      useAuthStore.getState().setSession({ user, accessToken });
    },
  });
}

// POST /api/auth/register  →  expects the same shape as login.
// NOTE: the server currently exposes only /auth/login and /auth/refresh — add a
// register route there before this will work, otherwise it returns 404.
export function useSignup() {
  return useMutation({
    mutationFn: async ({ name, email, password }) => {
      const { data } = await api.post("/auth/register", { name, email, password });
      return data.data;
    },
    onSuccess: (session) => {
      // If the register endpoint logs the user straight in, persist the session.
      if (session?.accessToken) {
        useAuthStore.getState().setSession(session);
      }
    },
  });
}

// POST /api/auth/logout — clears the server-side session and the refresh
// cookie. We clear the local store in onSettled so the user is signed out even
// if the request fails (e.g. the cookie was already expired).
export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSettled: () => {
      useAuthStore.getState().logout();
    },
  });
}

export { readError };
