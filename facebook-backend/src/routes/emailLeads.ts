import { Router } from "express";
import {
  createLeadGroupWithLeads,
  getAllEmailLeads,
  getAllEmailLeadGroups
} from "../controllers/emailLeads";

const router = Router();

router.post("/groups", createLeadGroupWithLeads);
router.get("/", getAllEmailLeads);
router.get("/groups", getAllEmailLeadGroups);

export default router;
