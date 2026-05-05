import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

/**
 * TELA 5: CONTINUIDADE (FREEMIUM)
 * Design: Minimalismo Acolhedor
 * - Duas opções claras
 * - Mensagem de acolhimento
 * - Flexibilidade para o usuário
 */
export default function Continuity() {
  const [, setLocation] = useLocation();

  const handleContinue = () => {
    setLocation("/referral");
  };

  const handleStop = () => {
    setLocation("/");
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
        {/* Título */}
        <h2
          className="text-2xl font-bold mb-4 text-center"
          style={{
            fontFamily: "'Poppins', sans-serif",
            color: "oklch(0.3 0.02 65)",
          }}
        >
          Podemos continuar juntos, se você quiser.
        </h2>

        {/* Subtexto */}
        <p
          className="text-center mb-10"
          style={{
            color: "oklch(0.55 0.02 65)",
            fontFamily: "'Inter', sans-serif",
            lineHeight: "1.6",
            fontSize: "16px",
          }}
        >
          Posso te ajudar a entender melhor o que está acontecendo e ver
          possíveis caminhos.
        </p>

        {/* Espaço respirável */}
        <div className="h-8" />

        {/* Botões de ação */}
        <div className="space-y-3 mb-8">
          <Button
            onClick={handleContinue}
            className="w-full py-6 text-lg font-semibold rounded-2xl transition-smooth"
            style={{
              backgroundColor: "oklch(0.6 0.15 240)",
              color: "white",
            }}
          >
            Quero continuar
          </Button>

          <button
            onClick={handleStop}
            className="w-full py-6 text-lg font-semibold rounded-2xl transition-smooth border-2"
            style={{
              borderColor: "oklch(0.92 0.01 65)",
              color: "oklch(0.3 0.02 65)",
              backgroundColor: "white",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Prefiro parar por aqui
          </button>
        </div>

        {/* Mensagem de acolhimento */}
        <p
          className="text-center text-sm"
          style={{
            color: "oklch(0.55 0.02 65)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Você pode voltar quando quiser.
        </p>
      </div>
    </div>
  );
}
