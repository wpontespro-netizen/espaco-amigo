import { buildWhatsAppLink, fallbackPsychologists, fetchApprovedPsychologists, initials, type Psychologist } from "@/lib/psychologists";
import { ArrowLeft, MapPin, MessageCircle, Search, UserRound, Video } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

export default function PsychologistList() {
  const [, setLocation] = useLocation();
  const [approvedPsychologists, setApprovedPsychologists] = useState<Psychologist[] | null>(null);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("Todas");

  useEffect(() => {
    fetchApprovedPsychologists()
      .then(setApprovedPsychologists)
      .catch(() => setApprovedPsychologists(null));
  }, []);

  const professionals = approvedPsychologists ?? fallbackPsychologists;
  const specialties = useMemo(
    () => ["Todas", ...Array.from(new Set(professionals.map((item) => item.especialidadePrincipal).filter(Boolean)))],
    [professionals],
  );
  const filteredProfessionals = useMemo(() => {
    const term = search.trim().toLowerCase();
    return professionals.filter((professional) => {
      const matchesSearch =
        !term ||
        [professional.nome, professional.especialidadePrincipal, professional.outrasEspecialidades, professional.bio]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      const matchesSpecialty = specialty === "Todas" || professional.especialidadePrincipal === specialty;
      return matchesSearch && matchesSpecialty;
    });
  }, [professionals, search, specialty]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050a1c] px-5 py-6 text-white sm:px-8">
      <div
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(159,130,255,0.28), transparent 32%), radial-gradient(circle at 80% 18%, rgba(255,156,145,0.18), transparent 30%), linear-gradient(135deg, #050a1c 0%, #08122f 55%, #140c2b 100%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl">
        <header className="mb-6">
          <button
            onClick={() => setLocation("/")}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/76 transition-smooth hover:bg-white/10"
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        </header>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/25 backdrop-blur md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#d7b8ff]">
                <UserRound className="h-4 w-4" />
                Apoio humano
              </div>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
                Encontre um psicólogo para conversar com cuidado.
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/68">
                Profissionais aprovados pelo Espaço Amigo para uma primeira conversa de acolhimento.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#9f82ff]/20 to-[#ff9c91]/16 p-5 text-sm text-white/72">
              <p className="font-semibold text-white">Perfis avaliados</p>
              <p className="mt-2">A listagem mostra somente profissionais aprovados.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 rounded-3xl border border-white/10 bg-[#070d24]/70 p-4 md:grid-cols-[1fr_260px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/42" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.06] py-4 pl-12 pr-4 text-white outline-none transition-smooth placeholder:text-white/38 focus:border-[#d7b8ff]/60"
                placeholder="Buscar por nome ou especialidade"
              />
            </label>
            <select
              value={specialty}
              onChange={(event) => setSpecialty(event.target.value)}
              className="rounded-2xl border border-white/10 bg-[#101735] px-4 py-4 text-white outline-none transition-smooth focus:border-[#d7b8ff]/60"
            >
              {specialties.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProfessionals.map((professional) => (
              <article key={professional.id} className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-black/20 transition-smooth hover:-translate-y-1 hover:border-white/20">
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
          {filteredProfessionals.length === 0 ? (
            <div className="mt-7 rounded-3xl border border-white/10 bg-white/[0.05] p-6 text-center text-white/66">
              Nenhum profissional encontrado com esses filtros.
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
