import prisma from "../../config/prisma.js"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { Position } from "@prisma/client";

type UserPayload = {
    id: string;
    email: string;
    password: string;
    position: Position;
}

export const loginUser = async (userData: UserPayload) => {
    const { email, password } = userData;
    try {
        const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        return { status: "failed", message: "Invalid credentials" };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return { status: "failed", message: "Invalid credentials" };
    }
    const token = jwt.sign({ id: user.id, email: user.email, position: user.position, }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
    const { password: _, ...safeUser } = user;
    return { status: "success", data: { ...safeUser, token: token }, message:"Login successful" };
    } catch (error) {
        return { status: "failed", message: "Login failed" };
    }   
}

export const registerUser = async (userData: UserPayload): Promise<any> => {
    const { email, password, position } = userData;
    try {
        const isEmailTaken = await prisma.user.findUnique({
            where: { email }
        });
        if (isEmailTaken) {
            return { status: "failed", message: "Email already taken" };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user  = await prisma.user.create({
            data: { email, password: hashedPassword, position: position }
        });
        const token = jwt.sign({ userId: user.id, email: email }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
        const { password: _, ...safeUser } = user;
        return { status: "success", data: { ...safeUser, token: token }, message: "Registration successful" };
    } catch (error) {
        return { status: "failed", message: "Registration failed" };
    }
}


export const getProfileById = async (userId: string) => {
    try {
        const user = await prisma.user.findUnique({ 
            where: { id: userId },
            select: { id: true, email: true, role: true, createdAt: true }
        });
        if (!user) {
            return { status: "failed", message: "User not found" };
        }   
        return { status: "success", data: user };
    } catch (error) {
        return { status: "failed", message: "Could not retrieve profile" };
    }
}
export const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return { status: "failed", message: "User not found" };
        }
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return { status: "failed", message: "Old password is incorrect" };
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword }
        });
        return { status: "success", message: "Password changed successfully" };
    } catch (error) {
        return { status: "failed", message: "Could not change password" };
    }
}