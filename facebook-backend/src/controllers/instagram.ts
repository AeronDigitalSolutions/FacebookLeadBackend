import { Request, Response } from "express";
import InstagramAccount from "../models/InstagramAccount";
import InstagramMessage from "../models/InstagramMessage";
import {
  exchangeCodeForToken,
  getPages,
  getInstagramAccount,
  sendInstagramMessage,
} from "../services/instagram";

/* 🔐 LOGIN */
export const instagramLogin = (_: Request, res: Response) => {
  const scopes = [
    "instagram_basic",
    "instagram_manage_messages",
    "pages_show_list",
    "pages_read_engagement",
    "business_management",
  ].join(",");

  const url =
    `https://www.facebook.com/v19.0/dialog/oauth` +
    `?client_id=${process.env.META_APP_ID}` +
    `&redirect_uri=${process.env.META_REDIRECT_URI}` +
    `&scope=${scopes}`;

  res.redirect(url);
};

/* 🔁 CALLBACK */
export const instagramCallback = async (
  req: Request,
  res: Response
) => {
  try {
    const accessToken = await exchangeCodeForToken(
      req.query.code as string
    );

    const pages = await getPages(accessToken);
    const page = pages[0];

    const igId = await getInstagramAccount(
      page.id,
      page.access_token
    );

    await InstagramAccount.create({
      pageId: page.id,
      pageAccessToken: page.access_token,
      instagramAccountId: igId,
    });

    res.redirect("/dashboard/instagram/accounts");
  } catch (err) {
    res.status(500).json({ error: "Instagram auth failed" });
  }
};

/* 📥 INBOX */
export const getInstagramInbox = async (
  req: Request,
  res: Response
) => {
  const messages = await InstagramMessage.find({
    instagramAccountId: req.params.igId,
  }).sort({ createdAt: -1 });

  res.json(messages);
};

/* ✉️ REPLY */
export const replyInstagramMessage = async (
  req: Request,
  res: Response
) => {
  const { instagramAccountId, recipientId, text } = req.body;

  const account = await InstagramAccount.findOne({
    instagramAccountId,
  });

  await sendInstagramMessage(
    instagramAccountId,
    recipientId,
    text,
    account!.pageAccessToken
  );

  await InstagramMessage.create({
    instagramAccountId,
    senderId: "business",
    message: text,
    direction: "outbound",
  });

  res.json({ success: true });
};
