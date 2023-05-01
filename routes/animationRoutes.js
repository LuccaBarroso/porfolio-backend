import express from "express";
import * as animationController from "../controllers/animationController.js";

const router = express.Router();

router.get("/", animationController.getAll);
router.get("/featured/", animationController.getAllFeatured);
router.put("/addCategory/:id", animationController.addCategory);
router.put("/removeCategory/:id", animationController.removeCategory);
router.get("/:id", animationController.getById);
router.post("/", animationController.create);
router.put("/:id", animationController.update);
router.delete("/:id", animationController.remove);
router.put("/:id/good", animationController.addGoodReview);
router.put("/:id/medium", animationController.addMediumReview);
router.put("/:id/bad", animationController.addBadReview);
router.put("/:id/view", animationController.addView);

export default router;
