import { ArrowLeft, CheckCircle, HeartHandshake, ShieldCheck, UserRound } from "lucide-react";
import { useLocation } from "wouter";

export default function Professionals() {
  const [, setLocation] = useLocation();

  return (
    <main className="min-h-screen bg-[#050a1c] px-5 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => setLocation("/")}
          className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/76 transition-smooth hover:bg-white/10"
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111a45] via-[#101633] to-[#080d22] p-6 shadow-2xl md:p-9">
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#d7b8ff]">
                <HeartHandshake className="h-4 w-4" />
                Psicólogos parceiros
              </div>
              <h1 className="text-4xl font-bold leading-tight">Acolhimento humano começa com cuidado e responsabilidade.</h1>
              <p className="mt-5 max-w-2xl leading-7 text-white/70">
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
                  className="rounded-2xl border border-white/12 px-6 py-4 font-semibold text-white/84 transition-smooth hover:bg-white/10"
                  type="button"
                >
                  Ver profissionais
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
              <UserRound className="h-12 w-12 text-[#ffb3ce]" />
              <h2 className="mt-5 text-2xl font-bold">Como funciona</h2>
              <div className="mt-5 space-y-4 text-sm leading-6 text-white/70">
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
