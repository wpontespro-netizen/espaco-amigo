import { createGoogleAuthStart, serializeCookie } from "../../../server/authApi.js";

interface ApiRequest {
  headers: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
  setHeader(name: string, value: string | string[]): void;
  status(code: number): ApiResponse;
  send(body: string): void;
  redirect(url: string): void;
}

export default function handler(req: ApiRequest, res: ApiResponse) {
  try {
    const result = createGoogleAuthStart(getRequestBaseUrl(req));
    res.setHeader("Set-Cookie", result.cookies.map(serializeCookie));
    return res.redirect(result.redirectUrl);
  } catch (error) {
    console.error("Google auth start serverless error:", error);
    return res.status(500).send("Login com Google não está configurado.");
  }
}

function getRequestBaseUrl(req: ApiRequest) {
  const configuredUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || process.env.AUTH_URL;
  if (configuredUrl) return configuredUrl.replace(/\/+$/, "");

  const proto = firstHeader(req.headers["x-forwarded-proto"]) || "https";
  const host = firstHeader(req.headers["x-forwarded-host"]) || firstHeader(req.headers.host) || "";
  return `${proto}://${host}`;
}

function firstHeader(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
