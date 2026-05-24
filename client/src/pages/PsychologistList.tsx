import { buildWhatsAppLink, fallbackPsychologists, fetchApprovedPsychologists, initials, type Psychologist } from "@/lib/psychologists";
import { ArrowLeft, MapPin, MessageCircle, UserRound, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function PsychologistList() {
  const [, setLocation] = useLocation();
  const [approvedPsychologists, setApprovedPsychologists] = useState<Psychologist[] | null>(null);

  useEffect(() => {
    fetchApprovedPsychologists()
      .then(setApprovedPsychologists)
      .catch(() => setApprovedPsychologists(null));
  }, []);

  const professionals = approvedPsychologists ?? fallbackPsychologists;

  return (
    <main className="min-h-screen bg-[#050a1c] px-5 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <button
            onClick={() => setLocation("/")}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/76 transition-smooth hover:bg-white/10"
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <button
            onClick={() => setLocation("/professionals")}
            className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/78 transition-smooth hover:bg-white/10"
            type="button"
          >
            Sou psicólogo
          </button>
        </header>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111a45] via-[#101633] to-[#080d22] p-6 md:p-8">
          <div className="flex items-center gap-3">
            <UserRound className="h-8 w-8 text-[#86cfff]" />
            <div>
              <h1 className="text-3xl font-bold">Encontrar psicólogo</h1>
              <p className="mt-2 text-white/66">Profissionais aprovados pelo Espaço Amigo para uma primeira conversa com cuidado.</p>
            </div>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {professionals.map((professional) => (
              <article key={professional.id} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/20">
                <div className="flex items-start gap-4">
                  {professional.fotoUrl ? (
                    <img src={professional.fotoUrl} alt={professional.nome} className="h-20 w-20 rounded-2xl object-cover" />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f3a0c5] to-[#8ecfff] text-xl font-bold text-[#071027]">
                      {initials(professional.nome)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold">{professional.nome}</h2>
                    <p className="mt-1 text-sm text-white/50">CRP {professional.crp || "em análise"}</p>
                    <p className="mt-1 text-sm font-semibold text-[#d7b8ff]">{professional.especialidadePrincipal}</p>
                    <p className="mt-3 text-sm leading-6 text-white/66">{professional.bio}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/72">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-3 py-1">
                    <Video className="h-3.5 w-3.5" />
                    Online
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-3 py-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {professional.cidade || "Cidade"} {professional.estado ? `/ ${professional.estado}` : ""}
                  </span>
                </div>

                <p className="mt-4 text-sm text-white/58">{professional.horariosDisponiveis}</p>
                <a
                  href={buildWhatsAppLink(professional)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#9f82ff] to-[#ff9c91] px-4 py-3 text-sm font-bold text-white transition-smooth hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4" />
                  Conversar no WhatsApp
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
