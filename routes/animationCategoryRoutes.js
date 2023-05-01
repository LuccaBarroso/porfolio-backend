import express from "express";
import * as animationCategoryController from "../controllers/animationCategoryController.js";

const router = express.Router();

router.get("/", animationCategoryController.getAll);
router.get("/:id", animationCategoryController.getById);
router.post("/", animationCategoryController.create);
router.put("/:id", animationCategoryController.update);
router.delete("/:id", animationCategoryController.remove);

export default router;
