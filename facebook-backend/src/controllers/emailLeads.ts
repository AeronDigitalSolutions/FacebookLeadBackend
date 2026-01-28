import { Request, Response } from "express";
import EmailLeadGroup from "../models/EmailLeadGroup";
import EmailLead from "../models/EmailLead";
import { normalizeLead } from "../utils/leadNormalizer";
import { Document, DefaultTimestampProps, Types } from "mongoose";

export const createLeadGroupWithLeads = async (
  req: Request,
  res: Response
) => {
  try {
    const { groupName, groupId, leads } = req.body;

    if (!Array.isArray(leads) || leads.length === 0) {
      return res.status(400).json({ message: "Leads array is required" });
    }

    let group;

    if (groupId) {
      group = await EmailLeadGroup.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
    } else if (groupName) {
      group = await EmailLeadGroup.create({
        name: groupName,
        totalLeads: 0,
      });
    } else {
      return res.status(400).json({
        message: "groupId or groupName is required",
      });
    }

    const docs = leads
      .map(normalizeLead)
      .filter((l) => l?.email)
      .map((l) => {
        const {
          first_name,
          last_name,
          email,
          company,
          position,
          phone,
          website,
          extraFields = {},
          ...dynamicFields // 🔥 new dynamic columns
        } = l;

        return {
          first_name,
          last_name,
          email: email.toLowerCase(),
          company,
          position,
          phone,
          website,
          extraFields,
          ...dynamicFields, // 🔥 stored at top-level
          groupId: group._id,
        };
      });

    let insertedDocs: any[] = [];

    try {
      insertedDocs = await EmailLead.insertMany(docs, {
        ordered: false,
      });
    } catch (err: any) {
      insertedDocs = err.insertedDocs || [];
    }

    if (insertedDocs.length > 0) {
      await EmailLeadGroup.findByIdAndUpdate(group._id, {
        $inc: { totalLeads: insertedDocs.length },
      });
    }

    return res.json({
      success: true,
      received: leads.length,
      inserted: insertedDocs.length,
      skipped: leads.length - insertedDocs.length,
    });
  } catch (error) {
    console.error("Email lead import failed:", error);
    return res.status(500).json({
      message: "Failed to import email leads",
    });
  }
};

export const getAllEmailLeads = async (_req: Request, res: Response) => {
  try {
    const leads = await EmailLead.find()
      .populate("groupId", "name")
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leads" });
  }
};

export const getAllEmailLeadGroups = async (_req: any, res: { json: (arg0: (Document<unknown, {}, { name: string; totalLeads: number; } & DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ name: string; totalLeads: number; } & DefaultTimestampProps & { _id: Types.ObjectId; } & { __v: number; }, "id"> & { id: string; })[]) => void; }) => {
  const groups = await EmailLeadGroup.find().sort({ createdAt: -1 });
  res.json(groups);
};
