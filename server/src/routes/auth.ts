import { Router } from "express";
import { secured } from "../middleware";
import * as authController from "../controllers/authController";

// Define routes, and pass to controller functions
const router = Router();

router.get("/login", authController.getAuthStatus);
router.post("/login", authController.loginUser);
router.get("/logout", secured, authController.logoutUser);

export default router;