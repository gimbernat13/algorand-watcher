import { Request, Response } from "express";
import * as dotenv from "dotenv";

dotenv.config();

const accounts: string[] = [];

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
