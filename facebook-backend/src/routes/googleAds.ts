import express from "express";
import {
  googleAuth,
  googleCallback,
  getGoogleAccounts,
} from "../controllers/googleAds";
import auth from "../middlewares/auth";

const router = express.Router();

/**
 * STEP 1: Start Google OAuth
 * 🔐 AUTH REQUIRED (we need userId for state)
 */
router.get("/auth", auth, googleAuth);

/**
 * STEP 2: Google OAuth Callback
 * 🌍 PUBLIC (Google redirects here)
 */
router.get("/callback", googleCallback);

/**
 * STEP 3: Protected Google API
 */
router.get("/accounts", auth, getGoogleAccounts);

export default router;
