import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });


export const search = async (req: Request, res: Response): Promise<void> => {

    const { query } = req.query;

    try {
        const tasks = await prisma.task.findMany({
            where: {
                OR: [
                    { title: { contains: query as string }},
                    { description: { contains: query as string }}
                ]
            }
        })

        const project = await prisma.project.findMany({
            where: {
                OR: [
                    {name: {contains: query as string}},
                    { description: { contains: query as string}}
                ]
            }
        })

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    {username: {contains: query as string}},
                ]
            }
        })

        res.json({ tasks, project, users});
    } catch (error: any) {
        res
         .status(500)
         .json({ mesasage: 'Error performing search'})
    }
};
