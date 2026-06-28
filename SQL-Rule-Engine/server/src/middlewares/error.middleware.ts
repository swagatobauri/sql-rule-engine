import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/api-response.utils.ts";
import { AppError } from "../utils/app-error.utils.ts";
import { logException } from "../utils/exception-logger.utils.ts";

/**
 * Global error-handling middleware. Mounted LAST in the app so any error
 * thrown (or passed to `next`) from a route/middleware lands here and is
 * converted into a consistent `ApiError` response.
 *
 * Note: Express identifies error handlers by their 4-arg signature, so
 * `next` must stay in the signature even though it is unused.
 */
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logException(err, req);

  // Default: unexpected error -> never leak internals to the client.
  let status = 500;
  let message = "Internal server error";
  let details: unknown;

  if (err instanceof ZodError) {
    // Validation error -> 400 with the field issues attached.
    status = 400;
    message = "Validation failed";
    details = err.issues;
  } else if (err instanceof AppError) {
    // Known, intentional application error -> use its status + message.
    status = err.statusCode;
    message = err.message;
    details = err.details;
  }

  ApiError(res, message, status, message, details);
};
