import { Button } from "@/components/ui/button";
import { ArrowLeft, Video, MapPin } from "lucide-react";
import { useLocation } from "wouter";

/**
 * TELA DE PROFISSIONAIS INDICADOS
 * Design: Minimalismo Acolhedor
 * - Cards simples com informações dos profissionais
 * - Tipos de atendimento (online/presencial)
 * - Botão para conversar com profissional
 */

interface Professional {
  id: number;
  name: string;
  specialty: string;
  type: "online" | "presencial" | "ambos";
  description: string;
}

const PROFESSIONALS: Professional[] = [
  {
    id: 1,
    name: "Dra. Ana Silva",
    specialty: "Ansiedade e Estresse",
    type: "ambos",
    description: "Especialista em terapia cognitivo-comportamental com 8 anos de experiência.",
  },
  {
    id: 2,
    name: "Dr. João Santos",
    specialty: "Emocional e Relacionamentos",
    type: "online",
    description: "Psicólogo clínico focado em bem-estar emocional e desenvolvimento pessoal.",
  },
  {
    id: 3,
    name: "Dra. Marina Costa",
    specialty: "Sobrecarga e Cansaço",
    type: "presencial",
    description: "Especialista em gestão de estresse e equilíbrio emocional.",
  },
  {
    id: 4,
    name: "Dr. Carlos Oliveira",
    specialty: "Tristeza e Desânimo",
    type: "ambos",
    description: "Psicólogo com abordagem humanista e acolhedora.",
  },
];

export default function Professionals() {
  const [, setLocation] = useLocation();

  const handleContactProfessional = (professionalName: string) => {
    alert(
      `Em um app real, você seria conectado com ${professionalName} para uma consulta.`
    );
  };

  return (
    <div className="mobile-screen min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
        <button
          onClick={() => setLocation("/chat")}
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
          Profissionais Indicados
        </h2>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Texto introdutório */}
        <p
          className="text-center mb-8"
          style={{
            color: "oklch(0.55 0.02 65)",
            fontFamily: "'Inter', sans-serif",
            lineHeight: "1.6",
            fontSize: "15px",
          }}
        >
          Aqui estão alguns profissionais que podem te ajudar. Escolha com calma
          e no seu tempo.
        </p>

        {/* Cards de profissionais */}
        <div className="space-y-4">
          {PROFESSIONALS.map((prof) => (
            <div
              key={prof.id}
              className="p-5 rounded-2xl border-l-4 transition-smooth hover:shadow-md"
              style={{
                backgroundColor: "oklch(0.97 0.01 65)",
                borderLeftColor: "oklch(0.75 0.08 160)",
              }}
            >
              {/* Nome e especialidade */}
              <h3
                className="font-semibold mb-1"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  color: "oklch(0.3 0.02 65)",
                  fontSize: "16px",
                }}
              >
                {prof.name}
              </h3>
              <p
                className="text-sm mb-3"
                style={{
                  color: "oklch(0.75 0.08 160)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                {prof.specialty}
              </p>

              {/* Descrição */}
              <p
                className="text-sm mb-3"
                style={{
                  color: "oklch(0.55 0.02 65)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  lineHeight: "1.4",
                }}
              >
                {prof.description}
              </p>

              {/* Tipo de atendimento */}
              <div className="flex gap-3 mb-4">
                {(prof.type === "online" || prof.type === "ambos") && (
                  <div
                    className="flex items-center gap-2 text-xs px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: "oklch(0.92 0.05 240)",
                      color: "oklch(0.3 0.02 65)",
                    }}
                  >
                    <Video size={14} />
                    <span>Online</span>
                  </div>
                )}
                {(prof.type === "presencial" || prof.type === "ambos") && (
                  <div
                    className="flex items-center gap-2 text-xs px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: "oklch(0.92 0.05 160)",
                      color: "oklch(0.3 0.02 65)",
                    }}
                  >
                    <MapPin size={14} />
                    <span>Presencial</span>
                  </div>
                )}
              </div>

              {/* Botão de ação */}
              <button
                onClick={() => handleContactProfessional(prof.name)}
                className="w-full py-2 rounded-xl font-semibold text-sm transition-smooth hover:opacity-90"
                style={{
                  backgroundColor: "oklch(0.6 0.15 240)",
                  color: "white",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Conversar com profissional
              </button>
            </div>
          ))}
        </div>

        {/* Mensagem final */}
        <div
          className="mt-8 p-5 rounded-2xl text-center"
          style={{
            backgroundColor: "oklch(0.92 0.05 160)",
          }}
        >
          <p
            style={{
              color: "oklch(0.3 0.02 65)",
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            Você pode voltar para o chat quando quiser ou explorar mais
            profissionais.
          </p>
        </div>
      </div>

      {/* Botão de voltar */}
      <div className="px-6 py-6 border-t border-gray-100 bg-white">
        <button
          onClick={() => setLocation("/")}
          className="w-full py-3 text-sm font-semibold rounded-2xl transition-smooth"
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
