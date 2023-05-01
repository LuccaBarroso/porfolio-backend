import express from "express";

import * as timelineController from "../controllers/timelineController.js";

const router = express.Router();

router.get("/", timelineController.getAll);
router.get("/:id", timelineController.getById);
router.post("/", timelineController.create);
router.put("/:id", timelineController.update);
router.delete("/:id", timelineController.remove);

export default router;
