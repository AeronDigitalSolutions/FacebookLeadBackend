export const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  redirectUri: process.env.GOOGLE_REDIRECT_URI!,
  scope: ["https://www.googleapis.com/auth/adwords"],
};
