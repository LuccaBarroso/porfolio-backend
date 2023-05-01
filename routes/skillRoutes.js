import express from "express";
import * as skillController from "../controllers/skillController.js";

const router = express.Router();

router.get("/", skillController.getAll);
router.put("/addStack/:id", skillController.addStack);
router.put("/removeStack/:id", skillController.removeStack);
router.get("/:id", skillController.getById);
router.post("/", skillController.create);
router.put("/:id", skillController.update);
router.delete("/:id", skillController.remove);

export default router;
