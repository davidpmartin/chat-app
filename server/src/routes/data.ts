import { Router } from "express";
import { secured } from "../middleware";
import * as dataController from "../controllers/dataController";

// Define routes, and pass to controller functions
const router = Router();

router.post("/users", dataController.registerUser);
router.get("/messages", secured, dataController.getMessages);
router.post("/messages", secured, dataController.addMessage);

export default router;