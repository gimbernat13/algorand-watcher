import * as express from "express";
import * as watcherController from "../controllers/watcher.controller";
import { AccountsService } from "../services/acounts.service";
// import { validateAccountAddress } from "../middleware/validateAccountAddress";

const router = express.Router();


const accountsService = new AccountsService();
router.get('/account-watcher/', async (req, res) => {
  try {
    const response = await accountsService.checkaccountsStates()
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/account-watcher/add/:address', async (req, res) => {
  try {
    const address = req.params.address;
    accountsService.addAccount(address);
    res.status(200).json({ success: true, message: `Account ${address} added` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route for removing an account
router.delete('/account-watcher/remove/:address', async (req, res) => {
  try {
    const address = req.params.address;
    accountsService.removeAccount(address);
    res.status(200).json({ success: true, message: `Account ${address} removed` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
