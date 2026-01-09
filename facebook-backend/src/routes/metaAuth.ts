import express from "express";
import { metaLogin, metaCallback } from "../controllers/metaAuth";

const router = express.Router();

router.get("/auth/meta/login", metaLogin);
router.get("/auth/meta/callback", metaCallback);

export default router;
