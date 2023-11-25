import { Request, Response } from "express";
import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();
// TODO: ADD CHECK FOR ADDRESS
const accounts: string[] = [
  "OM6MRCKILRNNBYSSM3NHOQVRCX4EKF3YMA4EKHIGYWAV553Y57ZO2B7EFM",
  "IVBHJFHZWPXRX2EA7AH7Y4UTTBO2AK73XI65OIXDEAEN7VO2IHWXKOKOVM",
  "KWNBRP4E6X7POFIPCDNX5NZBY2YHW4RRH67RBWRCII5BZVZ5NLTGCBANUU",
  "7O3IVAXXX645ZDKBOJIRXW7ULW4B77KK4B5KGVRIIYR3CTK2U5KRLLXWFQ",
  "SDA6DSYRY6P3JIVRA74YD37EXIBMM5FAYCIGXRSWARON6YMWHJSNU3TLDY",
];
interface accountState {
  [key: string]: number | null;
}
let accountState: accountState = {};
let isFirstRun = true;

async function checkAccountStates() {
  console.log("🚧 Checking Account States");
  const updatedAccState = { ...accountState };
  let stateHasChanged = false;
  for (const account of accounts) {
    try {
      const accountBalance = await fetchAccountData(account);
      const currentBalance = accountBalance ? accountBalance : null;
      updatedAccState[account] = currentBalance;
      if (
        accountState[account] !== undefined &&
        accountState[account] !== currentBalance
      ) {
        stateHasChanged = true;
        console.log(
          `${account}. Previous: ${accountState[account]}, Current: ${currentBalance}`
        );
      }
    } catch (error) {
      console.error(`Error fetching data for account ${account}:`, error);
    }
  }
  if (isFirstRun || stateHasChanged) {
    accountState = updatedAccState;
    isFirstRun = false;
    console.log("Accounts State Updated", accountState);
  }
}

setInterval(checkAccountStates, 6000);

export const getCurrentAccountState = async (req: Request, res: Response) => {
  res.json(accountState);
};

export async function fetchAccountData(address: string) {
  try {
    const url = `https://mainnet-api.algonode.cloud/v2/accounts/${address}`;
    const response = await axios.get(url);
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
