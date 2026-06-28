"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { useAuthStore } from "@/store/auth.store";

// Runs once when the app mounts. The access token only lives in memory, so a
// hard reload loses it — but the httpOnly refresh cookie survives. We exchange
// that cookie for a fresh access token via /auth/refresh and restore the
// session silently. If there's no valid cookie, we simply stay logged out.
//
// Note: /auth/refresh returns only an accessToken (not the user), so `user`
// stays null after a reload. Add a /auth/me endpoint and fetch it here if you
// need the full user object restored too.
export default function AuthBootstrap() {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const markAuthReady = useAuthStore((s) => s.markAuthReady);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const { data } = await api.post("/auth/refresh");
        if (active) setAccessToken(data.data.accessToken);
      } catch {
        // No / expired refresh cookie → remain signed out.
      } finally {
        if (active) markAuthReady();
      }
    })();

    return () => {
      active = false;
    };
  }, [setAccessToken, markAuthReady]);

  return null;
}
