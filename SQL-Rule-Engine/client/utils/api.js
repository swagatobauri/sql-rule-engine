import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

// Single axios instance the whole app shares.
// baseURL points at the server's /api prefix (routes are mounted at /api/auth).
// withCredentials lets the browser send/receive the httpOnly refreshToken cookie.
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g. http://localhost:8080/api
  withCredentials: true,
});

// --- Request interceptor -------------------------------------------------
// Attach the current access token to every request automatically, so
// individual calls never have to set the Authorization header themselves.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response interceptor ------------------------------------------------
// When a request fails with 401 (expired/missing access token), try ONCE to
// mint a new access token via /auth/refresh (which reads the refresh cookie),
// then replay the original request with the fresh token.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // Only handle a genuine 401, never retry more than once, and never try to
    // refresh the refresh call itself (that would loop forever).
    const isRefreshCall = original?.url?.includes("/auth/refresh");
    if (status === 401 && original && !original._retry && !isRefreshCall) {
      original._retry = true;

      try {
        const { data } = await api.post("/auth/refresh");
        // Server wraps payloads as { success, message, data: {...} }.
        const newToken = data.data.accessToken;

        useAuthStore.getState().setAccessToken(newToken);
        original.headers.Authorization = `Bearer ${newToken}`;

        return api(original); // replay the original request
      } catch (refreshError) {
        // Refresh token is gone/expired → clear the session.
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
