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
        {/* Título */}
        <h2
          className="text-2xl font-bold mb-4 text-center"
          style={{
            fontFamily: "'Poppins', sans-serif",
            color: "oklch(0.3 0.02 65)",
          }}
        >
          Talvez conversar com um psicólogo possa te ajudar.
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
            <div
              key={idx}
              className="flex items-center gap-4 p-4 rounded-2xl transition-smooth"
              style={{
                backgroundColor: "oklch(0.97 0.01 65)",
              }}
            >
              <div style={{ color: "oklch(0.6 0.15 240)" }}>{item.icon}</div>
              <span
                style={{
                  color: "oklch(0.3 0.02 65)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "15px",
                }}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Mensagem de acolhimento */}
        <p
          className="text-center text-sm mb-8"
          style={{
            color: "oklch(0.55 0.02 65)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Escolha com calma. Você está no controle.
        </p>
      </div>

      {/* Botão de ação */}
      <div className="px-6 py-6 border-t border-gray-100 bg-white">
        <Button
          onClick={handleViewReferrals}
          className="w-full py-6 text-lg font-semibold rounded-2xl transition-smooth"
          style={{
            backgroundColor: "oklch(0.6 0.15 240)",
            color: "white",
          }}
        >
          Ver indicações
        </Button>

        {/* Link para voltar */}
        <button
          onClick={() => setLocation("/")}
          className="w-full mt-3 py-3 text-sm font-semibold rounded-2xl transition-smooth"
          style={{
            color: "oklch(0.55 0.02 65)",
            fontFamily: "'Inter', sans-serif",
            backgroundColor: "transparent",
          }}
        >
          Voltar ao início
        </button>
      </div>
    </div>
  );
}
