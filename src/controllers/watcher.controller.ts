/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as dotenv from "dotenv";
import axios from "axios";
import _ from 'lodash';
import { wss } from "../index"
import WebSocket from 'ws'; // Import the WebSocket class


dotenv.config();
// TODO: ADD CHECK FOR ADDRESS
const accounts: string[] = [
  "OM6MRCKILRNNBYSSM3NHOQVRCX4EKF3YMA4EKHIGYWAV553Y57ZO2B7EFM",
  "IVBHJFHZWPXRX2EA7AH7Y4UTTBO2AK73XI65OIXDEAEN7VO2IHWXKOKOVM",
  "KWNBRP4E6X7POFIPCDNX5NZBY2YHW4RRH67RBWRCII5BZVZ5NLTGCBANUU",
  "7O3IVAXXX645ZDKBOJIRXW7ULW4B77KK4B5KGVRIIYR3CTK2U5KRLLXWFQ",
  "SDA6DSYRY6P3JIVRA74YD37EXIBMM5FAYCIGXRSWARON6YMWHJSNU3TLDY",
];
interface accountsState {
  [key: string]: any;
}


function sendWsMessage(type: string, data: any) {
  const message = JSON.stringify({ type, data });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}




let accountsState: accountsState = {};


let isFirstRun = true
async function checkaccountsStates() {
  console.log("🚧 Checking Account States");
  const updatedAccState = { ...accountsState };
  for (const account of accounts) {
    try {
      const currentAccountData = await fetchAccountData(account);
      // Specific check for balance change
      const currentBalance = currentAccountData ? currentAccountData.amount : null;
      if (accountsState[account] !== undefined && accountsState[account] !== null && accountsState[account].amount !== currentBalance) {
        console.log(`Balance changed for account ${account}. Previous: ${accountsState[account].amount}, Current: ${currentBalance}`);
        sendWsMessage('balanceChange', { account, newState: updatedAccState });
      }

      updatedAccState[account] = currentAccountData;
    } catch (error) {
      console.error(`Error fetching data for account ${account}:`, error);
    }
  }
  if (isFirstRun) {
    accountsState = updatedAccState;
    isFirstRun = false;
    console.log("Accounts State Updated");
    sendWsMessage('balanceChange', { newState: updatedAccState });
  }
}
setInterval(checkaccountsStates, 6000);

export const getCurrentaccountsState = async (req: Request, res: Response) => {
  await checkaccountsStates()
  res.json(accountsState);
};



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
    delete accountsState[address];
    await checkaccountsStates()

    res.status(200).send(`Account ${address} removed from watcher list`);
    console.log("Updated Accounts List: ", accounts);
    console.log("Updated Account States: ", accountsState);


  } else {
    res.status(404).send(`Account ${address} not found`);
  }
};
