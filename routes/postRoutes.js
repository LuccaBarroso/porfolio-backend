import express from "express";
import * as postController from "../controllers/postController.js";
import { requireLogin } from "./requireLoginMiddleware.js";

const router = express.Router();

router.get("/", postController.getAll);
router.get("/:id", postController.getById);
router.post("/", requireLogin, postController.create);
router.put("/:id", requireLogin, postController.update);
router.delete("/:id", requireLogin, postController.remove);

export default router;
