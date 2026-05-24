create extension if not exists pgcrypto;

insert into public.psychologists (
  id,
  nome,
  email,
  whatsapp,
  crp,
  bio,
  especialidade_principal,
  outras_especialidades,
  foto_url,
  horas_semanais,
  horarios_disponiveis,
  cidade,
  estado,
  status
)
select
  gen_random_uuid(),
  seed.nome,
  seed.email,
  seed.whatsapp,
  seed.crp,
  seed.bio,
  seed.especialidade_principal,
  seed.outras_especialidades,
  seed.foto_url,
  seed.horas_semanais,
  seed.horarios_disponiveis,
  seed.cidade,
  seed.estado,
  'aprovado'
from (
  values
    ('Wagner da Silva Pontes', 'wagner.psicologo.seed@espacoamigo.com', '11914909831', '05/123456', 'Escuta cuidadosa para pessoas em momentos de confusão, angústia e busca por sentido.', 'Psicologia analítica', 'Autoconhecimento, sonhos, relações e transições de vida', 'https://ui-avatars.com/api/?name=Wagner+da+Silva+Pontes&background=9f82ff&color=ffffff&size=256', '10h semanais', 'Segunda e quarta, 18h às 21h. Sábado, 9h às 12h.', 'Rio de Janeiro', 'RJ'),
    ('Marcelo Antunes', 'marcelo.antunes.seed@espacoamigo.com', '21973486357', '05/234567', 'Acolhimento emocional para quem precisa falar com calma e organizar o que sente.', 'Acolhimento emocional', 'Rotina emocional, medo, solidão e autoestima', 'https://ui-avatars.com/api/?name=Marcelo+Antunes&background=73d7ff&color=071027&size=256', '8h semanais', 'Terça e quinta, 19h às 22h. Sexta, 17h às 19h.', 'Rio de Janeiro', 'RJ'),
    ('Vitor Dias Pontes', 'vitor.dias.seed@espacoamigo.com', '22992247029', '05/345678', 'Apoio para atravessar ansiedade cotidiana, excesso de pensamentos e cansaço emocional.', 'Ansiedade e rotina emocional', 'Preocupação, rotina, estudo e organização emocional', 'https://ui-avatars.com/api/?name=Vitor+Dias+Pontes&background=ff9c91&color=071027&size=256', '12h semanais', 'Segunda, terça e quinta, 18h às 21h.', 'Araruama', 'RJ'),
    ('Camila Rocha', 'camila.rocha.seed@espacoamigo.com', '21988887777', '06/456789', 'Escuta acolhedora para autoestima, relações e momentos de perda.', 'Relacionamentos e autoestima', 'Luto, vínculo familiar e insegurança emocional', 'https://ui-avatars.com/api/?name=Camila+Rocha&background=f49cc7&color=ffffff&size=256', '6h semanais', 'Quarta, 14h às 18h. Sábado, 10h às 12h.', 'Niterói', 'RJ'),
    ('Juliana Martins', 'juliana.martins.seed@espacoamigo.com', '11977776666', '06/567890', 'Apoio para quem se sente sobrecarregado e precisa retomar o próprio ritmo.', 'Estresse e sobrecarga', 'Trabalho, estudos, autocobrança e rotina', 'https://ui-avatars.com/api/?name=Juliana+Martins&background=b991ff&color=ffffff&size=256', '9h semanais', 'Segunda e sexta, 8h às 11h. Quarta, 19h às 22h.', 'São Paulo', 'SP'),
    ('Rafael Costa', 'rafael.costa.seed@espacoamigo.com', '31999998888', '04/678901', 'Acolhimento para momentos de tristeza, isolamento e dificuldade de pedir ajuda.', 'Solidão e vínculos', 'Tristeza, isolamento e comunicação emocional', 'https://ui-avatars.com/api/?name=Rafael+Costa&background=86cfff&color=071027&size=256', '7h semanais', 'Terça e quinta, 16h às 19h. Domingo, 9h às 10h.', 'Belo Horizonte', 'MG'),
    ('Fernanda Lima', 'fernanda.lima.seed@espacoamigo.com', '41987654321', '08/789012', 'Escuta sensível para mudanças de fase, inseguranças e decisões difíceis.', 'Transições de vida', 'Mudanças, escolhas, família e autoconfiança', 'https://ui-avatars.com/api/?name=Fernanda+Lima&background=ff8aa7&color=ffffff&size=256', '8h semanais', 'Segunda e quarta, 13h às 17h.', 'Curitiba', 'PR'),
    ('Bruno Almeida', 'bruno.almeida.seed@espacoamigo.com', '71991234567', '03/890123', 'Apoio para quem sente medo, tensão no corpo e pensamentos acelerados.', 'Medo e preocupação', 'Ansiedade cotidiana, corpo e respiração', 'https://ui-avatars.com/api/?name=Bruno+Almeida&background=a5ffc1&color=071027&size=256', '10h semanais', 'Terça, quarta e sexta, 18h às 21h. Sábado, 8h às 9h.', 'Salvador', 'BA'),
    ('Patrícia Nunes', 'patricia.nunes.seed@espacoamigo.com', '51993456789', '07/901234', 'Acolhimento para autoestima, culpa e relações que deixam a pessoa cansada.', 'Autoestima e limites', 'Culpa, limites, relações e autocuidado', 'https://ui-avatars.com/api/?name=Patricia+Nunes&background=d7b8ff&color=071027&size=256', '6h semanais', 'Quinta, 9h às 12h. Sexta, 14h às 17h.', 'Porto Alegre', 'RS'),
    ('André Ribeiro', 'andre.ribeiro.seed@espacoamigo.com', '81992345678', '02/012345', 'Escuta tranquila para organizar pensamentos, sentimentos e próximos passos possíveis.', 'Organização emocional', 'Pensamentos recorrentes, rotina e cuidado inicial', 'https://ui-avatars.com/api/?name=Andre+Ribeiro&background=ffc0da&color=071027&size=256', '11h semanais', 'Segunda, 10h às 13h. Terça e quinta, 20h às 22h. Sábado, 14h às 17h.', 'Recife', 'PE')
) as seed (
  nome,
  email,
  whatsapp,
  crp,
  bio,
  especialidade_principal,
  outras_especialidades,
  foto_url,
  horas_semanais,
  horarios_disponiveis,
  cidade,
  estado
)
where not exists (
  select 1
  from public.psychologists existing
  where lower(existing.email) = lower(seed.email)
);
