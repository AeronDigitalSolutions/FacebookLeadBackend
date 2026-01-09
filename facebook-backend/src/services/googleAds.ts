import axios from "axios";
import { googleConfig } from "../config/google";

export const runGAQL = (token: string, customerId: string, query: string) =>
  axios.post(
    `https://googleads.googleapis.com/v14/customers/${customerId}/googleAds:search`,
    { query },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "developer-token": googleConfig.developerToken,
        "login-customer-id": customerId,
      },
    }
  );
