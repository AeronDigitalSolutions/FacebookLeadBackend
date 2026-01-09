import { Request, Response } from "express";
import Lead from "../models/Lead";
import { normalizeLead } from "../utils/normalizeLead";

export const metaWebhook = async (req: Request, res: Response) => {
  const leadData = normalizeLead(req.body);

  if (!leadData) return res.sendStatus(200);

  await Lead.create(leadData);
  res.sendStatus(200);
};
