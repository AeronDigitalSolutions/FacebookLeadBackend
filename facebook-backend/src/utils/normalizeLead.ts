type LeadInput = {
  name?: string;
  phone?: string;
  email?: string;
  source: "form" | "whatsapp" | "messenger" | "instagram" | "website";
  adAccountId?: string;
  campaignId?: string;
  campaignName?: string;
  adSetId?: string;
  adId?: string;
  formId?: string;
  conversationId?: string;
  status?: "new" | "contacted" | "qualified" | "followup" | "converted" | "lost";
  assignedAgent?: string;
  messages?: {
    sender: "lead" | "agent";
    message: string;
    timestamp: Date;
  }[];
};

export const normalizeLead = (payload: any): LeadInput | null => {
  if (payload.object === "page") {
    // Lead Form
    return {
      source: "form" as const,
      name: payload.name as string | undefined,
      phone: payload.phone as string | undefined,
      email: payload.email as string | undefined,
      campaignId: payload.campaign_id as string | undefined,
      adId: payload.ad_id as string | undefined,
      formId: payload.form_id as string | undefined,
      status: "new" as const,
    };
  }

  if (payload.entry?.[0]?.changes?.[0]?.value?.messages) {
    // WhatsApp / Messenger
    const msg = payload.entry[0].changes[0].value.messages[0];

    return {
      source: "whatsapp" as const,
      phone: msg.from as string | undefined,
      conversationId: msg.id as string | undefined,
      status: "new" as const,
      messages: [
        {
          sender: "lead" as const,
          message: (msg.text?.body || "") as string,
          timestamp: new Date(),
        },
      ],
    };
  }

  return null;
};
