import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });


export const search = async (req: Request, res: Response): Promise<void> => {
    
    const projectId = Number(req.query.projectId);

    if (!Number.isInteger(projectId)) {
        res.status(400).json({ message: "A valid projectId query parameter is required" });
        return;
    }

    try {
        const tasks = await prisma.task.findMany({
            where: {
                projectId
            }, 
            include: {
                author: true,
                assignee: true,
                comments: true,
                attachments: true,
            }
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error Retrieving Tasks", error: error });
    }
};


export const createTask = async (req: Request, res: Response): Promise <void> => {
    const { 
        title, 
        description, 
        status, 
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId,
        authorUserId,
        assignedUserId, 
    } = req.body;
    
    try {
        const tasks = await prisma.task.create({
            data: {
                title, 
                description, 
                status, 
                priority,
                tags,
                startDate,
                dueDate,
                points,
                projectId,
                authorUserId,
                assignedUserId, 
            }
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error Creating a Tasks", error: error });
    }
}

export const UpdateTaskStatus = async ( req: Request, res: Response ): Promise<void> => {
    // We wukk be getting our taskId tru Route Params
    const { taskId } = req.params;
    // We will be getting our new task status or we will be sending our JSON Body Request tru this Controller or post Request.
    // We are going to get our new Status to our JSON Body Request
    const { status } = req.body

    try {
        const tasks = await prisma.task.update({
            where: {
               id: Number(taskId)
            }, 
            data: {
                status
            }
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error Retrieving Tasks", error: error });
    }
}
