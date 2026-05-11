import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";

/**
 * CHAT INTELIGENTE COM FLUXO DE 7 ETAPAS
 * Design: Minimalismo Acolhedor
 * - Conversa humana e empática
 * - Respostas adaptadas a padrões emocionais
 */

interface Message {
  id: number;
  type: "user" | "app";
  text: string;
}

interface ChatApiResponse {
  reply: string;
  risk: boolean;
  endReached: boolean;
  showProfessionals: boolean;
}

export default function Chat() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const userName = user?.name || sessionStorage.getItem("espacoAmigoUserName")?.trim();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "app",
      text: userName
        ? `Oi, ${userName}… como você está hoje?`
        : "Prazer em te receber por aqui 🙂\nComo você está hoje?",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [riskDetected, setRiskDetected] = useState(false);
  const [endReached, setEndReached] = useState(false);
  const [showProfessionals, setShowProfessionals] = useState(false);
  const [continueAfterLimit, setContinueAfterLimit] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!user?.name) return;

    setMessages((prev) => {
      if (prev.length !== 1 || prev[0].type !== "app") return prev;
      if (!prev[0].text.startsWith("Prazer em te receber")) return prev;

      return [
        {
          ...prev[0],
          text: `Oi, ${user.name}… como você está hoje?`,
        },
      ];
    });
  }, [user]);

  const formatConversation = () => {
    const conversation = messages
      .map((msg) => {
        const author = msg.type === "user" ? "Usuário" : "Espaço Amigo";
        return `${author}: ${msg.text}`;
      })
      .join("\n\n");

    return `Espaço Amigo - Conversa\n\n${conversation}`;
  };

  const buildConversationMailto = () => {
    const body = [
      `Nome: ${userName || "Não informado"}`,
      `Email: ${user?.email || "Não informado"}`,
      `Data/hora: ${new Date().toLocaleString("pt-BR")}`,
      "",
      formatConversation(),
      "",
      "Conversa enviada a partir do Espaço Amigo.",
    ].join("\n");

    return `mailto:wpontes.pro@gmail.com?subject=${encodeURIComponent(
      "Conversa do Espaço Amigo",
    )}&body=${encodeURIComponent(body)}`;
  };

  const sendConversationToProfessional = () => {
    window.location.href = buildConversationMailto();
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const userText = userInput;
    setUserInput("");
    setIsLoading(true);

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      text: userText,
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName || "",
          message: userText,
          interactionCount: updatedMessages.filter((msg) => msg.type === "user").length,
          history: updatedMessages.map((msg) => ({
            role: msg.type === "user" ? "user" : "assistant",
            content: msg.text,
          })),
        }),
      });

      const data = (await response.json()) as ChatApiResponse;
      setRiskDetected(Boolean(data.risk));
      setEndReached(Boolean(data.endReached));
      setShowProfessionals(Boolean(data.showProfessionals));

      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, type: "app", text: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "app",
          text: "Não consegui responder agora. Tente novamente em instantes.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const showRiskButton = riskDetected;
  const showEndActions = !riskDetected && endReached;
  const showProfessionalsButton = !riskDetected && !endReached && showProfessionals;
  const shouldHideInput = showRiskButton || ((showEndActions || showProfessionalsButton) && !continueAfterLimit);

  return (
    <div className="mobile-screen min-h-screen flex flex-col bg-[#050a1c] text-white">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-white/10 bg-[#071027]/95 px-6 py-4">
        <button
          onClick={() => setLocation(user ? "/espaco" : "/")}
          className="rounded-xl p-2 text-white/78 transition-smooth hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Espaço Amigo
          </h2>
          <p className="text-xs text-white/55">um espaço seguro para conversar</p>
        </div>
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top,#172354_0%,#050a1c_45%,#040817_100%)] px-6 py-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            } animate-fade-in`}
          >
            <div
              className={`max-w-xs rounded-3xl border px-4 py-3 shadow-lg ${
                msg.type === "user"
                  ? "border-[#ffb3ce]/25 bg-gradient-to-br from-[#9f82ff] to-[#ff9c91] text-white"
                  : "border-white/10 bg-white/[0.08] text-white"
              }`}
              style={{
                backdropFilter: "blur(12px)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: "1.5",
                  fontSize: "15px",
                  whiteSpace: "pre-line",
                }}
              >
                {msg.text}
              </p>
            </div>
          </div>
        ))}

        {/* Indicador de digitação */}
        {isLoading && (
          <div className="flex justify-start">
            <div
              className="max-w-xs rounded-3xl border border-white/10 bg-white/[0.08] px-4 py-3"
              style={{
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="flex gap-2">
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: "#ffb3ce" }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: "#d7b8ff",
                    animationDelay: "0.1s",
                  }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: "#86cfff",
                    animationDelay: "0.2s",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Ações de proteção */}
        {showRiskButton && (
          <div className="flex justify-center mt-8 animate-fade-in">
            <Button
              onClick={sendConversationToProfessional}
              className="rounded-2xl bg-gradient-to-r from-[#9f82ff] to-[#ff9c91] px-6 py-3 font-semibold text-white transition-smooth"
            >
              <Mail className="mr-2 h-4 w-4" />
              Enviar conversa para um profissional
            </Button>
          </div>
        )}

        {/* Ações ao final do limite */}
        {showEndActions && (
          <div className="mt-8 space-y-3 rounded-3xl border border-white/10 bg-white/[0.06] p-4 animate-fade-in">
            <p className="text-center text-sm text-white/68">
              Você pode seguir conversando, mas também pode chamar ajuda humana quando fizer sentido.
            </p>
            <Button
              onClick={sendConversationToProfessional}
              className="w-full rounded-2xl bg-gradient-to-r from-[#9f82ff] to-[#ff9c91] py-3 font-semibold text-white transition-smooth"
            >
              Conversar com profissional
            </Button>
            <Button
              onClick={() => setContinueAfterLimit(true)}
              className="w-full rounded-2xl border border-white/10 bg-white px-5 py-3 font-semibold text-[#101735] transition-smooth hover:bg-white/90"
            >
              Continuar conversa
            </Button>
          </div>
        )}

        {/* Botão para ver profissionais */}
        {showProfessionalsButton && (
          <div className="flex justify-center mt-8 animate-fade-in">
            <Button
              onClick={sendConversationToProfessional}
              className="rounded-2xl bg-gradient-to-r from-[#9f82ff] to-[#ff9c91] px-8 py-3 font-semibold text-white transition-smooth"
            >
              <Mail className="mr-2 h-4 w-4" />
              Enviar conversa para um profissional
            </Button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Campo de entrada */}
      {!shouldHideInput && (
        <div className="border-t border-white/10 bg-[#071027]/95 px-6 py-6">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Escreva aqui..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
              className="flex-1 rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-white placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-[#d7b8ff]/50 transition-smooth disabled:opacity-50"
              style={{
                fontFamily: "'Inter', sans-serif",
              } as React.CSSProperties}
            />
            <button
              onClick={handleSendMessage}
              disabled={!userInput.trim() || isLoading}
              className="p-3 rounded-2xl transition-smooth disabled:opacity-50"
              style={{
                backgroundColor:
                  userInput.trim() && !isLoading
                    ? "#9f82ff"
                    : "rgba(255,255,255,0.12)",
              }}
            >
              <Send
                size={20}
                color={
                  userInput.trim() && !isLoading
                    ? "white"
                    : "rgba(255,255,255,0.42)"
                }
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
