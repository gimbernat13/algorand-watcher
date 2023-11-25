import * as express from "express";
import * as userController from "../controllers/watcher.controller";

const router = express.Router();

router.post("/account-watcher/add", userController.addAccount);
router.delete("/account-watcher/remove", userController.removeAccount);

export default router;
