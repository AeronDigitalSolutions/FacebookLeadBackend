import { Request, Response } from "express";
import Mailbox from "../models/mailbox";
import { testSMTP, testIMAP } from "../services/mail";
export const testMailbox = async (req: Request, res: Response) => {
  try {
    console.log("📥 BODY:", req.body);

    await testSMTP({
      host: req.body.smtpHost,
      port: Number(req.body.smtpPort), // 🔥 FIX
      user: req.body.smtpUser,
      pass: req.body.smtpPass,
    });

    await testIMAP({
      host: req.body.imapHost,
      port: Number(req.body.imapPort), // 🔥 FIX
      user: req.body.imapUser,
      pass: req.body.imapPass,
    });

    return res.json({ success: true });
  } catch (err: any) {
    console.error("❌ EMAIL TEST ERROR:", err);
    return res.status(400).json({
      message: err?.message || "SMTP or IMAP connection failed",
    });
  }
};

export const createMailbox = async (req: Request, res: Response) => {
  const mailbox = await Mailbox.create({
    email: req.body.email,
    smtp: {
      host: req.body.smtpHost,
      port: Number(req.body.smtpPort), // 🔥 FIX
      user: req.body.smtpUser,
      pass: req.body.smtpPass,
    },
    imap: {
      host: req.body.imapHost,
      port: Number(req.body.imapPort), // 🔥 FIX
      user: req.body.imapUser,
      pass: req.body.imapPass,
    },
  });

  res.json(mailbox);
};

/* GET ALL MAILBOXES */
export const getMailboxes = async (_req: Request, res: Response) => {
  const mailboxes = await Mailbox.find().sort({ createdAt: -1 });
  res.json(mailboxes);
};

/* TOGGLE WARMUP */
export const toggleWarmup = async (req: Request, res: Response) => {
  const mailbox = await Mailbox.findById(req.params.id);
  if (!mailbox) return res.status(404).json({ message: "Mailbox not found" });

  mailbox.warmupEnabled = !mailbox.warmupEnabled;
  await mailbox.save();

  res.json(mailbox);
};

/* DELETE MAILBOX */
export const deleteMailbox = async (req: Request, res: Response) => {
  await Mailbox.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};