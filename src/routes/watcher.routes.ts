import * as express from "express";
import * as userController from "../controllers/watcher.controller";

const router = express.Router();

router.post("/account-watcher", userController.addAccount);
router.post("/account-watcher", userController.removeAccount);

export default router;
