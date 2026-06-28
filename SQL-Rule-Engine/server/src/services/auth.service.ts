import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {db} from "../db/index.ts";
import { authSessions, users } from "../db/schema/tables.ts";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { createAccessToken, createRefreshToken } from "../utils/jwt.utils.ts";
import { AppError } from "../utils/app-error.utils.ts";

const register = async (email: string, password: string) => {
  const existingUser = (
    await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
  )[0];

  if (existingUser) throw new AppError("User already exists", 409);

  const hashedPassword = await bcrypt.hash(password, 12);

  const [user] = await db
    .insert(users)
    .values({
      email,
      passwordHash: hashedPassword,
    })
    .returning();

  return user;
};

// Creates the user, then issues tokens and a session row — same shape as
// login() so the controller can set the cookie and respond identically.
export const registerAndCreateSession = async (
  email: string,
  password: string
) => {
  const user = await register(email, password);

  if (!user) throw new AppError("Failed to create user", 500);

  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);

  await db.insert(authSessions).values({
    userId: user.id,
    refreshToken,
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const login = async (email: string, password: string) => {
  const user = (
    await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
  )[0];

  if (!user) throw new AppError("Invalid credentials", 401);

  const match = await bcrypt.compare(password, user.passwordHash);

  if (!match) throw new AppError("Invalid credentials", 401);

  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);

  await db.insert(authSessions).values({
    userId: user.id,
    refreshToken,
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

// Stateful refresh with rotation. The incoming refresh token must be both
// (a) validly signed and unexpired, and (b) present in auth_sessions — the DB
// row is what makes logout/revocation possible. On success we rotate: the old
// token is replaced with a freshly issued one, so each refresh token is
// single-use.
export const rotateSession = async (oldRefreshToken: string) => {
  let payload: { userId: string };
  try {
    payload = jwt.verify(
      oldRefreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { userId: string };
  } catch {
    throw new AppError("Unauthorized", 401);
  }

  const session = (
    await db
      .select()
      .from(authSessions)
      .where(eq(authSessions.refreshToken, oldRefreshToken))
      .limit(1)
  )[0];

  // Validly signed but not in the DB → already rotated/revoked/logged out.
  // Treat a reused token as a breach signal and drop every session for the
  // user, forcing a fresh login everywhere.
  if (!session) {
    await db
      .delete(authSessions)
      .where(eq(authSessions.userId, payload.userId));
    throw new AppError("Unauthorized", 401);
  }

  const accessToken = createAccessToken(payload.userId);
  const refreshToken = createRefreshToken(payload.userId);

  await db
    .update(authSessions)
    .set({ refreshToken })
    .where(eq(authSessions.id, session.id));

  return { accessToken, refreshToken };
};

// Invalidates a single refresh token (this device/session only). Idempotent —
// deleting a token that isn't there is a no-op.
export const logoutSession = async (refreshToken: string) => {
  await db
    .delete(authSessions)
    .where(eq(authSessions.refreshToken, refreshToken));
};