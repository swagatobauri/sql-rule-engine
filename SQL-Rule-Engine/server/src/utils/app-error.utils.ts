/**
 * Application-level error that carries an HTTP status code.
 *
 * Throw this anywhere in a controller/service and the global error handler
 * will turn it into a proper `ApiError` response automatically.
 */
export class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}
