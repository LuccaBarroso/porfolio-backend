import express from "express";
import * as skillController from "../controllers/skillController.js";
import { requireLogin } from "./requireLoginMiddleware.js";

const router = express.Router();

router.get("/", skillController.getAll);
router.put("/addStack/:id", requireLogin, skillController.addStack);
router.put("/removeStack/:id", requireLogin, skillController.removeStack);
router.get("/:id", skillController.getById);
router.post("/", requireLogin, skillController.create);
router.put("/:id", requireLogin, skillController.update);
router.delete("/:id", requireLogin, skillController.remove);
router.get("/addStack/:id", requireLogin, skillController.addStack);
router.get("/removeStack/:id", requireLogin, skillController.removeStack);

export default router;
