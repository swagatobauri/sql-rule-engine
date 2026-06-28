import type { Request } from "express";

export function logException(err: unknown, req?: Request): void {
  const timestamp = new Date().toISOString();
  const route = req ? `${req.method} ${req.originalUrl}` : "unknown route";

  if (err instanceof Error) {
    console.error(`[${timestamp}] [${route}] ${err.name}: ${err.message}`);
    if (err.stack) console.error(err.stack);
  } else {
    console.error(`[${timestamp}] [${route}] Non-error thrown:`, err);
  }
}
