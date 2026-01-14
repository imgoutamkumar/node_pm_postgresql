import {Router} from 'express';
import { authMiddleware, authorizePositions } from '../../middlewares/auth.middleware.js';
import { createNewTask } from './task.controller.js';

const router = Router();

// Define task routes here
router.post("/", authMiddleware, authorizePositions("MANAGER", "LEAD"), createNewTask);


export default router;