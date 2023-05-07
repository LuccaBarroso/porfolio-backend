import express from "express";

import * as timelineController from "../controllers/timelineController.js";
import { requireLogin } from "./requireLoginMiddleware.js";

const router = express.Router();

router.get("/", timelineController.getAll);
router.get("/:id", timelineController.getById);
router.post("/", requireLogin, timelineController.create);
router.put("/:id", requireLogin, timelineController.update);
router.delete("/:id", requireLogin, timelineController.remove);

export default router;
