import mongoose from "mongoose";

const InstagramMessageSchema = new mongoose.Schema(
  {
    instagramAccountId: String,
    senderId: String,
    message: String,
    direction: {
      type: String,
      enum: ["inbound", "outbound"],
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "InstagramMessage",
  InstagramMessageSchema
);
