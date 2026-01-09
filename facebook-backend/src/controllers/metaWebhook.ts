import { Request, Response } from "express";
import Lead from "../models/Lead";
import { normalizeLead } from "../utils/normalizeLead";
import { io } from "../server";

export const metaWebhook = async (req: Request, res: Response) => {
  try {
    const leadData = normalizeLead(req.body);

    // Facebook may send test / irrelevant payloads
    if (!leadData) {
      return res.sendStatus(200);
    }

    const lead = await Lead.create(leadData);

    /* 🔥 REALTIME PUSH TO DASHBOARD */
    io.emit("new-lead", lead);

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error);
    res.sendStatus(500);
  }
};
