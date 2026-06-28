import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Heart, ImagePlus, Send, UserRound } from "lucide-react";
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
  cidade: "",
  estado: "",
};

const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const emptySchedule = weekDays.map((day) => ({ day, active: false, start: "", end: "" }));

export default function PsychologistSignup() {
  const [, setLocation] = useLocation();
  const [form, setForm] = useState(emptyForm);
  const [schedule, setSchedule] = useState(emptySchedule);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const updateSchedule = (index: number, patch: Partial<(typeof schedule)[number]>) => {
    setSchedule((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
    setErrors((current) => ({ ...current, horariosDisponiveis: "" }));
  };

  const pickPhoto = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((current) => ({ ...current, fotoUrl: "Envie uma imagem válida." }));
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setForm((current) => ({ ...current, fotoUrl: "" }));
    setErrors((current) => ({ ...current, fotoUrl: "" }));
  };

  const uploadPhoto = async () => {
    if (!photoFile) return "";
    const dataUrl = await readFileAsDataUrl(photoFile);
    const response = await fetch("/api/psychologists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "upload-photo", fileName: photoFile.name, dataUrl }),
    });
    const data = (await response.json()) as { ok: boolean; url?: string; error?: string };
    if (!response.ok || !data.ok || !data.url) throw new Error(data.error || "Não foi possível enviar a foto.");
    return data.url;
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const fotoUrl = form.fotoUrl || (await uploadPhoto());
      const response = await fetch("/api/psychologists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, fotoUrl, horariosDisponiveis: JSON.stringify(schedule) }),
      });
      const data = (await response.json()) as { ok: boolean; errors?: Record<string, string>; error?: string };
      setIsSubmitting(false);

      if (!response.ok || !data.ok) {
        setErrors(data.errors || {});
        setMessage(data.error || "Revise os campos destacados.");
        return;
      }

      setSubmitted(true);
    } catch (error) {
      setIsSubmitting(false);
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar agora. Tente novamente em instantes.");
    }
  };

  if (submitted) {
    return (
      <main className="ea-bg flex items-center justify-center px-5">
        <div className="ea-panel w-full max-w-xl p-8 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-[#a5ffc1]" />
          <h1 className="mt-5 text-3xl font-bold">Recebemos seu cadastro.</h1>
          <p className="mt-4 leading-7 text-white/70">
            A equipe do Espaço Amigo vai avaliar suas informações com cuidado antes de liberar seu perfil para os usuários.
          </p>
          <Button onClick={() => setLocation("/")} className="mt-7 rounded-2xl bg-gradient-to-r from-[#9f82ff] to-[#ff9c91] px-7 py-5 font-bold text-white">
            Voltar para o início
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="ea-bg px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <button onClick={() => setLocation("/")} className="ea-button-ghost mb-6 inline-flex items-center gap-2 px-4 py-3 text-sm" type="button">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <section className="ea-panel p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.05] p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#F472B6] text-sm font-bold">1</div>
            <div>
              <p className="font-bold">Dados profissionais</p>
              <p className="text-sm text-white/56">Envie suas informações para avaliação do Espaço Amigo.</p>
            </div>
          </div>
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
            <Field label="Horas por semana" value={form.horasSemanais} error={errors.horasSemanais} onChange={(value) => updateField("horasSemanais", value)} />
            <Field label="Cidade" value={form.cidade} error={errors.cidade} onChange={(value) => updateField("cidade", value)} />
            <Field label="Estado" value={form.estado} error={errors.estado} onChange={(value) => updateField("estado", value)} />

            <label className="block md:col-span-2">
              <span className="text-sm font-semibold text-white/78">Foto profissional</span>
              <div className="mt-2 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-4 sm:grid-cols-[120px_1fr] sm:items-center">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl bg-white/10">
                  {photoPreview ? <img src={photoPreview} alt="Preview da foto" className="h-full w-full object-cover" /> : <ImagePlus className="h-8 w-8 text-[#d7b8ff]" />}
                </div>
                <div>
                  <input accept="image/*" onChange={(event) => pickPhoto(event.target.files?.[0])} className="block w-full text-sm text-white/70 file:mr-4 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-[#8B5CF6] file:to-[#F472B6] file:px-4 file:py-2 file:font-semibold file:text-white" type="file" />
                  <p className="mt-2 text-xs text-white/50">PNG, JPG ou WEBP até 2MB.</p>
                  {errors.fotoUrl ? <p className="mt-1 text-xs text-[#ffb3ce]">{errors.fotoUrl}</p> : null}
                </div>
              </div>
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm font-semibold text-white/78">Bio curta</span>
              <textarea value={form.bio} onChange={(event) => updateField("bio", event.target.value)} className="ea-input mt-2 min-h-28 w-full" />
              {errors.bio ? <p className="mt-1 text-xs text-[#ffb3ce]">{errors.bio}</p> : null}
            </label>

            <div className="md:col-span-2">
              <span className="text-sm font-semibold text-white/78">Horários disponíveis</span>
              <div className="mt-2 space-y-3 rounded-3xl border border-white/10 bg-white/[0.05] p-4">
                {schedule.map((item, index) => (
                  <div key={item.day} className="grid gap-3 rounded-2xl bg-white/[0.06] p-3 sm:grid-cols-[1fr_130px_130px] sm:items-center">
                    <label className="flex items-center gap-3 text-sm font-semibold text-white/80">
                      <input checked={item.active} onChange={(event) => updateSchedule(index, { active: event.target.checked })} type="checkbox" />
                      {item.day}
                    </label>
                    <input aria-label={`Início ${item.day}`} className="ea-input px-3 py-2 disabled:opacity-40" disabled={!item.active} onChange={(event) => updateSchedule(index, { start: event.target.value })} type="time" value={item.start} />
                    <input aria-label={`Fim ${item.day}`} className="ea-input px-3 py-2 disabled:opacity-40" disabled={!item.active} onChange={(event) => updateSchedule(index, { end: event.target.value })} type="time" value={item.end} />
                  </div>
                ))}
              </div>
              {errors.horariosDisponiveis ? <p className="mt-1 text-xs text-[#ffb3ce]">{errors.horariosDisponiveis}</p> : null}
            </div>

            {message ? <p className="text-sm text-[#ffb3ce] md:col-span-2">{message}</p> : null}
            <Button className="ea-button h-auto px-6 py-5 text-base md:col-span-2" disabled={isSubmitting} type="submit">
              <Send className="mr-2 h-5 w-5" />
              {isSubmitting ? "Enviando..." : "Enviar cadastro para avaliação"}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}

function Field({ label, value, error, type = "text", onChange }: { label: string; value: string; error?: string; type?: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-white/78">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="ea-input mt-2 w-full" type={type} />
      {error ? <p className="mt-1 text-xs text-[#ffb3ce]">{error}</p> : null}
    </label>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Não foi possível ler a foto."));
    reader.readAsDataURL(file);
  });
}
