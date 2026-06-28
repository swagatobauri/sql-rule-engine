import {
  pgEnum
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["admin", "user", "mentor"]);

export const planTypeEnum = pgEnum("plan_type", ["free", "paid"]);

export const subStatusEnum = pgEnum("sub_status", [
  "active",
  "cancelled",
  "expired",
  "trailing",
]);

export const difficultyLevelEnum = pgEnum("difficulty_level", [
  "easy",
  "medium",
  "hard",
]);

export const sessionModeEnum = pgEnum("session_mode", [
  "practice",
  "interview",
]);

export const sessionStatusEnum = pgEnum("session_status", [
  "active",
  "completed",
  "abandoned",
]);

export const sqStatusEnum = pgEnum("sq_status", [
  "pending",
  "answered",
  "skipped",
  "timed_out",
]);

