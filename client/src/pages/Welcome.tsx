import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Brain,
  Clock3,
  Footprints,
  Heart,
  LockKeyhole,
  MessageCircle,
  Moon,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Sprout,
  UserRound,
  Users,
  Wind,
} from "lucide-react";
import { useLocation } from "wouter";

const contentCards = [
  {
    title: "Quando a cabeça não para",
    text: "Um respiro para acalmar a mente.",
    icon: Brain,
    time: "1:12",
    tone: "from-violet-500/25 via-slate-900/70 to-[#070c22]",
  },
  {
    title: "Pra quem está sozinho agora",
    text: "Você não está só. Estamos aqui.",
    icon: Heart,
    time: "1:08",
    tone: "from-rose-400/25 via-slate-900/65 to-[#111733]",
  },
  {
    title: "Respira. Um minuto só seu.",
    text: "Exercício rápido de respiração.",
    icon: Wind,
    time: "0:59",
    tone: "from-emerald-300/25 via-slate-900/65 to-[#091d20]",
  },
  {
    title: "Quando tudo parece sem sentido",
    text: "Não precisa entender tudo agora.",
    icon: Moon,
    time: "1:15",
    tone: "from-indigo-400/25 via-slate-900/70 to-[#07122c]",
  },
  {
    title: "Pequenos passos contam muito",
    text: "Você pode ir devagar.",
    icon: Footprints,
    time: "1:03",
    tone: "from-orange-300/25 via-slate-900/65 to-[#1e1325]",
  },
];

const professionals = [
  {
    name: "Vitor Dias Pontes",
    area: "Acolhimento emocional",
    status: "Online",
  },
  {
    name: "Marcelo Pereira Bastos",
    area: "Rotina, medo e ansiedade",
    status: "Disponível hoje",
  },
  {
    name: "Camila Pereira",
    area: "Relações e autoestima",
    status: "Online",
  },
];

export default function Welcome() {
  const [, setLocation] = useLocation();

  const goToChat = () => setLocation("/chat-start");

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openContentPlaceholder = (title: string) => {
    alert(`Conteúdo em breve: ${title}`);
  };

  return (
    <main className="min-h-screen bg-[#050a1c] text-white overflow-hidden">
      <section className="relative min-h-[92vh] px-5 sm:px-8 lg:px-12 pt-6 pb-16">
        <div
          className="absolute inset-0 opacity-45"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 30%, rgba(171, 128, 255, 0.22), transparent 35%), linear-gradient(135deg, #030715 0%, #08122f 52%, #140c2b 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl">
          <header className="flex items-center justify-between gap-5">
            <button
              onClick={() => scrollToSection("inicio")}
              className="flex items-center gap-3 text-left"
              type="button"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff8aa7] via-[#a982ff] to-[#73d7ff] shadow-lg shadow-purple-950/30">
                <Heart className="h-7 w-7 fill-white/70 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold leading-tight">Espaço Amigo</p>
                <p className="text-sm text-white/70">você não está sozinho</p>
              </div>
            </button>

            <nav className="hidden items-center gap-9 text-sm text-white/78 md:flex">
              <button className="text-[#d7b8ff]" onClick={() => scrollToSection("inicio")} type="button">
                Início
              </button>
              <button onClick={() => scrollToSection("conteudos")} type="button">
                Conteúdos
              </button>
              <button onClick={() => scrollToSection("psicologos")} type="button">
                Psicólogos
              </button>
              <button onClick={() => scrollToSection("sobre")} type="button">
                Sobre
              </button>
            </nav>

            <button
              onClick={goToChat}
              className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/90 backdrop-blur transition-smooth hover:bg-white/10"
              type="button"
            >
              <UserRound className="h-4 w-4 text-[#f4a5d7]" />
              Entrar
            </button>
          </header>

          <div id="inicio" className="grid min-h-[78vh] items-center gap-10 py-16 lg:grid-cols-[1fr_0.95fr]">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex rounded-lg bg-white/8 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#ceb2ff]">
                Seu espaço de acolhimento
              </div>

              <h1 className="text-5xl font-bold leading-[1.04] tracking-normal sm:text-6xl lg:text-7xl">
                Um lugar seguro para{" "}
                <span className="bg-gradient-to-r from-[#f49cc7] via-[#b991ff] to-[#8dd7ff] bg-clip-text text-transparent">
                  você ser como é.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/78">
                Converse, desabafe, organize seus pensamentos e encontre apoio quando precisar.
              </p>

              <p className="mt-5 flex items-center gap-3 text-base text-[#ffc0da]">
                <Heart className="h-5 w-5 fill-[#ffc0da]/60" />
                Você importa. Você não está sozinho.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Button
                  onClick={goToChat}
                  className="h-auto rounded-2xl bg-gradient-to-r from-[#9f82ff] to-[#ff9c91] px-7 py-5 text-base font-bold text-white shadow-xl shadow-purple-950/30"
                >
                  <MessageCircle className="mr-3 h-6 w-6" />
                  Quero conversar
                </Button>
                <button
                  onClick={() => scrollToSection("conteudos")}
                  className="flex items-center justify-center gap-3 rounded-2xl border border-white/18 bg-white/5 px-7 py-5 text-base font-bold text-white/90 backdrop-blur transition-smooth hover:bg-white/10"
                  type="button"
                >
                  <Sprout className="h-6 w-6 text-[#8ff0c2]" />
                  Ver conteúdos
                </button>
              </div>
            </div>

            <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/12 bg-[#101735]/70 shadow-2xl shadow-black/30">
              <div className="absolute inset-0 bg-gradient-to-br from-[#111b42] via-[#221642] to-[#050a1c]" />
              <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#040817] via-[#0b1230] to-transparent" />
              <div className="absolute bottom-16 left-[-10%] h-28 w-[58%] rounded-t-full bg-[#060b1b]/80" />
              <div className="absolute bottom-16 right-[-6%] h-36 w-[66%] rounded-t-full bg-[#0c1534]/90" />
              <div className="absolute bottom-16 left-[30%] h-24 w-[50%] rounded-t-full bg-[#17204a]/75" />
              <div className="absolute left-[48%] top-[40%] h-px w-[40%] bg-gradient-to-r from-transparent via-[#ffbd8f]/70 to-transparent" />
              <Moon className="absolute right-14 top-14 h-11 w-11 rotate-[-24deg] text-[#f7a7c9]" />
              <div className="absolute right-20 bottom-20 h-28 w-16 rounded-t-full border border-[#ffb886]/40 bg-[#130d19]/70">
                <div className="absolute left-1/2 top-5 h-12 w-8 -translate-x-1/2 rounded-full bg-[#ffad63]/45 shadow-[0_0_38px_rgba(255,173,99,0.65)]" />
                <div className="absolute left-1/2 top-[-14px] h-8 w-8 -translate-x-1/2 rounded-full border border-[#ffb886]/40" />
              </div>
              <div className="absolute right-[28%] bottom-24 h-44 w-28 rounded-t-[4rem] bg-[#080d1d]/80 shadow-2xl shadow-black/30" />
              <div className="absolute right-[30%] bottom-48 h-16 w-16 rounded-full bg-[#080d1d]/95" />
              <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#050a1c] to-transparent" />
              <div className="relative z-10 flex h-full min-h-[420px] flex-col justify-end p-7">
                <div className="max-w-sm rounded-2xl border border-white/12 bg-[#071027]/72 p-5 backdrop-blur">
                  <Sparkles className="mb-4 h-8 w-8 text-[#f4a5d7]" />
                  <p className="text-2xl font-bold leading-tight">Um respiro antes de seguir.</p>
                  <p className="mt-3 text-sm leading-6 text-white/68">
                    Um começo simples para falar com calma, no seu tempo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="conteudos" className="relative px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-3 flex items-center gap-3 text-[#86cfff]">
                <Sprout className="h-7 w-7" />
                <h2 className="text-3xl font-bold">Pílulas de acolhimento</h2>
              </div>
              <p className="max-w-xl text-white/68">
                Conteúdos curtos para te apoiar no momento que você precisa.
              </p>
            </div>
            <button
              onClick={() => scrollToSection("conteudos")}
              className="hidden items-center gap-2 text-sm font-semibold text-[#d7b8ff] md:flex"
              type="button"
            >
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {contentCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.title}
                  onClick={() => openContentPlaceholder(card.title)}
                  className={`group min-h-[255px] rounded-2xl border border-white/10 bg-gradient-to-br ${card.tone} p-5 text-left shadow-lg shadow-black/20 transition-smooth hover:border-white/25`}
                  type="button"
                >
                  <Icon className="mb-9 h-8 w-8 text-[#c7a7ff]" />
                  <h3 className="text-xl font-bold leading-snug">{card.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-white/74">{card.text}</p>
                  <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-black/28 px-3 py-1 text-xs text-white/88">
                    <PlayCircle className="h-4 w-4" />
                    {card.time}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="chat" className="px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-8 rounded-3xl border border-white/10 bg-gradient-to-r from-[#121a45] via-[#121a3b] to-[#0d1430] p-6 shadow-xl shadow-black/25 md:grid-cols-[0.7fr_1.25fr_0.8fr] md:p-8">
          <div className="flex min-h-44 items-center justify-center rounded-3xl bg-gradient-to-br from-[#b99cff]/28 to-[#ff93b3]/18">
            <Heart className="h-24 w-24 fill-[#ffb3ce]/45 text-[#d3b6ff]" />
          </div>

          <div>
            <h2 className="text-3xl font-bold">Precisa conversar agora?</h2>
            <p className="mt-4 max-w-xl leading-7 text-white/74">
              Nosso chat é um espaço seguro para você falar, organizar seus pensamentos e ser ouvido.
            </p>
            <div className="mt-7 flex flex-wrap gap-4 text-sm text-white/80">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#d7b8ff]" />
                Sigilo e segurança
              </span>
              <span className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-[#ff9fca]" />
                Sem julgamentos
              </span>
              <span className="flex items-center gap-2">
                <Clock3 className="h-5 w-5 text-[#bca4ff]" />
                Quando você precisar
              </span>
            </div>
          </div>

          <Button
            onClick={goToChat}
            className="h-auto rounded-2xl bg-gradient-to-r from-[#9f82ff] to-[#ff9c91] px-7 py-5 text-base font-bold text-white"
          >
            <MessageCircle className="mr-3 h-5 w-5" />
            Iniciar conversa
          </Button>
        </div>
      </section>

      <section id="psicologos" className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-3 flex items-center gap-3 text-[#86cfff]">
                <Users className="h-7 w-7" />
                <h2 className="text-3xl font-bold">Psicólogos disponíveis</h2>
              </div>
              <p className="max-w-xl text-white/68">
                Profissionais prontos para te acompanhar na sua jornada.
              </p>
            </div>
            <button
              onClick={() => setLocation("/professionals")}
              className="flex items-center gap-2 text-sm font-semibold text-[#d7b8ff]"
              type="button"
            >
              Ver todos os psicólogos
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {professionals.map((professional, index) => (
              <article
                key={professional.name}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-lg shadow-black/20 backdrop-blur"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f3a0c5] to-[#8ecfff] text-xl font-bold text-[#071027]">
                    {professional.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{professional.name}</h3>
                    <p className="mt-1 text-sm text-white/66">{professional.area}</p>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm text-white/78">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        index === 1 ? "bg-[#ff9db8]" : "bg-[#70f29d]"
                      }`}
                    />
                    {professional.status}
                  </span>
                  <button
                    onClick={() => setLocation("/professionals")}
                    className="rounded-xl border border-white/12 px-4 py-2 text-sm font-semibold text-white/90 transition-smooth hover:bg-white/10"
                    type="button"
                  >
                    Ver profissional
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer id="sobre" className="px-5 pb-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-6 rounded-3xl border border-white/10 bg-white/[0.07] p-7 shadow-xl shadow-black/20 md:grid-cols-[1.2fr_1.6fr] md:items-center">
          <div>
            <p className="text-2xl font-bold">Você importa. Você não está sozinho.</p>
            <p className="mt-2 text-white/66">by Pensando Bem</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <span className="flex items-center gap-3 text-sm text-white/78">
              <ShieldCheck className="h-6 w-6 text-[#ff9fca]" />
              Ambiente seguro
            </span>
            <span className="flex items-center gap-3 text-sm text-white/78">
              <LockKeyhole className="h-6 w-6 text-[#ff9fca]" />
              Privacidade garantida
            </span>
            <span className="flex items-center gap-3 text-sm text-white/78">
              <Heart className="h-6 w-6 text-[#ff9fca]" />
              Acolhimento de verdade
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
