import { createPsychologistApplication, listApprovedPsychologists } from "../server/psychologistApi.js";

interface ApiRequest {
  body?: unknown;
  method?: string;
}

interface ApiResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  try {
    if (req.method === "GET") {
      const psychologists = await listApprovedPsychologists();
      return res.status(200).json({ ok: true, psychologists });
    }

    if (req.method === "POST") {
      const result = await createPsychologistApplication(req.body);
      if (!result.ok) return res.status(400).json(result);
      return res.status(200).json({
        ok: true,
        message: "Recebemos seu cadastro. A equipe do Espaço Amigo vai avaliar suas informações com cuidado antes de liberar seu perfil para os usuários.",
      });
    }

    return res.status(405).json({ ok: false, error: "Método não permitido." });
  } catch (error) {
    console.error("Psychologists API error:", error);
    return res.status(500).json({ ok: false, error: "Não foi possível continuar agora." });
  }
}
