import { serializeCookie, updateUserProfile } from "../../server/authApi.js";

interface ApiRequest {
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  method?: string;
}

interface ApiResponse {
  setHeader(name: string, value: string | string[]): void;
  status(code: number): ApiResponse;
  json(body: unknown): void;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Método não permitido." });

  try {
    const result = await updateUserProfile(getRequestBaseUrl(req), req.body, firstHeader(req.headers.cookie));
    if (!result.ok) return res.status(400).json(result);
    const cookies = (result as { cookies: Parameters<typeof serializeCookie>[0][] }).cookies;
    res.setHeader("Set-Cookie", cookies.map(serializeCookie));
    return res.status(200).json({ ok: true, user: result.user });
  } catch (error) {
    console.error("Update profile serverless error:", error);
    return res.status(500).json({ ok: false, error: "Não foi possível salvar seu perfil agora." });
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
