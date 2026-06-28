import "@dotenvx/dotenvx/config";
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { apiRouter } from "./routes/api.js";
import { ApiSuccess, ApiError } from "./utils/api-response.utils.js";

export function createApp() {
  const app = express();

  // Middleware Setup
  app.use(helmet());
  app.use(morgan("dev"));

  // CORS Configuration
  app.use(
    cors({
      origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      optionsSuccessStatus: 200,
    }),
  );

  // Body Parsers
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use("/api", apiRouter);

  // Health Check Endpoints
  app.get("/", (_req: Request, res: Response): void => {
    ApiSuccess(res, "Welcome to SQL Rule Engine API", 200, { version: "1.0.0" });
  });

  app.get("/health", (_req: Request, res: Response): void => {
    ApiSuccess(res, "API is running fine", 200, { timestamp: new Date().toISOString() });
  });

  // 404 Handler
  app.use((_req: Request, res: Response): void => {
    ApiError(res, "Route not found", 404);
  });

  return app;
}

// Start server
const app = createApp();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
