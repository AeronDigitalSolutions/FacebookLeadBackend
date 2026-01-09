import express from "express";
import { metaWebhook } from "../controllers/metaWebhook";

const router = express.Router();

router.post("/webhook/meta", metaWebhook);

export default router;
