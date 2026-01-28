import { Router } from "express";
import {
  instagramLogin,
  instagramCallback,
  getInstagramInbox,
  replyInstagramMessage,
} from "../controllers/instagram";

import {
  verifyInstagramWebhook,
  handleInstagramWebhook,
} from "../webhooks/instagram";

const router = Router();

/* AUTH */
router.get("/auth/instagram", instagramLogin);
router.get("/auth/instagram/callback", instagramCallback);

/* WEBHOOK */
router.get("/webhooks/instagram", verifyInstagramWebhook);
router.post("/webhooks/instagram", handleInstagramWebhook);

/* INBOX */
router.get("/api/instagram/inbox/:igId", getInstagramInbox);
router.post("/api/instagram/reply", replyInstagramMessage);

export default router;
