import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Bookmark,
  Heart,
  Home,
  LifeBuoy,
  LogOut,
  Mail,
  MessageCircle,
  Music,
  Phone,
  Play,
  Shield,
  Sparkles,
  Star,
  UserRound,
  Users,
  Video,
  Wind,
  X,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const moods = ["Ansiedade", "Solidão", "Pensamentos que doem", "Baixa autoestima", "Recaída"];

const videos = [
  {
    title: "Quando a cabeça não para",
    duration: "1:12",
    source: "/videos/espaco_amigo_video_1_quando_a_cabeca_nao_para.mp4",
    tone: "from-violet-500/25 via-slate-900/70 to-[#07122c]",
  },
  {
    title: "3 passos para voltar ao agora",
    duration: "0:58",
    source: "/videos/espaco_amigo_video_2_3_passos_para_voltar_ao_agora.mp4",
    tone: "from-cyan-300/20 via-slate-900/70 to-[#081827]",
  },
  {
    title: "Respire. Um minuto pode mudar tudo",
    duration: "1:00",
    source: "/videos/espaco_amigo_video_3_respire_um_minuto_pode_mudar_tudo.mp4",
    tone: "from-emerald-300/20 via-slate-900/70 to-[#0b1f1e]",
  },
  {
    title: "Pequenas escolhas salvam dias difíceis",
    duration: "1:04",
    source: "/videos/espaco_amigo_video_4_pequenas_escolhas_salvam_dias_dificeis.mp4",
    tone: "from-rose-300/20 via-slate-900/70 to-[#211226]",
  },
];

const quickSupport = [
  { title: "Chat de acolhimento", text: "Fale no seu tempo.", icon: MessageCircle, action: "chat" },
  { title: "Áudios de acolhimento", text: "Em breve por aqui.", icon: Music, action: "placeholder" },
];

const todayPhrases = [
  "Você não precisa resolver tudo agora.",
  "Um passo pequeno ainda é um passo.",
  "Respirar também é continuar.",
  "Você pode atravessar este momento com calma.",
  "Não estar bem também faz parte de ser humano.",
];

const breathingSteps = ["Inspire devagar", "Segure por um instante", "Solte o ar com calma"];

const helpPhones = [
  { name: "CVV — 188", text: "Apoio emocional e prevenção do suicídio", time: "24h" },
  { name: "SAMU — 192", text: "Emergência médica", time: "24h" },
  { name: "Violência contra a mulher — 180", text: "Central de atendimento à mulher", time: "24h" },
  { name: "Narcóticos Anônimos — 132", text: "Apoio para dependência química", time: "24h" },
  { name: "Alcoólicos Anônimos", text: "Grupos de apoio e reuniões", time: "Grupos de apoio", link: "https://www.aa.org.br" },
];

const professionals = [
  { name: "Vitor Dias Pontes", area: "Acolhimento emocional", status: "Disponível" },
  { name: "Marcelo Pereira Bastos", area: "Rotina, medo e preocupação", status: "Disponível" },
  { name: "Camila Rocha", area: "Relacionamentos, autoestima e luto", status: "Disponível" },
];

const navItems = [
  { label: "Início", id: "inicio", icon: Home },
  { label: "Vídeos", id: "videos", icon: Video },
  { label: "Chat de acolhimento", id: "chat", icon: MessageCircle },
  { label: "Recursos", id: "recursos", icon: Sparkles },
  { label: "Telefones de ajuda", id: "telefones", icon: Phone },
  { label: "Psicólogos", id: "psicologos", icon: Users },
  { label: "Favoritos", id: "videos", icon: Bookmark },
  { label: "Meu espaço", id: "inicio", icon: Star },
];

export default function LoggedSpace() {
  const [, setLocation] = useLocation();
  const { isLoading, logout, user } = useAuth();
  const [selectedMood, setSelectedMood] = useState("Ansiedade");
  const [activeVideo, setActiveVideo] = useState<(typeof videos)[number] | null>(null);
  const [activeSupport, setActiveSupport] = useState<"phrases" | "breathe" | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);

  const goToChat = () => setLocation("/chat-start");
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const showPlaceholder = (label: string) => {
    alert(`${label} em breve no Espaço Amigo.`);
  };
  const openSupport = (action: string, title: string) => {
    if (action === "chat") {
      goToChat();
      return;
    }

    if (action === "phrases" || action === "breathe") {
      setActiveSupport(action);
      return;
    }

    showPlaceholder(title);
  };
  const closeSupport = () => {
    setActiveSupport(null);
  };
  const showAnotherPhrase = () => {
    setPhraseIndex((current) => {
      const next = Math.floor(Math.random() * todayPhrases.length);
      return next === current ? (next + 1) % todayPhrases.length : next;
    });
  };
  const buildProfessionalMailto = (professionalName: string) => {
    const body = [
      `Nome do usuário: ${user?.name || "Não informado"}`,
      `Email do usuário: ${user?.email || "Não informado"}`,
      `Profissional escolhido: ${professionalName}`,
      "",
      "Gostaria de conversar com este profissional.",
    ].join("\n");

    return `mailto:wpontes.pro@gmail.com?subject=${encodeURIComponent(
      "Contato pelo Espaço Amigo",
    )}&body=${encodeURIComponent(body)}`;
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050a1c] text-white">
        <p>Carregando seu espaço...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050a1c] px-6 text-center text-white">
        <div className="max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-8">
          <h1 className="text-2xl font-bold">Entre para acessar seu espaço</h1>
          <p className="mt-3 text-white/70">A home continua pública, mas esta área usa sua conta Google.</p>
          <Button
            onClick={() => {
              window.location.href = "/api/auth/google/start";
            }}
            className="mt-6 rounded-2xl bg-gradient-to-r from-[#9f82ff] to-[#ff9c91] px-6 py-5 text-white"
          >
            Entrar com Google
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050a1c] text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-5 lg:grid-cols-[245px_1fr] lg:px-6">
        <aside className="hidden rounded-3xl border border-white/10 bg-white/[0.05] p-4 lg:block">
          <div className="mb-6 flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff8aa7] to-[#73d7ff]">
              <Heart className="h-6 w-6 fill-white/70" />
            </div>
            <div>
              <p className="font-bold">Espaço Amigo</p>
              <p className="text-xs text-white/55">seu espaço</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.id)}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-white/72 transition-smooth hover:bg-white/10 hover:text-white"
                  type="button"
                >
                  <Icon className="h-4 w-4 text-[#d7b8ff]" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="space-y-6">
          <header id="inicio" className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold">Olá, {user.name} 👋</h1>
                <p className="mt-1 text-white/68">Que bom ter você aqui. Você não está sozinho.</p>
              </div>
              <div className="flex items-center gap-3">
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="h-11 w-11 rounded-full border border-white/15" />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                    <UserRound className="h-5 w-5" />
                  </div>
                )}
                <button
                  onClick={() => void logout().then(() => setLocation("/"))}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/78 transition-smooth hover:bg-white/10"
                  type="button"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </div>
          </header>

          <section className="grid gap-5 rounded-3xl border border-white/10 bg-gradient-to-br from-[#111a45] via-[#101633] to-[#080d22] p-6 md:grid-cols-[1fr_0.8fr] md:p-8">
            <div>
              <h2 className="max-w-2xl text-4xl font-bold leading-tight">
                Um lugar seguro para você ser como é.
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-white/72">
                Converse, desabafe, organize seus pensamentos e encontre apoio quando precisar.
              </p>
              <Button
                onClick={goToChat}
                className="mt-7 rounded-2xl bg-gradient-to-r from-[#9f82ff] to-[#ff9c91] px-7 py-5 text-base font-bold text-white"
              >
                <MessageCircle className="mr-3 h-5 w-5" />
                Conversar agora
              </Button>
            </div>
            <div className="relative min-h-48 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#b991ff]/25 via-transparent to-[#ff9c91]/20" />
              <Heart className="absolute bottom-8 right-8 h-28 w-28 fill-[#ffb3ce]/30 text-[#d7b8ff]" />
              <Sparkles className="absolute left-7 top-7 h-9 w-9 text-[#ffb3ce]" />
            </div>
          </section>

          <section id="chat" className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
            <h2 className="text-2xl font-bold">Como você está se sentindo?</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {moods.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`rounded-2xl border px-4 py-4 text-left font-semibold transition-smooth ${
                    selectedMood === mood
                      ? "border-[#ff9cce]/60 bg-[#ff9cce]/16 text-white"
                      : "border-white/10 bg-white/[0.04] text-white/76 hover:bg-white/10"
                  }`}
                  type="button"
                >
                  {mood}
                </button>
              ))}
            </div>
          </section>

          <section id="videos" className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">Vídeos para você</h2>
              <Video className="h-6 w-6 text-[#d7b8ff]" />
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {videos.map((video) => (
                <button
                  key={video.title}
                  onClick={() => setActiveVideo(video)}
                  className={`min-h-48 rounded-3xl border border-white/10 bg-gradient-to-br ${video.tone} p-5 transition-smooth hover:border-white/25`}
                  type="button"
                >
                  <div className="flex items-center justify-between text-sm text-white/68">
                    <span>Espaço Amigo</span>
                    <span>Interno</span>
                  </div>
                  <h3 className="mt-10 text-left text-xl font-bold leading-tight">{video.title}</h3>
                  <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-black/25 px-3 py-1 text-xs">
                    <Play className="h-3.5 w-3.5" />
                    {video.duration}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section id="recursos" className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
            <h2 className="text-2xl font-bold">Acolhimento rápido</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setActiveSupport("breathe");
                }}
                className="cursor-pointer rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-left transition-smooth hover:bg-white/10"
              >
                <Wind className="h-7 w-7 text-[#d7b8ff]" />
                <h3 className="mt-5 font-bold">Respire um pouco</h3>
                <p className="mt-2 text-sm text-white/62">Um minuto de pausa.</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveSupport("phrases");
                }}
                className="cursor-pointer rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-left transition-smooth hover:bg-white/10"
              >
                <Sparkles className="h-7 w-7 text-[#d7b8ff]" />
                <h3 className="mt-5 font-bold">Frases para hoje</h3>
                <p className="mt-2 text-sm text-white/62">Palavras simples para seguir.</p>
              </button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {quickSupport.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    onClick={() => openSupport(item.action, item.title)}
                    className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-left transition-smooth hover:bg-white/10"
                    type="button"
                  >
                    <Icon className="h-7 w-7 text-[#d7b8ff]" />
                    <h3 className="mt-5 font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm text-white/62">{item.text}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section id="telefones" className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
              <div className="flex items-center gap-3">
                <LifeBuoy className="h-7 w-7 text-[#ff9cce]" />
                <h2 className="text-2xl font-bold">Telefones de ajuda</h2>
              </div>
              <div className="mt-5 space-y-3">
                {helpPhones.map((phone) => (
                  <div key={phone.name} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold">{phone.name}</h3>
                        <p className="mt-1 text-sm text-white/62">{phone.text}</p>
                        {"link" in phone && phone.link ? (
                          <a
                            href={phone.link}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex text-sm font-semibold text-[#d7b8ff] hover:text-white"
                          >
                            {phone.link}
                          </a>
                        ) : null}
                      </div>
                      <span className="rounded-full bg-[#70f29d]/14 px-3 py-1 text-xs text-[#a5ffc1]">{phone.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="psicologos" className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
              <div className="flex items-center gap-3">
                <Users className="h-7 w-7 text-[#86cfff]" />
                <h2 className="text-2xl font-bold">Psicólogos disponíveis</h2>
              </div>
              <div className="mt-5 space-y-3">
                {professionals.map((professional) => (
                  <div key={professional.name} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <h3 className="font-bold">{professional.name}</h3>
                    <p className="mt-1 text-sm text-white/62">{professional.area}</p>
                    <p className="mt-2 text-sm text-[#a5ffc1]">• {professional.status}</p>
                    <a
                      href={buildProfessionalMailto(professional.name)}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#9f82ff] to-[#ff9c91] px-4 py-3 text-sm font-bold text-white transition-smooth hover:opacity-90"
                    >
                      <Mail className="h-4 w-4" />
                      Conversar com profissional
                    </a>
                  </div>
                ))}
              </div>
              <button
                onClick={() => showPlaceholder("Lista de psicólogos")}
                className="mt-5 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/82 transition-smooth hover:bg-white/10"
                type="button"
              >
                Ver todos os psicólogos
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#25194a] to-[#142650] p-8 text-center">
            <Shield className="mx-auto h-9 w-9 text-[#ffb3ce]" />
            <h2 className="mt-4 text-3xl font-bold">Você importa. Sua vida importa.</h2>
            <p className="mt-3 text-white/70">Um passo de cada vez é suficiente por hoje.</p>
            <Button
              onClick={() => scrollToSection("inicio")}
              className="mt-6 rounded-2xl bg-white px-7 py-5 font-bold text-[#101735] hover:bg-white/90"
            >
              Estou aqui
            </Button>
          </section>
        </div>
      </div>
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0b1028] p-5 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white/58">Espaço Amigo</p>
                <h3 className="mt-1 text-2xl font-bold">{activeVideo.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="rounded-full border border-white/10 p-2 text-white/70 transition-smooth hover:bg-white/10 hover:text-white"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <video
              className={`mt-5 aspect-video w-full rounded-3xl border border-white/10 bg-gradient-to-br ${activeVideo.tone}`}
              controls
              src={activeVideo.source}
            />
          </div>
        </div>
      )}
      {activeSupport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0b1028] p-5 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white/58">Espaço Amigo</p>
                <h3 className="mt-1 text-2xl font-bold">
                  {activeSupport === "phrases" ? "Frases para hoje" : "Respire um pouco"}
                </h3>
                <p className="mt-2 text-sm text-white/62">
                  {activeSupport === "phrases"
                    ? "Às vezes uma pausa também ajuda."
                    : "Vamos fazer uma pausa curta. Não precisa resolver tudo agora."}
                </p>
              </div>
              <button
                onClick={closeSupport}
                className="rounded-full border border-white/10 p-2 text-white/70 transition-smooth hover:bg-white/10 hover:text-white"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {activeSupport === "phrases" ? (
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-7 text-center">
                <p className="mx-auto max-w-md text-2xl font-semibold leading-snug text-white">
                  {todayPhrases[phraseIndex]}
                </p>
                <Button
                  onClick={showAnotherPhrase}
                  className="mt-7 rounded-2xl bg-white px-6 py-5 font-bold text-[#101735] hover:bg-white/90"
                >
                  Mostrar outra frase
                </Button>
              </div>
            ) : null}

            {activeSupport === "breathe" ? (
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-7">
                <div className="space-y-3">
                  {breathingSteps.map((step, index) => (
                    <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                      <p className="text-xs font-semibold text-[#d7b8ff]">0{index + 1}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{step}</p>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setActiveSupport("breathe")}
                  className="mt-7 rounded-2xl bg-white px-6 py-5 font-bold text-[#101735] hover:bg-white/90"
                >
                  Começar novamente
                </Button>
              </div>
            ) : null}
            <button
              onClick={closeSupport}
              className="mt-5 w-full rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/78 transition-smooth hover:bg-white/10 hover:text-white"
              type="button"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
