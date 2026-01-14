import type { Request, Response } from "express";
import { createTask } from "./task.service.js";

export const createNewTask = async (req: Request, res: Response): Promise<any> => {
    try {
         const result = await createTask(
        req.body
    );
    if (result.status !== "success") {
        return res.status(401).json(result);
    }
    return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ status: "failed", message: "Internal server error" });
    }
   
}