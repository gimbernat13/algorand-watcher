import { Request, Response } from "express";
import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const accounts: string[] = [
  "OM6MRCKILRNNBYSSM3NHOQVRCX4EKF3YMA4EKHIGYWAV553Y57ZO2B7EFM",
  "IVBHJFHZWPXRX2EA7AH7Y4UTTBO2AK73XI65OIXDEAEN7VO2IHWXKOKOVM",
];
interface AccountBalances {
  [key: string]: number | null;
}

const accountBalances: AccountBalances = {};
async function checkAccountStates() {
  console.log("🚧 Checking Account States");
  for (const account of accounts) {
    try {
      const accountData = await fetchAccountData(account);
      const currentBalance = accountData ? accountData.amount : null;

      if (
        accountBalances[account] !== undefined &&
        accountBalances[account] !== currentBalance
      ) {
        console.log(
          `Balance changed for account ${account}. Previous: ${accountBalances[account]}, Current: ${currentBalance}`
        );
      }
      accountBalances[account] = currentBalance;
    } catch (error) {
      console.error(`Error fetching data for account ${account}:`, error);
    }
  }
}

setInterval(checkAccountStates, 6000);

export async function fetchAccountData(address: string) {
  console.log("Accounts ", accounts);
  console.log("🚧 Fetching: ", address);
  try {
    const url = `https://mainnet-api.algonode.cloud/v2/accounts/${address}`;
    const response = await axios.get(url);
    console.log(response.data);
    return response.data.amount;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export const addAccount = async (req: Request, res: Response) => {
  const address = req.params.address;
  try {
    accounts.push(address);
    res.status(200).send(`Account ${address} added to watcher list`);
    console.log("Accounts ", accounts);
  } catch (error) {
    console.log("error", error);
  }
};

export const removeAccount = async (req: Request, res: Response) => {
  const address = req.params.address;
  accounts.indexOf(address);

  try {
    res.status(200).send(`Account ${address} added to watcher list`);
  } catch (error) {
    console.log("error", error);
  }
};
