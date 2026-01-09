import mongoose, { Schema, Document } from "mongoose";

export interface ILead extends Document {
  name?: string;
  phone?: string;
  email?: string;

  source: "form" | "whatsapp" | "messenger" | "instagram" | "website";

  adAccountId?: string;
  campaignId?: string;
  campaignName?: string;
  adSetId?: string;
  adId?: string;

  formId?: string;
  conversationId?: string;

  status: "new" | "contacted" | "qualified" | "followup" | "converted" | "lost";
  assignedAgent?: string;

  messages?: {
    sender: "lead" | "agent";
    message: string;
    timestamp: Date;
  }[];

  createdAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: String,
    phone: String,
    email: String,

    source: {
      type: String,
      enum: ["form", "whatsapp", "messenger", "instagram", "website"],
      required: true,
    },

    adAccountId: String,
    campaignId: String,
    campaignName: String,
    adSetId: String,
    adId: String,

    formId: String,
    conversationId: String,

    status: {
      type: String,
      default: "new",
    },

    assignedAgent: String,

    messages: [
      {
        sender: String,
        message: String,
        timestamp: Date,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ILead>("Lead", LeadSchema);
