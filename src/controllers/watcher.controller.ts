import { Request, Response } from "express";
import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const accounts: string[] = [
  "ZW3ISEHZUHPO7OZGMKLKIIMKVICOUDRCERI454I3DB2BH52HGLSO67W754",
];

export async function fetchAccountData(address: string) {
  console.log("fetching acc data ");
  try {
    const url = `https://mainnet-api.algonode.cloud/v2/accounts/${address}`;
    const response = await axios.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // or handle the error as you see fit
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
  try {
  } catch (error) {}
};
