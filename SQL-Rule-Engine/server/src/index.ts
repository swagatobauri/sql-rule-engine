import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiSuccess, ApiError } from "./utils/api-response.utils.ts";
import authRoutes from "./routes/auth.route.ts";
import { errorHandler } from "./middlewares/error.middleware.ts";
import { authMiddleware } from "./middlewares/auth.middleware.ts";

export function createApp() {
  const app = express();

  app.use(
    cors({
      // Allow requests from both the default Next.js port and the fallback port.
      origin: ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      optionsSuccessStatus: 200,
    }),
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.get("/", (_req: Request, res: Response) => {
    ApiSuccess(res, "Welcome to SQL Rule Engine API", 200, { version: "1.0.0" });
  });

  app.get("/health", (_req: Request, res: Response) => {
    ApiSuccess(res, "API is running fine", 200, { timestamp: new Date().toISOString() });
  });

  app.get("/service-up-duration", (_req: Request, res: Response) => {
    ApiSuccess(res, "Service uptime", 200, { uptime: process.uptime() });
  });

  // Mount auth routes before the auth middleware to allow login and refresh without a token.
  app.use("/api/auth", authRoutes);

  // Mount auth middleware after the auth routes to check for a token.
  app.use(authMiddleware);

  // 404 for any unmatched route.
  app.use((_req: Request, res: Response) => {
    ApiError(res, "Route not found", 404);
  });

  // Global error handler — must be registered LAST, after all routes.
  app.use(errorHandler);

  return app;
}

const app = createApp();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Auth server running on http://localhost:${PORT}`);
});