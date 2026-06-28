import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, MapPin, Video } from "lucide-react";
import { useLocation } from "wouter";

/**
 * TELA 6: DIRECIONAMENTO
 * Design: Minimalismo Acolhedor
 * - Informações sobre profissionais
 * - Elementos de confiança
 * - Call-to-action clara
 */
export default function Referral() {
  const [, setLocation] = useLocation();

  const handleViewReferrals = () => {
    // Simula a ação de ver indicações
    alert(
      "Em um app real, aqui apareceriam profissionais verificados e disponíveis para atendimento."
    );
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
        {/* Título */}
        <h2 className="mb-4 text-center text-2xl font-bold">
          Talvez conversar com um psicólogo possa te ajudar.
        </h2>

        {/* Subtexto */}
        <p className="mb-10 text-center text-base leading-7 text-white/68">
          Posso te indicar profissionais que trabalham com situações como a sua.
        </p>

        {/* Elementos de confiança */}
        <div className="space-y-4 mb-10">
          {[
            {
              icon: <CheckCircle size={24} />,
              text: "Profissionais verificados",
            },
            {
              icon: <Video size={24} />,
              text: "Atendimento online",
            },
            {
              icon: <MapPin size={24} />,
              text: "Atendimento presencial",
            },
          ].map((item, idx) => (
            <div key={idx} className="ea-card flex items-center gap-4 p-4">
              <div className="text-[#F472B6]">{item.icon}</div>
              <span className="text-sm text-white/82">
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Mensagem de acolhimento */}
        <p className="mb-8 text-center text-sm text-white/58">
          Escolha com calma. Você está no controle.
        </p>
      </div>

      {/* Botão de ação */}
      <div className="border-t border-white/10 bg-[#071027]/80 px-6 py-6 backdrop-blur">
        <Button
          onClick={handleViewReferrals}
          className="ea-button w-full py-6 text-lg"
        >
          Ver indicações
        </Button>

        {/* Link para voltar */}
        <button
          onClick={() => setLocation("/")}
          className="mt-3 w-full rounded-2xl py-3 text-sm font-semibold text-white/62 transition-smooth hover:bg-white/10 hover:text-white"
        >
          Voltar ao início
        </button>
      </div>
    </div>
  );
}
