import { Router } from "express";
import { verifyEmailController } from "../controllers/emailVerifier";

const router = Router();

router.post("/verify-email", verifyEmailController);

export default router;
