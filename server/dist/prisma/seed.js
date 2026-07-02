"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new client_1.PrismaClient({ adapter });
async function deleteAllData(orderedFileNames) {
    const modelNames = orderedFileNames.map((fileName) => {
        const modelName = path_1.default.basename(fileName, path_1.default.extname(fileName));
        return modelName.charAt(0).toUpperCase() + modelName.slice(1);
    });
    for (const modelName of modelNames) {
        const model = prisma[modelName];
        try {
            await model.deleteMany({});
            console.log(`Cleared data from ${modelName}`);
        }
        catch (error) {
            console.error(`Error clearing data from ${modelName}:`, error);
        }
    }
}
async function main() {
    const dataDirectory = path_1.default.join(__dirname, "seedData");
    const orderedFileNames = [
        "team.json",
        "project.json",
        "projectTeam.json",
        "user.json",
        "task.json",
        "attachment.json",
        "comment.json",
        "taskAssignment.json",
    ];
    await deleteAllData(orderedFileNames);
    for (const fileName of orderedFileNames) {
        const filePath = path_1.default.join(dataDirectory, fileName);
        const jsonData = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
        const modelName = path_1.default.basename(fileName, path_1.default.extname(fileName));
        const model = prisma[modelName];
        try {
            for (const data of jsonData) {
                await model.create({ data });
            }
            console.log(`Seeded ${modelName} with data from ${fileName}`);
        }
        catch (error) {
            console.error(`Error seeding data for ${modelName}:`, error);
        }
    }
}
main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
//# sourceMappingURL=seed.js.map