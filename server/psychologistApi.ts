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
  abordagem: string;
  cidade: string;
  estado: string;
  atendimentoOnline: boolean;
  linkedin?: string;
  instagram?: string;
  site?: string;
  valorSessao?: string;
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
  abordagem: string;
  cidade: string;
  estado: string;
  atendimento_online: boolean;
  linkedin?: string | null;
  instagram?: string | null;
  site?: string | null;
  valor_sessao?: string | null;
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
  abordagem: string;
  cidade: string;
  estado: string;
  atendimentoOnline: boolean;
  linkedin: string;
  instagram: string;
  site: string;
  valorSessao: string;
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

  const row = {
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
    abordagem: clean(data.abordagem),
    cidade: clean(data.cidade),
    estado: clean(data.estado),
    atendimento_online: Boolean(data.atendimentoOnline),
    linkedin: cleanOptional(data.linkedin),
    instagram: cleanOptional(data.instagram),
    site: cleanOptional(data.site),
    valor_sessao: cleanOptional(data.valorSessao),
    status: "em_avaliacao",
  };

  await supabaseDb("/psychologists", "POST", row);
  return { ok: true };
}

function validatePsychologist(data: PsychologistPayload) {
  const errors: Record<string, string> = {};
  if (!clean(data.nome)) errors.nome = "Informe seu nome completo.";
  if (!isValidEmail(normalizeEmail(data.email || ""))) errors.email = "Informe um email válido.";
  if (!clean(data.whatsapp)) errors.whatsapp = "Informe seu WhatsApp.";
  if (!clean(data.crp)) errors.crp = "Informe seu CRP.";
  if (!clean(data.bio)) errors.bio = "Escreva uma bio curta.";
  if (!clean(data.especialidadePrincipal)) errors.especialidadePrincipal = "Informe a especialidade principal.";
  if (!clean(data.fotoUrl)) errors.fotoUrl = "Informe a URL da foto profissional.";
  if (!clean(data.horasSemanais)) errors.horasSemanais = "Informe as horas semanais.";
  if (!clean(data.horariosDisponiveis)) errors.horariosDisponiveis = "Informe os horários disponíveis.";
  if (!clean(data.abordagem)) errors.abordagem = "Informe sua abordagem ou forma de atendimento.";
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
    horariosDisponiveis: row.horarios_disponiveis,
    abordagem: row.abordagem,
    cidade: row.cidade,
    estado: row.estado,
    atendimentoOnline: row.atendimento_online,
    linkedin: row.linkedin || undefined,
    instagram: row.instagram || undefined,
    site: row.site || undefined,
    valorSessao: row.valor_sessao || undefined,
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
import { randomUUID } from "node:crypto";
