import express from "express";
import * as stackController from "../controllers/stackController.js";
import { requireLogin } from "./requireLoginMiddleware.js";

const router = express.Router();

router.get("/", stackController.getAll);
router.get("/:id", stackController.getById);
router.post("/", requireLogin, stackController.create);
router.put("/:id", requireLogin, stackController.update);
router.delete("/:id", requireLogin, stackController.remove);

export default router;
