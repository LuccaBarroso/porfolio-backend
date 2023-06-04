import express from "express";
import * as authController from "../controllers/authController.js";
import { requireLogin } from "./requireLoginMiddleware.js";

const router = express.Router();

router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/refreshLogin", authController.refreshLogin);
router.get("/me", requireLogin, authController.getCurrentUser);

export default router;
