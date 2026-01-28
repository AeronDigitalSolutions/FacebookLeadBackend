import mongoose from "mongoose";

const MailboxSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    smtp: {
      host: String,
      port: Number,
      user: String,
      pass: String,
    },
    imap: {
      host: String,
      port: Number,
      user: String,
      pass: String,
    },
    warmupEnabled: { type: Boolean, default: true },
    dailyLimit: { type: Number, default: 30 },
    status: { type: String, default: "connected" },
  },
  { timestamps: true }
);

export default mongoose.model("Mailbox", MailboxSchema);
