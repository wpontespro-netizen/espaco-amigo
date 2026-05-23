import { randomUUID } from "node:crypto";

export interface PublicPsychologist {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  crp: string;
  bio: string;
  especialidadePrincipal: string;
  outrasEspecialidades?: string;
  fotoUrl: string;
  horasSemanais: string;
  horariosDisponiveis: string;
  cidade: string;
  estado: string;
  status: "em_avaliacao" | "aprovado" | "recusado";
}

interface PsychologistRow {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  crp: string;
  bio: string;
  especialidade_principal: string;
  outras_especialidades?: string | null;
  foto_url: string;
  horas_semanais: string;
  horarios_disponiveis: string;
  cidade: string;
  estado: string;
  status: "em_avaliacao" | "aprovado" | "recusado";
}

type PsychologistPayload = Partial<{
  nome: string;
  email: string;
  whatsapp: string;
  crp: string;
  bio: string;
  especialidadePrincipal: string;
  outrasEspecialidades: string;
  fotoUrl: string;
  horasSemanais: string;
  horariosDisponiveis: string;
  cidade: string;
  estado: string;
}>;

export async function listApprovedPsychologists() {
  const rows = (await supabaseDb(
    "/psychologists?status=eq.aprovado&select=*&order=created_at.desc",
    "GET",
  )) as PsychologistRow[];
  return rows.map(rowToPsychologist);
}

export async function createPsychologistApplication(payload: unknown) {
  const data = payload as PsychologistPayload;
  const errors = validatePsychologist(data);
  if (Object.keys(errors).length) return { ok: false, errors };

  await supabaseDb("/psychologists", "POST", {
    id: randomUUID(),
    nome: clean(data.nome),
    email: normalizeEmail(data.email || ""),
    whatsapp: clean(data.whatsapp),
    crp: clean(data.crp),
    bio: clean(data.bio),
    especialidade_principal: clean(data.especialidadePrincipal),
    outras_especialidades: cleanOptional(data.outrasEspecialidades),
    foto_url: clean(data.fotoUrl),
    horas_semanais: clean(data.horasSemanais),
    horarios_disponiveis: clean(data.horariosDisponiveis),
    cidade: clean(data.cidade),
    estado: clean(data.estado),
    status: "em_avaliacao",
  });
  return { ok: true };
}

export async function uploadPsychologistPhoto(payload: unknown) {
  const data = payload as Partial<{ fileName: string; dataUrl: string }>;
  const match = String(data.dataUrl || "").match(/^data:(image\/(?:png|jpe?g|webp));base64,(.+)$/i);
  if (!match) return { ok: false, error: "Envie uma imagem válida." };

  const mimeType = match[1].toLowerCase();
  const buffer = Buffer.from(match[2], "base64");
  if (buffer.byteLength > 2 * 1024 * 1024) return { ok: false, error: "A imagem deve ter até 2MB." };

  const extension = mimeType.includes("png") ? "png" : mimeType.includes("webp") ? "webp" : "jpg";
  const safeName = clean(data.fileName).replace(/[^a-z0-9_.-]/gi, "-").toLowerCase() || `foto.${extension}`;
  const path = `${randomUUID()}-${safeName.replace(/\.[^.]+$/, "")}.${extension}`;
  const { url, serviceKey } = supabaseConfig();
  const response = await fetch(`${url}/storage/v1/object/psychologist-photos/${path}`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": mimeType,
      "x-upsert": "false",
    },
    body: buffer,
  });
  const text = await response.text();
  const responseData = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(responseData?.message || `Supabase storage error ${response.status}`);

  return { ok: true, url: `${url}/storage/v1/object/public/psychologist-photos/${path}` };
}

function validatePsychologist(data: PsychologistPayload) {
  const errors: Record<string, string> = {};
  if (!clean(data.nome)) errors.nome = "Informe seu nome completo.";
  if (!isValidEmail(normalizeEmail(data.email || ""))) errors.email = "Informe um email válido.";
  if (!clean(data.whatsapp)) errors.whatsapp = "Informe seu WhatsApp.";
  if (!clean(data.crp)) errors.crp = "Informe seu CRP.";
  if (!clean(data.bio)) errors.bio = "Escreva uma bio curta.";
  if (!clean(data.especialidadePrincipal)) errors.especialidadePrincipal = "Informe a especialidade principal.";
  if (!clean(data.fotoUrl)) errors.fotoUrl = "Envie uma foto profissional.";
  if (!clean(data.horasSemanais)) errors.horasSemanais = "Informe as horas semanais.";
  if (!hasSchedule(data.horariosDisponiveis)) errors.horariosDisponiveis = "Informe ao menos um dia e horário.";
  if (!clean(data.cidade)) errors.cidade = "Informe sua cidade.";
  if (!clean(data.estado)) errors.estado = "Informe seu estado.";
  return errors;
}

function rowToPsychologist(row: PsychologistRow): PublicPsychologist {
  return {
    id: row.id,
    nome: row.nome,
    email: row.email,
    whatsapp: row.whatsapp,
    crp: row.crp,
    bio: row.bio,
    especialidadePrincipal: row.especialidade_principal,
    outrasEspecialidades: row.outras_especialidades || undefined,
    fotoUrl: row.foto_url,
    horasSemanais: row.horas_semanais,
    horariosDisponiveis: summarizeSchedule(row.horarios_disponiveis),
    cidade: row.cidade,
    estado: row.estado,
    status: row.status,
  };
}

async function supabaseDb(path: string, method = "GET", body?: unknown) {
  const { url, serviceKey } = supabaseConfig();
  const response = await fetch(`${url}/rest/v1${path}`, {
    method,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(data?.message || `Supabase error ${response.status}`);
  return data;
}

function hasSchedule(value?: string) {
  try {
    const days = JSON.parse(clean(value)) as { active?: boolean; start?: string; end?: string }[];
    return days.some((day) => day.active && clean(day.start) && clean(day.end));
  } catch {
    return Boolean(clean(value));
  }
}

function summarizeSchedule(value: string) {
  try {
    const days = JSON.parse(value) as { day: string; active?: boolean; start?: string; end?: string }[];
    const activeDays = days.filter((day) => day.active && day.start && day.end);
    if (!activeDays.length) return "Disponibilidade a combinar";
    return activeDays.map((day) => `${day.day}, ${formatHour(day.start)} às ${formatHour(day.end)}`).join(". ");
  } catch {
    return value;
  }
}

function formatHour(value?: string) {
  return clean(value).replace(":00", "h").replace(":", "h");
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Supabase is not configured.");
  return { url: url.replace(/\/+$/, ""), serviceKey };
}

function clean(value?: string) {
  return String(value || "").trim();
}

function cleanOptional(value?: string) {
  const cleaned = clean(value);
  return cleaned || null;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
