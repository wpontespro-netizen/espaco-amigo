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
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {/* Texto introdutório */}
        <p className="mb-8 text-center text-lg leading-7 text-white/82">
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
            <div key={idx} className="ea-card border-l-4 border-l-[#F472B6] p-5">
              <h3 className="mb-2 font-semibold text-white">
                {item.title}
              </h3>
              <p className="text-sm leading-6 text-white/64">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mensagem final validadora */}
        <div className="ea-panel mb-8 border-l-4 border-l-[#8B5CF6] p-5">
          <p className="text-sm leading-7 text-white/78">
            Isso não define quem você é. Muitas pessoas passam por isso e buscar
            ajuda é um passo importante.
          </p>
        </div>
      </div>

      {/* Botão de ação */}
      <div className="border-t border-white/10 bg-[#071027]/80 px-6 py-6 backdrop-blur">
        <Button
          onClick={handleContinue}
          className="ea-button w-full py-6 text-lg"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
