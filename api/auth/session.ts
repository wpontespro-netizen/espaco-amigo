import { getSessionUser } from "../../server/authApi.js";

interface ApiRequest {
  headers: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
}

export default function handler(req: ApiRequest, res: ApiResponse) {
  return res.status(200).json({ user: getSessionUser(firstHeader(req.headers.cookie)) });
}

function firstHeader(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
