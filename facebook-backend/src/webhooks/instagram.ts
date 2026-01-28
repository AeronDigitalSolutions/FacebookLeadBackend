import { Request, Response } from "express";

export const verifyInstagramWebhook = (
  req: Request,
  res: Response
) => {
  console.log("✅ Instagram webhook verification hit");
  console.log(req.query);

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === process.env.META_WEBHOOK_VERIFY_TOKEN
  ) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
};

export const handleInstagramWebhook = (
  req: Request,
  res: Response
) => {
  console.log("📩 Instagram webhook event received");
  console.log(JSON.stringify(req.body, null, 2));

  return res.sendStatus(200);
};
