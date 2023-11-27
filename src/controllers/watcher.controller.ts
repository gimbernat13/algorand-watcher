/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as dotenv from "dotenv";
import axios from "axios";
import _ from 'lodash';

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
  [key: string]: any;
}
let accountState: accountState = {};
let isFirstRun = true;


function findDifferences(obj1: Record<string, any>, obj2: Record<string, any>) {
  const differences: Record<string, { from: any; to: any }> = {};

  Object.keys({ ...obj1, ...obj2 }).forEach(key => {
    if (!_.isEqual(obj1[key], obj2[key])) {
      differences[key] = { from: obj1[key], to: obj2[key] };
    }
  });

  return differences;
}

async function checkAccountStates() {
  console.log("🚧 Checking Account States");
  const updatedAccState = { ...accountState };
  let stateHasChanged = false;

  for (const account of accounts) {
    try {
      const currentAccountData = await fetchAccountData(account);

      // Check for any state change (deep comparison)
      if (!_.isEqual(accountState[account], currentAccountData)) {
        stateHasChanged = true;
        console.log(`Overall state changed for account ${account}.`);
        // Emit WebSocket event or log for overall state change
      }
      if (!_.isEqual(accountState[account], currentAccountData)) {
        // Find specific differences
        const diffs = accountState[account] && findDifferences(accountState[account], currentAccountData);
        console.log(`Differences for account ${account}:`, diffs);
        // Emit WebSocket event or log differences
      }

      // Specific check for balance change
      const currentBalance = currentAccountData ? currentAccountData.amount : null;
      if (accountState[account] !== undefined && accountState[account] !== null && accountState[account].amount !== currentBalance) {
        console.log(`Balance changed for account ${account}. Previous: ${accountState[account].amount}, Current: ${currentBalance}`);
        // Emit WebSocket event or log for balance change
      }

      updatedAccState[account] = currentAccountData;
    } catch (error) {
      console.error(`Error fetching data for account ${account}:`, error);
    }
  }

  if (isFirstRun || stateHasChanged) {
    accountState = updatedAccState;
    isFirstRun = false;
    console.log("Accounts State Updated");
  }
}
setInterval(checkAccountStates, 6000);

export const getCurrentAccountState = async (req: Request, res: Response) => {
  await checkAccountStates()
  res.json(accountState);
};

export async function fetchAccountData(address: string) {
  try {
    const url = `https://mainnet-api.algonode.cloud/v2/accounts/${address}`;
    const response = await axios.get(url);
    return response.data;
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
  const index = accounts.indexOf(address);

  if (index > -1) {
    accounts.splice(index, 1);
    delete accountState[address];
    await checkAccountStates()

    res.status(200).send(`Account ${address} removed from watcher list`);
    console.log("Updated Accounts List: ", accounts);
    console.log("Updated Account States: ", accountState);


  } else {
    res.status(404).send(`Account ${address} not found`);
  }
};
