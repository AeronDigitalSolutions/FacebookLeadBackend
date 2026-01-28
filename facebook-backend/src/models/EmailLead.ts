import mongoose from "mongoose";

const EmailLeadSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmailLeadGroup",
      required: true,
    },

    first_name: String,
    last_name: String,
    email: { type: String, required: true, unique: true },
    company: String,
    position: String,
    phone: String,
    website: String,

    // 🔥 EXISTING – DO NOT REMOVE
    extraFields: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
    strict: false, // ✅ allows dynamic columns
  }
);

export default mongoose.model("EmailLead", EmailLeadSchema);
