"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = exports.getProjects = void 0;
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new client_1.PrismaClient({ adapter });
// grab the information from the request and res will be what we use for our response
const getProjects = async (req, res) => {
    try {
        // we have prisma and inside of prisma we're going to grab the project schema.
        const projects = await prisma.project.findMany();
        res.status(200).json(projects);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error: error });
    }
};
exports.getProjects = getProjects;
const createProject = async (req, res) => {
    try {
        const { name, description, startDate, endDate, link } = req.body;
        const newProject = await prisma.project.create({
            data: { name, description, startDate, endDate }
        });
        res.status(201).json(newProject);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error: error });
    }
};
exports.createProject = createProject;
//# sourceMappingURL=projectControllers.js.map