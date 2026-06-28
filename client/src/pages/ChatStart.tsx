import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Send } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

/**
 * TELA 2: INÍCIO DA CONVERSA
 * Design: Minimalismo Acolhedor
 * - Primeiro contato leve
 * - Campo de texto para o nome do usuário
 * - Botão de envio suave
 */
export default function ChatStart() {
  const [, setLocation] = useLocation();
  const { isLoading, user } = useAuth();
  const [name, setName] = useState("");

  useEffect(() => {
    if (!isLoading && user) {
      sessionStorage.removeItem("espacoAmigoUserName");
      setLocation("/chat");
    }
  }, [isLoading, setLocation, user]);

  const handleSend = () => {
    const trimmedName = name.trim();

    if (trimmedName) {
      sessionStorage.setItem("espacoAmigoUserName", trimmedName);
      setLocation("/chat");
    }
  };

  return (
    <div className="mobile-screen min-h-screen flex flex-col text-white">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-white/10 bg-[#071027]/80 px-6 py-4 backdrop-blur">
        <button
          onClick={() => setLocation("/")}
          className="rounded-xl p-2 text-white/78 transition-smooth hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">Espaço Amigo</h2>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        {/* Mensagem inicial do app */}
        <div className="ea-panel mb-8 max-w-sm p-5">
          <p className="text-base leading-7 text-white/86">
            {isLoading
              ? "Só um instante..."
              : "Oi… que bom que você está aqui"}
            {!isLoading && (
              <>
                <br />
                Antes de tudo, como posso te chamar?
              </>
            )}
          </p>
        </div>
      </div>

      {/* Campo de entrada e botão */}
      <div className="border-t border-white/10 bg-[#071027]/80 px-6 py-6 backdrop-blur">
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
            disabled={isLoading}
            className="ea-input flex-1"
          />
          <button
            onClick={handleSend}
            disabled={!name.trim() || isLoading}
            className="ea-button p-3 disabled:opacity-50"
          >
            <Send
              size={20}
              color={name.trim() ? "white" : "rgba(255,255,255,0.5)"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
