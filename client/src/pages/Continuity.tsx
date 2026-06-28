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
        {/* Título */}
        <h2 className="mb-4 text-center text-2xl font-bold">
          Podemos continuar juntos, se você quiser.
        </h2>

        {/* Subtexto */}
        <p className="mb-10 text-center text-base leading-7 text-white/68">
          Posso te ajudar a entender melhor o que está acontecendo e ver
          possíveis caminhos.
        </p>

        {/* Espaço respirável */}
        <div className="h-8" />

        {/* Botões de ação */}
        <div className="space-y-3 mb-8">
          <Button
            onClick={handleContinue}
            className="ea-button w-full py-6 text-lg"
          >
            Quero continuar
          </Button>

          <button
            onClick={handleStop}
            className="ea-button-ghost w-full py-6 text-lg"
          >
            Prefiro parar por aqui
          </button>
        </div>

        {/* Mensagem de acolhimento */}
        <p className="text-center text-sm text-white/58">
          Você pode voltar quando quiser.
        </p>
      </div>
    </div>
  );
}
