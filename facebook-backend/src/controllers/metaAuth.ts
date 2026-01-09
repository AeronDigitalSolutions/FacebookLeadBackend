import { Request, Response } from "express";
import axios from "axios";
import { setMetaToken } from "../utils/metaToken";

const FRONTEND_URL = "http://localhost:5173";

export const metaLogin = (req: Request, res: Response) => {
  const redirectUri = process.env.META_REDIRECT_URI!;
  const clientId = process.env.META_APP_ID!;

  const scope = [
    "pages_show_list",
    "pages_read_engagement",
    "leads_retrieval",
    "business_management",
    "ads_management",
    "instagram_basic",
  ].join(",");

  const state = "leadflow_meta_auth";

  const authUrl =
    `https://www.facebook.com/v19.0/dialog/oauth` +
    `?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${scope}` +
    `&response_type=code` +
    `&state=${state}`;

  res.redirect(authUrl);
};

export const metaCallback = async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(
      `${FRONTEND_URL}/dashboard/integrations/meta/error`
    );
  }

  try {
    /* 1️⃣ Exchange code → short-lived token */
    const tokenRes = await axios.get(
      "https://graph.facebook.com/v19.0/oauth/access_token",
      {
        params: {
          client_id: process.env.META_APP_ID,
          client_secret: process.env.META_APP_SECRET,
          redirect_uri: process.env.META_REDIRECT_URI,
          code,
        },
      }
    );

    const { access_token } = tokenRes.data;

    /* 2️⃣ Convert to long-lived token */
    const longTokenRes = await axios.get(
      "https://graph.facebook.com/v19.0/oauth/access_token",
      {
        params: {
          grant_type: "fb_exchange_token",
          client_id: process.env.META_APP_ID,
          client_secret: process.env.META_APP_SECRET,
          fb_exchange_token: access_token,
        },
      }
    );

    const longLivedToken = longTokenRes.data.access_token;

    /* 3️⃣ Store token server-side (MVP memory storage) */
    setMetaToken(longLivedToken);

    /* 🔥 4️⃣ SEND TOKEN TO FRONTEND (CRITICAL FIX) */
    res.redirect(
      `${FRONTEND_URL}/dashboard/integrations/meta/processing?token=${longLivedToken}`
    );
  } catch (error) {
    console.error("META CALLBACK ERROR:", error);

    res.redirect(
      `${FRONTEND_URL}/dashboard/integrations/meta/error`
    );
  }
};
