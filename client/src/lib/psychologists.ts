export interface Psychologist {
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

export const fallbackPsychologists: Psychologist[] = [
  {
    id: "mock-vitor",
    nome: "Vitor Dias Pontes",
    email: "wpontes.pro@gmail.com",
    whatsapp: "",
    crp: "",
    bio: "Acolhimento emocional com escuta cuidadosa.",
    especialidadePrincipal: "Acolhimento emocional",
    fotoUrl: "",
    horasSemanais: "Disponível",
    horariosDisponiveis: "Disponível hoje",
    abordagem: "Acolhimento inicial",
    cidade: "",
    estado: "",
    atendimentoOnline: true,
    status: "aprovado",
  },
  {
    id: "mock-marcelo",
    nome: "Marcelo Pereira Bastos",
    email: "wpontes.pro@gmail.com",
    whatsapp: "",
    crp: "",
    bio: "Apoio para rotina, medo e preocupação.",
    especialidadePrincipal: "Rotina, medo e preocupação",
    fotoUrl: "",
    horasSemanais: "Disponível",
    horariosDisponiveis: "Disponível hoje",
    abordagem: "Acolhimento inicial",
    cidade: "",
    estado: "",
    atendimentoOnline: true,
    status: "aprovado",
  },
  {
    id: "mock-camila",
    nome: "Camila Rocha",
    email: "wpontes.pro@gmail.com",
    whatsapp: "",
    crp: "",
    bio: "Apoio em relacionamentos, autoestima e luto.",
    especialidadePrincipal: "Relacionamentos, autoestima e luto",
    fotoUrl: "",
    horasSemanais: "Disponível",
    horariosDisponiveis: "Disponível hoje",
    abordagem: "Acolhimento inicial",
    cidade: "",
    estado: "",
    atendimentoOnline: true,
    status: "aprovado",
  },
];

export async function fetchApprovedPsychologists() {
  const response = await fetch("/api/psychologists");
  const data = (await response.json()) as { ok: boolean; psychologists?: Psychologist[] };
  if (!response.ok || !data.ok) throw new Error("Não foi possível carregar psicólogos.");
  return data.psychologists || [];
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

export function buildProfessionalMailto(professionalName: string, user?: { name?: string; email?: string } | null) {
  const body = [
    `Nome do usuário: ${user?.name || "Não informado"}`,
    `Email do usuário: ${user?.email || "Não informado"}`,
    `Profissional escolhido: ${professionalName}`,
    "",
    "Gostaria de conversar com este profissional.",
  ].join("\n");

  return `mailto:wpontes.pro@gmail.com?subject=${encodeURIComponent("Contato pelo Espaço Amigo")}&body=${encodeURIComponent(body)}`;
}
