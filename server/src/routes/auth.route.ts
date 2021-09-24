import { Router } from "express";
import { secured } from "../middleware";
import * as authController from "../controllers/auth.controller";

// Define routes, and pass to controller functions
const router = Router();

router.post("/users", authController.registerUser);
router.get("/login", authController.getAuthStatus);
router.post("/login", authController.loginUser);
router.get("/logout", secured, authController.logoutUser);

export default router;