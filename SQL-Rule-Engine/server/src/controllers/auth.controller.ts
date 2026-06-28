import {
  login,
  registerAndCreateSession,
  rotateSession,
  logoutSession,
} from "../services/auth.service.ts";
import type { Request, Response } from "express";
import { loginBodySchema, registerBodySchema } from "../utils/zod.utils.ts";
import { ApiSuccess } from "../utils/api-response.utils.ts";
import { AppError } from "../utils/app-error.utils.ts";

// Shared cookie options so login/register/refresh/logout stay in sync.
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export const handleLogin = async (req: Request, res: Response) => {
  // Throws ZodError on invalid input -> handled by the global error middleware.
  const { email, password } = loginBodySchema.parse(req.body);

  // Returns an object containing accessToken, refreshToken, and user
  const result = await login(email, password);

  res.cookie("refreshToken", result.refreshToken, {
    ...REFRESH_COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  ApiSuccess(res, "Login successful", 200, {
    accessToken: result.accessToken,
    user: {
      id: result.user.id,
      email: result.user.email,
    },
  });
};

export const handleRegister = async (req: Request, res: Response) => {
  // Throws ZodError on invalid input -> handled by the global error middleware.
  // `name` is accepted by the schema but not yet persisted (no column).
  const { email, password } = registerBodySchema.parse(req.body);

  // Creates the user, then returns accessToken, refreshToken, and user.
  const result = await registerAndCreateSession(email, password);

  res.cookie("refreshToken", result.refreshToken, {
    ...REFRESH_COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  ApiSuccess(res, "Registration successful", 201, {
    accessToken: result.accessToken,
    user: {
      id: result.user.id,
      email: result.user.email,
    },
  });
};

export const handleRefresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new AppError("Unauthorized", 401);
  }

  // Verifies the token AND checks it's still an active session, then rotates it.
  const result = await rotateSession(refreshToken);

  // Replace the cookie with the newly rotated refresh token.
  res.cookie("refreshToken", result.refreshToken, {
    ...REFRESH_COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  ApiSuccess(res, "Token refreshed", 200, { accessToken: result.accessToken });
};

export const handleLogout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  // Drop the server-side session so the refresh token can never be used again.
  if (refreshToken) {
    await logoutSession(refreshToken);
  }

  // Clear the cookie on the client (options must match how it was set).
  res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);

  ApiSuccess(res, "Logged out", 200);
};
