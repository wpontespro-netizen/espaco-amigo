import { completeGoogleAuth, serializeCookie } from "../../../server/authApi.js";

interface ApiRequest {
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
  setHeader(name: string, value: string | string[]): void;
  redirect(url: string): void;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  try {
    const result = await completeGoogleAuth({
      baseUrl: getRequestBaseUrl(req),
      code: firstQuery(req.query.code),
      cookieHeader: firstHeader(req.headers.cookie),
      state: firstQuery(req.query.state),
    });

    res.setHeader("Set-Cookie", result.cookies.map(serializeCookie));
    return res.redirect("/espaco");
  } catch (error) {
    console.error("Google auth callback serverless error:", error);
    return res.redirect("/?login=erro");
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

function firstQuery(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
