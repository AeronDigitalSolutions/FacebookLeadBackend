import express from "express";
import {
  getLeads,
  getLeadById,
  updateLeadStatus,
} from "../controllers/lead";

const router = express.Router();

router.get("/", getLeads);
router.get("/:id", getLeadById);
router.patch("/:id", updateLeadStatus);

export default router;
