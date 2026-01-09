import { Request, Response } from "express";
import Lead from "../models/Lead";

export const getLeads = async (req: Request, res: Response) => {
  const {
    campaignId,
    source,
    status,
    agent,
    startDate,
    endDate,
  } = req.query;

  const query: any = {};

  if (campaignId) query.campaignId = campaignId;
  if (source) query.source = source;
  if (status) query.status = status;
  if (agent) query.assignedAgent = agent;

  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate as string),
      $lte: new Date(endDate as string),
    };
  }

  const leads = await Lead.find(query).sort({ createdAt: -1 });
  res.json(leads);
};

export const getLeadById = async (req: Request, res: Response) => {
  const lead = await Lead.findById(req.params.id);
  res.json(lead);
};

export const updateLeadStatus = async (req: Request, res: Response) => {
  const { status, assignedAgent } = req.body;

  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { status, assignedAgent },
    { new: true }
  );

  res.json(lead);
};
