import * as express from "express";
import * as watcherController from "../controllers/watcher.controller";
// import { validateAccountAddress } from "../middleware/validateAccountAddress";

const router = express.Router();
router.get("/account-watcher/", watcherController.getCurrentAccountState);
router.post(
  "/account-watcher/add/:address",
  watcherController.addAccount
);
router.delete(
  "/account-watcher/remove/:address",
  watcherController.removeAccount
);

export default router;
