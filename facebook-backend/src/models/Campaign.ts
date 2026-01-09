import mongoose, { Schema, Document } from "mongoose";

export interface ICampaign extends Document {
  metaCampaignId: string;
  adAccountId: string;
  name: string;
  status: string;
  objective?: string;
  platform: "Meta";
}

const CampaignSchema = new Schema(
  {
    metaCampaignId: { type: String, required: true },
    adAccountId: { type: String, required: true },

    name: String,
    status: String,
    objective: String,

    platform: { type: String, default: "Meta" },
  },
  { timestamps: true }
);

export default mongoose.model<ICampaign>("Campaign", CampaignSchema);
