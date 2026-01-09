import axios from "axios";
import Campaign from "../models/Campaign";

export const fetchMetaCampaigns = async (
  adAccountId: string,
  accessToken: string
) => {
  const url = `https://graph.facebook.com/v19.0/act_${adAccountId}/campaigns`;

  const response = await axios.get(url, {
    params: {
      access_token: accessToken,
      fields: "id,name,status,objective",
      limit: 100,
    },
  });

  for (const c of response.data.data) {
    await Campaign.updateOne(
      {
        metaCampaignId: c.id,
        adAccountId,
      },
      {
        metaCampaignId: c.id,
        adAccountId,
        name: c.name,
        status: c.status,
        objective: c.objective,
        platform: "Meta",
      },
      { upsert: true }
    );
  }

  return response.data.data;
};
