import * as express from "express";
import * as userController from "../controllers/watcher.controller";

const router = express.Router();

router.post("/account-watcher/add/:address", userController.addAccount);
router.delete("/account-watcher/remove/:address", userController.removeAccount);

export default router;
