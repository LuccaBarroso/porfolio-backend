import express from "express";
import * as projectController from "../controllers/projectController.js";
import { requireLogin } from "./requireLoginMiddleware.js";

const router = express.Router();

router.get("/", projectController.getAll);
router.put("/addStack/:id", requireLogin, projectController.addStack);
router.put("/removeStack/:id", requireLogin, projectController.removeStack);
router.get("/:id", projectController.getById);
router.post("/", requireLogin, projectController.create);
router.put("/:id", requireLogin, projectController.update);
router.delete("/:id", requireLogin, projectController.remove);

export default router;
