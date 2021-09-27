import { Router } from "express";
import { secured } from "../middleware";
import * as dataController from "../controllers/data.controller";

// Define routes, and pass to controller functions
const router = Router();

router.get("/channels", secured, dataController.getChannels);
router.get("/channels/:channelId", secured, dataController.getChannelMessages);
router.post("/channels", secured, dataController.addChannel);
router.get("/messages", secured, dataController.getMessages);
router.post("/messages", secured, dataController.addMessage);

export default router;