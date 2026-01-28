import express from "express";
import {
  googleAuth,
  googleCallback,
  getGoogleAccounts,
} from "../controllers/googleAds";
import auth from "../middlewares/auth";

const router = express.Router();

/* 🔥 START OAUTH (JWT REQUIRED) */
router.get("/auth", auth, googleAuth);

/* 🔥 CALLBACK (NO JWT) */
router.get("/callback", googleCallback);

/* 🔐 FETCH ACCOUNTS */
router.get("/accounts", auth, getGoogleAccounts);

export default router;
