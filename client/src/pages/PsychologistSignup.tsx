import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Heart, Send, UserRound } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const emptyForm = {
  nome: "",
  email: "",
  whatsapp: "",
  crp: "",
  bio: "",
  especialidadePrincipal: "",
  outrasEspecialidades: "",
  fotoUrl: "",
  horasSemanais: "",
  horariosDisponiveis: "",
  abordagem: "",
  cidade: "",
  estado: "",
  atendimentoOnline: "sim",
  linkedin: "",
  instagram: "",
  site: "",
  valorSessao: "",
};

export default function PsychologistSignup() {
  const [, setLocation] = useLocation();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/psychologists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, atendimentoOnline: form.atendimentoOnline === "sim" }),
      });
      const data = (await response.json()) as { ok: boolean; errors?: Record<string, string>; error?: string };
      setIsSubmitting(false);

      if (!response.ok || !data.ok) {
        setErrors(data.errors || {});
        setMessage(data.error || "Revise os campos destacados.");
        return;
      }

      setSubmitted(true);
    } catch {
      setIsSubmitting(false);
      setMessage("Não foi possível enviar agora. Tente novamente em instantes.");
    }
  };

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050a1c] px-5 text-white">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl">
          <CheckCircle className="mx-auto h-12 w-12 text-[#a5ffc1]" />
          <h1 className="mt-5 text-3xl font-bold">Recebemos seu cadastro.</h1>
          <p className="mt-4 leading-7 text-white/70">
            A equipe do Espaço Amigo vai avaliar suas informações com cuidado antes de liberar seu perfil para os usuários.
          </p>
          <Button
            onClick={() => setLocation("/")}
            className="mt-7 rounded-2xl bg-gradient-to-r from-[#9f82ff] to-[#ff9c91] px-7 py-5 font-bold text-white"
          >
            Voltar para o início
          </Button>
        </div>
      </main>
    );
  }

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

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111a45] via-[#101633] to-[#080d22] p-6 shadow-2xl md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#d7b8ff]">
                <Heart className="h-4 w-4" />
                Espaço Amigo
              </div>
              <h1 className="text-4xl font-bold leading-tight">Cadastro de psicólogo</h1>
              <p className="mt-4 max-w-2xl leading-7 text-white/70">
                O cadastro será analisado pelo Espaço Amigo antes de aparecer para os usuários. Buscamos profissionais alinhados com uma proposta de acolhimento humano, ético e cuidadoso.
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10">
              <UserRound className="h-8 w-8 text-[#ffb3ce]" />
            </div>
          </div>

          <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={submit}>
            <Field label="Nome completo" value={form.nome} error={errors.nome} onChange={(value) => updateField("nome", value)} />
            <Field label="Email" value={form.email} error={errors.email} type="email" onChange={(value) => updateField("email", value)} />
            <Field label="WhatsApp" value={form.whatsapp} error={errors.whatsapp} onChange={(value) => updateField("whatsapp", value)} />
            <Field label="CRP" value={form.crp} error={errors.crp} onChange={(value) => updateField("crp", value)} />
            <Field label="Especialidade principal" value={form.especialidadePrincipal} error={errors.especialidadePrincipal} onChange={(value) => updateField("especialidadePrincipal", value)} />
            <Field label="Outras especialidades" value={form.outrasEspecialidades} onChange={(value) => updateField("outrasEspecialidades", value)} />
            <Field label="URL da foto profissional" value={form.fotoUrl} error={errors.fotoUrl} onChange={(value) => updateField("fotoUrl", value)} />
            <Field label="Horas por semana" value={form.horasSemanais} error={errors.horasSemanais} onChange={(value) => updateField("horasSemanais", value)} />
            <Field label="Cidade" value={form.cidade} error={errors.cidade} onChange={(value) => updateField("cidade", value)} />
            <Field label="Estado" value={form.estado} error={errors.estado} onChange={(value) => updateField("estado", value)} />
            <label className="block md:col-span-2">
              <span className="text-sm font-semibold text-white/78">Bio curta</span>
              <textarea
                value={form.bio}
                onChange={(event) => updateField("bio", event.target.value)}
                className="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition-smooth placeholder:text-white/35 focus:border-[#d7b8ff]/60"
              />
              {errors.bio ? <p className="mt-1 text-xs text-[#ffb3ce]">{errors.bio}</p> : null}
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm font-semibold text-white/78">Horários disponíveis</span>
              <textarea
                value={form.horariosDisponiveis}
                onChange={(event) => updateField("horariosDisponiveis", event.target.value)}
                placeholder="Segunda e quarta, 18h às 21h. Sábado, 9h às 12h."
                className="mt-2 min-h-24 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition-smooth placeholder:text-white/35 focus:border-[#d7b8ff]/60"
              />
              {errors.horariosDisponiveis ? <p className="mt-1 text-xs text-[#ffb3ce]">{errors.horariosDisponiveis}</p> : null}
            </label>
            <Field label="Abordagem / forma de atendimento" value={form.abordagem} error={errors.abordagem} onChange={(value) => updateField("abordagem", value)} />
            <label className="block">
              <span className="text-sm font-semibold text-white/78">Atendimento online?</span>
              <select
                value={form.atendimentoOnline}
                onChange={(event) => updateField("atendimentoOnline", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#101735] px-4 py-3 text-white outline-none transition-smooth focus:border-[#d7b8ff]/60"
              >
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            </label>
            <Field label="LinkedIn" value={form.linkedin} onChange={(value) => updateField("linkedin", value)} />
            <Field label="Instagram profissional" value={form.instagram} onChange={(value) => updateField("instagram", value)} />
            <Field label="Site" value={form.site} onChange={(value) => updateField("site", value)} />
            <Field label="Valor de sessão, se quiser informar depois" value={form.valorSessao} onChange={(value) => updateField("valorSessao", value)} />

            {message ? <p className="text-sm text-[#ffb3ce] md:col-span-2">{message}</p> : null}
            <Button
              className="h-auto rounded-2xl bg-gradient-to-r from-[#9f82ff] to-[#ff9c91] px-6 py-5 text-base font-bold text-white md:col-span-2"
              disabled={isSubmitting}
              type="submit"
            >
              <Send className="mr-2 h-5 w-5" />
              {isSubmitting ? "Enviando..." : "Enviar cadastro para avaliação"}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  error,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-white/78">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition-smooth placeholder:text-white/35 focus:border-[#d7b8ff]/60"
        type={type}
      />
      {error ? <p className="mt-1 text-xs text-[#ffb3ce]">{error}</p> : null}
    </label>
  );
}
