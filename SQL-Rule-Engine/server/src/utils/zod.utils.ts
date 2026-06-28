import { z } from "zod";

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  // Accepted from the signup form but not persisted — the users table has no
  // name column yet. Add one (and store it) if you want to keep it.
  name: z.string().min(2).max(60).optional(),
});
