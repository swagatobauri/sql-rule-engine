import type { Response } from "express";

export interface ApiResponseData {
  success: boolean;
  message: string;
  statusCode: number;
  data?: any;
  error?: string;
  details?: unknown;
  timestamp: string;
}

export function ApiSuccess(
  res: Response,
  message: string,
  statusCode: number = 200,
  data?: any
): void {
  const response: ApiResponseData = {
    success: true,
    message,
    statusCode,
    data,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

export function ApiError(
  res: Response,
  message: string,
  statusCode: number = 500,
  error?: any,
  details?: unknown
): void {
  const response: ApiResponseData = {
    success: false,
    message,
    statusCode,
    error: error?.message || error,
    details,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}
