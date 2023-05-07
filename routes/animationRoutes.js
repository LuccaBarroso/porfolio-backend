import express from "express";
import * as animationController from "../controllers/animationController.js";
import { requireLogin } from "./requireLoginMiddleware.js";

const router = express.Router();

router.get("/", animationController.getAll);
router.get("/featured/", animationController.getAllFeatured);
router.put("/addCategory/:id", requireLogin, animationController.addCategory);
router.put(
  "/removeCategory/:id",
  requireLogin,
  animationController.removeCategory
);
router.get("/:id", animationController.getById);
router.post("/", requireLogin, animationController.create);
router.put("/:id", requireLogin, animationController.update);
router.delete("/:id", requireLogin, animationController.remove);
router.put("/:id/good", animationController.addGoodReview);
router.put("/:id/medium", animationController.addMediumReview);
router.put("/:id/bad", animationController.addBadReview);
router.put("/:id/view", animationController.addView);

export default router;
