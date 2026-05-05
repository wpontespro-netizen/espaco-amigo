import { handleChatRequest } from "../server/chatApi.js";

interface ApiRequest {
  method?: string;
  body?: unknown;
}

interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: unknown): void;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await handleChatRequest(req.body || {});
    return res.status(200).json(result);
  } catch (error) {
    console.error("Chat serverless endpoint error:", error);
    return res.status(500).json({
      reply: "Não consegui responder agora. Tente novamente em instantes.",
      risk: false,
      endReached: false,
      showProfessionals: false,
    });
  }
}
