import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

/**
 * TELA 2: INÍCIO DA CONVERSA
 * Design: Minimalismo Acolhedor
 * - Primeiro contato leve
 * - Campo de texto para o nome do usuário
 * - Botão de envio suave
 */
export default function ChatStart() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");

  const handleSend = () => {
    const trimmedName = name.trim();

    if (trimmedName) {
      sessionStorage.setItem("espacoAmigoUserName", trimmedName);
      setLocation("/chat");
    }
  };

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
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        {/* Mensagem inicial do app */}
        <div
          className="mb-8 p-4 rounded-3xl max-w-sm"
          style={{
            backgroundColor: "oklch(0.97 0.01 65)",
          }}
        >
          <p
            style={{
              color: "oklch(0.3 0.02 65)",
              fontFamily: "'Inter', sans-serif",
              lineHeight: "1.6",
              fontSize: "16px",
            }}
          >
            Oi… que bom que você está aqui
            <br />
            Antes de tudo, como posso te chamar?
          </p>
        </div>
      </div>

      {/* Campo de entrada e botão */}
      <div className="px-6 py-6 border-t border-gray-100 bg-white">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Seu nome..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 transition-smooth"
            style={{
              borderColor: "oklch(0.92 0.01 65)",
              color: "oklch(0.3 0.02 65)",
              fontFamily: "'Inter', sans-serif",
            } as React.CSSProperties}
          />
          <button
            onClick={handleSend}
            disabled={!name.trim()}
            className="p-3 rounded-2xl transition-smooth disabled:opacity-50"
            style={{
              backgroundColor: name.trim()
                ? "oklch(0.6 0.15 240)"
                : "oklch(0.92 0.01 65)",
            }}
          >
            <Send
              size={20}
              color={name.trim() ? "white" : "oklch(0.55 0.02 65)"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
