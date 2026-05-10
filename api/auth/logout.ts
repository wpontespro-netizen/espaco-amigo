import { createLogoutCookie, serializeCookie } from "../../server/authApi.js";

interface ApiRequest {
  headers: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: unknown): void;
}

export default function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader("Set-Cookie", serializeCookie(createLogoutCookie(getRequestBaseUrl(req))));
  return res.status(200).json({ ok: true });
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
