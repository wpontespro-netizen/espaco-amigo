import { ArrowLeft, CheckCircle, HeartHandshake, ShieldCheck, UserRound } from "lucide-react";
import { useLocation } from "wouter";

export default function Professionals() {
  const [, setLocation] = useLocation();

  return (
    <main className="min-h-screen bg-[#f6f1ff] px-5 py-6 text-[#131936] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => setLocation("/")}
          className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-[#d8cef6] bg-white px-4 py-3 text-sm text-[#5f6580] shadow-sm transition-smooth hover:bg-[#fbf9ff]"
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <section className="overflow-hidden rounded-[2rem] border border-[#d8cef6] bg-white p-6 shadow-2xl shadow-[#8b74bd]/15 md:p-9">
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#f1eaff] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#7a57cb]">
                <HeartHandshake className="h-4 w-4" />
                Psicólogos parceiros
              </div>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight">Acolhimento humano começa com cuidado e responsabilidade.</h1>
              <p className="mt-5 max-w-2xl leading-7 text-[#5f6580]">
                O Espaço Amigo aproxima pessoas em sofrimento emocional de profissionais alinhados com uma escuta ética, sensível e segura. A parceria passa por avaliação antes de qualquer perfil aparecer para os usuários.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setLocation("/cadastro-psicologo")}
                  className="rounded-2xl bg-gradient-to-r from-[#9f82ff] to-[#ff9c91] px-6 py-4 font-bold text-white transition-smooth hover:opacity-90"
                  type="button"
                >
                  Quero me cadastrar
                </button>
                <button
                  onClick={() => setLocation("/encontrar-psicologo")}
                  className="rounded-2xl border border-[#d8cef6] px-6 py-4 font-semibold text-[#5c3db2] transition-smooth hover:bg-[#f8f4ff]"
                  type="button"
                >
                  Ver profissionais
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
      </div>
    </main>
  );
}
