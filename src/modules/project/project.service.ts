import  prisma  from "../../config/prisma.js"

export const createProject = async (userId: string, data: any) => {
  try {
    return prisma.project.create({
    data: {
      ...data,
      ownerId: userId,
      projectMembers: {
        create: { userId },
      },
    },
  });
  } catch (error) {
    return {status: "failed", message: "Project creation failed"}
  }
  
};

export const getMyProjects = async (userId: string) => {
  return prisma.project.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { projectMembers: { some: { userId } } },
      ],
    },
  });
};
