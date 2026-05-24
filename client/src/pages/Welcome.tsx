import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Heart,
  Headphones,
  LockKeyhole,
  LogOut,
  MessageCircle,
  PenLine,
  ShieldCheck,
  Sprout,
  UserPlus,
  UserRound,
  Users,
  Wind,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const contentCards = [
  {
    title: "Exercícios de relaxamento",
    text: "Técnicas simples para respirar, desacelerar e voltar ao agora.",
    icon: Wind,
    tone: "from-violet-500/25 via-slate-900/70 to-[#070c22]",
  },
  {
    title: "Áudio de meditação",
    text: "Pausas guiadas para atravessar momentos difíceis com mais calma.",
    icon: Headphones,
    tone: "from-rose-400/25 via-slate-900/65 to-[#111733]",
  },
  {
    title: "Frases e textos de acolhimento",
    text: "Palavras simples de validação, conforto e apoio emocional.",
    icon: BookOpen,
    tone: "from-emerald-300/25 via-slate-900/65 to-[#091d20]",
  },
  {
    title: "Diário emocional",
    text: "Um espaço para escrever sentimentos e organizar pensamentos.",
    icon: PenLine,
    tone: "from-indigo-400/25 via-slate-900/70 to-[#07122c]",
  },
  {
    title: "Chat de acolhimento",
    text: "Um espaço seguro para você falar e ser ouvido quando precisar.",
    icon: MessageCircle,
    tone: "from-orange-300/25 via-slate-900/65 to-[#1e1325]",
  },
];

const birthMonths = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const emptyAuthForm = {
  name: "",
  email: "",
  password: "",
  age: "",
  birthMonth: "",
};

export default function Welcome() {
  const [, setLocation] = useLocation();
  const { completeProfile, isLoading, loginWithEmail, logout, registerWithEmail, user } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "signup" | "complete" | null>(null);
  const [authForm, setAuthForm] = useState(emptyAuthForm);
  const [authErrors, setAuthErrors] = useState<Record<string, string>>({});
  const [authMessage, setAuthMessage] = useState("");
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "complete") openAuthModal("complete");
  }, []);

  useEffect(() => {
    if (authMode === "complete" && user?.age && user.birthMonth) {
      setLocation("/espaco");
    }
  }, [authMode, setLocation, user]);

  const goToChat = () => setLocation("/chat-start");
  const openAuthModal = (mode: "login" | "signup" | "complete") => {
    setAuthForm(emptyAuthForm);
    setAuthErrors({});
    setAuthMessage("");
    setAuthMode(mode);
  };

  const startGoogleLogin = (mode: "login" | "signup") => {
    window.location.href = `/api/auth/google/start?mode=${mode}`;
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openContentPlaceholder = (title: string) => {
    alert(`Conteúdo em breve: ${title}`);
  };

  const updateAuthForm = (field: keyof typeof authForm, value: string) => {
    setAuthForm((current) => ({ ...current, [field]: value }));
    setAuthErrors((current) => ({ ...current, [field]: "" }));
  };

  const validateAuthForm = () => {
    const errors: Record<string, string> = {};
    const age = Number(authForm.age);
    const isSignup = authMode === "signup";
    const isComplete = authMode === "complete";

    if (isSignup && !authForm.name.trim()) errors.name = "Informe seu nome.";
    if (!isComplete && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authForm.email.trim())) errors.email = "Informe um email válido.";
    if (!isComplete && authForm.password.length < 6) errors.password = "A senha precisa ter pelo menos 6 caracteres.";
    if (isSignup || isComplete) {
      if (!authForm.age.trim()) errors.age = "Informe sua idade.";
      else if (!Number.isFinite(age) || age < 13) errors.age = "A idade mínima é 13 anos.";
      if (!authForm.birthMonth) errors.birthMonth = "Escolha o mês de nascimento.";
    }

    return errors;
  };

  const handleAuthSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authMode) return;
    setAuthMessage("");

    const errors = validateAuthForm();
    setAuthErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmittingAuth(true);
    const result =
      authMode === "login"
        ? await loginWithEmail({ email: authForm.email, password: authForm.password })
        : authMode === "signup"
          ? await registerWithEmail(authForm)
          : await completeProfile({ age: authForm.age, birthMonth: authForm.birthMonth });
    setIsSubmittingAuth(false);

    if (!result.ok) {
      setAuthErrors(result.errors || {});
      setAuthMessage(result.error || "Não foi possível continuar agora.");
      return;
    }

    setAuthMode(null);
    setLocation("/espaco");
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
              <button onClick={() => setLocation("/psicologos")} type="button">
                Psicólogos
              </button>
              <button onClick={() => scrollToSection("sobre")} type="button">
                Sobre
              </button>
              <button onClick={() => setLocation("/sou-psicologo")} type="button">
                Sou psicólogo
              </button>
            </nav>

            {user ? (
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/90 backdrop-blur">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="h-8 w-8 rounded-full border border-white/20"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                    <UserRound className="h-4 w-4 text-[#f4a5d7]" />
                  </div>
                )}
                <span className="hidden max-w-36 truncate font-semibold sm:inline">{user.name}</span>
                <button
                  onClick={() => void logout()}
                  className="flex items-center gap-1 rounded-xl px-2 py-1 text-white/72 transition-smooth hover:bg-white/10 hover:text-white"
                  type="button"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal("login")}
                  disabled={isLoading}
                  className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/90 backdrop-blur transition-smooth hover:bg-white/10 disabled:opacity-60"
                  type="button"
                >
                  <UserRound className="h-4 w-4 text-[#f4a5d7]" />
                  Entrar
                </button>
                <button
                  onClick={() => openAuthModal("signup")}
                  className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#101735] transition-smooth hover:bg-white/90"
                  type="button"
                >
                  <UserPlus className="h-4 w-4" />
                  Criar conta
                </button>
              </div>
            )}
          </header>

          <div id="inicio" className="grid min-h-[78vh] items-center gap-10 py-16 lg:grid-cols-[1fr_0.95fr]">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex rounded-lg bg-white/8 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#ceb2ff]">
                Seu espaço de acolhimento
              </div>

              <h1 className="text-5xl font-bold leading-[1.04] tracking-normal sm:text-6xl lg:text-7xl">
                Quando tudo parece demais e não há mais saída,{" "}
                <span className="bg-gradient-to-r from-[#f49cc7] via-[#b991ff] to-[#8dd7ff] bg-clip-text text-transparent">
                  você não precisa enfrentar sozinho.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/78">
                O Espaço Amigo acolhe você com presença, ferramentas simples e caminhos para encontrar apoio humano.
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
              <div className="absolute inset-0 bg-gradient-to-r from-[#020512] via-[#171338] to-[#45253f]" />
              <div className="absolute inset-y-0 left-0 w-[58%] bg-[radial-gradient(circle_at_35%_42%,rgba(64,79,145,0.24),transparent_38%)]" />
              <div className="absolute inset-y-0 right-0 w-[54%] bg-[radial-gradient(circle_at_76%_36%,rgba(255,180,122,0.38),transparent_40%)]" />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050a1c] to-transparent" />
              <div className="absolute bottom-16 left-[24%] h-52 w-36 rounded-t-[5rem] bg-[#070b18]/95 shadow-2xl shadow-black/50" />
              <div className="absolute bottom-56 left-[29%] h-20 w-20 rounded-full bg-[#151c32]" />
              <div className="absolute bottom-[13rem] left-[28%] h-10 w-24 rounded-full bg-[#0b1024]/80" />
              <div className="absolute bottom-28 right-[17%] h-24 w-44 rounded-full bg-[#ffb083]/24 blur-2xl" />
              <div className="absolute right-14 top-14 h-28 w-28 rounded-full bg-[#ffb083]/26 blur-2xl" />
              <div className="absolute bottom-28 right-24 h-1 w-48 rounded-full bg-gradient-to-r from-transparent via-[#ffd0aa] to-transparent" />
              <div className="absolute right-20 bottom-24 h-32 w-20 rounded-t-full border border-[#ffcfaa]/40 bg-[#160f1d]/70">
                <div className="absolute left-1/2 top-7 h-14 w-9 -translate-x-1/2 rounded-full bg-[#ffad63]/55 shadow-[0_0_42px_rgba(255,173,99,0.7)]" />
              </div>
              <div className="absolute bottom-24 left-[52%] h-1 w-40 rotate-[-8deg] rounded-full bg-gradient-to-r from-[#3f4f8d] via-[#a977ff] to-[#ffd0aa]" />
              <div className="relative z-10 flex h-full min-h-[420px] flex-col justify-end p-7">
                <div className="max-w-sm rounded-2xl border border-white/12 bg-[#071027]/72 p-5 backdrop-blur">
                  <Heart className="mb-4 h-8 w-8 text-[#f4a5d7]" />
                  <p className="text-2xl font-bold leading-tight">Um caminho começa com uma presença.</p>
                  <p className="mt-3 text-sm leading-6 text-white/68">
                    Do peso silencioso para uma luz possível, no seu tempo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="conteudos" className="relative bg-[#f6f1ff] px-5 py-16 text-[#131936] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-3 flex items-center gap-3 text-[#86cfff]">
                <Sprout className="h-7 w-7" />
                <h2 className="text-3xl font-bold">Pílulas de acolhimento</h2>
              </div>
              <p className="max-w-xl text-[#5f6580]">
                Ferramentas simples para atravessar o momento com um pouco mais de presença.
              </p>
            </div>
            <button
              onClick={() => scrollToSection("conteudos")}
              className="hidden items-center gap-2 text-sm font-semibold text-[#7a57cb] md:flex"
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
                  className={`group min-h-[235px] rounded-3xl border border-white/70 bg-gradient-to-br ${card.tone} p-5 text-left text-white shadow-xl shadow-[#7760a8]/15 transition-smooth hover:-translate-y-1 hover:border-[#b89cff]`}
                  type="button"
                >
                  <Icon className="mb-9 h-8 w-8 text-[#c7a7ff]" />
                  <h3 className="text-xl font-bold leading-snug">{card.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-white/74">{card.text}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="chat" className="bg-[#f6f1ff] px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-8 rounded-[2rem] border border-[#e0d8fb] bg-white p-6 text-[#131936] shadow-xl shadow-[#8b74bd]/15 md:grid-cols-[0.7fr_1.25fr_0.8fr] md:p-8">
          <div className="flex min-h-44 items-center justify-center rounded-3xl bg-gradient-to-br from-[#b99cff]/28 to-[#ff93b3]/18">
            <Heart className="h-24 w-24 fill-[#ffb3ce]/45 text-[#d3b6ff]" />
          </div>

          <div>
            <h2 className="text-3xl font-bold">Precisa conversar agora?</h2>
            <p className="mt-4 max-w-xl leading-7 text-[#5f6580]">
              O chat de acolhimento é um espaço seguro para você falar, organizar seus pensamentos e ser ouvido.
            </p>
            <div className="mt-7 flex flex-wrap gap-4 text-sm text-[#4e5570]">
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

      <section id="psicologos" className="bg-[#f6f1ff] px-5 py-16 text-[#131936] sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-[#e0d8fb] bg-gradient-to-r from-white via-[#fbf9ff] to-[#f0e9ff] p-7 shadow-xl shadow-[#8b74bd]/15 md:grid-cols-[1fr_0.8fr] md:p-9">
          <div>
            <div className="mb-4 flex items-center gap-3 text-[#86cfff]">
              <Users className="h-7 w-7" />
              <h2 className="text-3xl font-bold">Apoio humano quando você precisar</h2>
            </div>
            <p className="max-w-2xl leading-7 text-[#5f6580]">
              O Espaço Amigo também conecta pessoas a psicólogos parceiros. São profissionais avaliados com cuidado, para que a busca por apoio seja mais simples, humana e segura.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3">
            <Button
              onClick={() => setLocation("/psicologos")}
              className="h-auto rounded-2xl bg-gradient-to-r from-[#9f82ff] to-[#ff9c91] px-7 py-5 text-base font-bold text-white"
            >
              Encontrar psicólogo
            </Button>
            <button
              onClick={() => setLocation("/sou-psicologo")}
              className="rounded-2xl border border-[#d8cef6] bg-white px-7 py-5 text-base font-bold text-[#5c3db2] transition-smooth hover:bg-[#f8f4ff]"
              type="button"
            >
              Sou psicólogo
            </button>
          </div>
        </div>
      </section>

      <section id="sobre" className="bg-[#f6f1ff] px-5 pb-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#101735] p-7 text-white shadow-xl shadow-[#8b74bd]/15 md:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#d7b8ff]">Por que o Espaço Amigo existe</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-tight">
            Porque há momentos em que a pessoa só precisa encontrar um lugar seguro antes do próximo passo.
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-white/68">
            O Espaço Amigo oferece acolhimento inicial, recursos simples e caminhos de apoio humano para quem está atravessando dias difíceis, sem diagnóstico, sem pressa e sem julgamento.
          </p>
        </div>
      </section>

      <footer className="bg-[#f6f1ff] px-5 pb-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-6 rounded-3xl border border-[#d8cef6] bg-white p-7 text-[#131936] shadow-xl shadow-[#8b74bd]/15 md:grid-cols-[1.2fr_1.6fr] md:items-center">
          <div>
            <p className="text-2xl font-bold">Você importa. Você não está sozinho.</p>
            <p className="mt-2 text-[#6b718a]">by Pensando Bem</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <span className="flex items-center gap-3 text-sm text-[#535a76]">
              <ShieldCheck className="h-6 w-6 text-[#ff9fca]" />
              Ambiente seguro
            </span>
            <span className="flex items-center gap-3 text-sm text-[#535a76]">
              <LockKeyhole className="h-6 w-6 text-[#ff9fca]" />
              Privacidade garantida
            </span>
            <span className="flex items-center gap-3 text-sm text-[#535a76]">
              <Heart className="h-6 w-6 text-[#ff9fca]" />
              Acolhimento de verdade
            </span>
          </div>
        </div>
      </footer>

      {authMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#0b1028] p-6 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {authMode === "login" ? "Entrar" : authMode === "signup" ? "Criar conta" : "Completar meu espaço"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/66">
                  {authMode === "complete"
                    ? "Só precisamos de duas informações para deixar seu espaço mais acolhedor."
                    : authMode === "signup"
                      ? "Crie seu espaço com calma. Você poderá voltar aqui quando precisar respirar um pouco."
                      : "Entre no seu espaço para continuar com calma."}
                </p>
              </div>
              <button
                onClick={() => setAuthMode(null)}
                className="rounded-full border border-white/10 p-2 text-white/70 transition-smooth hover:bg-white/10 hover:text-white"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {authMode !== "complete" ? (
              <>
                <button
                  onClick={() => startGoogleLogin(authMode)}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-bold text-[#101735] transition-smooth hover:bg-white/90"
                  type="button"
                >
                  <UserRound className="h-5 w-5" />
                  {authMode === "login" ? "Entrar com Google" : "Criar com Google"}
                </button>
                <div className="my-5 flex items-center gap-3 text-sm text-white/45">
                  <span className="h-px flex-1 bg-white/10" />
                  ou
                  <span className="h-px flex-1 bg-white/10" />
                </div>
              </>
            ) : null}

            <form className="space-y-4" onSubmit={handleAuthSubmit}>
              {authMode === "signup" ? (
                <label className="block">
                  <span className="text-sm font-semibold text-white/78">Nome</span>
                  <input
                    value={authForm.name}
                    onChange={(event) => updateAuthForm("name", event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition-smooth placeholder:text-white/35 focus:border-[#d7b8ff]/60"
                    placeholder="Como podemos te chamar?"
                  />
                  {authErrors.name ? <p className="mt-1 text-xs text-[#ffb3ce]">{authErrors.name}</p> : null}
                </label>
              ) : null}

              {authMode !== "complete" ? (
                <>
                  <label className="block">
                    <span className="text-sm font-semibold text-white/78">Email</span>
                    <input
                      value={authForm.email}
                      onChange={(event) => updateAuthForm("email", event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition-smooth placeholder:text-white/35 focus:border-[#d7b8ff]/60"
                      placeholder="voce@email.com"
                      type="email"
                    />
                    {authErrors.email ? <p className="mt-1 text-xs text-[#ffb3ce]">{authErrors.email}</p> : null}
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-white/78">Senha</span>
                    <input
                      value={authForm.password}
                      onChange={(event) => updateAuthForm("password", event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition-smooth placeholder:text-white/35 focus:border-[#d7b8ff]/60"
                      placeholder="Mínimo 6 caracteres"
                      type="password"
                    />
                    {authErrors.password ? <p className="mt-1 text-xs text-[#ffb3ce]">{authErrors.password}</p> : null}
                  </label>
                </>
              ) : null}

              {authMode !== "login" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-white/78">Idade</span>
                  <input
                    value={authForm.age}
                    onChange={(event) => updateAuthForm("age", event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition-smooth placeholder:text-white/35 focus:border-[#d7b8ff]/60"
                    min={13}
                    placeholder="13+"
                    type="number"
                  />
                  {authErrors.age ? <p className="mt-1 text-xs text-[#ffb3ce]">{authErrors.age}</p> : null}
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-white/78">Mês de nascimento</span>
                  <select
                    value={authForm.birthMonth}
                    onChange={(event) => updateAuthForm("birthMonth", event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-[#101735] px-4 py-3 text-white outline-none transition-smooth focus:border-[#d7b8ff]/60"
                  >
                    <option value="">Escolha</option>
                    {birthMonths.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  {authErrors.birthMonth ? (
                    <p className="mt-1 text-xs text-[#ffb3ce]">{authErrors.birthMonth}</p>
                  ) : null}
                </label>
              </div>
              ) : null}

              {authMessage ? <p className="text-sm text-[#ffb3ce]">{authMessage}</p> : null}

              <Button
                className="h-auto w-full rounded-2xl bg-gradient-to-r from-[#9f82ff] to-[#ff9c91] px-6 py-4 text-base font-bold text-white"
                disabled={isSubmittingAuth}
                type="submit"
              >
                {isSubmittingAuth
                  ? "Continuando..."
                  : authMode === "login"
                    ? "Entrar"
                    : authMode === "signup"
                      ? "Criar conta"
                      : "Entrar no meu espaço"}
              </Button>
            </form>
            {authMode !== "complete" ? (
              <p className="mt-5 text-center text-sm text-white/62">
                {authMode === "login" ? "Não possui conta? " : "Já possui conta? "}
                <button
                  onClick={() => {
                    openAuthModal(authMode === "login" ? "signup" : "login");
                  }}
                  className="font-bold text-[#d7b8ff] hover:text-white"
                  type="button"
                >
                  {authMode === "login" ? "Criar conta" : "Entrar"}
                </button>
              </p>
            ) : null}
          </div>
        </div>
      )}
    </main>
  );
}
