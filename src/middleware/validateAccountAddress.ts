import { Request, Response, NextFunction } from "express";

export function validateAccountAddress(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const address = req.params.address;
  const isValidAddress = /^[A-Za-z0-9]{52}$/.test(address);

  if (isValidAddress) {
    next();
  } else {
    res.status(400).send("Invalid account address");
  }
}
