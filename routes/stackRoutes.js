import express from "express";
import * as stackController from "../controllers/stackController.js";

const router = express.Router();

router.get("/", stackController.getAll);
router.get("/:id", stackController.getById);
router.post("/", stackController.create);
router.put("/:id", stackController.update);
router.delete("/:id", stackController.remove);

export default router;
