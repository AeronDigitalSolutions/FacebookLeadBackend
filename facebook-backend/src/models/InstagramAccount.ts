import mongoose from "mongoose";

const InstagramAccountSchema = new mongoose.Schema(
  {
    pageId: { type: String, required: true },
    pageAccessToken: { type: String, required: true },

    instagramAccountId: { type: String, required: true },
    instagramUsername: String,
  },
  { timestamps: true }
);

export default mongoose.model(
  "InstagramAccount",
  InstagramAccountSchema
);
