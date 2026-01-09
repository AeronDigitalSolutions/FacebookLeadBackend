import express from "express";
import {
  getMetaCampaigns,
  syncMetaCampaigns,
} from "../controllers/campaign";

const router = express.Router();

// 🔥 THESE ROUTES MUST EXIST
router.get("/meta/:adAccountId", getMetaCampaigns);
router.get("/meta/sync/:adAccountId", syncMetaCampaigns);

export default router;
