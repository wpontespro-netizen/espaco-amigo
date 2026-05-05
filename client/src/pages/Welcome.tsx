import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useLocation } from "wouter";

/**
 * TELA 1: ENTRADA (ACOLHIMENTO)
 * Design: Minimalismo Acolhedor
 * - Muito espaço em branco
 * - Tipografia humanizada (Poppins para título)
 * - Ícone suave (coração)
 * - Três pilares de segurança
 */
export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <div className="mobile-screen min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-white">
      {/* Ícone suave no topo */}
      <div className="mb-8 animate-fade-in">
        <Heart
          size={48}
          className="text-blue-400 fill-blue-200"
          style={{ color: "oklch(0.6 0.15 240)" }}
        />
      </div>

      {/* Título principal */}
      <h1
        className="text-4xl font-bold text-center mb-4 transition-smooth"
        style={{
          fontFamily: "'Poppins', sans-serif",
          color: "oklch(0.3 0.02 65)",
        }}
      >
        Espaço Amigo
      </h1>

      {/* Subtítulo acolhedor */}
      <p
        className="text-lg text-center mb-12 max-w-sm transition-smooth"
        style={{
          color: "oklch(0.55 0.02 65)",
          fontFamily: "'Inter', sans-serif",
          lineHeight: "1.6",
        }}
      >
        Um lugar seguro para você falar e entender o que está sentindo.
      </p>

      {/* Três pilares de segurança */}
      <div className="w-full max-w-sm space-y-4 mb-12">
        {[
          { icon: "🛡️", text: "Sem julgamento" },
          { icon: "🔒", text: "Tudo é confidencial" },
          { icon: "⏱️", text: "No seu tempo" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-4 rounded-2xl transition-smooth"
            style={{
              backgroundColor: "oklch(0.97 0.01 65)",
            }}
          >
            <span className="text-2xl">{item.icon}</span>
            <span
              style={{
                color: "oklch(0.3 0.02 65)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* Botão de ação */}
      <Button
        onClick={() => setLocation("/chat-start")}
        className="w-full max-w-sm py-6 text-lg font-semibold rounded-2xl transition-smooth hover:shadow-lg"
        style={{
          backgroundColor: "oklch(0.6 0.15 240)",
          color: "white",
        }}
      >
        Começar
      </Button>

      {/* Espaço respirável no final */}
      <div className="flex-1" />
    </div>
  );
}
