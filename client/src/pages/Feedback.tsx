import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

/**
 * TELA 4: DEVOLUTIVA (ORGANIZAÇÃO)
 * Design: Minimalismo Acolhedor
 * - Cards informativos suaves
 * - Mensagem de validação
 * - Transição para próxima etapa
 */
export default function Feedback() {
  const [, setLocation] = useLocation();

  const handleContinue = () => {
    setLocation("/continuity");
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
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {/* Texto introdutório */}
        <p
          className="text-lg mb-8 text-center"
          style={{
            color: "oklch(0.3 0.02 65)",
            fontFamily: "'Inter', sans-serif",
            lineHeight: "1.6",
          }}
        >
          Pelo que você trouxe, pode estar relacionado a alguns pontos como:
        </p>

        {/* Cards informativos */}
        <div className="space-y-4 mb-10">
          {[
            {
              title: "Ansiedade",
              description: "Preocupação constante, pensamentos acelerados",
            },
            {
              title: "Sobrecarga emocional",
              description: "Muitas demandas, pouco tempo para si",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl transition-smooth hover:shadow-md"
              style={{
                backgroundColor: "oklch(0.97 0.01 65)",
                borderLeft: "4px solid oklch(0.75 0.08 160)",
              }}
            >
              <h3
                className="font-semibold mb-2"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  color: "oklch(0.3 0.02 65)",
                  fontSize: "16px",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  color: "oklch(0.55 0.02 65)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mensagem final validadora */}
        <div
          className="p-5 rounded-2xl mb-8"
          style={{
            backgroundColor: "oklch(0.92 0.05 160)",
            borderLeft: "4px solid oklch(0.75 0.08 160)",
          }}
        >
          <p
            style={{
              color: "oklch(0.3 0.02 65)",
              fontFamily: "'Inter', sans-serif",
              lineHeight: "1.6",
              fontSize: "15px",
            }}
          >
            Isso não define quem você é. Muitas pessoas passam por isso e buscar
            ajuda é um passo importante.
          </p>
        </div>
      </div>

      {/* Botão de ação */}
      <div className="px-6 py-6 border-t border-gray-100 bg-white">
        <Button
          onClick={handleContinue}
          className="w-full py-6 text-lg font-semibold rounded-2xl transition-smooth"
          style={{
            backgroundColor: "oklch(0.6 0.15 240)",
            color: "white",
          }}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
