import { Router } from "express";
import { handleLogin, handleLogout, handleRefresh, handleRegister } from "../controllers/auth.controller.ts";
import { asyncHandler } from "../middlewares/async-handler.middleware.ts";

const router = Router();

router.post("/register", asyncHandler(handleRegister));

router.post("/login" ,asyncHandler(handleLogin));

router.post("/refresh", asyncHandler(handleRefresh));

router.post("/logout", asyncHandler(handleLogout));

export default router;
