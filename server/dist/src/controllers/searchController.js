"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new client_1.PrismaClient({ adapter });
const search = async (req, res) => {
    const { query } = req.query;
    try {
        const tasks = await prisma.task.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { description: { contains: query } }
                ]
            }
        });
        const project = await prisma.project.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { description: { contains: query } }
                ]
            }
        });
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: query } },
                ]
            }
        });
        res.json({ tasks, project, users });
    }
    catch (error) {
        res
            .status(500)
            .json({ mesasage: 'Error performing search' });
    }
};
exports.search = search;
//# sourceMappingURL=searchController.js.map