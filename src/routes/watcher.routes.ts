import * as express from "express";
import { AccountsService } from "../services/acounts.service";

const router = express.Router();


const accountsService = new AccountsService();
router.get('/account-watcher/', async (req, res) => {
  try {
    const response = await accountsService.checkAccountsStates()
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});

router.post('/account-watcher/add/:address', async (req, res) => {
  try {
    const address = req.params.address;
    accountsService.addAccount(address);
    res.status(200).json({ success: true, message: `Account ${address} added` });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});

// Route for removing an account
router.delete('/account-watcher/remove/:address', async (req, res) => {
  try {
    const address = req.params.address;
    accountsService.removeAccount(address);
    res.status(200).json({ success: true, message: `Account ${address} removed` });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});

export default router;
