import { Router } from "express";
import {
  testMailbox,
  createMailbox,
  getMailboxes,
  toggleWarmup,
  deleteMailbox,
} from "../controllers/mailbox";

const router = Router();

router.post("/mailboxes/test", testMailbox);
router.post("/mailboxes", createMailbox);
router.get("/mailboxes", getMailboxes);
router.patch("/mailboxes/:id/warmup", toggleWarmup);
router.delete("/mailboxes/:id", deleteMailbox);

export default router;
