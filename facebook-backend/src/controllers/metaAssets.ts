import axios from "axios";
import { Request, Response } from "express";
import { getMetaToken } from "../utils/metaToken";

/* ---------------- PAGINATION HELPER ---------------- */
const fetchAllFromMeta = async (
  url: string,
  token: string,
  collected: any[] = []
): Promise<any[]> => {
  const response = await axios.get(url, {
    params: { access_token: token },
  });

  if (response.data?.data) {
    collected.push(...response.data.data);
  }

  if (response.data?.paging?.next) {
    return fetchAllFromMeta(response.data.paging.next, token, collected);
  }

  return collected;
};

/* ---------------- FACEBOOK PAGES (USER + BUSINESS) ---------------- */
export const getPages = async (req: Request, res: Response) => {
  const token = getMetaToken();
  if (!token) {
    return res.status(401).json({ message: "Meta not connected" });
  }

  try {
    console.log("➡ Fetching user pages...");
    const userPages = await fetchAllFromMeta(
      "https://graph.facebook.com/v19.0/me/accounts?fields=id,name",
      token
    );
    console.log("✅ User pages fetched:", userPages.length);

    console.log("➡ Fetching businesses...");
    const businesses = await fetchAllFromMeta(
      "https://graph.facebook.com/v19.0/me/businesses?fields=id,name",
      token
    );
    console.log("✅ Businesses fetched:", businesses.length);

    let businessPages: any[] = [];

    for (const business of businesses) {
      console.log(`➡ Fetching pages for business ${business.id}`);
      try {
        const ownedPages = await fetchAllFromMeta(
          `https://graph.facebook.com/v19.0/${business.id}/owned_pages?fields=id,name`,
          token
        );

        const clientPages = await fetchAllFromMeta(
          `https://graph.facebook.com/v19.0/${business.id}/client_pages?fields=id,name`,
          token
        );

        console.log(
          `✅ Business ${business.id}:`,
          ownedPages.length,
          "owned,",
          clientPages.length,
          "client"
        );

        businessPages.push(...ownedPages, ...clientPages);
      } catch (bizErr: any) {
        console.error(
          `❌ Failed fetching pages for business ${business.id}`,
          bizErr?.response?.data || bizErr.message
        );
      }
    }

    const pagesMap = new Map<string, any>();
    [...userPages, ...businessPages].forEach((page) => {
      pagesMap.set(page.id, page);
    });

    console.log("✅ Total unique pages:", pagesMap.size);

    res.json(Array.from(pagesMap.values()));
  } catch (error: any) {
    console.error("🔥 FINAL ERROR:", error?.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch pages" });
  }
};
/* ---------------- AD ACCOUNTS ---------------- */
export const getAdAccounts = async (req: Request, res: Response) => {
  const token = getMetaToken();
  if (!token) {
    return res.status(401).json({ message: "Meta not connected" });
  }

  try {
    const adAccounts = await fetchAllFromMeta(
      "https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name,account_status",
      token
    );

    res.json(adAccounts);
  } catch (error) {
    console.error("AD ACCOUNTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch ad accounts" });
  }
};
