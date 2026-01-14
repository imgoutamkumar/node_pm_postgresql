import type { Request, Response } from "express";
import {createProject,getMyProjects} from "../../modules/project/project.service.js"

export const createNewProject = async (req: Request, res: Response) => {
  const project = await createProject(
    req.user.id,
    req.body
  );
  res.status(201).json(project);
};

export const getProject = async (req: Request, res: Response) => {
  const projects = await getMyProjects(req.user.id);
  res.json(projects);
};
