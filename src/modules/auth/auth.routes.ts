import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { login } from "./auth.controller.js";

const router = Router();

router.post("/login", authMiddleware, login);
// router.get("/register", authMiddleware, register);

export default router;
