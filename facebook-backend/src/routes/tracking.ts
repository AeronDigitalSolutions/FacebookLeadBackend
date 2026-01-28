import { Router } from "express";
import { trackEmailOpen } from "../controllers/tracking";

const router = Router();

router.get("/track/open/:emailId", trackEmailOpen);

export default router;
