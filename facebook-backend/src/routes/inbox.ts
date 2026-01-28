import { Router } from "express";
import {
  syncFolder,
  getFolderEmails,
  getEmailById,
  replyToEmail,
  sendNewEmail,
} from "../controllers/inbox";

const router = Router();

router.post("/inbox/:mailboxId/:folder/sync", syncFolder);
router.get("/inbox/:mailboxId/:folder", getFolderEmails);

router.get("/email/:emailId", getEmailById);
router.post("/email/:emailId/reply", replyToEmail);
router.post("/email/send", sendNewEmail);

export default router;
