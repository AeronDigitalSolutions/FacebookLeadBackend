import axios from "axios";

export const exchangeCodeForToken = async (code: string) => {
  const res = await axios.get(
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
  return res.data.access_token;
};

export const getPages = async (accessToken: string) => {
  const res = await axios.get(
    "https://graph.facebook.com/v19.0/me/accounts",
    { params: { access_token: accessToken } }
  );
  return res.data.data;
};

export const getInstagramAccount = async (
  pageId: string,
  pageAccessToken: string
) => {
  const res = await axios.get(
    `https://graph.facebook.com/v19.0/${pageId}`,
    {
      params: {
        fields: "instagram_business_account,username",
        access_token: pageAccessToken,
      },
    }
  );
  return res.data.instagram_business_account.id;
};

export const sendInstagramMessage = async (
  igId: string,
  recipientId: string,
  text: string,
  token: string
) => {
  return axios.post(
    `https://graph.facebook.com/v19.0/${igId}/messages`,
    {
      recipient: { id: recipientId },
      message: { text },
    },
    { params: { access_token: token } }
  );
};
