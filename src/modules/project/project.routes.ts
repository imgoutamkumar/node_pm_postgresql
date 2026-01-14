import { Router } from "express";
import { authMiddleware,authorizePositions } from "../../middlewares/auth.middleware.js";
import { createNewProject,getProject } from "./project.controller.js";

const router = Router();

router.post("/", authMiddleware, authorizePositions("MANAGER"), createNewProject);
router.get("/:myId", authMiddleware, getProject);

export default router;
