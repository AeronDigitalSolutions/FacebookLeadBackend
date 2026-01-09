import { Request, Response } from "express";
import Campaign from "../models/Campaign";
import { fetchMetaCampaigns } from "../services/metaCampaign";

export const syncMetaCampaigns = async (req: Request, res: Response) => {
  try {
    const { adAccountId } = req.params;

    // 🔴 TEMP TOKEN (replace with your metaAuth middleware later)
    const accessToken = req.headers.authorization?.replace("Bearer ", "");

    if (!accessToken) {
      return res.status(401).json({ message: "Missing access token" });
    }

    const data = await fetchMetaCampaigns(adAccountId, accessToken);

    res.json({ success: true, count: data.length });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getMetaCampaigns = async (req: Request, res: Response) => {
  const { adAccountId } = req.params;

  const campaigns = await Campaign.find({
    adAccountId,
    platform: "Meta",
  }).sort({ createdAt: -1 });

  // ✅ MUST return ARRAY
  res.json(campaigns);
};
