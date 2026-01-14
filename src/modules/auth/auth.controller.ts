import type { Request, Response } from "express";
import { getProfileById, loginUser, registerUser } from "./auth.service.js";


export const login = async (req: Request, res: Response) => {
  const result:any = await loginUser(req.body);


  if (result.status !== "success") {
    return res.status(401).json(result);
  }
  const { token } = result.data;
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 min
  });
  res.status(200).json(result);
}

export const register = async (req: Request, res: Response) => {

  const result = await registerUser(req.body);

  if (result.status !== "success") {
    return res.status(401).json(result);
  }
  const { token } = result.data;
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 min
  });
  res.status(201).json(result);
}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.status(200).json({ status: "success", message: "Logged out successfully" });
}

export const getProfile = async (req: Request, res: Response) => {
  const result = await getProfileById(req.user.id);
  res.status(200).json(result);
}