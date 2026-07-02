import { Router } from "express";
import { createTask, getTasks, UpdateTaskStatus } from "../controllers/taskControllers";


const router = Router();

router.get("/", getTasks);
router.post("/", createTask)
router.patch("/:taskId/status", UpdateTaskStatus);

export default router;

 