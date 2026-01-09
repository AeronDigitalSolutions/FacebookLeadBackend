import { Request, Response } from "express";
import axios from "axios";
import { getGoogleAuthUrl, googleOAuthClient } from "../utils/googleOAuth";
import GoogleAccount from "../models/GoogleAccount";

/* STEP 1: START OAUTH */
export const googleAuth = (req: Request, res: Response) => {
  const userId = req.user.id; // SAFE now
  const url = getGoogleAuthUrl(userId.toString());
  res.redirect(url);
};

/* STEP 2: CALLBACK */
export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query as {
      code: string;
      state: string;
    };

    const { tokens } = await googleOAuthClient.getToken(code);

    await GoogleAccount.findOneAndUpdate(
      { userId: state },
      {
        userId: state,
        accessToken: tokens.access_token!,
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

/* STEP 3: FETCH ACCOUNTS */
export const getGoogleAccounts = async (req: Request, res: Response) => {
  const account = await GoogleAccount.findOne({
    userId: req.user.id,
  });

  if (!account) return res.json([]);

  const response = await axios.get(
    "https://googleads.googleapis.com/v14/customers:listAccessibleCustomers",
    {
      headers: {
        Authorization: `Bearer ${account.accessToken}`,
        "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
      },
    }
  );

  res.json(
    response.data.resourceNames.map((r: string) =>
      r.replace("customers/", "")
    )
  );
};
