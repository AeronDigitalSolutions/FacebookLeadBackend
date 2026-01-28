import { Request, Response } from "express";
import InboxEmail from "../models/inboxEmail";

export const trackEmailOpen = async (req: Request, res: Response) => {
  const { emailId } = req.params;

  await InboxEmail.findByIdAndUpdate(emailId, {
    isOpened: true,
    openedAt: new Date(),
  });

  // 1x1 transparent gif
  const pixel = Buffer.from(
    "R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
    "base64"
  );

  res.set("Content-Type", "image/gif");
  res.send(pixel);
};
