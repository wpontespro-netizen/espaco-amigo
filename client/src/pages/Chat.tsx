import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Copy, Send } from "lucide-react";
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
  const [copyLabel, setCopyLabel] = useState("Copiar conversa");
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

  useEffect(() => {
    if (copyLabel === "Copiar conversa") return;

    const timeoutId = window.setTimeout(() => {
      setCopyLabel("Copiar conversa");
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [copyLabel]);

  const formatConversation = () => {
    const conversation = messages
      .map((msg) => {
        const author = msg.type === "user" ? "Usuário" : "Espaço Amigo";
        return `${author}: ${msg.text}`;
      })
      .join("\n\n");

    return `Espaço Amigo - Conversa\n\n${conversation}`;
  };

  const handleCopyConversation = async () => {
    try {
      await navigator.clipboard.writeText(formatConversation());
      setCopyLabel("Copiado");
    } catch {
      setCopyLabel("Não foi possível copiar");
    }
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
  const shouldHideInput = showRiskButton || showEndActions || showProfessionalsButton;

  return (
    <div className="mobile-screen min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
        <button
          onClick={() => setLocation("/")}
          className="p-2 hover:bg-gray-50 rounded-lg transition-smooth"
        >
          <ArrowLeft size={24} style={{ color: "oklch(0.3 0.02 65)" }} />
        </button>
        <h2
          className="text-xl font-bold"
          style={{
            fontFamily: "'Poppins', sans-serif",
            color: "oklch(0.3 0.02 65)",
          }}
        >
          Espaço Amigo
        </h2>
        <button
          onClick={handleCopyConversation}
          className="ml-auto flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-smooth hover:bg-gray-50"
          style={{
            color: "oklch(0.3 0.02 65)",
            fontFamily: "'Inter', sans-serif",
          }}
          type="button"
        >
          <Copy size={16} />
          {copyLabel}
        </button>
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            } animate-fade-in`}
          >
            <div
              className="max-w-xs px-4 py-3 rounded-3xl"
              style={{
                backgroundColor:
                  msg.type === "user"
                    ? "oklch(0.92 0.05 240)"
                    : "oklch(0.97 0.01 65)",
                color: "oklch(0.3 0.02 65)",
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
              className="max-w-xs px-4 py-3 rounded-3xl"
              style={{
                backgroundColor: "oklch(0.97 0.01 65)",
              }}
            >
              <div className="flex gap-2">
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: "oklch(0.3 0.02 65)" }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: "oklch(0.3 0.02 65)",
                    animationDelay: "0.1s",
                  }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: "oklch(0.3 0.02 65)",
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
              onClick={() => setLocation("/professionals")}
              className="px-6 py-3 rounded-2xl font-semibold transition-smooth"
              style={{
                backgroundColor: "oklch(0.6 0.15 240)",
                color: "white",
              }}
            >
              Falar com um psicólogo agora
            </Button>
          </div>
        )}

        {/* Ações ao final do limite */}
        {showEndActions && (
          <div className="space-y-3 mt-8 animate-fade-in">
            <Button
              onClick={() => setLocation("/professionals")}
              className="w-full py-3 rounded-2xl font-semibold transition-smooth"
              style={{
                backgroundColor: "oklch(0.75 0.08 160)",
                color: "white",
              }}
            >
              Ver profissionais
            </Button>
            <Button
              onClick={() => setLocation("/continuity")}
              className="w-full py-3 rounded-2xl font-semibold transition-smooth"
              style={{
                backgroundColor: "oklch(0.85 0.13 85)",
                color: "oklch(0.3 0.02 65)",
              }}
            >
              Continuar conversa
            </Button>
          </div>
        )}

        {/* Botão para ver profissionais */}
        {showProfessionalsButton && (
          <div className="flex justify-center mt-8 animate-fade-in">
            <Button
              onClick={() => setLocation("/professionals")}
              className="px-8 py-3 rounded-2xl font-semibold transition-smooth"
              style={{
                backgroundColor: "oklch(0.6 0.15 240)",
                color: "white",
              }}
            >
              Ver profissionais
            </Button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Campo de entrada */}
      {!shouldHideInput && (
        <div className="px-6 py-6 border-t border-gray-100 bg-white">
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
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 transition-smooth disabled:opacity-50"
              style={{
                borderColor: "oklch(0.92 0.01 65)",
                color: "oklch(0.3 0.02 65)",
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
                    ? "oklch(0.6 0.15 240)"
                    : "oklch(0.92 0.01 65)",
              }}
            >
              <Send
                size={20}
                color={
                  userInput.trim() && !isLoading
                    ? "white"
                    : "oklch(0.55 0.02 65)"
                }
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
