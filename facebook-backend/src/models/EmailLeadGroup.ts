import mongoose from "mongoose";

const EmailLeadGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    totalLeads: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("EmailLeadGroup", EmailLeadGroupSchema);
