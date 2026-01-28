import { OAuth2Client } from "google-auth-library";

export const googleOAuthClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!
);

export const getGoogleAuthUrl = (userId: string) =>
  googleOAuthClient.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/adwords"],
    state: userId, // 🔥 REQUIRED
  });
if (
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.GOOGLE_REDIRECT_URI
) {
  throw new Error("❌ Google OAuth env vars missing");
}
