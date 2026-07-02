import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });


// grab the information from the request and res will be what we use for our response
export const getProjects = async (req: Request, res: Response): Promise<void> => {
    try {
        // we have prisma and inside of prisma we're going to grab the project schema.
        const projects = await prisma.project.findMany();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error });
    }
}

export const createProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, startDate, endDate, link } = req.body;
        const newProject = await prisma.project.create({
            data: { name, description, startDate, endDate }
        });
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error });
    }
};
