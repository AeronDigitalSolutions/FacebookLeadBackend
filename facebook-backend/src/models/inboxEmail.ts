import mongoose from "mongoose";

const InboxEmailSchema = new mongoose.Schema(
  {
    mailboxId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mailbox",
      required: true,
    },

    messageId: { type: String, required: true },

    folder: { type: String, default: "INBOX" },

    from: String,
    to: String,
    cc: String,

    subject: String,
    bodyText: String,
    bodyHtml: String,

    date: Date,

    isRead: { type: Boolean, default: false },

    // 🔥 NEW (OPEN TRACKING)
    isOpened: { type: Boolean, default: false },
    openedAt: Date,

    hasAttachments: { type: Boolean, default: false },
  },
  { timestamps: true }
);

InboxEmailSchema.index(
  { mailboxId: 1, messageId: 1 },
  { unique: true }
);

export default mongoose.model("InboxEmail", InboxEmailSchema);
