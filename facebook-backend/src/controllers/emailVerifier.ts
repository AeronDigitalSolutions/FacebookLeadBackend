import { Request, Response } from "express";
import { verifyEmail } from "../services/emailVerifier";

export const verifyEmailController = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const result = await verifyEmail(email);
  res.json(result);
};
