import { Request, Response } from "express";
import axios from "axios";
import { getGoogleAuthUrl, googleOAuthClient } from "../utils/googleOAuth";
import GoogleAccount from "../models/GoogleAccount";

/* =========================
   STEP 1: START OAUTH
========================= */
export const googleAuth = (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        error: "Unauthorized: user not found",
      });
    }

    const userId = req.user.userId.toString();
    const url = getGoogleAuthUrl(userId);

    res.redirect(url);
  } catch (err) {
    console.error("Google auth start error:", err);
    return res.status(500).json({
      error: "Failed to start Google OAuth",
    });
  }
};

/* =========================
   STEP 2: CALLBACK
========================= */
export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query as {
      code?: string;
      state?: string;
    };

    if (!code || !state) {
      console.error("Missing code or state in Google callback");
      return res.redirect(
        `${process.env.FRONTEND_URL}/dashboard/google/error`
      );
    }

    const { tokens } = await googleOAuthClient.getToken(code);

    if (!tokens.access_token) {
      throw new Error("No access token received from Google");
    }

    await GoogleAccount.findOneAndUpdate(
      { userId: state },
      {
        userId: state,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: tokens.expiry_date
          ? new Date(tokens.expiry_date)
          : null,
      },
      { upsert: true, new: true }
    );

    res.redirect(
      `${process.env.FRONTEND_URL}/dashboard/google/success`
    );
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    res.redirect(
      `${process.env.FRONTEND_URL}/dashboard/google/error`
    );
  }
};

/* =========================
   STEP 3: FETCH ACCOUNTS
========================= */
export const getGoogleAccounts = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const account = await GoogleAccount.findOne({
      userId: req.user.userId,
    });

    if (!account || !account.accessToken) {
      return res.json([]);
    }

    const response = await axios.get(
      "https://googleads.googleapis.com/v14/customers:listAccessibleCustomers",
      {
        headers: {
          Authorization: `Bearer ${account.accessToken}`,
          "developer-token":
            process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
        },
      }
    );

    const customers =
      response.data?.resourceNames?.map((r: string) =>
        r.replace("customers/", "")
      ) || [];

    res.json(customers);
  } catch (err) {
    console.error("Fetch Google accounts error:", err);
    res.status(500).json({
      error: "Failed to fetch Google Ads accounts",
    });
  }
};
