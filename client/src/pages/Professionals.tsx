import { ArrowLeft, CheckCircle, Clock3, HeartHandshake, MessageCircle, ShieldCheck, UserRound, Video } from "lucide-react";
import { useLocation } from "wouter";

export default function Professionals() {
  const [, setLocation] = useLocation();

  return (
    <main className="ea-bg px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => setLocation("/")}
          className="ea-button-ghost mb-6 inline-flex items-center gap-2 px-4 py-3 text-sm"
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <section className="ea-panel overflow-hidden p-6 md:p-9">
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#f1eaff] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#7a57cb]">
                <HeartHandshake className="h-4 w-4" />
                Psicólogos parceiros
              </div>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight">
                Faça parte da rede de psicólogos parceiros do Espaço Amigo
              </h1>
              <p className="mt-5 max-w-2xl leading-7 text-white/68">
                Ajude pessoas que estão passando por momentos difíceis a encontrar acolhimento humano, ético e online.
              </p>
              <div className="mt-7">
                <button
                  onClick={() => setLocation("/cadastro-psicologo")}
                  className="rounded-2xl bg-gradient-to-r from-[#9f82ff] to-[#ff9c91] px-6 py-4 font-bold text-white transition-smooth hover:opacity-90"
                  type="button"
                >
                  Quero me cadastrar
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-[#e0d8fb] bg-gradient-to-br from-[#101735] to-[#211336] p-6 text-white">
              <UserRound className="h-12 w-12 text-[#ffb3ce]" />
              <h2 className="mt-5 text-2xl font-bold">Como funciona</h2>
              <div className="mt-5 space-y-4 text-sm leading-6 text-white/72">
                <p className="flex gap-3">
                  <CheckCircle className="mt-1 h-4 w-4 shrink-0 text-[#a5ffc1]" />
                  Você envia seus dados profissionais e disponibilidade.
                </p>
                <p className="flex gap-3">
                  <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-[#d7b8ff]" />
                  A equipe avalia manualmente o perfil antes da publicação.
                </p>
                <p className="flex gap-3">
                  <HeartHandshake className="mt-1 h-4 w-4 shrink-0 text-[#ffb3ce]" />
                  Perfis aprovados aparecem para pessoas que buscam apoio humano.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="ea-panel mt-6 p-6 md:p-8">
          <h2 className="text-2xl font-bold">Por que atender pelo Espaço Amigo?</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Pessoas buscando acolhimento", icon: HeartHandshake },
              { label: "Atendimento online", icon: Video },
              { label: "Autonomia de horários", icon: Clock3 },
              { label: "Perfil avaliado antes da publicação", icon: ShieldCheck },
              { label: "Contato direto pelo WhatsApp", icon: MessageCircle },
            ].map(({ label, icon: CardIcon }) => {
              return (
                <div key={label} className="ea-card p-5">
                  <CardIcon className="h-7 w-7 text-[#7a57cb]" />
                  <p className="mt-4 text-sm font-bold leading-5">{label}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="ea-panel p-6 md:p-8">
            <h2 className="text-2xl font-bold">Como funciona?</h2>
            <div className="mt-5 space-y-4">
              {[
                "Envie seus dados profissionais",
                "A equipe avalia seu cadastro",
                "Após aprovação, seu perfil fica visível",
                "Usuários entram em contato pelo WhatsApp",
              ].map((step, index) => (
                <div key={step} className="flex gap-4 rounded-2xl bg-white/[0.06] p-4">
                  <span className="font-bold text-[#7a57cb]">0{index + 1}</span>
                  <p className="font-semibold text-white/82">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#d8cef6] bg-gradient-to-br from-[#101735] to-[#211336] p-6 text-white shadow-xl shadow-[#8b74bd]/10 md:p-8">
            <ShieldCheck className="h-9 w-9 text-[#d7b8ff]" />
            <h2 className="mt-4 text-2xl font-bold">Processo de avaliação</h2>
            <p className="mt-4 leading-7 text-white/70">
              O cadastro passa por avaliação manual para garantir alinhamento com a proposta de acolhimento do Espaço Amigo.
            </p>
          </div>
        </section>

        <section className="ea-panel mt-6 p-8 text-center">
          <h2 className="text-3xl font-bold">Quer fazer parte?</h2>
          <button
            onClick={() => setLocation("/cadastro-psicologo")}
            className="mt-5 rounded-2xl bg-gradient-to-r from-[#9f82ff] to-[#ff9c91] px-7 py-4 font-bold text-white transition-smooth hover:opacity-90"
            type="button"
          >
            Fazer cadastro
          </button>
        </section>
      </div>
    </main>
  );
}
