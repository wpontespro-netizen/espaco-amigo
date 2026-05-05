import fs from "node:fs";
import path from "node:path";

export type ChatRole = "user" | "assistant";

export interface ChatHistoryMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequestBody {
  history?: ChatHistoryMessage[];
  name?: string;
  message?: string;
  interactionCount?: number;
}

export interface ChatApiResponse {
  reply: string;
  risk: boolean;
  endReached: boolean;
  showProfessionals: boolean;
}

const SYSTEM_PROMPT = `Você é o Espaço Amigo, um espaço digital de acolhimento inicial. Sua função é conversar de forma leve, humana e segura, ajudando a pessoa a perceber melhor o que está sentindo.

Você não é psicólogo, não faz terapia, não faz diagnóstico e não substitui profissional de saúde mental.

Sempre use o histórico da conversa. Não responda apenas à última mensagem.

Estilo das respostas:

- seja breve: 1 ou 2 parágrafos curtos;
- fale como uma conversa real, sem soar técnico;
- não comece todas as respostas com "Oi, [nome]";
- use o nome apenas de vez em quando, de forma natural;
- organize o que a pessoa disse usando palavras dela;
- termine com uma pergunta curta, exceto em risco ou síntese final;
- varie a linguagem para evitar repetição.

Prefira frases naturais, como:
"entendi... então esse medo aparece mais no corpo, com tremor nas pernas."
"parece que isso vem mais forte quando você fica parado."
"soa como uma sensação de perigo chegando de repente."

Evite linguagem explicativa ou artificial, como:
"pra eu te ajudar a entender"
"pra organizar melhor"
"ao longo da conversa"
"pelo que você contou ao longo da conversa"

Não dê conselhos diretos, listas de próximos passos ou instruções do que fazer. Mantenha o foco em acolher, refletir e perguntar.

Não use termos clínicos. Não diga "você tem ansiedade", "você está deprimido" ou qualquer diagnóstico.

Use com cuidado frases como "parece que", "soa como", "talvez esteja relacionado a" e "pelo que você trouxe". Evite "isso é", "você tem" e "isso acontece porque".

Se detectar risco de autoagressão ou suicídio, interrompa o fluxo normal, acolha brevemente e oriente buscar um profissional imediatamente. Não aprofunde a conversa nesses casos.

Após 10 interações, gere uma síntese leve, curta e sem plano de ação. Não dê recomendações clínicas. Você pode terminar com uma pergunta simples como "isso bate com o que você está sentindo?".`;

const RISK_TERMS = [
  "suicidio",
  "suicídio",
  "não quero mais viver",
  "nao quero mais viver",
  "quero sumir",
  "me machucar",
  "me ferir",
  "autoagressão",
  "autoagressao",
  "acabar com tudo",
  "tirar minha vida",
  "tirar a minha vida",
];

const FALLBACK_REPLY =
  "Desculpa, não consegui responder com calma agora. Pelo que você trouxe, parece importante continuar falando sobre isso com alguém de confiança ou um profissional. Você consegue me contar, em poucas palavras, o que mais está pesando neste momento?";

let envLoaded = false;

export function loadLocalEnv(projectRoot = process.cwd()) {
  if (envLoaded) return;
  envLoaded = true;

  for (const fileName of [".env.local", ".env"]) {
    const envPath = path.resolve(projectRoot, fileName);
    if (!fs.existsSync(envPath)) continue;

    const lines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

      const [key, ...valueParts] = trimmed.split("=");
      const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

export async function handleChatRequest(body: ChatRequestBody): Promise<ChatApiResponse> {
  const message = String(body.message || "").trim();
  const name = String(body.name || "").trim();
  const interactionCount = Number(body.interactionCount || 0);
  const history = normalizeHistory(body.history);

  if (!message) {
    return {
      reply: "Pode escrever do seu jeito. Estou aqui para te ouvir.",
      risk: false,
      endReached: false,
      showProfessionals: false,
    };
  }

  if (containsRisk(message)) {
    return getRiskResponse();
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      reply: "A integração com a OpenAI ainda não está configurada. Defina OPENAI_API_KEY no arquivo .env do backend para ativar o chat inteligente.",
      risk: false,
      endReached: false,
      showProfessionals: false,
    };
  }

  const endReached = interactionCount >= 10;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.4-nano",
        input: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: buildContextPrompt({ history, name, message, interactionCount, endReached }),
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "espaco_amigo_chat_response",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                reply: { type: "string" },
                risk: { type: "boolean" },
                endReached: { type: "boolean" },
                showProfessionals: { type: "boolean" },
              },
              required: ["reply", "risk", "endReached", "showProfessionals"],
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("OpenAI API error:", response.status, detail);
      return {
        reply: FALLBACK_REPLY,
        risk: false,
        endReached: false,
        showProfessionals: false,
      };
    }

    const data = await response.json();
    const parsed = parseStructuredResponse(data);

    return {
      reply: parsed.reply || FALLBACK_REPLY,
      risk: parsed.risk,
      endReached: endReached || parsed.endReached,
      showProfessionals: endReached || parsed.showProfessionals || parsed.risk,
    };
  } catch (error) {
    console.error("OpenAI request failed:", error);
    return {
      reply: FALLBACK_REPLY,
      risk: false,
      endReached: false,
      showProfessionals: false,
    };
  }
}

function normalizeHistory(history: ChatRequestBody["history"]): ChatHistoryMessage[] {
  if (!Array.isArray(history)) return [];

  return history
    .filter((item): item is ChatHistoryMessage => {
      return (
        item &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string" &&
        item.content.trim().length > 0
      );
    })
    .slice(-24);
}

function containsRisk(text: string) {
  const lowerText = text.toLowerCase();
  return RISK_TERMS.some((term) => lowerText.includes(term));
}

function getRiskResponse(): ChatApiResponse {
  return {
    reply:
      "Sinto muito que isso esteja tão pesado agora. Você não precisa lidar com isso sozinho. Procure ajuda profissional imediatamente e, se houver risco agora, acione um serviço de emergência da sua região ou fale com alguém de confiança perto de você.",
    risk: true,
    endReached: true,
    showProfessionals: true,
  };
}

function buildContextPrompt({
  history,
  name,
  message,
  interactionCount,
  endReached,
}: {
  history: ChatHistoryMessage[];
  name: string;
  message: string;
  interactionCount: number;
  endReached: boolean;
}) {
  return JSON.stringify(
    {
      pessoa: { nome: name || null },
      contadorDeInteracoes: interactionCount,
      mensagemAtual: message,
      historicoCompleto: history,
      instrucoesDeFluxo: endReached
        ? "Esta é a décima interação ou mais. Gere uma síntese final leve, curta e sem diagnóstico. Não dê plano de ação nem recomendações clínicas. Pode terminar com uma pergunta simples de confirmação."
        : "Responda normalmente e termine com uma pergunta cuidadosa. Não deixe a conversa morrer.",
      formatoObrigatorio:
        "Responda apenas no JSON definido. Use risk=true apenas se houver risco de autoagressão ou suicídio. Use endReached=true ao gerar síntese final. Use showProfessionals=true em risco ou síntese final.",
    },
    null,
    2
  );
}

function parseStructuredResponse(data: any): ChatApiResponse {
  const outputText = typeof data.output_text === "string" ? data.output_text : findOutputText(data);

  try {
    const parsed = JSON.parse(outputText || "{}");
    return {
      reply: typeof parsed.reply === "string" ? parsed.reply : FALLBACK_REPLY,
      risk: Boolean(parsed.risk),
      endReached: Boolean(parsed.endReached),
      showProfessionals: Boolean(parsed.showProfessionals),
    };
  } catch {
    return {
      reply: outputText || FALLBACK_REPLY,
      risk: false,
      endReached: false,
      showProfessionals: false,
    };
  }
}

function findOutputText(value: any): string {
  if (!value) return "";
  if (typeof value === "string") return "";
  if (Array.isArray(value)) {
    return value.map(findOutputText).find(Boolean) || "";
  }
  if (typeof value === "object") {
    if (value.type === "output_text" && typeof value.text === "string") return value.text;
    for (const nested of Object.values(value)) {
      const found = findOutputText(nested);
      if (found) return found;
    }
  }
  return "";
}
