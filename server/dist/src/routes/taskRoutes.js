"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskControllers_1 = require("../controllers/taskControllers");
const router = (0, express_1.Router)();
router.get("/", taskControllers_1.getTasks);
router.post("/", taskControllers_1.createTask);
router.patch("/:taskId/status", taskControllers_1.UpdateTaskStatus);
exports.default = router;
//# sourceMappingURL=taskRoutes.js.map