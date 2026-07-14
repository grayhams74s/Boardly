"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskStatus = exports.createTask = exports.search = void 0;
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new client_1.PrismaClient({ adapter });
const search = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ message: "Error Retrieving Tasks", error: error });
    }
};
exports.search = search;
const createTask = async (req, res) => {
    const { title, description, status, priority, tags, startDate, dueDate, points, projectId, authorUserId, assignedUserId, } = req.body;
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
    }
    catch (error) {
        res.status(500).json({ message: "Error Creating a Tasks", error: error });
    }
};
exports.createTask = createTask;
const UpdateTaskStatus = async (req, res) => {
    // We wukk be getting our taskId tru Route Params
    const { taskId } = req.params;
    // We will be getting our new task status or we will be sending our JSON Body Request tru this Controller or post Request.
    // We are going to get our new Status to our JSON Body Request
    const { status } = req.body;
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
    }
    catch (error) {
        res.status(500).json({ message: "Error Retrieving Tasks", error: error });
    }
};
exports.UpdateTaskStatus = UpdateTaskStatus;
//# sourceMappingURL=searchController.js.map