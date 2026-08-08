import { z } from "zod";
import { ExternalServiceError, fetchJson } from "../lib/http.js";

const tokenSchema = z.object({ access_token: z.string().min(1), expires_in: z.number().optional(), token_type: z.string().optional() }).passthrough();

export type GoogleCredentials = {
  clientId?: string | undefined;
  clientSecret?: string | undefined;
  refreshToken?: string | undefined;
};

export async function googleAccessToken(credentials: GoogleCredentials): Promise<string> {
  if (!credentials.clientId || !credentials.clientSecret || !credentials.refreshToken) {
    throw new ExternalServiceError("google_not_configured", "Google OAuth is not configured");
  }
  const body = new URLSearchParams({
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    refresh_token: credentials.refreshToken,
    grant_type: "refresh_token",
  });
  const response = await fetchJson("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body }, tokenSchema, "google_oauth");
  return response.access_token;
}
