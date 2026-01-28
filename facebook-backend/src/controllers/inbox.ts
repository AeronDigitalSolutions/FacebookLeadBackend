import { Request, Response } from "express";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Mailbox from "../models/mailbox";
import InboxEmail from "../models/inboxEmail";
import { fetchFolderEmails } from "../services/inbox";

/* SYNC FOLDER */
export const syncFolder = async (req: Request, res: Response) => {
  const { mailboxId, folder } = req.params;

  const mailbox = await Mailbox.findById(mailboxId);
  if (!mailbox) {
    return res.status(404).json({ message: "Mailbox not found" });
  }

  await fetchFolderEmails(mailbox, folder);
  res.json({ success: true });
};

/* GET FOLDER EMAILS */
export const getFolderEmails = async (req: Request, res: Response) => {
  const { mailboxId, folder } = req.params;

  const emails = await InboxEmail.find({
    mailboxId,
    folder,
  })
    .sort({ date: -1 })
    .limit(50);

  res.json(emails);
};

/* GET SINGLE EMAIL */
export const getEmailById = async (req: Request, res: Response) => {
  const email = await InboxEmail.findById(req.params.emailId).populate(
    "mailboxId"
  );

  if (!email) {
    return res.status(404).json({ message: "Email not found" });
  }

  res.json(email);
};

/* REPLY TO EMAIL */
export const replyToEmail = async (req: Request, res: Response) => {
  const { emailId } = req.params;
  const { body } = req.body;

  const email: any = await InboxEmail.findById(emailId).populate(
    "mailboxId"
  );

  if (!email) {
    return res.status(404).json({ message: "Email not found" });
  }

  const mailbox = email.mailboxId;

  if (!mailbox.smtp) {
    return res.status(400).json({ message: "SMTP configuration not found for this mailbox" });
  }

  const smtpOptions: SMTPTransport.Options = {
  host: mailbox.smtp.host,
  port: mailbox.smtp.port,
  secure: false,
  auth: {
    user: mailbox.smtp.user,
    pass: mailbox.smtp.pass,
  },
  tls: { rejectUnauthorized: false },
};


  const transporter = nodemailer.createTransport(smtpOptions);

  await transporter.sendMail({
    from: mailbox.email,
    to: email.from,
    subject: `Re: ${email.subject}`,
    text: body,
    inReplyTo: email.messageId,
    references: email.messageId,
  });

  res.json({ success: true });
};
export const sendNewEmail = async (req: Request, res: Response) => {
  const { mailboxId, to, subject, body } = req.body;

  const mailbox = await Mailbox.findById(mailboxId);
  if (!mailbox) {
    return res.status(404).json({ message: "Mailbox not found" });
  }

  if (!mailbox.smtp) {
    return res.status(400).json({ message: "SMTP configuration not found for this mailbox" });
  }

  // Create DB record first (needed for tracking ID)
  const sentEmail = await InboxEmail.create({
    mailboxId,
    messageId: `${mailboxId}-${Date.now()}`,
    folder: "Sent",
    from: mailbox.email,
    to,
    subject,
    bodyHtml: body,
    date: new Date(),
    isRead: true,
  });

  const trackingPixel = `<img src="http://localhost:5000/api/track/open/${sentEmail._id}" width="1" height="1" style="display:none;" />`;


const transporter = nodemailer.createTransport({
  host: mailbox.smtp.host,
  port: mailbox.smtp.port,
  secure: false,
  auth: {
    user: mailbox.smtp.user,
    pass: mailbox.smtp.pass,
  },
  tls: { rejectUnauthorized: false },
} as SMTPTransport.Options);


  const info = await transporter.sendMail({
    from: mailbox.email,
    to,
    subject,
    html: body + trackingPixel,
  });

  // Update messageId from SMTP (if available)
  sentEmail.messageId = info.messageId || sentEmail.messageId;
  await sentEmail.save();

  res.json({ success: true });
};
