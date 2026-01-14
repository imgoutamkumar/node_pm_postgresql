import prisma from "../../config/prisma.js";

export const getAllTasksByProjectId = async (projectId: string) => {
    try {
        return await prisma.task.findMany({
            where: { projectId }
        });
    } catch (error){
        return {status : "failed", message:"Could not retrieve tasks"};
    }
};

export const createTask = async (taskData: any) => {
    try {
        const task = await prisma.task.create({
            data: taskData
        });
        if (!task) {
            return { status: "failed", message: "Task not created" };
        }   
        return { status: "success", data: task, message: "Task created successfully" };
    } catch (error) {
        return { status: "failed", message: "Task creation failed" };
    }
};