import express from "express";
import * as animationCategoryController from "../controllers/animationCategoryController.js";
import { requireLogin } from "./requireLoginMiddleware.js";

const router = express.Router();

router.get("/", animationCategoryController.getAll);
router.get("/:id", animationCategoryController.getById);
router.post("/", requireLogin, animationCategoryController.create);
router.put("/:id", requireLogin, animationCategoryController.update);
router.delete("/:id", requireLogin, animationCategoryController.remove);

export default router;
